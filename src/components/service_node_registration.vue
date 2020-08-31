<template>
  <div class="service-node-registration">
    <div class="q-pa-md">
      <i18n path="strings.serviceNodeRegistrationDescription" tag="div" class="description q-mb-lg">
        <b place="registerCommand">register_service_node</b>
        <b place="prepareCommand">prepare_registration</b>
      </i18n>
      <LokiField
        :label="$t('fieldLabels.serviceNodeCommand')"
        :error="$v.registration_string.$error"
        :disabled="registration_status.sending"
      >
        <q-input
          v-model.trim="registration_string"
          type="textarea"
          :dark="theme == 'dark'"
          class="full-width text-area-loki"
          placeholder="register_service_node ..."
          :disabled="registration_status.sending"
          borderless
          dense
          @blur="$v.registration_string.$touch"
          @paste="onPaste"
        />
      </LokiField>
      <q-btn
        class="register-button"
        color="primary"
        :label="$t('buttons.registerServiceNode')"
        :disabled="registration_status.sending"
        @click="register()"
      />
    </div>

    <q-inner-loading :showing="registration_status.sending" :dark="theme == 'dark'">
      <q-spinner color="primary" size="30" />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import LokiField from "components/loki_field";
import WalletPassword from "src/mixins/wallet_password";

export default {
  name: "ServiceNodeRegistration",
  components: {
    LokiField
  },
  mixins: [WalletPassword],
  data() {
    return {
      registration_string: ""
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    registration_status: state => state.gateway.service_node_status.registration
  }),
  validations: {
    registration_string: { required }
  },
  watch: {
    registration_status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case 0:
            this.$q.notify({
              type: "positive",
              timeout: 1000,
              message
            });
            this.$v.$reset();
            this.registration_string = "";
            break;
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message
            });
            break;
        }
      },
      deep: true
    }
  },
  methods: {
    async register() {
      this.$v.registration_string.$touch();

      if (this.$v.registration_string.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidServiceNodeCommand")
        });
        return;
      }

      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.registerServiceNode.title"),
        noPasswordMessage: this.$t("dialog.registerServiceNode.message"),
        ok: {
          label: this.$t("dialog.registerServiceNode.ok"),
          color: "primary"
        },
        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark"
      });
      passwordDialog
        .onOk(password => {
          // in case of no password
          password = password || "";
          this.$store.commit("gateway/set_snode_status", {
            registration: {
              code: 1,
              message: "Registering...",
              sending: true
            }
          });
          this.$gateway.send("wallet", "register_service_node", {
            password,
            string: this.registration_string.trim()
          });
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    onPaste() {
      this.$nextTick(() => {
        this.registration_string = this.registration_string.trim();
      });
    }
  }
};
</script>

<style lang="scss">
.register-button {
  margin-top: 6px;
}
</style>
