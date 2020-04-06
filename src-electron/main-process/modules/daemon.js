import child_process from "child_process";
const request = require("request-promise");
const queue = require("promise-queue");
const http = require("http");
const fs = require("fs");
const path = require("upath");
const portscanner = require("portscanner");

export class Daemon {
  constructor(backend) {
    this.backend = backend;
    this.heartbeat = null;
    this.heartbeat_slow = null;
    this.id = 0;
    this.net_type = "mainnet";
    this.local = false; // do we have a local daemon ?

    this.agent = new http.Agent({ keepAlive: true, maxSockets: 1 });
    this.queue = new queue(1, Infinity);

    // Settings for timestamp to height conversion
    // These are initial values used to calculate the height
    this.PIVOT_BLOCK_HEIGHT = 119681;
    this.PIVOT_BLOCK_TIMESTAMP = 1539676273;
    this.PIVOT_BLOCK_TIME = 120;
  }

  checkVersion() {
    return new Promise(resolve => {
      if (process.platform === "win32") {
        let lokid_path = path.join(__ryo_bin, "lokid.exe");
        let lokid_version_cmd = `"${lokid_path}" --version`;
        if (!fs.existsSync(lokid_path)) {
          resolve(false);
        }
        child_process.exec(lokid_version_cmd, (error, stdout) => {
          if (error) {
            resolve(false);
          }
          resolve(stdout);
        });
      } else {
        let lokid_path = path.join(__ryo_bin, "lokid");
        let lokid_version_cmd = `"${lokid_path}" --version`;
        if (!fs.existsSync(lokid_path)) {
          resolve(false);
        }
        child_process.exec(lokid_version_cmd, { detached: true }, (error, stdout) => {
          if (error) {
            resolve(false);
          }
          resolve(stdout);
        });
      }
    });
  }

  checkRemote(daemon) {
    if (daemon.type === "local") {
      return Promise.resolve({});
    }

    return this.sendRPC(
      "get_info",
      {},
      {
        protocol: "http://",
        hostname: daemon.remote_host,
        port: daemon.remote_port,
        timeout: 20000
      }
    ).then(data => {
      if (data.error) return { error: data.error };
      return {
        net_type: data.result.nettype
      };
    });
  }

