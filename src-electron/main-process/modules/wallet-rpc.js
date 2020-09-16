import child_process from "child_process";
const request = require("request-promise");
const queue = require("promise-queue");
const http = require("http");
const os = require("os");
const fs = require("fs-extra");
const path = require("upath");
const crypto = require("crypto");
const portscanner = require("portscanner");

export class WalletRPC {
  constructor(backend) {
    this.backend = backend;
    this.data_dir = null;
    this.wallet_dir = null;
    this.auth = [];
    this.id = 0;
    this.net_type = "mainnet";
    this.heartbeat = null;
    this.lnsHeartbeat = null;
    this.wallet_state = {
      open: false,
      name: "",
      password_hash: null,
      balance: null,
      unlocked_balance: null,
      lnsRecords: []
    };
    this.isRPCSyncing = false;
    this.dirs = null;
    this.last_height_send_time = Date.now();

    // A mapping of name => type
    this.purchasedNames = {};

    this.height_regexes = [
      {
        string: /Processed block: <([a-f0-9]+)>, height (\d+)/,
        height: match => match[2]
      },
      {
        string: /Skipped block by height: (\d+)/,
        height: match => match[1]
      },
      {
        string: /Skipped block by timestamp, height: (\d+)/,
        height: match => match[1]
      },
      {
        string: /Blockchain sync progress: <([a-f0-9]+)>, height (\d+)/,
        height: match => match[2]
      }
    ];

    this.agent = new http.Agent({ keepAlive: true, maxSockets: 1 });
    this.queue = new queue(1, Infinity);
  }

  // this function will take an options object for testnet, data-dir, etc
  start(options) {
    const { net_type } = options.app;
    const daemon = options.daemons[net_type];
    return new Promise((resolve, reject) => {
      let daemon_address = `${daemon.rpc_bind_ip}:${daemon.rpc_bind_port}`;
      if (daemon.type == "remote") {
        daemon_address = `${daemon.remote_host}:${daemon.remote_port}`;
      }

      crypto.randomBytes(64 + 64 + 32, (err, buffer) => {
        if (err) throw err;

        let auth = buffer.toString("hex");

        this.auth = [
          auth.substr(0, 64), // rpc username
          auth.substr(64, 64), // rpc password
          auth.substr(128, 32) // password salt
        ];

        const args = [
          "--rpc-login",
          this.auth[0] + ":" + this.auth[1],
          "--rpc-bind-port",
          options.wallet.rpc_bind_port,
          "--daemon-address",
          daemon_address,
          // "--log-level", options.wallet.log_level,
          "--log-level",
          "*:WARNING,net*:FATAL,net.http:DEBUG,global:INFO,verify:FATAL,stacktrace:INFO"
        ];

        const { net_type, wallet_data_dir, data_dir } = options.app;
        this.net_type = net_type;
        this.data_dir = data_dir;
        this.wallet_data_dir = wallet_data_dir;

        this.dirs = {
          mainnet: this.wallet_data_dir,
          stagenet: path.join(this.wallet_data_dir, "stagenet"),
          testnet: path.join(this.wallet_data_dir, "testnet")
        };

        this.wallet_dir = path.join(this.dirs[net_type], "wallets");
        args.push("--wallet-dir", this.wallet_dir);

        const log_file = path.join(
          this.dirs[net_type],
          "logs",
          "wallet-rpc.log"
        );
        args.push("--log-file", log_file);

        if (net_type === "testnet") {
          args.push("--testnet");
        } else if (net_type === "stagenet") {
          args.push("--stagenet");
        }

        if (fs.existsSync(log_file)) {
          fs.truncateSync(log_file, 0);
        }

        if (!fs.existsSync(this.wallet_dir)) {
          fs.mkdirpSync(this.wallet_dir);
        }

        // save this info for later RPC calls
        this.protocol = "http://";
        this.hostname = "127.0.0.1";
        this.port = options.wallet.rpc_bind_port;

        const rpcExecutable =
          process.platform === "win32"
            ? "loki-wallet-rpc.exe"
            : "loki-wallet-rpc";
        // eslint-disable-next-line no-undef
        const rpcPath = path.join(__ryo_bin, rpcExecutable);

        // Check if the rpc exists
        if (!fs.existsSync(rpcPath)) {
          reject(
            new Error(
              "Failed to find Loki Wallet RPC. Please make sure you anti-virus has not removed it."
            )
          );
          return;
        }

        portscanner
          .checkPortStatus(this.port, this.hostname)
          .catch(() => "closed")
          .then(status => {
            if (status === "closed") {
              const options =
                process.platform === "win32" ? {} : { detached: true };
              this.walletRPCProcess = child_process.spawn(
                rpcPath,
                args,
                options
              );

              this.walletRPCProcess.stdout.on("data", data => {
                process.stdout.write(`Wallet: ${data}`);

                let lines = data.toString().split("\n");
                let match,
                  height = null;
                let isRPCSyncing = false;
                for (const line of lines) {
                  for (const regex of this.height_regexes) {
                    match = line.match(regex.string);
                    if (match) {
                      height = regex.height(match);
                      isRPCSyncing = true;
                      break;
                    }
                  }
                }

                // Keep track on wether a wallet is syncing or not
                this.sendGateway("set_wallet_data", {
                  isRPCSyncing
                });
                this.isRPCSyncing = isRPCSyncing;

                if (height && Date.now() - this.last_height_send_time > 1000) {
                  this.last_height_send_time = Date.now();
                  this.sendGateway("set_wallet_data", {
                    info: {
                      height
                    }
                  });
                }
              });
              this.walletRPCProcess.on("error", err =>
                process.stderr.write(`Wallet: ${err}`)
              );
              this.walletRPCProcess.on("close", code => {
                process.stderr.write(`Wallet: exited with code ${code} \n`);
                this.walletRPCProcess = null;
                this.agent.destroy();
                if (code === null) {
                  reject(new Error("Failed to start wallet RPC"));
                }
              });

              // To let caller know when the wallet is ready
              let intrvl = setInterval(() => {
                this.sendRPC("get_languages").then(data => {
                  if (!data.hasOwnProperty("error")) {
                    clearInterval(intrvl);
                    resolve();
                  } else {
                    if (
                      this.walletRPCProcess &&
                      data.error.cause &&
                      data.error.cause.code === "ECONNREFUSED"
                    ) {
                      // Ignore
                    } else {
                      clearInterval(intrvl);
                      if (this.walletRPCProcess) this.walletRPCProcess.kill();
                      this.walletRPCProcess = null;
                      reject(new Error("Could not connect to wallet RPC"));
                    }
                  }
                });
              }, 1000);
            } else {
              reject(new Error(`Wallet RPC port ${this.port} is in use`));
            }
          });
      });
    });
  }

