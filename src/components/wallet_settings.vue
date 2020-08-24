<template>
  <div class="wallet-settings">
    <q-btn icon-right="more_vert" :label="$t('buttons.settings')" size="md" flat>
      <q-popover anchor="bottom right" self="top right">
        <q-list separator link>
          <q-item v-close-popup :disabled="!is_ready" @click.native="getPrivateKeys()">
            <q-item-main>
              <q-item-tile label>{{ $t("menuItems.showPrivateKeys") }}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item v-close-popup :disabled="!is_ready" @click.native="showModal('change_password')">
            <q-item-main>
              <q-item-tile label>{{ $t("menuItems.changePassword") }}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item v-close-popup :disabled="!is_ready" @click.native="showModal('rescan')">
            <q-item-main>
              <q-item-tile label>{{ $t("menuItems.rescanWallet") }}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item v-close-popup :disabled="!is_ready" @click.native="showModal('key_image')">
            <q-item-main>
              <q-item-tile label>{{ $t("menuItems.manageKeyImages") }}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item v-close-popup :disabled="!is_ready" @click.native="deleteWallet()">
            <q-item-main>
              <q-item-tile label>{{ $t("menuItems.deleteWallet") }}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </q-popover>
    </q-btn>

    <!-- Modals -->
    <q-modal v-model="modals.private_keys.visible" minimized class="private-key-modal" @hide="closePrivateKeys()">
      <div class="modal-header">{{ $t("titles.privateKeys") }}</div>
      <div class="q-ma-lg">
        <template v-if="secret.mnemonic">
          <h6 class="q-mb-xs q-mt-lg">
            {{ $t("strings.seedWords") }}
          </h6>
          <div class="row">
            <div class="col">
              {{ secret.mnemonic }}
            </div>
            <div class="col-auto">
              <q-btn
                class="copy-btn"
                color="primary"
                style="width:25px;"
                size="sm"
                icon="file_copy"
                @click="copyPrivateKey('mnemonic', $event)"
              >
                <q-tooltip anchor="center left" self="center right" :offset="[5, 10]">
                  {{ $t("menuItems.copySeedWords") }}
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>

        <template v-if="secret.view_key != secret.spend_key">
          <h6 class="q-mb-xs">{{ $t("strings.viewKey") }}</h6>
          <div class="row">
            <div class="col" style="word-break:break-all;">
              {{ secret.view_key }}
            </div>
            <div class="col-auto">
              <q-btn
                class="copy-btn"
                color="primary"
                style="width:25px;"
                size="sm"
                icon="file_copy"
                @click="copyPrivateKey('view_key', $event)"
              >
                <q-tooltip anchor="center left" self="center right" :offset="[5, 10]">
                  {{ $t("menuItems.copyViewKey") }}
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>

        <template v-if="!/^0*$/.test(secret.spend_key)">
          <h6 class="q-mb-xs">{{ $t("strings.spendKey") }}</h6>
          <div class="row">
            <div class="col" style="word-break:break-all;">
              {{ secret.spend_key }}
            </div>
            <div class="col-auto">
              <q-btn
                class="copy-btn"
                color="primary"
                style="width:25px;"
                size="sm"
                icon="file_copy"
                @click="copyPrivateKey('spend_key', $event)"
              >
                <q-tooltip anchor="center left" self="center right" :offset="[5, 10]">
                  {{ $t("menuItems.copySpendKey") }}
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>

        <div class="q-mt-lg">
          <q-btn color="primary" :label="$t('buttons.close')" @click="hideModal('private_keys')" />
        </div>
      </div>
    </q-modal>

    <q-modal v-model="modals.rescan.visible" minimized>
      <div class="modal-header">{{ $t("titles.rescanWallet") }}</div>
      <div class="q-ma-lg">
        <p>{{ $t("strings.rescanModalDescription") }}</p>

        <div class="q-mt-lg">
          <q-radio v-model="modals.rescan.type" val="full" :label="$t('fieldLabels.rescanFullBlockchain')" />
        </div>
        <div class="q-mt-sm">
          <q-radio v-model="modals.rescan.type" val="spent" :label="$t('fieldLabels.rescanSpentOutputs')" />
        </div>

        <div class="q-mt-xl text-right">
          <q-btn flat class="q-mr-sm" :label="$t('buttons.close')" @click="hideModal('rescan')" />
          <q-btn color="primary" :label="$t('buttons.rescan')" @click="rescanWallet()" />
        </div>
      </div>
    </q-modal>

    <q-modal v-model="modals.key_image.visible" class="key-image-modal" minimized>
      <div class="modal-header">
        <!-- Export/Import key images -->
        {{
          $t("dialog.keyImages.title", {
            type: $t(`dialog.keyImages.${modals.key_image.type.toLowerCase()}`)
          })
        }}
      </div>
      <div class="q-ma-lg">
        <div class="row q-mb-md">
          <div class="q-mr-xl">
            <q-radio v-model="modals.key_image.type" val="Export" :label="$t('dialog.keyImages.export')" />
          </div>
          <div>
            <q-radio v-model="modals.key_image.type" val="Import" :label="$t('dialog.keyImages.import')" />
          </div>
        </div>

        <template v-if="modals.key_image.type == 'Export'">
          <LokiField class="q-mt-lg" :label="$t('fieldLabels.keyImages.exportDirectory')" disable-hover>
            <q-input v-model="modals.key_image.export_path" disable hide-underline />
            <input
              id="keyImageExportPath"
              ref="keyImageExportSelect"
              type="file"
              webkitdirectory
              directory
              hidden
              @change="setKeyImageExportPath"
            />
            <q-btn color="secondary" @click="selectKeyImageExportPath">{{ $t("buttons.browse") }}</q-btn>
          </LokiField>
        </template>
        <template v-if="modals.key_image.type == 'Import'">
          <LokiField class="q-mt-lg" :label="$t('fieldLabels.keyImages.importFile')" disable-hover>
            <q-input v-model="modals.key_image.import_path" disable hide-underline />
            <input
              id="keyImageImportPath"
              ref="keyImageImportSelect"
              type="file"
              hidden
              @change="setKeyImageImportPath"
            />
            <q-btn color="secondary" @click="selectKeyImageImportPath">{{ $t("buttons.browse") }}</q-btn>
          </LokiField>
        </template>

        <div class="q-mt-lg text-right">
          <q-btn flat class="q-mr-sm" :label="$t('buttons.close')" @click="hideModal('key_image')" />
          <q-btn color="primary" :label="$t('buttons.' + modals.key_image.type.toLowerCase())" @click="doKeyImages()" />
        </div>
      </div>
    </q-modal>

    <q-modal v-model="modals.change_password.visible" minimized @hide="clearChangePassword()">
      <div class="modal-header">{{ $t("titles.changePassword") }}</div>
      <div class="q-ma-lg">
        <q-field>
          <q-input
            v-model="modals.change_password.old_password"
            type="password"
            :float-label="$t('fieldLabels.oldPassword')"
            :dark="theme == 'dark'"
          />
        </q-field>

        <q-field>
          <q-input
            v-model="modals.change_password.new_password"
            type="password"
            :float-label="$t('fieldLabels.newPassword')"
            :dark="theme == 'dark'"
          />
        </q-field>

        <q-field>
          <q-input
            v-model="modals.change_password.new_password_confirm"
            type="password"
            :float-label="$t('fieldLabels.confirmNewPassword')"
            :dark="theme == 'dark'"
          />
        </q-field>

        <div class="q-mt-xl text-right">
          <q-btn flat class="q-mr-sm" :label="$t('buttons.close')" @click="hideModal('change_password')" />
          <q-btn color="primary" :label="$t('buttons.change')" @click="doChangePassword()" />
        </div>
      </div>
    </q-modal>
  </div>
