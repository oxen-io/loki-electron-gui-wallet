<template>
  <div class="lns-input">
    <div class="q-px-md q-pt-md">
      <div class="q-mb-lg description">
        {{ $t("strings.lnsDescription") }}
      </div>
      <LNSInputForm
        ref="form"
        :submit-label="submit_label"
        :disable-name="updating"
        :show-clear-button="updating"
        :disable-submit-button="disable_submit_button"
        @onSubmit="onSubmit"
        @onClear="onClear"
      />
      <q-inner-loading :showing="lns_status.sending" :dark="theme == 'dark'">
        <q-spinner color="primary" size="30" />
      </q-inner-loading>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LNSInputForm from "components/lns_input_form";
import WalletPassword from "src/mixins/wallet_password";
const objectAssignDeep = require("object-assign-deep");

export default {
  name: "LNSInput",
  components: {
    LNSInputForm
  },
  mixins: [WalletPassword],
  data() {
    return {
      updating: false
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    lns_status: state => state.gateway.lns_status,
    unlocked_balance: state => state.gateway.wallet.info.unlocked_balance,
    disable_submit_button() {
      const minBalance = this.updating ? 0.05 : 21;
      return this.unlocked_balance < minBalance * 1e9;
    },
    submit_label() {
      const label = this.updating ? "buttons.update" : "buttons.purchase";
      return this.$t(label);
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

            this.$refs.form.reset();
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
    startUpdating(record) {
      this.$refs.form.setRecord(record);
      this.updating = true;
    },
    onSubmit(record, oldRecord) {
      if (this.updating) {
        this.update(record, oldRecord);
      } else {
        this.purchase(record);
      }
    },
    onClear() {
      this.$refs.form.reset();
      this.updating = false;
    },
    async update(record, oldRecord) {
      // Make sure we have a diff between the 2 records
      const isOwnerDifferent = record.owner !== "" && record.owner !== oldRecord.owner;
      const isBackupOwnerDifferent = record.backup_owner !== "" && record.backup_owner !== oldRecord.backup_owner;
      const isValueDifferent = record.value !== oldRecord.value;
      const different = isOwnerDifferent || isBackupOwnerDifferent || isValueDifferent;
      if (!different) {
        this.$q.notify({
          type: "positive",
          timeout: 1000,
          message: this.$t("notification.positive.lnsRecordUpdated")
        });
        return;
      }

      const updatedRecord = {
        ...record,
        value: isValueDifferent ? record.value : "",
        owner: isOwnerDifferent ? record.owner : "",
        backup_owner: isBackupOwnerDifferent ? record.backup_owner : ""
      };

      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.lnsUpdate.title"),
        noPasswordMessage: this.$t("dialog.lnsUpdate.message"),
        ok: {
          label: this.$t("dialog.lnsUpdate.ok"),
          color: "primary"
        },
        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark"
      });
      passwordDialog
        .onOk(password => {
          // if no password set
          password = password || "";
          this.$store.commit("gateway/set_lns_status", {
            code: 1,
            message: "Sending transaction",
            sending: true
          });
          const lns = objectAssignDeep.noMutate(updatedRecord, {
            password
          });
          this.$gateway.send("wallet", "update_lns_mapping", lns);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    async purchase(record) {
      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.purchase.title"),
        noPasswordMessage: this.$t("dialog.purchase.message"),
        ok: {
          label: this.$t("dialog.purchase.ok"),
          color: "primary"
        },
        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark"
      });
      passwordDialog
        .onOk(password => {
          // if no password set
          password = password || "";
          this.$store.commit("gateway/set_lns_status", {
            code: 1,
            message: "Sending transaction",
            sending: true
          });
          const lns = objectAssignDeep.noMutate(record, {
            password
          });
          this.$gateway.send("wallet", "purchase_lns", lns);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    }
  }
};
</script>

<style lang="scss">
.lns-input {
  .description {
    white-space: pre-line;
  }
}
</style>