  async handle(data) {
    let params = data.data;

    switch (data.method) {
      case "has_password":
        this.hasPassword();
        break;

      case "validate_address":
        this.validateAddress(params.address);
        break;

      case "decrypt_record": {
        const record = await this.decryptLNSRecord(params.type, params.name);
        this.sendGateway("set_decrypt_record_result", {
          record,
          decrypted: !!record
        });
        break;
      }

      case "copy_old_gui_wallets":
        this.copyOldGuiWallets(params.wallets || []);
        break;

      case "list_wallets":
        this.listWallets();
        break;

      case "create_wallet":
        this.createWallet(params.name, params.password, params.language);
        break;

      case "restore_wallet":
        this.restoreWallet(
          params.name,
          params.password,
          params.seed,
          params.refresh_type,
          params.refresh_type == "date"
            ? params.refresh_start_date
            : params.refresh_start_height
        );
        break;

      case "restore_view_wallet":
        // TODO: Decide if we want this for loki
        this.restoreViewWallet(
          params.name,
          params.password,
          params.address,
          params.viewkey,
          params.refresh_type,
          params.refresh_type == "date"
            ? params.refresh_start_date
            : params.refresh_start_height
        );
        break;

      case "import_wallet":
        this.importWallet(params.name, params.password, params.path);
        break;

      case "open_wallet":
        this.openWallet(params.name, params.password);
        break;

      case "close_wallet":
        this.closeWallet();
        break;

      case "stake":
        this.stake(
          params.password,
          params.amount,
          params.key,
          params.destination
        );
        break;

      case "register_service_node":
        this.registerSnode(params.password, params.string);
        break;

      case "update_service_node_list":
        this.updateServiceNodeList();
        break;

      case "unlock_stake":
        this.unlockStake(
          params.password,
          params.service_node_key,
          params.confirmed || false
        );
        break;

      case "transfer":
        this.transfer(
          params.password,
          params.amount,
          params.address,
          params.payment_id,
          params.priority,
          // return false if undefined
          !!params.isSweepAll
        );
        break;
      case "relay_tx":
        this.relayTransaction(
          params.metadataList,
          params.isBlink,
          params.addressSave,
          params.note
        );
        break;
      case "purchase_lns":
        this.purchaseLNS(
          params.password,
          params.type,
          params.name,
          params.value,
          params.owner || "",
          params.backup_owner || ""
        );
        break;

      case "update_lns_mapping":
        this.updateLNSMapping(
          params.password,
          params.type,
          params.name,
          params.value,
          params.owner || "",
          params.backup_owner || ""
        );

        break;

      case "prove_transaction":
        this.proveTransaction(params.txid, params.address, params.message);
        break;

      case "check_transaction":
        this.checkTransactionProof(
          params.signature,
          params.txid,
          params.address,
          params.message
        );
        break;

      case "add_address_book":
        this.addAddressBook(
          params.address,
          params.payment_id,
          params.description,
          params.name,
          params.starred,
          params.hasOwnProperty("index") ? params.index : false
        );
        break;

      case "delete_address_book":
        this.deleteAddressBook(
          params.hasOwnProperty("index") ? params.index : false
        );
        break;

      case "save_tx_notes":
        this.saveTxNotes(params.txid, params.note);
        break;

      case "rescan_blockchain":
        this.rescanBlockchain();
        break;
      case "rescan_spent":
        this.rescanSpent();
        break;
      case "get_private_keys":
        this.getPrivateKeys(params.password);
        break;
      case "export_key_images":
        this.exportKeyImages(params.password, params.path);
        break;
      case "import_key_images":
        this.importKeyImages(params.password, params.path);
        break;

      case "change_wallet_password":
        this.changeWalletPassword(params.old_password, params.new_password);
        break;

      case "delete_wallet":
        this.deleteWallet(params.password);
        break;

      default:
    }
  }

  isValidPasswordHash(password_hash) {
    if (this.wallet_state.password_hash === null) return true;
    return this.wallet_state.password_hash === password_hash.toString("hex");
  }

  hasPassword() {
    if (this.wallet_state.password_hash === null) {
      this.sendGateway("set_has_password", false);
      return;
    }

    // We need to check if the hash generated with an empty string is the same as the password_hash we are storing
    crypto.pbkdf2(
      "",
      this.auth[2],
      1000,
      64,
      "sha512",
      (err, password_hash) => {
        if (err) {
          this.sendGateway("set_has_password", false);
          return;
        }

        // If the pass hash doesn't match empty string then we don't have a password
        this.sendGateway(
          "set_has_password",
          this.wallet_state.password_hash !== password_hash.toString("hex")
        );
      }
    );
  }

  validateAddress(address) {
    this.sendRPC("validate_address", {
      address
    }).then(data => {
      if (data.hasOwnProperty("error")) {
        this.sendGateway("set_valid_address", {
          address,
          valid: false
        });
        return;
      }

      const { valid, nettype } = data.result;

      const netMatches = this.net_type === nettype;
      const isValid = valid && netMatches;

      this.sendGateway("set_valid_address", {
        address,
        valid: isValid,
        nettype
      });
    });
  }

  createWallet(filename, password, language) {
    // Reset the status error
    this.sendGateway("reset_wallet_error");
    this.sendRPC("create_wallet", {
      filename,
      password,
      language
    }).then(data => {
      if (data.hasOwnProperty("error")) {
        this.sendGateway("set_wallet_error", { status: data.error });
        return;
      }

      // store hash of the password so we can check against it later when requesting private keys, or for sending txs
      this.wallet_state.password_hash = crypto
        .pbkdf2Sync(password, this.auth[2], 1000, 64, "sha512")
        .toString("hex");
      this.wallet_state.name = filename;
      this.wallet_state.open = true;

      this.finalizeNewWallet(filename);
    });
  }

  restoreWallet(
    filename,
    password,
    seed,
    refresh_type,
    refresh_start_timestamp_or_height
  ) {
    if (refresh_type == "date") {
      // Convert timestamp to 00:00 and move back a day
      // Core code also moved back some amount of blocks
      let timestamp = refresh_start_timestamp_or_height;
      timestamp = timestamp - (timestamp % 86400000) - 86400000;

      this.sendGateway("reset_wallet_error");
      this.backend.daemon.timestampToHeight(timestamp).then(height => {
        if (height === false) {
          this.sendGateway("set_wallet_error", {
            status: {
              code: -1,
              i18n: "notification.errors.invalidRestoreDate"
            }
          });
        } else {
          this.restoreWallet(filename, password, seed, "height", height);
        }
      });
      return;
    }

    let restore_height = refresh_start_timestamp_or_height;

    if (!Number.isInteger(restore_height)) {
      restore_height = 0;
    }
    seed = seed.trim().replace(/\s{2,}/g, " ");

    this.sendGateway("reset_wallet_error");
    this.sendRPC("restore_deterministic_wallet", {
      filename,
      password,
      seed,
      restore_height
    }).then(data => {
      if (data.hasOwnProperty("error")) {
        this.sendGateway("set_wallet_error", { status: data.error });
        return;
      }

      // store hash of the password so we can check against it later when requesting private keys, or for sending txs
      this.wallet_state.password_hash = crypto
        .pbkdf2Sync(password, this.auth[2], 1000, 64, "sha512")
        .toString("hex");
      this.wallet_state.name = filename;
      this.wallet_state.open = true;

      this.finalizeNewWallet(filename);
    });
  }

  restoreViewWallet(
    filename,
    password,
    address,
    viewkey,
    refresh_type,
    refresh_start_timestamp_or_height
  ) {
    if (refresh_type == "date") {
      // Convert timestamp to 00:00 and move back a day
      // Core code also moved back some amount of blocks
      let timestamp = refresh_start_timestamp_or_height;
      timestamp = timestamp - (timestamp % 86400000) - 86400000;

      this.backend.daemon.timestampToHeight(timestamp).then(height => {
        if (height === false) {
          this.sendGateway("set_wallet_error", {
            status: {
              code: -1,
              i18n: "notification.errors.invalidRestoreDate"
            }
          });
        } else {
          this.restoreViewWallet(
            filename,
            password,
            address,
            viewkey,
            "height",
            height
          );
        }
      });
      return;
    }

    let refresh_start_height = refresh_start_timestamp_or_height;

    if (!Number.isInteger(refresh_start_height)) {
      refresh_start_height = 0;
    }

    this.sendRPC("restore_view_wallet", {
      filename,
      password,
      address,
      viewkey,
      refresh_start_height
    }).then(data => {
      if (data.hasOwnProperty("error")) {
        this.sendGateway("set_wallet_error", { status: data.error });
        return;
      }

      // store hash of the password so we can check against it later when requesting private keys, or for sending txs
      this.wallet_state.password_hash = crypto
        .pbkdf2Sync(password, this.auth[2], 1000, 64, "sha512")
        .toString("hex");
      this.wallet_state.name = filename;
      this.wallet_state.open = true;

      this.finalizeNewWallet(filename);
    });
  }

