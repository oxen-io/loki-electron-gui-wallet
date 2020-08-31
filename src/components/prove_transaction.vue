<template>
  <div class="prove-transaction">
    <div class="q-pa-md">
      <div class="q-mb-lg description">
        {{ $t("strings.proveTransactionDescription") }}
      </div>
      <div>
        <LokiField :label="$t('fieldLabels.transactionId')" :error="$v.txid.$error">
          <q-input
            v-model.trim="txid"
            :dark="theme == 'dark'"
            :placeholder="$t('placeholders.pasteTransactionId')"
            borderless
            dense
            @blur="$v.txid.$touch"
          />
        </LokiField>
        <LokiField class="q-mt-md" :label="$t('fieldLabels.address')" :error="$v.address.$error" optional>
          <q-input
            v-model.trim="address"
            :dark="theme == 'dark'"
            :placeholder="$t('placeholders.recipientWalletAddress')"
            borderless
            dense
            @blur="$v.address.$touch"
          />
        </LokiField>
        <LokiField class="q-mt-md" :label="$t('fieldLabels.message')" optional>
          <q-input
            v-model.trim="message"
            :dark="theme == 'dark'"
            :placeholder="$t('placeholders.proveOptionalMessage')"
            borderless
            dense
          />
        </LokiField>
        <div class="buttons submit-button">
          <q-btn color="primary" :label="$t('buttons.generate')" @click="generate" />
          <q-btn v-if="canClear" color="secondary" :label="$t('buttons.clear')" @click="clear" />
          <q-btn v-if="status.state.signature" color="secondary" :label="$t('buttons.copySignature')" @click="copy" />
        </div>
      </div>
      <div v-if="status.state.signature" class="signature-wrapper">
        <div class="txid q-mb-sm">
          <div class="title">{{ $t("strings.transactionID") }}</div>
          <div>{{ status.state.txid }}</div>
        </div>
        <p class="signature">
          {{ status.state.signature }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import { address } from "src/validators/common";
import LokiField from "components/loki_field";
import { clipboard } from "electron";

export default {
  name: "ProveTransaction",
  components: {
    LokiField
  },
  data() {
    return {
      txid: "",
      address: "",
      message: ""
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    status: state => state.gateway.prove_transaction_status,
    canClear() {
      return this.txid !== "" || this.address !== "" || this.message !== "";
    }
  }),
  validations: {
    txid: { required },
    address: {
      isAddress(value) {
        if (value === "") return true;

        return new Promise(resolve => {
          address(value, this.$gateway)
            .then(() => resolve(true))
            .catch(() => resolve(false));
        });
      }
    }
  },
  watch: {
    status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
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
    generate() {
      this.$v.txid.$touch();
      this.$v.address.$touch();

      if (this.$v.txid.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterTransactionId")
        });
        return;
      }

      if (this.$v.address.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidAddress")
        });
        return;
      }

      this.$gateway.send("wallet", "prove_transaction", {
        txid: this.txid.trim(),
        address: this.address.trim(),
        message: this.message.trim()
      });
    },
    clear() {
      this.txid = "";
      this.address = "";
      this.message = "";
      this.$v.$reset();
    },
    copy() {
      clipboard.writeText(this.status.state.signature);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.signatureCopied")
      });
    }
  }
};
</script>

<style lang="scss">
.signature-wrapper {
  margin-top: 12px;
}

.prove-transaction {
  .description {
    white-space: pre-line;
  }
  .buttons {
    .q-btn:not(:first-child) {
      margin-left: 8px;
    }
  }
  .signature {
    flex: 1;
    word-break: break-all;
    word-wrap: break-word;
    -webkit-user-select: all;
    user-select: all;
    padding: 8px;
  }
}
</style>