</template>

<script>
const { clipboard } = require("electron");
import { mapState } from "vuex";
import WalletPassword from "src/mixins/wallet_password";
import LokiField from "components/loki_field";

export default {
  name: "WalletSettings",
  components: {
    LokiField
  },
  mixins: [WalletPassword],
  data() {
    return {
      modals: {
        private_keys: {
          visible: false
        },
        rescan: {
          visible: false,
          type: "full"
        },
        key_image: {
          visible: false,
          type: "Export",
          export_path: "",
          import_path: ""
        },
        change_password: {
          visible: false,
          old_password: "",
          new_password: "",
          new_password_confirm: ""
        }
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    info: state => state.gateway.wallet.info,
    secret: state => state.gateway.wallet.secret,
    wallet_data_dir: state => state.gateway.app.config.app.wallet_data_dir,
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    locale() {
      return this.$q.i18n.getLocale();
    }
  }),
  watch: {
    secret: {
      handler(val, old) {
        if (val.view_key == old.view_key) return;
        switch (this.secret.view_key) {
          case "":
            break;
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 1000,
              message: this.$t(this.secret.mnemonic)
            });
            this.$store.commit("gateway/set_wallet_data", {
              secret: {
                mnemonic: "",
                spend_key: "",
                view_key: ""
              }
            });
            break;
          default:
            this.showModal("private_keys");
            break;
        }
      },
      deep: true
    }
  },
  created() {
    const path = require("upath");
    this.modals.key_image.export_path = path.join(this.wallet_data_dir, "images", this.info.name);
    this.modals.key_image.import_path = path.join(this.wallet_data_dir, "images", this.info.name, "key_image_export");
  },
  methods: {
    showModal(which) {
      if (!this.is_ready) return;
      this.modals[which].visible = true;
    },
    hideModal(which) {
      this.modals[which].visible = false;
    },
    copyPrivateKey(type, event) {
      event.stopPropagation();
      for (let i = 0; i < event.path.length; i++) {
        if (event.path[i].tagName == "BUTTON") {
          event.path[i].blur();
          break;
        }
      }

      if (this.secret[type] == null) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.copyingPrivateKeys")
        });
        return;
      }

      clipboard.writeText(this.secret[type]);

      let type_key = "seedWords";
      if (type === "spend_key") {
        type_key = "spendKey";
      } else if (type === "view_key") {
        type_key = "viewKey";
      }
      const type_title = this.$t("dialog.copyPrivateKeys." + type_key);

      this.$q
        .dialog({
          title: this.$t("dialog.copyPrivateKeys.title", {
            type: type_title
          }),
          message: this.$t("dialog.copyPrivateKeys.message"),
          ok: {
            label: this.$t("dialog.buttons.ok")
          }
        })
        .catch(() => null)
        .then(() => {
          this.$q.notify({
            type: "positive",
            timeout: 1000,
            message: this.$t("notification.positive.copied", {
              item: this.$t("strings." + type_key)
            })
          });
        });
    },
    getPrivateKeys() {
      if (!this.is_ready) return;
      this.showPasswordConfirmation({
        title: this.$t("dialog.showPrivateKeys.title"),
        noPasswordMessage: this.$t("dialog.showPrivateKeys.message"),
        ok: {
          label: this.$t("dialog.showPrivateKeys.ok")
        }
      })
        .then(password => {
          this.$gateway.send("wallet", "get_private_keys", {
            password
          });
        })
        .catch(() => {});
    },
    closePrivateKeys() {
      this.hideModal("private_keys");
      setTimeout(() => {
        this.$store.commit("gateway/set_wallet_data", {
          secret: {
            mnemonic: "",
            spend_key: "",
            view_key: ""
          }
        });
      }, 500);
    },
    rescanWallet() {
      this.hideModal("rescan");
      if (this.modals.rescan.type == "full") {
        this.$q
          .dialog({
            title: this.$t("dialog.rescan.title"),
            message: this.$t("dialog.rescan.message"),
            ok: {
              label: this.$t("dialog.rescan.ok")
            },
            cancel: {
              flat: true,
              label: this.$t("dialog.buttons.cancel"),
              color: this.theme == "dark" ? "white" : "dark"
            }
          })
          .then(() => {
            this.$gateway.send("wallet", "rescan_blockchain");
          })
          .catch(() => {});
      } else {
        this.$gateway.send("wallet", "rescan_spent");
      }
    },
    selectKeyImageExportPath() {
      this.$refs.keyImageExportSelect.click();
    },
    setKeyImageExportPath(file) {
      this.modals.key_image.export_path = file.target.files[0].path;
    },
    selectKeyImageImportPath() {
      this.$refs.keyImageImportSelect.click();
    },
    setKeyImageImportPath(file) {
      this.modals.key_image.import_path = file.target.files[0].path;
    },
    doKeyImages() {
      this.hideModal("key_image");

      const type = this.$t(`dialog.keyImages.${this.modals.key_image.type.toLowerCase()}`);

      this.showPasswordConfirmation({
        title: this.$t("dialog.keyImages.title", { type }),
        noPasswordMessage: this.$t("dialog.keyImages.message", {
          type: type.toLocaleLowerCase(this.locale)
        }),
        ok: {
          label: type.toLocaleUpperCase(this.locale)
        }
      })
        .then(password => {
          if (this.modals.key_image.type == "Export")
            this.$gateway.send("wallet", "export_key_images", {
              password: password,
              path: this.modals.key_image.export_path
            });
          else if (this.modals.key_image.type == "Import")
            this.$gateway.send("wallet", "import_key_images", {
              password: password,
              path: this.modals.key_image.import_path
            });
        })
        .catch(() => {});
    },
    doChangePassword() {
      let old_password = this.modals.change_password.old_password;
      let new_password = this.modals.change_password.new_password;
      let new_password_confirm = this.modals.change_password.new_password_confirm;

      if (new_password == old_password) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.newPasswordSame")
        });
      } else if (new_password != new_password_confirm) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.newPasswordNoMatch")
        });
      } else {
        this.hideModal("change_password");
        this.$gateway.send("wallet", "change_wallet_password", {
          old_password,
          new_password
        });
      }
    },
    clearChangePassword() {
      this.modals.change_password.old_password = "";
      this.modals.change_password.new_password = "";
      this.modals.change_password.new_password_confirm = "";
    },
    deleteWallet() {
      if (!this.is_ready) return;
      this.$q
        .dialog({
          title: this.$t("dialog.deleteWallet.title"),
          message: this.$t("dialog.deleteWallet.message"),
          ok: {
            label: this.$t("dialog.deleteWallet.ok"),
            color: "red"
          },
          cancel: {
            flat: true,
            label: this.$t("dialog.buttons.cancel"),
            color: this.theme == "dark" ? "white" : "dark"
          }
        })
        .then(() => {
          return this.hasPassword();
        })
        .then(hasPassword => {
          if (!hasPassword) return "";
          return this.$q.dialog({
            title: this.$t("dialog.deleteWallet.title"),
            message: this.$t("dialog.password.message"),
            prompt: {
              model: "",
              type: "password"
            },
            ok: {
              label: this.$t("dialog.deleteWallet.ok"),
              color: "red"
            },
            cancel: {
              flat: true,
              label: this.$t("dialog.buttons.cancel"),
              color: this.theme == "dark" ? "white" : "dark"
            }
          });
        })
        .then(password => {
          this.$gateway.send("wallet", "delete_wallet", { password });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.private-key-modal {
  .copy-btn {
    margin-left: 8px;
  }
}
.key-image-modal {
  .modal-content {
    min-width: 600px;
    width: 45vw;
  }
  .loki-field {
    flex: 1;
  }
}
</style>