  importWallet(wallet_name, password, import_path) {
    // Reset the status error
    this.sendGateway("reset_wallet_error");

    // trim off suffix if exists
    if (import_path.endsWith(".keys")) {
      import_path = import_path.substring(
        0,
        import_path.length - ".keys".length
      );
    } else if (import_path.endsWith(".address.txt")) {
      import_path = import_path.substring(
        0,
        import_path.length - ".address.txt".length
      );
    }

    if (!fs.existsSync(import_path)) {
      this.sendGateway("set_wallet_error", {
        status: {
          code: -1,
          i18n: "notification.errors.invalidWalletPath"
        }
      });
      return;
    } else {
      let destination = path.join(this.wallet_dir, wallet_name);
      if (fs.existsSync(destination) || fs.existsSync(destination + ".keys")) {
        this.sendGateway("set_wallet_error", {
          status: {
            code: -1,
            i18n: "notification.errors.walletAlreadyExists"
          }
        });
        return;
      }

      try {
        fs.copySync(import_path, destination, { errorOnExist: true });
        if (fs.existsSync(import_path + ".keys")) {
          fs.copySync(import_path + ".keys", destination + ".keys", {
            errorOnExist: true
          });
        }
      } catch (e) {
        this.sendGateway("set_wallet_error", {
          status: {
            code: -1,
            i18n: "notification.errors.copyWalletFail"
          }
        });
        return;
      }
      this.sendRPC("open_wallet", {
        filename: wallet_name,
        password
      })
        .then(data => {
          if (data.hasOwnProperty("error")) {
            if (fs.existsSync(destination)) fs.unlinkSync(destination);
            if (fs.existsSync(destination + ".keys"))
              fs.unlinkSync(destination + ".keys");
            this.sendGateway("set_wallet_error", {
              status: data.error
            });
            return;
          }
          // store hash of the password so we can check against it later when requesting private keys, or for sending txs
          this.wallet_state.password_hash = crypto
            .pbkdf2Sync(password, this.auth[2], 1000, 64, "sha512")
            .toString("hex");
          this.wallet_state.name = wallet_name;
          this.wallet_state.open = true;
          this.finalizeNewWallet(wallet_name);
        })
        .catch(() => {
          this.sendGateway("set_wallet_error", {
            status: {
              code: -1,
              i18n: "notification.errors.unknownError"
            }
          });
        });
    }
  }

  finalizeNewWallet(filename) {
    Promise.all([
      this.sendRPC("get_address"),
      this.sendRPC("getheight"),
      this.sendRPC("getbalance", { account_index: 0 }),
      this.sendRPC("query_key", { key_type: "mnemonic" }),
      this.sendRPC("query_key", { key_type: "spend_key" }),
      this.sendRPC("query_key", { key_type: "view_key" })
    ]).then(data => {
      let wallet = {
        info: {
          name: filename,
          address: "",
          balance: 0,
          unlocked_balance: 0,
          height: 0,
          view_only: false
        },
        secret: {
          mnemonic: "",
          spend_key: "",
          view_key: ""
        }
      };
      for (let n of data) {
        if (n.hasOwnProperty("error") || !n.hasOwnProperty("result")) {
          continue;
        }
        if (n.method == "get_address") {
          wallet.info.address = n.result.address;
        } else if (n.method == "getheight") {
          wallet.info.height = n.result.height;
        } else if (n.method == "getbalance") {
          wallet.info.balance = n.result.balance;
          wallet.info.unlocked_balance = n.result.unlocked_balance;
        } else if (n.method == "query_key") {
          wallet.secret[n.params.key_type] = n.result.key;
          if (n.params.key_type == "spend_key") {
            if (/^0*$/.test(n.result.key)) {
              wallet.info.view_only = true;
            }
          }
        }
      }

      this.saveWallet().then(() => {
        let address_txt_path = path.join(
          this.wallet_dir,
          filename + ".address.txt"
        );
        if (!fs.existsSync(address_txt_path)) {
          fs.writeFile(address_txt_path, wallet.info.address, "utf8", () => {
            this.listWallets();
          });
        } else {
          this.listWallets();
        }
      });

      this.sendGateway("set_wallet_data", wallet);

      this.startHeartbeat();
    });
  }

  openWallet(filename, password) {
    this.sendGateway("reset_wallet_error");
    this.sendRPC("open_wallet", {
      filename,
      password
    }).then(data => {
      if (data.hasOwnProperty("error")) {
        this.sendGateway("set_wallet_error", { status: data.error });
        return;
      }

      let address_txt_path = path.join(
        this.wallet_dir,
        filename + ".address.txt"
      );
      if (!fs.existsSync(address_txt_path)) {
        this.sendRPC("get_address", { account_index: 0 }).then(data => {
          if (data.hasOwnProperty("error") || !data.hasOwnProperty("result")) {
            return;
          }
          fs.writeFile(address_txt_path, data.result.address, "utf8", () => {
            this.listWallets();
          });
        });
      }

      // store hash of the password so we can check against it later when requesting private keys, or for sending txs
      this.wallet_state.password_hash = crypto
        .pbkdf2Sync(password, this.auth[2], 1000, 64, "sha512")
        .toString("hex");
      this.wallet_state.name = filename;
      this.wallet_state.open = true;

      this.startHeartbeat();

      this.purchasedNames = {};

      // Check if we have a view only wallet by querying the spend key
      this.sendRPC("query_key", { key_type: "spend_key" }).then(data => {
        if (data.hasOwnProperty("error") || !data.hasOwnProperty("result")) {
          return;
        }
        if (/^0*$/.test(data.result.key)) {
          this.sendGateway("set_wallet_data", {
            info: {
              view_only: true
            }
          });
        }
      });
    });
  }

  startHeartbeat() {
    clearInterval(this.heartbeat);
    this.heartbeat = setInterval(() => {
      this.heartbeatAction();
    }, 5000);
    this.heartbeatAction(true);

    clearInterval(this.lnsHeartbeat);
    this.lnsHeartbeat = setInterval(() => {
      this.updateLocalLNSRecords();
    }, 30 * 1000); // Every 30 seconds
    this.updateLocalLNSRecords();
  }

  heartbeatAction(extended = false) {
    Promise.all([
      this.sendRPC("get_address", { account_index: 0 }, 5000),
      this.sendRPC("getheight", {}, 5000),
      this.sendRPC("getbalance", { account_index: 0 }, 5000)
    ]).then(data => {
      let didError = false;
      let wallet = {
        status: {
          code: 0,
          message: "OK"
        },
        info: {
          name: this.wallet_state.name
        },
        transactions: {
          tx_list: []
        },
        address_list: {
          primary: [],
          used: [],
          unused: [],
          address_book: [],
          address_book_starred: []
        }
      };

      for (let n of data) {
        if (n.hasOwnProperty("error") || !n.hasOwnProperty("result")) {
          // Maybe we also need to look into the other error codes it could give us
          // Error -13: No wallet file - This occurs when you call open wallet while another wallet is still syncing
          if (extended && n.error && n.error.code === -13) {
            didError = true;
          }
          continue;
        }

        if (n.method == "getheight") {
          wallet.info.height = n.result.height;
          this.sendGateway("set_wallet_data", {
            info: {
              height: n.result.height
            }
          });
        } else if (n.method == "get_address") {
          wallet.info.address = n.result.address;
          this.sendGateway("set_wallet_data", {
            info: {
              address: n.result.address
            }
          });
        } else if (n.method == "getbalance") {
          if (
            this.wallet_state.balance == n.result.balance &&
            this.wallet_state.unlocked_balance == n.result.unlocked_balance
          ) {
            // continue
          }

          this.wallet_state.balance = wallet.info.balance = n.result.balance;
          this.wallet_state.unlocked_balance = wallet.info.unlocked_balance =
            n.result.unlocked_balance;
          this.sendGateway("set_wallet_data", {
            info: wallet.info
          });

          // if balance has recently changed, get updated list of transactions and used addresses
          let actions = [this.getTransactions(), this.getAddressList()];
          actions.push(this.getAddressBook());
          Promise.all(actions).then(data => {
            for (let n of data) {
              Object.keys(n).map(key => {
                wallet[key] = Object.assign(wallet[key], n[key]);
              });
            }
            this.sendGateway("set_wallet_data", wallet);
          });
        }
      }

      // Set the wallet state on initial heartbeat
      if (extended) {
        if (!didError) {
          this.sendGateway("set_wallet_data", wallet);
        } else {
          this.closeWallet().then(() => {
            this.sendGateway("set_wallet_error", {
              status: {
                code: -1,
                i18n: "notification.errors.failedWalletOpen"
              }
            });
          });
        }
      }
    });
  }

