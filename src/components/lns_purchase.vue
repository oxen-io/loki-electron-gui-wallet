<template>
  <div class="lns-purchase">
    <div class="q-px-md q-pt-md">
      <div class="q-mb-lg description">
        {{ $t("strings.lnsDescription") }}
      </div>
      <div>
        <!-- Name -->
        <div class="col q-mt-sm">
          <LokiField :label="$t('fieldLabels.name')" :error="$v.lns.name.$error">
            <q-input
              v-model.trim="lns.name"
              :dark="theme == 'dark'"
              :placeholder="$t('placeholders.lnsName')"
              hide-underline
              @blur="$v.lns.name.$touch"
            />
          </LokiField>
        </div>

        <!-- Value (Session ID, Wallet Address or .loki address) -->
        <div class="col q-mt-sm">
          <LokiField class="q-mt-md" :label="value_field_label" :error="$v.lns.value.$error">
            <q-input
              v-model.trim="lns.value"
              :dark="theme == 'dark'"
              :placeholder="value_placeholder"
              hide-underline
              @blur="$v.lns.value.$touch"
            />
          </LokiField>
        </div>

        <!-- Backup owner -->
        <div class="col q-mt-sm">
          <LokiField class="q-mt-md" :label="$t('fieldLabels.backupOwner')" :error="$v.lns.backupOwner.$error" optional>
            <q-input
              v-model.trim="lns.backupOwner"
              :dark="theme == 'dark'"
              :placeholder="$t('placeholders.lnsBackupOwner')"
              hide-underline
              @blur="$v.lns.backupOwner.$touch"
            />
          </LokiField>
        </div>

        <q-field class="q-pt-sm">
          <q-btn
            class="send-btn"
            :disable="!is_able_to_send"
            color="primary"
            :label="$t('buttons.purchase')"
            @click="purchase()"
          />
        </q-field>
      </div>

      <q-inner-loading :visible="lns_status.sending" :dark="theme == 'dark'">
        <q-spinner color="primary" :size="30" />
      </q-inner-loading>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { required, maxLength } from "vuelidate/lib/validators";
import { address, session_id, lns_name } from "src/validators/common";
import LokiField from "components/loki_field";
import WalletPassword from "src/mixins/wallet_password";
const objectAssignDeep = require("object-assign-deep");

export default {
  name: "LNSPurchase",
  components: {
    LokiField
  },
  mixins: [WalletPassword],
  data() {
    return {
      lns: {
        type: "session",
        name: "",
        value: "",
        owner: "",
        backupOwner: ""
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    lns_status: state => state.gateway.lns_status,
    is_able_to_send() {
      return this.$store.getters["gateway/isAbleToSend"];
    },
    value_field_label() {
      return this.$t("fieldLabels.sessionId");
    },
    value_placeholder() {
      return this.$t("placeholders.sessionId");
    }
  }),
  watch: {
    lns_status: {
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
            this.lns = {
              type: "session",
              name: "",
              value: "",
              owner: "",
              backupOwner: ""
            };
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
    isAddress: function(value) {
      if (value === "") return true;

      return new Promise(resolve => {
        address(value, this.$gateway)
          .then(() => resolve(true))
          .catch(() => resolve(false));
      });
    },
    purchase() {
      this.$v.lns.$touch();

      const nameValidator = this.$v.lns.name;
      if (nameValidator.$error) {
        let message;
        if (!nameValidator.required) {
          message = "notification.errors.enterName";
        } else if (!nameValidator.maxLength) {
          message = "notification.errors.invalidNameLength";
        } else if (!nameValidator.hyphen) {
          message = "notification.errors.invalidNameHypenNotAllowed";
        } else {
          message = "notification.errors.invalidNameFormat";
        }

        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: this.$t(message)
        });
        return;
      }

      if (this.$v.lns.value.$error) {
        let message = "Invalid value provided";
        if (this.lns.type === "session") {
          message = this.$t("notification.errors.invalidSessionId");
        }
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message
        });
        return;
      }

      if (this.$v.lns.backupOwner.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: this.$t("notification.errors.invalidBackupOwner")
        });
        return;
      }

      this.showPasswordConfirmation({
        title: this.$t("dialog.purchase.title"),
        noPasswordMessage: this.$t("dialog.purchase.message"),
        ok: {
          label: this.$t("dialog.purchase.ok")
        }
      })
        .then(password => {
          this.$store.commit("gateway/set_lns_status", {
            code: 1,
            message: "Sending transaction",
            sending: true
          });
          const lns = objectAssignDeep.noMutate(this.lns, {
            password
          });
          this.$gateway.send("wallet", "purchase_lns", lns);
        })
        .catch(console.error);
    }
  },
  validations: {
    lns: {
      name: {
        required,
        maxLength: maxLength(64),
        hyphen: function(value) {
          const str = value || "";
          return !(str.startsWith("-") || str.endsWith("-"));
        },
        validate: lns_name
      },
      owner: {
        validate: function(value) {
          return this.isAddress(value);
        }
      },
      value: {
        required,
        validate: function(value) {
          if (this.lns.type === "session") {
            return session_id(value);
          }

          return false;
        }
      },
      backupOwner: {
        validate: function(value) {
          return this.isAddress(value);
        }
      }
    }
  }
};
</script>

<style lang="scss">
.lns-purchase {
  .description {
    white-space: pre-line;
  }
}
</style>
