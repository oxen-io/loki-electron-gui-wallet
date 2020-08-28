<template>
  <q-page>
    <div class="q-mx-md import-wallet">
      <LokiField :label="$t('fieldLabels.newWalletName')" :error="$v.wallet.name.$error">
        <q-input
          v-model="wallet.name"
          :placeholder="$t('placeholders.walletName')"
          :dark="theme == 'dark'"
          borderless
          dense
          @keyup.enter="import_wallet"
          @blur="$v.wallet.name.$touch"
        />
      </LokiField>

      <LokiField :label="$t('fieldLabels.walletFile')" disable-hover :error="$v.wallet.path.$error">
        <q-input
          v-model="wallet.path"
          :placeholder="$t('placeholders.selectAFile')"
          disable
          :dark="theme == 'dark'"
          borderless
          dense
        />
        <input id="walletPath" ref="fileInput" type="file" hidden @change="setWalletPath" />
        <q-btn
          color="secondary"
          :label="$t('buttons.selectWalletFile')"
          :text-color="theme == 'dark' ? 'white' : 'dark'"
          @click="selectFile"
        />
      </LokiField>

      <LokiField :label="$t('fieldLabels.password')">
        <q-input
          v-model="wallet.password"
          :placeholder="$t('placeholders.walletPassword')"
          type="password"
          :dark="theme == 'dark'"
          borderless
          dense
          @keyup.enter="import_wallet"
        />
      </LokiField>

      <LokiField :label="$t('fieldLabels.confirmPassword')">
        <q-input
          v-model="wallet.password_confirm"
          type="password"
          :dark="theme == 'dark'"
          borderless
          dense
          @keyup.enter="import_wallet"
        />
      </LokiField>
      <q-btn class="submit-button" color="primary" :label="$tc('buttons.importWallet', 1)" @click="import_wallet" />
    </div>
  </q-page>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import LokiField from "components/loki_field";
export default {
  components: {
    LokiField
  },
  data() {
    return {
      wallet: {
        name: "",
        path: "",
        password: "",
        password_confirm: ""
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    status: state => state.gateway.wallet.status
  }),
  watch: {
    status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case 1:
            break;
          case 0:
            this.$q.loading.hide();
            this.$router.replace({
              path: "/wallet-select/created"
            });
            break;
          default:
            this.$q.loading.hide();
            this.$q.notify({
              type: "negative",
              timeout: 1000,
              message
            });
            break;
        }
      },
      deep: true
    }
  },
  validations: {
    wallet: {
      name: { required },
      path: { required }
    }
  },
  methods: {
    selectFile() {
      this.$refs.fileInput.click();
    },
    setWalletPath(file) {
      this.wallet.path = file.target.files[0].path;
    },
    import_wallet() {
      this.$v.wallet.$touch();

      if (this.$v.wallet.name.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterWalletName")
        });
        return;
      }

      if (this.$v.wallet.path.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.selectWalletFile")
        });
        return;
      }

      if (this.wallet.password != this.wallet.password_confirm) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.passwordNoMatch")
        });
        return;
      }

      this.$q.loading.show({
        delay: 0
      });

      this.$gateway.send("wallet", "import_wallet", this.wallet);
    },
    cancel() {
      this.$router.replace({ path: "/wallet-select" });
    }
  }
};
</script>

<style lang="scss">
.import-wallet {
  .q-if-disabled {
    cursor: default !important;
    .q-input-target {
      cursor: default !important;
    }
  }

  .loki-field {
    margin-top: 16px;
  }
}
</style>