  async updateLocalLNSRecords() {
    try {
      const addressData = await this.sendRPC(
        "get_address",
        { account_index: 0 },
        5000
      );
      if (
        addressData.hasOwnProperty("error") ||
        !addressData.hasOwnProperty("result")
      ) {
        return;
      }

      // Pull out all our addresses from the data and make sure they're valid
      const results = addressData.result.addresses || [];
      const addresses = results.map(a => a.address).filter(a => !!a);
      if (addresses.length === 0) return;

      const records = await this.backend.daemon.getLNSRecordsForOwners(
        addresses
      );

      // We need to ensure that we decrypt any incoming records that we already have
      const currentRecords = this.wallet_state.lnsRecords;
      const recordsToUpdate = { ...this.purchasedNames };
      const newRecords = records.map(record => {
        // If we have a new record or we haven't decrypted our current record then we should return the new record
        const current = currentRecords.find(
          c => c.name_hash === record.name_hash
        );
        if (!current || !current.name) return record;

        // We need to check if we need to re-decrypt the record.
        // This is only necessary if the encrypted_value changed.
        const needsToUpdate =
          current.encrypted_value !== record.encrypted_value;
        if (needsToUpdate) {
          const { name, type } = current;
          recordsToUpdate[name] = type;

          return {
            name,
            ...record
          };
        }

        // Otherwise just update our current record with new information (in the case that owner or backup_owner was updated)
        return {
          ...current,
          ...record
        };
      });
      this.wallet_state.lnsRecords = newRecords;
      this.sendGateway("set_wallet_data", { lnsRecords: newRecords });

      // Decrypt the records serially
      let updatePromise = Promise.resolve();
      for (const [name, type] of Object.entries(recordsToUpdate)) {
        updatePromise = updatePromise.then(() => {
          this.decryptLNSRecord(type, name);
        });
      }
    } catch (e) {
      console.debug("Something went wrong when updating lns records: ", e);
    }
  }

  /*
  Get our LNS record and update our wallet state with decrypted values.
  This will return `null` if the record is not in our currently stored records.
  */
  async decryptLNSRecord(type, name) {
    try {
      const record = await this.getLNSRecord(type, name);
      if (!record) return null;

      // Update our current records with the new decrypted record
      const currentRecords = this.wallet_state.lnsRecords;
      const isOurRecord = currentRecords.find(
        c => c.name_hash === record.name_hash
      );
      if (!isOurRecord) return null;

      const newRecords = currentRecords.map(current => {
        if (current.name_hash === record.name_hash) {
          return record;
        }
        return current;
      });
      this.wallet_state.lnsRecords = newRecords;
      this.sendGateway("set_wallet_data", { lnsRecords: newRecords });
      return record;
    } catch (e) {
      console.debug("Something went wrong when updating lns record: ", e);
      return null;
    }
  }

  /*
  Get a LNS record associated with the given name
  */
  async getLNSRecord(type, name) {
    const types = ["session"]; // We currently only support session
    if (!types.includes(type)) return null;

    if (!name || name.trim().length === 0) return null;

    const lowerCaseName = name.toLowerCase();

    const nameHash = await this.hashLNSName(type, lowerCaseName);
    if (!nameHash) return null;

    const record = await this.backend.daemon.getLNSRecord(nameHash);
    if (!record || !record.encrypted_value) return null;

    // Decrypt the value if possible
    const value = await this.decryptLNSValue(
      type,
      lowerCaseName,
      record.encrypted_value
    );

    return {
      name,
      value,
      ...record
    };
  }

  async hashLNSName(type, name) {
    if (!type || !name) return null;

    try {
      const data = await this.sendRPC("lns_hash_name", {
        type,
        name
      });

      if (data.hasOwnProperty("error")) {
        let error =
          data.error.message.charAt(0).toUpperCase() +
          data.error.message.slice(1);
        throw new Error(error);
      }

      return (data.result && data.result.name) || null;
    } catch (e) {
      console.debug("Failed to hash lsn name: ", e);
      return null;
    }
  }

  async decryptLNSValue(type, name, encrypted_value) {
    if (!type || !name || !encrypted_value) return null;

    try {
      const data = await this.sendRPC("lns_decrypt_value", {
        type,
        name,
        encrypted_value
      });

      if (data.hasOwnProperty("error")) {
        let error =
          data.error.message.charAt(0).toUpperCase() +
          data.error.message.slice(1);
        throw new Error(error);
      }

      return (data.result && data.result.value) || null;
    } catch (e) {
      console.debug("Failed to decrypt lsn value: ", e);
      return null;
    }
  }

  stake(password, amount, service_node_key, destination) {
    crypto.pbkdf2(
      password,
      this.auth[2],
      1000,
      64,
      "sha512",
      (err, password_hash) => {
        if (err) {
          this.sendGateway("set_snode_status", {
            stake: {
              code: -1,
              i18n: "notification.errors.internalError",
              sending: false
            }
          });
          return;
        }
        if (!this.isValidPasswordHash(password_hash)) {
          this.sendGateway("set_snode_status", {
            stake: {
              code: -1,
              i18n: "notification.errors.invalidPassword",
              sending: false
            }
          });
          return;
        }

        amount = (parseFloat(amount) * 1e9).toFixed(0);

        this.sendRPC("stake", {
          amount,
          destination,
          service_node_key
        }).then(data => {
          if (data.hasOwnProperty("error")) {
            let error =
              data.error.message.charAt(0).toUpperCase() +
              data.error.message.slice(1);
            this.sendGateway("set_snode_status", {
              stake: {
                code: -1,
                message: error,
                sending: false
              }
            });
            return;
          }

          // Update the new snode list
          this.backend.daemon.updateServiceNodes();

          this.sendGateway("set_snode_status", {
            stake: {
              code: 0,
              i18n: "notification.positive.stakeSuccess",
              sending: false
            }
          });
        });
      }
    );
  }

  registerSnode(password, register_service_node_str) {
    crypto.pbkdf2(
      password,
      this.auth[2],
      1000,
      64,
      "sha512",
      (err, password_hash) => {
        if (err) {
          this.sendGateway("set_snode_status", {
            registration: {
              code: -1,
              i18n: "notification.errors.internalError",
              sending: false
            }
          });
          return;
        }

        if (!this.isValidPasswordHash(password_hash)) {
          this.sendGateway("set_snode_status", {
            registration: {
              code: -1,
              i18n: "notification.errors.invalidPassword",
              sending: false
            }
          });
          return;
        }

        this.sendRPC("register_service_node", {
          register_service_node_str
        }).then(data => {
          if (data.hasOwnProperty("error")) {
            const error =
              data.error.message.charAt(0).toUpperCase() +
              data.error.message.slice(1);
            this.sendGateway("set_snode_status", {
              registration: {
                code: -1,
                message: error,
                sending: false
              }
            });
            return;
          }

          // Update the new snode list
          this.backend.daemon.updateServiceNodes();

          this.sendGateway("set_snode_status", {
            registration: {
              code: 0,
              i18n: "notification.positive.registerServiceNodeSuccess",
              sending: false
            }
          });
        });
      }
    );
  }

  async updateServiceNodeList() {
    this.backend.daemon.updateServiceNodes();
  }

