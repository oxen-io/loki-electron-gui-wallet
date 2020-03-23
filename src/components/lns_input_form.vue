<template>
  <div class="lns-input-form">
    <!-- Name -->
    <div class="col q-mt-sm">
      <LokiField :label="$t('fieldLabels.name')" :disable="disableName" :error="$v.localRecord.name.$error">
        <q-input
          v-model.trim="localRecord.name"
          :dark="theme == 'dark'"
          :placeholder="$t('placeholders.lnsName')"
          hide-underline
          :disable="disableName"
          @blur="$v.localRecord.name.$touch"
        />
      </LokiField>
    </div>

    <!-- Value (Session ID, Wallet Address or .loki address) -->
    <div class="col q-mt-sm">
      <LokiField class="q-mt-md" :label="value_field_label" :error="$v.localRecord.value.$error">
        <q-input
          v-model.trim="localRecord.value"
          :dark="theme == 'dark'"
          :placeholder="value_placeholder"
          hide-underline
          @blur="$v.localRecord.value.$touch"
        />
      </LokiField>
    </div>

    <!-- Owner -->
    <div class="col q-mt-sm">
      <LokiField class="q-mt-md" :label="$t('fieldLabels.owner')" :error="$v.localRecord.owner.$error" optional>
        <q-input
          v-model.trim="localRecord.owner"
          :dark="theme == 'dark'"
          :placeholder="owner_placeholder"
          hide-underline
          @blur="$v.localRecord.owner.$touch"
        />
      </LokiField>
    </div>

    <!-- Backup owner -->
    <div class="col q-mt-sm">
      <LokiField
        class="q-mt-md"
        :label="$t('fieldLabels.backupOwner')"
        :error="$v.localRecord.backup_owner.$error"
        optional
      >
        <q-input
          v-model.trim="localRecord.backup_owner"
          :dark="theme == 'dark'"
          :placeholder="$t('placeholders.lnsBackupOwner')"
          hide-underline
          @blur="$v.localRecord.backup_owner.$touch"
        />
      </LokiField>
    </div>

    <q-field class="buttons q-pt-sm">
      <q-btn :disable="!is_able_to_send" color="primary" :label="submitLabel" @click="submit()" />
      <q-btn v-if="showClearButton" color="secondary" :label="$t('buttons.clear')" @click="clear()" />
    </q-field>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { required, maxLength } from "vuelidate/lib/validators";
import { address, session_id, lns_name } from "src/validators/common";
import LokiField from "components/loki_field";
import WalletPassword from "src/mixins/wallet_password";

export default {
  name: "LNSInputForm",
  components: {
    LokiField
  },
  mixins: [WalletPassword],
  props: {
    record: {
      type: Object,
      required: true
    },
    submitLabel: {
      type: String,
      required: true
    },
    disableName: {
      type: Boolean,
      required: false,
      default: false
    },
    showClearButton: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    const cleanRecord = {
      type: "session",
      name: "",
      value: "",
      owner: "",
      backup_owner: ""
    };
    const localRecord = {
      ...cleanRecord,
      ...this.record
    };
    return {
      cleanRecord,
      localRecord
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    our_address: state => state.gateway.wallet.info.address,
    is_able_to_send() {
      return this.$store.getters["gateway/isAbleToSend"];
    },
    value_field_label() {
      return this.$t("fieldLabels.sessionId");
    },
    value_placeholder() {
      return this.$t("placeholders.sessionId");
    },
    owner_placeholder() {
      const { owner } = this.record;
      if (!owner || owner.trim() === "") {
        return this.our_address;
      }

      return owner;
    }
  }),
  methods: {
    isAddress: function(value) {
      if (value === "") return true;

      return new Promise(resolve => {
        address(value, this.$gateway)
          .then(() => resolve(true))
          .catch(() => resolve(false));
      });
    },
    reset() {
      this.$nextTick(() => {
        this.localRecord = {
          ...this.cleanRecord,
          ...this.record
        };
        this.$v.$reset();
      });
    },
    submit() {
      this.$v.localRecord.$touch();

      const nameValidator = this.$v.localRecord.name;
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

      if (this.$v.localRecord.value.$error) {
        let message = "Invalid value provided";
        if (this.localRecord.type === "session") {
          message = this.$t("notification.errors.invalidSessionId");
        }
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message
        });
        return;
      }

      if (this.$v.localRecord.backup_owner.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: this.$t("notification.errors.invalidBackupOwner")
        });
        return;
      }

      if (this.$v.localRecord.owner.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: this.$t("notification.errors.invalidOwner")
        });
        return;
      }

      this.$emit("onSubmit", this.localRecord);
    },
    clear() {
      this.$emit("onClear");
    }
  },
  validations: {
    localRecord: {
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
          if (this.localRecord.type === "session") {
            return session_id(value);
          }

          return false;
        }
      },
      backup_owner: {
        validate: function(value) {
          return this.isAddress(value);
        }
      }
    }
  }
};
</script>

<style lang="scss">
.lns-input-form {
  .buttons {
    .q-btn:not(:first-child) {
      margin-left: 8px;
    }
  }
}
</style>