  start(options) {
    const { net_type } = options.app;
    const daemon = options.daemons[net_type];
    if (daemon.type === "remote") {
      this.local = false;

      // save this info for later RPC calls
      this.protocol = "http://";
      this.hostname = daemon.remote_host;
      this.port = daemon.remote_port;

      return new Promise((resolve, reject) => {
        // Set a 20 second timeout on get_info incase the node is unresponsive
        this.sendRPC("get_info", {}, { timeout: 20000 }).then(data => {
          if (!data.hasOwnProperty("error")) {
            this.startHeartbeat();
            resolve();
          } else {
            reject();
          }
        });
      });
    }
    return new Promise((resolve, reject) => {
      this.local = true;

      const args = [
        "--data-dir",
        options.app.data_dir,
        "--p2p-bind-ip",
        daemon.p2p_bind_ip,
        "--p2p-bind-port",
        daemon.p2p_bind_port,
        "--rpc-bind-ip",
        daemon.rpc_bind_ip,
        "--rpc-bind-port",
        daemon.rpc_bind_port,
        "--zmq-rpc-bind-ip",
        daemon.zmq_rpc_bind_ip,
        "--zmq-rpc-bind-port",
        daemon.zmq_rpc_bind_port,
        "--out-peers",
        daemon.out_peers,
        "--in-peers",
        daemon.in_peers,
        "--limit-rate-up",
        daemon.limit_rate_up,
        "--limit-rate-down",
        daemon.limit_rate_down,
        "--log-level",
        daemon.log_level
      ];

      const dirs = {
        mainnet: options.app.data_dir,
        stagenet: path.join(options.app.data_dir, "stagenet"),
        testnet: path.join(options.app.data_dir, "testnet")
      };

      const { net_type } = options.app;
      this.net_type = net_type;

      if (net_type === "testnet") {
        args.push("--testnet");
      } else if (net_type === "stagenet") {
        args.push("--stagenet");
      }

      args.push("--log-file", path.join(dirs[net_type], "logs", "lokid.log"));
      if (daemon.rpc_bind_ip !== "127.0.0.1") {
        args.push("--confirm-external-bind");
      }

      // TODO: Check if we need to push this command for staging too
      if (daemon.type === "local_remote" && net_type === "mainnet") {
        args.push("--bootstrap-daemon-address", `${daemon.remote_host}:${daemon.remote_port}`);
      }

      // save this info for later RPC calls
      this.protocol = "http://";
      this.hostname = daemon.rpc_bind_ip;
      this.port = daemon.rpc_bind_port;

      portscanner
        .checkPortStatus(this.port, this.hostname)
        .catch(() => "closed")
        .then(status => {
          if (status === "closed") {
            if (process.platform === "win32") {
              this.daemonProcess = child_process.spawn(path.join(__ryo_bin, "lokid.exe"), args);
            } else {
              this.daemonProcess = child_process.spawn(path.join(__ryo_bin, "lokid"), args, {
                detached: true
              });
            }

            this.daemonProcess.stdout.on("data", data => process.stdout.write(`Daemon: ${data}`));
            this.daemonProcess.on("error", err => process.stderr.write(`Daemon: ${err}`));
            this.daemonProcess.on("close", code => {
              process.stderr.write(`Daemon: exited with code ${code} \n`);
              this.daemonProcess = null;
              this.agent.destroy();
              if (code === null) {
                reject(new Error("Failed to start local daemon"));
              }
            });

            // To let caller know when the daemon is ready
            // We can't apply timeout to this because the local daemon might be syncing in the background
            let intrvl = setInterval(() => {
              this.sendRPC("get_info").then(data => {
                if (!data.hasOwnProperty("error")) {
                  this.startHeartbeat();
                  clearInterval(intrvl);
                  resolve();
                } else {
                  if (this.daemonProcess && data.error.cause && data.error.cause.code === "ECONNREFUSED") {
                    // Ignore
                  } else {
                    clearInterval(intrvl);
                    this.killProcess();
                    reject(new Error("Could not connect to local daemon"));
                  }
                }
              });
            }, 1000);
          } else {
            reject(new Error(`Local daemon port ${this.port} is in use`));
          }
        });
    });
  }

  killProcess() {
    if (this.daemonProcess) {
      this.daemonProcess.kill();
      this.daemonProcess = null;
    }
  }

  handle(data) {
    let params = data.data;

    switch (data.method) {
      case "ban_peer":
        this.banPeer(params.host, params.seconds);
        break;

      default:
    }
  }

  banPeer(host, seconds = 3600) {
    if (!seconds) {
      seconds = 3600;
    }

    let params = {
      bans: [
        {
          host,
          seconds,
          ban: true
        }
      ]
    };

    this.sendRPC("set_bans", params).then(data => {
      if (data.hasOwnProperty("error") || !data.hasOwnProperty("result")) {
        this.sendGateway("show_notification", {
          type: "negative",
          i18n: "notification.errors.banningPeer",
          timeout: 2000
        });
        return;
      }

      let end_time = new Date(Date.now() + seconds * 1000).toLocaleString();
      this.sendGateway("show_notification", {
        i18n: ["notification.positive.bannedPeer", { host, time: end_time }],
        timeout: 2000
      });

      // Send updated peer and ban list
      this.heartbeatSlowAction();
    });
  }