  unlockStake(password, service_node_key, confirmed = false) {
    const sendError = (message, i18n = true) => {
      const key = i18n ? "i18n" : "message";
      this.sendGateway("set_snode_status", {
        unlock: {
          code: -1,
          [key]: message,
          sending: false
        }
      });
    };

    // Unlock code 0 means success, 1 means can unlock, -1 means error
    crypto.pbkdf2(
      password,
      this.auth[2],
      1000,
      64,
      "sha512",
      (err, password_hash) => {
        if (err) {
          sendError("notification.errors.internalError");
          return;
        }

        if (!this.isValidPasswordHash(password_hash)) {
          sendError("notification.errors.invalidPassword");
          return;
        }

        const sendRPC = path => {
          return this.sendRPC(path, {
            service_node_key
          }).then(data => {
            if (data.hasOwnProperty("error")) {
              const error =
                data.error.message.charAt(0).toUpperCase() +
                data.error.message.slice(1);
              sendError(error, false);
              return null;
            }

            if (!data.hasOwnProperty("result")) {
              sendError("notification.errors.failedServiceNodeUnlock");
              return null;
            }

            return data.result;
          });
        };

        if (confirmed) {
          sendRPC("request_stake_unlock").then(data => {
            if (!data) return;

            const unlock = {
              code: data.unlocked ? 0 : -1,
              message: data.msg,
              sending: false
            };

            // Update the new snode list
            if (data.unlocked) {
              this.backend.daemon.updateServiceNodes();
            }

            this.sendGateway("set_snode_status", { unlock });
          });
        } else {
          sendRPC("can_request_stake_unlock").then(data => {
            if (!data) return;

            const unlock = {
              code: data.can_unlock ? 1 : -1,
              message: data.msg,
              sending: false
            };

            this.sendGateway("set_snode_status", { unlock });
          });
        }
      }
    );
  }

  // submits the transaction to the blockchain, irreversible from here
  async relayTransaction(metadataList, isBlink, addressSave, note) {
    const { address, payment_id, address_book } = addressSave;
    let failed = false;
    let errorMessage = "";

    // submit each transaction individually
    for (const hex of metadataList) {
      const params = {
        hex,
        isBlink
      };
      // don't try submit more txs if a prev one failed
      if (failed) break;
      try {
        const data = await this.sendRPC("relay_tx", params);
        if (data.hasOwnProperty("error")) {
          const errMsg = data.error.message;
          const error = errMsg.charAt(0).toUpperCase() + errMsg.slice(1);
          errorMessage = error;
          failed = true;
          return;
        }
        // save note to the new txid
        if (data.hasOwnProperty("result")) {
          const tx_hash = data.result.tx_hash;
          if (note && note !== "") {
            this.saveTxNotes(tx_hash, note);
          }
        }
      } catch (e) {
        failed = true;
        errorMessage = e.toString();
      }
    }

    if (!failed) {
      this.sendGateway("set_tx_status", {
        code: 0,
        i18n: "notification.positive.sendSuccess",
        sending: false
      });

      if (address_book.hasOwnProperty("save") && address_book.save) {
        this.addAddressBook(
          address,
          payment_id,
          address_book.description,
          address_book.name
        );
      }
      return;
    }

    this.sendGateway("set_tx_status", {
      code: -1,
      message: errorMessage,
      sending: false
    });
  }

  // prepares params and provides a "confirm" popup to allow the user to check
  // send address and tx fees before sending
  transfer(password, amount, address, payment_id, priority, isSweepAll) {
    const cryptoCallback = (err, password_hash) => {
      if (err) {
        this.sendGateway("set_tx_status", {
          code: -1,
          i18n: "notification.errors.internalError",
          sending: false
        });
        return;
      }
      if (!this.isValidPasswordHash(password_hash)) {
        this.sendGateway("set_tx_status", {
          code: -1,
          i18n: "notification.errors.invalidPassword",
          sending: false
        });
        return;
      }

      amount = (parseFloat(amount) * 1e9).toFixed(0);

      const rpc_endpoint = isSweepAll ? "sweep_all" : "transfer_split";
      const rpcSpecificParams = isSweepAll
        ? {
            address,
            account_index: 0
          }
        : {
            destinations: [{ amount: amount, address: address }]
          };
      const params = {
        ...rpcSpecificParams,
        priority,
        do_not_relay: true,
        get_tx_metadata: true
      };

      if (payment_id) {
        params.payment_id = payment_id;
      }

      this.sendRPC(rpc_endpoint, params)
        .then(data => {
          if (data.hasOwnProperty("error") || !data.hasOwnProperty("result")) {
            let error = "";
            if (data.error && data.error.message) {
              error =
                data.error.message.charAt(0).toUpperCase() +
                data.error.message.slice(1);
            } else {
              error = `Incorrect result from ${rpc_endpoint} RPC call`;
            }
            this.sendGateway("set_tx_status", {
              code: -1,
              message: error,
              sending: false
            });
            return;
          }
          // update state to show a confirm popup
          this.sendGateway("set_tx_status", {
            code: 1,
            i18n: "strings.awaitingConfirmation",
            sending: false,
            txData: {
              // for a sweep all
              address: data.params.address,
              isSweepAll: rpc_endpoint === "sweep_all",
              amountList: data.result.amount_list,
              metadataList: data.result.tx_metadata_list,
              feeList: data.result.fee_list,
              priority: data.params.priority,
              // for a "send" tx
              destinations: data.params.destinations
            }
          });
        })
        .catch(err => {
          this.sendGateway("set_tx_status", {
            code: -1,
            message: err.message,
            sending: false
          });
        });
    };

    crypto.pbkdf2(password, this.auth[2], 1000, 64, "sha512", cryptoCallback);
  }

  purchaseLNS(password, type, name, value, owner, backupOwner) {
    const _name = name.trim().toLowerCase();
    const _owner = owner.trim() === "" ? null : owner;
    const backup_owner = backupOwner.trim() === "" ? null : backupOwner;

    crypto.pbkdf2(
      password,
      this.auth[2],
      1000,
      64,
      "sha512",
      (err, password_hash) => {
        if (err) {
          this.sendGateway("set_lns_status", {
            code: -1,
            i18n: "notification.errors.internalError",
            sending: false
          });
          return;
        }
        if (!this.isValidPasswordHash(password_hash)) {
          this.sendGateway("set_lns_status", {
            code: -1,
            i18n: "notification.errors.invalidPassword",
            sending: false
          });
          return;
        }

        const params = {
          type,
          owner: _owner,
          backup_owner,
          name: _name,
          value
        };

        this.sendRPC("lns_buy_mapping", params).then(data => {
          if (data.hasOwnProperty("error")) {
            let error =
              data.error.message.charAt(0).toUpperCase() +
              data.error.message.slice(1);
            this.sendGateway("set_lns_status", {
              code: -1,
              message: error,
              sending: false
            });
            return;
          }

          this.purchasedNames[name.trim()] = type;

          // Fetch new records and then get the decrypted record for the one we just inserted
          setTimeout(() => this.updateLocalLNSRecords(), 5000);

          this.sendGateway("set_lns_status", {
            code: 0,
            i18n: "notification.positive.namePurchased",
            sending: false
          });
        });
      }
    );
  }

  updateLNSMapping(password, type, name, value, owner, backupOwner) {
    const _name = name.trim().toLowerCase();
    const _owner = owner.trim() === "" ? null : owner;
    const backup_owner = backupOwner.trim() === "" ? null : backupOwner;

    crypto.pbkdf2(
      password,
      this.auth[2],
      1000,
      64,
      "sha512",
      (err, password_hash) => {
        if (err) {
          this.sendGateway("set_lns_status", {
            code: -1,
            i18n: "notification.errors.internalError",
            sending: false
          });
          return;
        }
        if (!this.isValidPasswordHash(password_hash)) {
          this.sendGateway("set_lns_status", {
            code: -1,
            i18n: "notification.errors.invalidPassword",
            sending: false
          });
          return;
        }

        const params = {
          type,
          owner: _owner,
          backup_owner,
          name: _name,
          value
        };

        this.sendRPC("lns_update_mapping", params).then(data => {
          if (data.hasOwnProperty("error")) {
            let error =
              data.error.message.charAt(0).toUpperCase() +
              data.error.message.slice(1);
            this.sendGateway("set_lns_status", {
              code: -1,
              message: error,
              sending: false
            });
            return;
          }

          this.purchasedNames[name.trim()] = type;

          // Fetch new records and then get the decrypted record for the one we just inserted
          setTimeout(() => this.updateLocalLNSRecords(), 5000);

          // Optimistically update our record
          const { lnsRecords } = this.wallet_state;
          const newRecords = lnsRecords.map(record => {
            if (
              record.type === type &&
              record.name &&
              record.name.toLowerCase() === _name
            ) {
              return {
                ...record,
                owner: _owner,
                backup_owner,
                value
              };
            }

            return record;
          });
          this.wallet_state.lnsRecords = newRecords;
          this.sendGateway("set_wallet_data", { lnsRecords: newRecords });

          this.sendGateway("set_lns_status", {
            code: 0,
            i18n: "notification.positive.lnsRecordUpdated",
            sending: false
          });
        });
      }
    );
  }

