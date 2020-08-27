<template>
  <q-page padding class="created">
    <div class="col wallet q-mb-lg">
      <h6>{{ walletName }}</h6>
      <div class="row items-center">
        <div class="col address">
          {{ info.address }}
        </div>
        <div class="q-item-side">
          <q-btn color="primary" padding="xs" size="sm" icon="file_copy" @click="copyAddress">
            <q-tooltip anchor="center left" self="center right" :offset="[5, 10]">
              {{ $t("menuItems.copyAddress") }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <template v-if="secret.mnemonic">
      <div class="seed-box col">
        <h6 class="q-mb-xs q-mt-lg">{{ $t("strings.seedWords") }}</h6>
        <div class="seed q-my-lg">
          {{ secret.mnemonic }}
        </div>
        <div class="q-my-md warning">
          {{ $t("strings.saveSeedWarning") }}
        </div>
        <div>
          <q-btn
            color="primary"
            size="md"
            icon="file_copy"
            label="Copy seed words"
            @click="copyPrivateKey('mnemonic', $event)"
          />
        </div>
      </div>
    </template>

    <q-expansion-item label="Advanced" header-class="q-mt-sm non-selectable row reverse advanced-options-label">
      <template v-if="secret.view_key != secret.spend_key">
        <h6 class="q-mb-xs title">{{ $t("strings.viewKey") }}</h6>
        <div class="row">
          <div class="col" style="word-break:break-all;">
            {{ secret.view_key }}
          </div>
          <div class="q-item-side">
            <q-btn color="primary" padding="xs" size="sm" icon="file_copy" @click="copyPrivateKey('view_key', $event)">
              <q-tooltip anchor="center left" self="center right" :offset="[5, 10]">
                {{ $t("menuItems.copyViewKey") }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </template>

      <template v-if="!/^0*$/.test(secret.spend_key)">
        <h6 class="q-mb-xs title">{{ $t("strings.spendKey") }}</h6>
        <div class="row">
          <div class="col" style="word-break:break-all;">
            {{ secret.spend_key }}
          </div>
          <div class="q-item-side">
            <q-btn color="primary" padding="xs" size="sm" icon="file_copy" @click="copyPrivateKey('spend_key', $event)">
              <q-tooltip anchor="center left" self="center right" :offset="[5, 10]">
                {{ $t("menuItems.copySpendKey") }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </template>
    </q-expansion-item>

    <q-btn class="q-mt-lg" color="primary" :label="$t('buttons.openWallet')" @click="open" />
  </q-page>
</template>

<script>
const { clipboard } = require("electron");
import { mapState } from "vuex";
export default {
  computed: mapState({
    info: state => state.gateway.wallet.info,
    secret: state => state.gateway.wallet.secret,
    theme: state => state.gateway.app.config.appearance.theme,
    walletName() {
      return `Wallet: ${this.info.name}`;
    }
  }),
  methods: {
    open() {
      setTimeout(() => {
        this.$store.commit("gateway/set_wallet_data", {
          secret: {
            mnemonic: "",
            spend_key: "",
            view_key: ""
          }
        });
      }, 500);
      this.$router.replace({ path: "/wallet" });
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
            label: this.$t("dialog.buttons.ok"),
            color: "primary"
          },
          color: this.theme === "dark" ? "white" : "dark",
          dark: this.theme === "dark"
        })
        .onDismiss(() => null)
        .onCancel(() => null)
        .onOk(() => {
          this.$q.notify({
            type: "positive",
            timeout: 1000,
            message: this.$t("notification.positive.copied", {
              item: this.$t("strings." + type_key)
            })
          });
        });
    },
    copyAddress() {
      clipboard.writeText(this.info.address);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.addressCopied"),
        dark: this.theme == "dark"
      });
    }
  }
};
</script>

<style lang="scss">
.created {
  .wallet h6 {
    text-align: center;
  }

  .address {
    text-align: center;
    word-break: break-all;
  }

  .seed-box {
    border: 1px solid white;
    border-radius: 3px;
    margin: 16px;
    padding: 16px;

    div,
    h6 {
      text-align: center;
    }

    .seed {
      font-size: 24px;
      font-weight: 600;
    }

    .warning {
      color: goldenrod;
    }
  }
  h6 {
    font-size: 18px;
    margin: 8px 0;
    font-weight: 450;
  }
  .advanced-options-label {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