  timestampToHeight(timestamp, pivot = null, recursion_limit = null) {
    return new Promise((resolve, reject) => {
      if (timestamp > 999999999999) {
        // We have got a JS ms timestamp, convert
        timestamp = Math.floor(timestamp / 1000);
      }

      pivot = pivot || [this.PIVOT_BLOCK_HEIGHT, this.PIVOT_BLOCK_TIMESTAMP];
      recursion_limit = recursion_limit || 0;

      let diff = Math.floor((timestamp - pivot[1]) / this.PIVOT_BLOCK_TIME);
      let estimated_height = pivot[0] + diff;

      if (estimated_height <= 0) {
        return resolve(0);
      }

      if (recursion_limit > 10) {
        return resolve(pivot[0]);
      }

      this.getRPC("block_header_by_height", {
        height: estimated_height
      }).then(data => {
        if (data.hasOwnProperty("error") || !data.hasOwnProperty("result")) {
          if (data.error.code == -2) {
            // Too big height
            this.getRPC("last_block_header").then(data => {
              if (data.hasOwnProperty("error") || !data.hasOwnProperty("result")) {
                return reject();
              }

              let new_pivot = [data.result.block_header.height, data.result.block_header.timestamp];

              // If we are within an hour that is good enough
              // If for some reason there is a > 1h gap between blocks
              // the recursion limit will take care of infinite loop
              if (Math.abs(timestamp - new_pivot[1]) < 3600) {
                return resolve(new_pivot[0]);
              }

              // Continue recursion with new pivot
              resolve(new_pivot);
            });
            return;
          } else {
            return reject();
          }
        }

        let new_pivot = [data.result.block_header.height, data.result.block_header.timestamp];

        // If we are within an hour that is good enough
        // If for some reason there is a > 1h gap between blocks
        // the recursion limit will take care of infinite loop
        if (Math.abs(timestamp - new_pivot[1]) < 3600) {
          return resolve(new_pivot[0]);
        }

        // Continue recursion with new pivot
        resolve(new_pivot);
      });
    })
      .then(pivot_or_height => {
        return Array.isArray(pivot_or_height)
          ? this.timestampToHeight(timestamp, pivot_or_height, recursion_limit + 1)
          : pivot_or_height;
      })
      .catch(() => {
        return false;
      });
  }

  startHeartbeat() {
    clearInterval(this.heartbeat);
    this.heartbeat = setInterval(
      () => {
        this.heartbeatAction();
      },
      this.local ? 5 * 1000 : 30 * 1000
    ); // 5 seconds for local daemon, 30 seconds for remote
    this.heartbeatAction();

    clearInterval(this.heartbeat_slow);
    this.heartbeat_slow = setInterval(() => {
      this.heartbeatSlowAction();
    }, 30 * 1000); // 30 seconds
    this.heartbeatSlowAction();

    clearInterval(this.serviceNodeHeartbeat);
    this.serviceNodeHeartbeat = setInterval(() => {
      this.updateServiceNodes();
    }, 5 * 60 * 1000); // 5 minutes
    this.updateServiceNodes();
  }

  heartbeatAction() {
    let actions = [];

    // No difference between local and remote heartbeat action for now
    if (this.local) {
      actions = [this.getRPC("info")];
    } else {
      actions = [this.getRPC("info")];
    }

    Promise.all(actions).then(data => {
      let daemon_info = {};
      for (let n of data) {
        if (n == undefined || !n.hasOwnProperty("result") || n.result == undefined) {
          continue;
        }
        if (n.method == "get_info") {
          daemon_info.info = n.result;
        }
      }
      this.sendGateway("set_daemon_data", daemon_info);
    });
  }