  proveTransaction(txid, address, message) {
    const _address = address.trim() === "" ? null : address;
    const _message = message.trim() === "" ? null : message;

    const rpc_endpoint = _address ? "get_tx_proof" : "get_spend_proof";
    const params = {
      txid,
      address: _address,
      message: _message
    };

    this.sendGateway("set_prove_transaction_status", {
      code: 1,
      message: "",
      state: {}
    });

    this.sendRPC(rpc_endpoint, params).then(data => {
      if (data.hasOwnProperty("error")) {
        let error =
          data.error.message.charAt(0).toUpperCase() +
          data.error.message.slice(1);
        this.sendGateway("set_prove_transaction_status", {
          code: -1,
          message: error,
          state: {}
        });
        return;
      }

      this.sendGateway("set_prove_transaction_status", {
        code: 0,
        message: "",
        state: {
          txid,
          ...(data.result || {})
        }
      });
    });
  }

  checkTransactionProof(signature, txid, address, message) {
    const _address = address.trim() === "" ? null : address;
    const _message = message.trim() === "" ? null : message;

    const rpc_endpoint = _address ? "check_tx_proof" : "check_spend_proof";
    const params = {
      txid,
      signature,
      address: _address,
      message: _message
    };

    this.sendGateway("set_check_transaction_status", {
      code: 1,
      message: "",
      state: {}
    });

    this.sendRPC(rpc_endpoint, params).then(data => {
      if (data.hasOwnProperty("error")) {
        let error =
          data.error.message.charAt(0).toUpperCase() +
          data.error.message.slice(1);
        this.sendGateway("set_check_transaction_status", {
          code: -1,
          message: error,
          state: {}
        });
        return;
      }

      this.sendGateway("set_check_transaction_status", {
        code: 0,
        message: "",
        state: {
          txid,
          ...(data.result || {})
        }
      });
    });
  }

  rescanBlockchain() {
    this.sendRPC("rescan_blockchain");
  }

  rescanSpent() {
    this.sendRPC("rescan_spent");
  }

  getPrivateKeys(password) {
    crypto.pbkdf2(
      password,
      this.auth[2],
      1000,
      64,
      "sha512",
      (err, password_hash) => {
        if (err) {
          this.sendGateway("set_wallet_data", {
            secret: {
              mnemonic: "notification.errors.internalError",
              spend_key: -1,
              view_key: -1
            }
          });
          return;
        }
        if (!this.isValidPasswordHash(password_hash)) {
          this.sendGateway("set_wallet_data", {
            secret: {
              mnemonic: "notification.errors.invalidPassword",
              spend_key: -1,
              view_key: -1
            }
          });
          return;
        }
        Promise.all([
          this.sendRPC("query_key", { key_type: "mnemonic" }),
          this.sendRPC("query_key", { key_type: "spend_key" }),
          this.sendRPC("query_key", { key_type: "view_key" })
        ]).then(data => {
          let wallet = {
            secret: {
              mnemonic: "",
              spend_key: "",
              view_key: ""
            }
          };
          for (let n of data) {
            if (n.hasOwnProperty("error") || !n.hasOwnProperty("result")) {
              continue;
            }
            wallet.secret[n.params.key_type] = n.result.key;
          }

          this.sendGateway("set_wallet_data", wallet);
        });
      }
    );
  }

  getAddressList() {
    return new Promise(resolve => {
      Promise.all([
        this.sendRPC("get_address", { account_index: 0 }),
        this.sendRPC("getbalance", { account_index: 0 })
      ]).then(data => {
        for (let n of data) {
          if (n.hasOwnProperty("error") || !n.hasOwnProperty("result")) {
            resolve({});
            return;
          }
        }

        let num_unused_addresses = 10;

        let wallet = {
          info: {
            address: data[0].result.address,
            balance: data[1].result.balance,
            unlocked_balance: data[1].result.unlocked_balance
            // num_unspent_outputs: data[1].result.num_unspent_outputs
          },
          address_list: {
            primary: [],
            used: [],
            unused: []
          }
        };

        for (let address of data[0].result.addresses) {
          address.balance = null;
          address.unlocked_balance = null;
          address.num_unspent_outputs = null;

          if (data[1].result.hasOwnProperty("per_subaddress")) {
            for (let address_balance of data[1].result.per_subaddress) {
              if (address_balance.address_index == address.address_index) {
                address.balance = address_balance.balance;
                address.unlocked_balance = address_balance.unlocked_balance;
                address.num_unspent_outputs =
                  address_balance.num_unspent_outputs;
                break;
              }
            }
          }

          if (address.address_index == 0) {
            wallet.address_list.primary.push(address);
          } else if (address.used) {
            wallet.address_list.used.push(address);
          } else {
            wallet.address_list.unused.push(address);
          }
        }

        // limit to 10 unused addresses
        wallet.address_list.unused = wallet.address_list.unused.slice(0, 10);

        if (wallet.address_list.unused.length < num_unused_addresses) {
          for (
            let n = wallet.address_list.unused.length;
            n < num_unused_addresses;
            n++
          ) {
            this.sendRPC("create_address", {
              account_index: 0
            }).then(data => {
              wallet.address_list.unused.push(data.result);
              if (wallet.address_list.unused.length == num_unused_addresses) {
                // should sort them here
                resolve(wallet);
              }
            });
          }
        } else {
          resolve(wallet);
        }
      });
    });
  }

  getTransactions() {
    return new Promise(resolve => {
      this.sendRPC("get_transfers", {
        in: true,
        out: true,
        pending: true,
        failed: true,
        pool: true
      }).then(data => {
        if (data.hasOwnProperty("error") || !data.hasOwnProperty("result")) {
          resolve({});
          return;
        }
        let wallet = {
          transactions: {
            tx_list: []
          }
        };

        const types = [
          "in",
          "out",
          "pending",
          "failed",
          "pool",
          "miner",
          "snode",
          "gov",
          "stake"
        ];
        types.forEach(type => {
          if (data.result.hasOwnProperty(type)) {
            wallet.transactions.tx_list = wallet.transactions.tx_list.concat(
              data.result[type]
            );
          }
        });

        for (let i = 0; i < wallet.transactions.tx_list.length; i++) {
          if (/^0*$/.test(wallet.transactions.tx_list[i].payment_id)) {
            wallet.transactions.tx_list[i].payment_id = "";
          } else if (
            /^0*$/.test(wallet.transactions.tx_list[i].payment_id.substring(16))
          ) {
            wallet.transactions.tx_list[
              i
            ].payment_id = wallet.transactions.tx_list[i].payment_id.substring(
              0,
              16
            );
          }
        }

        wallet.transactions.tx_list.sort(function(a, b) {
          if (a.timestamp < b.timestamp) return 1;
          if (a.timestamp > b.timestamp) return -1;
          return 0;
        });
        resolve(wallet);
      });
    });
  }

