import { ipcRenderer } from "electron";
import { Notify, Dialog, Loading, LocalStorage } from "quasar";
import { EventEmitter } from "events";
import { SCEE } from "./SCEE-Node";
import { i18n, changeLanguage } from "src/boot/i18n";

export class Gateway extends EventEmitter {
  constructor(app, router) {
    super();
    this.app = app;
    this.router = router;
    this.token = null;
    this.scee = new SCEE();

    // Set the initial language
    let language = LocalStorage.has("language") ? LocalStorage.getItem("language") : "en-us";
    this.setLanguage(language);

    let theme = LocalStorage.has("theme") ? LocalStorage.getItem("theme") : "dark";
    this.app.store.commit("gateway/set_app_data", {
      config: {
        appearance: {
          theme
        }
      }
    });
    this.app.store.watch(
      state => state.gateway.app.config.appearance.theme,
      theme => {
        LocalStorage.set("theme", theme);
      }
    );

    this.closeDialog = false;

    this.app.store.commit("gateway/set_app_data", {
      status: {
        code: 1 // Connecting to backend
      }
    });

    ipcRenderer.on("initialize", (event, data) => {
      this.token = data.token;
      setTimeout(() => {
        this.ws = new WebSocket("ws://127.0.0.1:" + data.port);
        this.ws.addEventListener("open", () => {
          this.open();
        });
        this.ws.addEventListener("message", e => {
          this.receive(e.data);
        });
      }, 1000);
    });

    ipcRenderer.on("confirmClose", () => {
      this.confirmClose(i18n.t("dialog.exit.message"));
    });

    ipcRenderer.on("showQuitScreen", () => {
      if (this.router) {
        this.router.replace({ path: "/quit" });
      }
    });
  }

  open() {
    this.app.store.commit("gateway/set_app_data", {
      status: {
        code: 2 // Loading config
      }
    });
    this.send("core", "init");
  }

  confirmClose(msg, restart = false) {
    if (this.closeDialog) {
      return;
    }
    this.closeDialog = true;

    const key = restart ? "restart" : "exit";

    Dialog.create({
      title: i18n.t(`dialog.${key}.title`),
      message: msg,
      ok: {
        label: i18n.t(`dialog.${key}.ok`),
        color: "positive"
      },
      cancel: {
        flat: true,
        label: i18n.t("dialog.buttons.cancel"),
        color: this.app.store.state.gateway.app.config.appearance.theme === "dark" ? "white" : "dark"
      },
      dark: this.app.store.state.gateway.app.config.appearance.theme === "dark"
    })
      .onOk(() => {
        this.closeDialog = false;
        Loading.hide();
        this.router.replace({ path: "/quit" });
        ipcRenderer.send("confirmClose", restart);
      })
      .onCancel(() => {
        this.closeDialog = false;
      });
  }

  send(module, method, data = {}) {
    let message = {
      module,
      method,
      data
    };
    let encrypted_data = this.scee.encryptString(JSON.stringify(message), this.token);
    this.ws.send(encrypted_data);
  }

  geti18n(key) {
    return Array.isArray(key) ? i18n.t(...key) : i18n.t(key);
  }

  receive(message) {
    // should wrap this in a try catch, and if fail redirect to error screen
    // shouldn't happen outside of dev environment
    let decrypted_data = JSON.parse(this.scee.decryptString(message, this.token));

    if (
      typeof decrypted_data !== "object" ||
      !decrypted_data.hasOwnProperty("event") ||
      !decrypted_data.hasOwnProperty("data")
    ) {
      return;
    }

    switch (decrypted_data.event) {
      case "set_language": {
        const { lang } = decrypted_data.data;
        this.setLanguage(lang);
        break;
      }
      case "set_has_password":
        this.emit("has_password", decrypted_data.data);
        break;
      case "set_valid_address":
        this.emit("validate_address", decrypted_data.data);
        break;
      case "set_decrypt_record_result":
        this.emit("decrypt_record_result", decrypted_data.data);
        break;
      case "set_app_data":
        this.app.store.commit("gateway/set_app_data", decrypted_data.data);
        break;

      case "set_daemon_data":
        this.app.store.commit("gateway/set_daemon_data", decrypted_data.data);
        break;

      case "set_wallet_data":
      case "set_wallet_error":
        this.app.store.commit("gateway/set_wallet_data", decrypted_data.data);
        break;

      case "reset_wallet_error":
        this.app.store.dispatch("gateway/resetWalletStatus");
        break;

      case "set_tx_status": {
        const data = { ...decrypted_data.data };
        if (data.i18n) {
          data.message = this.geti18n(data.i18n);
        }
        this.app.store.commit("gateway/set_tx_status", data);
        break;
      }

      case "set_lns_status": {
        const data = { ...decrypted_data.data };
        if (data.i18n) {
          data.message = this.geti18n(data.i18n);
        }

        this.app.store.commit("gateway/set_lns_status", data);
        break;
      }

      case "set_snode_status": {
        const data = { ...decrypted_data.data };

        // We have multiple nested objects in service_node_status
        for (const key in data) {
          if (data[key].i18n) {
            data[key].message = this.geti18n(data[key].i18n);
          }
        }

        this.app.store.commit("gateway/set_snode_status", data);
        break;
      }
      case "set_prove_transaction_status": {
        const data = { ...decrypted_data.data };

        if (data.i18n) {
          data.message = this.geti18n(data.i18n);
        }

        this.app.store.commit("gateway/set_prove_transaction_status", data);
        break;
      }
      case "set_check_transaction_status": {
        const data = { ...decrypted_data.data };

        if (data.i18n) {
          data.message = this.geti18n(data.i18n);
        }

        this.app.store.commit("gateway/set_check_transaction_status", data);
        break;
      }
      case "set_old_gui_import_status":
        this.app.store.commit("gateway/set_old_gui_import_status", decrypted_data.data);
        break;

      case "wallet_list":
        this.app.store.commit("gateway/set_wallet_list", decrypted_data.data);
        break;

      case "settings_changed_reboot":
        this.confirmClose(i18n.t("dialog.restart.message"), true);
        break;

      case "show_notification": {
        let notification = {
          type: "positive",
          timeout: 1000,
          message: ""
        };
        const { data } = decrypted_data;
        if (data.i18n) {
          notification.message = this.geti18n(data.i18n);
        }
        Notify.create(Object.assign(notification, data));
        break;
      }

      case "show_loading":
        Loading.show({ ...(decrypted_data.data || {}) });
        break;

      case "hide_loading":
        Loading.hide();
        break;

      case "return_to_wallet_select":
        this.router.replace({ path: "/wallet-select" });
        setTimeout(() => {
          // short delay to prevent wallet data reaching the
          // websocket moments after we close and reset data
          this.app.store.dispatch("gateway/resetWalletData");
        }, 250);
        break;
    }
  }

  setLanguage(lang) {
    changeLanguage(lang)
      .then(() => {
        LocalStorage.set("language", lang);
      })
      .catch(() => {
        Notify.create({
          type: "negative",
          timeout: 2000,
          message: i18n.t("notification.errors.failedToSetLanguage", {
            lang
          })
        });
      });
  }
}