  heartbeatSlowAction() {
    let actions = [];
    if (this.local) {
      actions = [
        this.getRPC("connections"),
        this.getRPC("bans")
        // this.getRPC("txpool_backlog"),
      ];
    } else {
      actions = [
        // this.getRPC("txpool_backlog"),
      ];
    }

    if (actions.length === 0) return;

    Promise.all(actions).then(data => {
      let daemon_info = {};
      for (let n of data) {
        if (n == undefined || !n.hasOwnProperty("result") || n.result == undefined) {
          continue;
        }
        if (n.method == "get_connections" && n.result.hasOwnProperty("connections")) {
          daemon_info.connections = n.result.connections;
        } else if (n.method == "get_bans" && n.result.hasOwnProperty("bans")) {
          daemon_info.bans = n.result.bans;
        } else if (n.method == "get_txpool_backlog" && n.result.hasOwnProperty("backlog")) {
          daemon_info.tx_pool_backlog = n.result.backlog;
        }
      }
      this.sendGateway("set_daemon_data", daemon_info);
    });
  }

  updateServiceNodes() {
    // Get the latest service node data
    this.getRPC("service_nodes").then(data => {
      if (!data.hasOwnProperty("result")) return;

      const service_nodes = data.result.service_node_states;
      this.sendGateway("set_daemon_data", { service_nodes });
    });
  }

  async getLNSRecordsForOwners(owners) {
    if (!Array.isArray(owners) || owners.length === 0) {
      return [];
    }

    const data = await this.sendRPC("lns_owners_to_names", { entries: owners });
    if (!data.hasOwnProperty("result")) return [];

    // We need to map request_index to owner
    const { entries } = data.result;
    const recordsWithOwners = (entries || []).map(record => {
      const owner = owners[record.request_index];
      return {
        ...record,
        owner
      };
    });

    return this._sanitizeLNSRecords(recordsWithOwners);
  }

  async getLNSRecord(nameHash) {
    if (!nameHash || nameHash.length === 0) {
      return null;
    }

    const params = {
      entries: [
        {
          name_hash: nameHash,
          types: [0] // Update this when we have other types. Type 0 = session
        }
      ]
    };

    const data = await this.sendRPC("lns_names_to_owners", params);
    if (!data.hasOwnProperty("result")) return null;

    const entries = this._sanitizeLNSRecords(data.result.entries);
    if (entries.length === 0) return null;

    return entries[0];
  }

  _sanitizeLNSRecords(records) {
    return (records || []).map(record => {
      // Record type is in uint16 format
      // Session = 0
      // For now since wallet and loki names haven't been implemented, we always assume it's session
      const type = "session";
      return {
        ...record,
        type
      };
    });
  }

  sendGateway(method, data) {
    this.backend.send(method, data);
  }

  sendRPC(method, params = {}, options = {}) {
    let id = this.id++;

    const protocol = options.protocol || this.protocol;
    const hostname = options.hostname || this.hostname;
    const port = options.port || this.port;

    let requestOptions = {
      uri: `${protocol}${hostname}:${port}/json_rpc`,
      method: "POST",
      json: {
        jsonrpc: "2.0",
        id: id,
        method: method
      },
      agent: this.agent
    };
    if (Object.keys(params).length !== 0) {
      requestOptions.json.params = params;
    }

    // If there's a timeout then set it
    if (options.timeout) {
      requestOptions.timeout = options.timeout;
    }

    return this.queue.add(() => {
      return request(requestOptions)
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
              message: "Cannot connect to daemon-rpc",
              cause: error.cause
            }
          };
        });
    });
  }

  /**
   * Call one of the get_* RPC calls
   */
  getRPC(parameter, args) {
    return this.sendRPC(`get_${parameter}`, args);
  }

  quit() {
    clearInterval(this.heartbeat);
    return new Promise(resolve => {
      if (this.daemonProcess) {
        this.daemonProcess.on("close", () => {
          this.agent.destroy();
          clearTimeout(this.forceKill);
          resolve();
        });

        // Force kill after 20 seconds
        this.forceKill = setTimeout(() => {
          if (this.daemonProcess) {
            this.daemonProcess.kill("SIGKILL");
          }
        }, 20000);

        const signal = this.isDaemonSyncing ? "SIGKILL" : "SIGTERM";
        this.daemonProcess.kill(signal);
      } else {
        resolve();
      }
    });
  }
}