  getAddressBook() {
    return new Promise(resolve => {
      this.sendRPC("get_address_book").then(data => {
        if (data.hasOwnProperty("error") || !data.hasOwnProperty("result")) {
          resolve({});
          return;
        }
        let wallet = {
          address_list: {
            address_book: [],
            address_book_starred: []
          }
        };

        const entries = data.result.entries || [];
        const addresses = entries.map(e => {
          const entry = { ...e };
          const desc = entry.description.split("::");
          if (desc.length == 3) {
            entry.starred = desc[0] == "starred";
            entry.name = desc[1];
            entry.description = desc[2];
          } else if (desc.length == 2) {
            entry.starred = false;
            entry.name = desc[0];
            entry.description = desc[1];
          } else {
            entry.starred = false;
            entry.name = entry.description;
            entry.description = "";
          }

          if (/^0*$/.test(entry.payment_id)) {
            entry.payment_id = "";
          } else if (/^0*$/.test(entry.payment_id.substring(16))) {
            entry.payment_id = entry.payment_id.substring(0, 16);
          }

          return entry;
        });

        for (const entry of addresses) {
          const list = entry.starred
            ? wallet.address_list.address_book_starred
            : wallet.address_list.address_book;
          const hasAddress = list.find(a => {
            return (
              a.address === entry.address &&
              a.name === entry.name &&
              a.payment_id === entry.payment_id
            );
          });
          if (!hasAddress) {
            list.push(entry);
          }
        }

        resolve(wallet);
      });
    });
  }

  deleteAddressBook(index = false) {
    if (index !== false) {
      this.sendRPC("delete_address_book", { index: index }).then(() => {
        this.saveWallet().then(() => {
          this.getAddressBook().then(data => {
            this.sendGateway("set_wallet_data", data);
          });
        });
      });
    }
  }

  addAddressBook(
    address,
    payment_id = null,
    description = "",
    name = "",
    starred = false,
    index = false
  ) {
    if (index !== false) {
      this.sendRPC("delete_address_book", { index: index }).then(() => {
        this.addAddressBook(address, payment_id, description, name, starred);
      });
      return;
    }

    let params = {
      address
    };
    if (payment_id != null) {
      params.payment_id = payment_id;
    }

    let desc = [];
    if (starred) {
      desc.push("starred");
    }
    desc.push(name, description);

    params.description = desc.join("::");

    this.sendRPC("add_address_book", params).then(() => {
      this.saveWallet().then(() => {
        this.getAddressBook().then(data => {
          this.sendGateway("set_wallet_data", data);
        });
      });
    });
  }

  saveTxNotes(txid, note) {
    this.sendRPC("set_tx_notes", { txids: [txid], notes: [note] }).then(() => {
      this.getTransactions().then(wallet => {
        this.sendGateway("set_wallet_data", wallet);
      });
    });
  }

  exportKeyImages(password, filename = null) {
    crypto.pbkdf2(
      password,
      this.auth[2],
      1000,
      64,
      "sha512",
      (err, password_hash) => {
        if (err) {
          this.sendGateway("show_notification", {
            type: "negative",
            i18n: "notification.errors.internalError",
            timeout: 2000
          });
          return;
        }
        if (!this.isValidPasswordHash(password_hash)) {
          this.sendGateway("show_notification", {
            type: "negative",
            i18n: "notification.errors.invalidPassword",
            timeout: 2000
          });
          return;
        }

        if (filename == null) {
          filename = path.join(
            this.wallet_data_dir,
            "images",
            this.wallet_state.name,
            "key_image_export"
          );
        } else {
          filename = path.join(filename, "key_image_export");
        }

        const onError = () =>
          this.sendGateway("show_notification", {
            type: "negative",
            i18n: "notification.errors.keyImages.exporting",
            timeout: 2000
          });

        this.sendRPC("export_key_images")
          .then(data => {
            if (
              data.hasOwnProperty("error") ||
              !data.hasOwnProperty("result")
            ) {
              onError();
              return;
            }

            if (data.result.signed_key_images) {
              fs.outputJSONSync(filename, data.result.signed_key_images);
              this.sendGateway("show_notification", {
                i18n: [
                  "notification.positive.keyImages.exported",
                  { filename }
                ],
                timeout: 2000
              });
            } else {
              this.sendGateway("show_notification", {
                type: "warning",
                textColor: "black",
                i18n: "notification.warnings.noKeyImageExport",
                timeout: 2000
              });
            }
          })
          .catch(onError);
      }
    );
  }

  importKeyImages(password, filename = null) {
    crypto.pbkdf2(
      password,
      this.auth[2],
      1000,
      64,
      "sha512",
      (err, password_hash) => {
        if (err) {
          this.sendGateway("show_notification", {
            type: "negative",
            i18n: "notification.errors.internalError",
            timeout: 2000
          });
          return;
        }
        if (!this.isValidPasswordHash(password_hash)) {
          this.sendGateway("show_notification", {
            type: "negative",
            i18n: "notification.errors.invalidPassword",
            timeout: 2000
          });
          return;
        }

        if (filename == null) {
          filename = path.join(
            this.wallet_data_dir,
            "images",
            this.wallet_state.name,
            "key_image_export"
          );
        }

        const onError = i18n =>
          this.sendGateway("show_notification", {
            type: "negative",
            i18n,
            timeout: 2000
          });

        fs.readJSON(filename)
          .then(signed_key_images => {
            this.sendRPC("import_key_images", {
              signed_key_images
            }).then(data => {
              if (
                data.hasOwnProperty("error") ||
                !data.hasOwnProperty("result")
              ) {
                onError("notification.errors.keyImages.importing");
                return;
              }

              this.sendGateway("show_notification", {
                i18n: "notification.positive.keyImages.imported",
                timeout: 2000
              });
            });
          })
          .catch(() => onError("notification.errors.keyImages.reading"));
      }
    );
  }

  copyOldGuiWallets(wallets) {
    this.sendGateway("set_old_gui_import_status", {
      code: 1,
      failed_wallets: []
    });

    /*
        Old wallets were in the following format:
            wallets:
                <name>:
                    <name>
                    <name>.keys
                    <name>.address.txt

        We need to change it so it becomes:
            wallets:
                <name>
                <name>.keys
                <name>.address.txt
        */

    const failed_wallets = [];

    for (const wallet of wallets) {
      const { type, directory } = wallet;

      const old_gui_path = path.join(this.wallet_dir, "old-gui");
      const dir_path = path.join(this.wallet_dir, directory);
      const stat = fs.statSync(dir_path);
      if (!stat.isDirectory()) continue;

      // Make sure the directory has the keys file
      const wallet_file = path.join(dir_path, directory);
      const key_file = wallet_file + ".keys";

      // If we don't have them then don't bother copying
      if (!fs.existsSync(key_file)) {
        failed_wallets.push(directory);
        continue;
      }

      // Copy out the file into the relevant directory
      const destination = path.join(this.dirs[type], "wallets");
      if (!fs.existsSync(destination)) fs.mkdirpSync(destination);

      try {
        // Don't move file if we already have copied the keys file
        if (fs.existsSync(path.join(destination, directory) + ".keys")) {
          failed_wallets.push(directory);
          continue;
        }

        // Archive the folder
        if (!fs.existsSync(old_gui_path)) fs.mkdirpSync(old_gui_path);
        const archive_path = path.join(old_gui_path, directory);
        fs.moveSync(dir_path, archive_path, { overwrite: true });

        // Copy contents of archived folder into the wallet folder
        fs.copySync(archive_path, this.wallet_dir, { overwrite: true });
      } catch (e) {
        failed_wallets.push(directory);
        continue;
      }
    }

    this.sendGateway("set_old_gui_import_status", {
      code: 0,
      failed_wallets
    });
    this.listWallets();
  }

  listWallets(legacy = false) {
    let wallets = {
      list: [],
      directories: []
    };

    let walletFiles = [];
    try {
      walletFiles = fs.readdirSync(this.wallet_dir);
    } catch (e) {
      this.sendGateway("show_notification", {
        type: "negative",
        i18n: "notification.errors.failedWalletRead",
        timeout: 2000
      });
      return;
    }

    walletFiles.forEach(filename => {
      try {
        switch (filename) {
          case ".DS_Store":
          case ".DS_Store?":
          case "._.DS_Store":
          case ".Spotlight-V100":
          case ".Trashes":
          case "ehthumbs.db":
          case "Thumbs.db":
          case "old-gui":
            return;
        }

        // If it's a directory then check if it's an old gui wallet
        const name = path.join(this.wallet_dir, filename);
        const stat = fs.statSync(name);
        if (stat.isDirectory()) {
          // Make sure the directory has keys file
          const wallet_file = path.join(name, filename);
          const key_file = wallet_file + ".keys";

          // If we have them then it is an old gui wallet
          if (fs.existsSync(key_file)) {
            wallets.directories.push(filename);
          }
          return;
        }

        // Exclude all files without a keys extension
        if (path.extname(filename) !== ".keys") return;

        const wallet_name = path.parse(filename).name;
        if (!wallet_name) return;

        let wallet_data = {
          name: wallet_name,
          address: null,
          password_protected: null
        };

        if (
          fs.existsSync(path.join(this.wallet_dir, wallet_name + ".meta.json"))
        ) {
          let meta = fs.readFileSync(
            path.join(this.wallet_dir, wallet_name + ".meta.json"),
            "utf8"
          );
          if (meta) {
            meta = JSON.parse(meta);
            wallet_data.address = meta.address;
            wallet_data.password_protected = meta.password_protected;
          }
        } else if (
          fs.existsSync(
            path.join(this.wallet_dir, wallet_name + ".address.txt")
          )
        ) {
          let address = fs.readFileSync(
            path.join(this.wallet_dir, wallet_name + ".address.txt"),
            "utf8"
          );
          if (address) {
            wallet_data.address = address;
          }
        }

        wallets.list.push(wallet_data);
      } catch (e) {
        // Something went wrong
      }
    });

    // Check for legacy wallet files
    if (legacy) {
      wallets.legacy = [];
      let legacy_paths = [];
      if (os.platform() == "win32") {
        legacy_paths = ["C:\\ProgramData\\Loki"];
      } else {
        legacy_paths = [path.join(os.homedir(), "Loki")];
      }
      for (var i = 0; i < legacy_paths.length; i++) {
        try {
          let legacy_config_path = path.join(
            legacy_paths[i],
            "config",
            "wallet_info.json"
          );
          if (this.net_type === "test") {
            legacy_config_path = path.join(
              legacy_paths[i],
              "testnet",
              "config",
              "wallet_info.json"
            );
          }
          if (!fs.existsSync(legacy_config_path)) {
            continue;
          }

          let legacy_config = JSON.parse(
            fs.readFileSync(legacy_config_path, "utf8")
          );
          let legacy_wallet_path = legacy_config.wallet_filepath;
          if (!fs.existsSync(legacy_wallet_path)) {
            continue;
          }

          let legacy_address = "";
          if (fs.existsSync(legacy_wallet_path + ".address.txt")) {
            legacy_address = fs.readFileSync(
              legacy_wallet_path + ".address.txt",
              "utf8"
            );
          }
          wallets.legacy.push({
            path: legacy_wallet_path,
            address: legacy_address
          });
        } catch (e) {
          // Something went wrong
        }
      }
    }

    this.sendGateway("wallet_list", wallets);
  }

  changeWalletPassword(old_password, new_password) {
    crypto.pbkdf2(
      old_password,
      this.auth[2],
      1000,
      64,
      "sha512",
      (err, password_hash) => {
        if (err) {
          this.sendGateway("show_notification", {
            type: "negative",
            i18n: "notification.errors.internalError",
            timeout: 2000
          });
          return;
        }
        if (!this.isValidPasswordHash(password_hash)) {
          this.sendGateway("show_notification", {
            type: "negative",
            i18n: "notification.errors.invalidOldPassword",
            timeout: 2000
          });
          return;
        }

        this.sendRPC("change_wallet_password", {
          old_password,
          new_password
        }).then(data => {
          if (data.hasOwnProperty("error") || !data.hasOwnProperty("result")) {
            this.sendGateway("show_notification", {
              type: "negative",
              i18n: "notification.errors.changingPassword",
              timeout: 2000
            });
            return;
          }

          // store hash of the password so we can check against it later when requesting private keys, or for sending txs
          this.wallet_state.password_hash = crypto
            .pbkdf2Sync(new_password, this.auth[2], 1000, 64, "sha512")
            .toString("hex");

          this.sendGateway("show_notification", {
            i18n: "notification.positive.passwordUpdated",
            timeout: 2000
          });
        });
      }
    );
  }

  deleteWallet(password) {
    crypto.pbkdf2(
      password,
      this.auth[2],
      1000,
      64,
      "sha512",
      (err, password_hash) => {
        if (err) {
          this.sendGateway("show_notification", {
            type: "negative",
            i18n: "notification.errors.internalError",
            timeout: 2000
          });
          return;
        }
        if (!this.isValidPasswordHash(password_hash)) {
          this.sendGateway("show_notification", {
            type: "negative",
            i18n: "notification.errors.invalidPassword",
            timeout: 2000
          });
          return;
        }

        this.sendGateway("show_loading", {
          message: "Deleting wallet"
        });

        let wallet_path = path.join(this.wallet_dir, this.wallet_state.name);
        this.closeWallet().then(() => {
          try {
            if (fs.existsSync(wallet_path + ".keys"))
              fs.unlinkSync(wallet_path + ".keys");
            if (fs.existsSync(wallet_path + ".address.txt"))
              fs.unlinkSync(wallet_path + ".address.txt");
            if (fs.existsSync(wallet_path)) fs.unlinkSync(wallet_path);
          } catch (e) {
            console.warn(`Failed to delete wallet files: ${e}`);
          }

          this.listWallets();
          this.sendGateway("hide_loading");
          this.sendGateway("return_to_wallet_select");
        });
      }
    );
  }

  async saveWallet() {
    await this.sendRPC("store");
  }

  async closeWallet() {
    clearInterval(this.heartbeat);
    clearInterval(this.lnsHeartbeat);
    this.wallet_state = {
      open: false,
      name: "",
      password_hash: null,
      balance: null,
      unlocked_balance: null,
      lnsRecords: []
    };

    this.purchasedNames = {};

    await this.saveWallet();
    await this.sendRPC("close_wallet");
  }

  sendGateway(method, data) {
    // if wallet is closed, do not send any wallet data to gateway
    // this is for the case that we close the wallet at the same
    // after another action has started, but before it has finished
    if (!this.wallet_state.open && method == "set_wallet_data") {
      return;
    }
    this.backend.send(method, data);
  }

  sendRPC(method, params = {}, timeout = 0) {
    let id = this.id++;
    let options = {
      uri: `${this.protocol}${this.hostname}:${this.port}/json_rpc`,
      method: "POST",
      json: {
        jsonrpc: "2.0",
        id: id,
        method: method
      },
      auth: {
        user: this.auth[0],
        pass: this.auth[1],
        sendImmediately: false
      },
      agent: this.agent
    };
    if (Object.keys(params).length !== 0) {
      options.json.params = params;
    }
    if (timeout > 0) {
      options.timeout = timeout;
    }

    return this.queue.add(() => {
      return request(options)
        .then(response => {
          if (response.hasOwnProperty("error")) {
            return {
              method: method,
              params: params,
              error: response.error
            };
          }
          return {
            method: method,
            params: params,
            result: response.result
          };
        })
        .catch(error => {
          return {
            method: method,
            params: params,
            error: {
              code: -1,
              message: "Cannot connect to wallet-rpc",
              cause: error.cause
            }
          };
        });
    });
  }

  getRPC(parameter, params = {}) {
    return this.sendRPC(`get_${parameter}`, params);
  }

  async quit() {
    return new Promise(resolve => {
      if (!this.walletRPCProcess) {
        resolve();
        return;
      }

      this.closeWallet().then(() => {
        // normally we would exit wallet after this promise
        // however if the wallet is not responsive to RPC
        // requests then we must forcefully close it below
      });
      setTimeout(() => {
        if (this.walletRPCProcess) {
          this.walletRPCProcess.on("close", () => {
            this.agent.destroy();
            clearTimeout(this.forceKill);
            resolve();
          });

          // Force kill after 20 seconds
          this.forceKill = setTimeout(() => {
            if (this.walletRPCProcess) {
              this.walletRPCProcess.kill("SIGKILL");
            }
          }, 20000);

          // Force kill if the rpc is syncing
          const signal = this.isRPCSyncing ? "SIGKILL" : "SIGTERM";
          this.walletRPCProcess.kill(signal);
        } else {
          resolve();
        }
      }, 2500);
    });
  }
}
