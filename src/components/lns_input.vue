<template>
  <div class="lns-input">
    <div class="q-px-md q-pt-md">
      <div class="q-mb-lg description">
        {{ $t("strings.lnsDescription") }}
      </div>
      <LNSInputForm
        ref="form"
        :record="record"
        :submit-label="submit_label"
        :disable-name="updating"
        :show-clear-button="updating"
        @onSubmit="onSubmit"
        @onClear="onClear"
      />
      <q-inner-loading :visible="lns_status.sending" :dark="theme == 'dark'">
        <q-spinner color="primary" :size="30" />
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
    const cleanRecord = {
      type: "session",
      name: "",
      value: "",
      owner: "",
      backup_owner: ""
    };
    return {
      updating: false,
      cleanRecord,
      record: cleanRecord
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    lns_status: state => state.gateway.lns_status,
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
            if (!this.updating) {
              this.record = this.cleanRecord;
            }
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
      this.record = {
        ...this.cleanRecord,
        ...record
      };
      this.updating = true;
      this.$refs.form.reset();
    },
    onSubmit(record) {
      if (this.updating) {
        this._update(record);
      } else {
        this._purchase(record);
      }
    },
    onClear() {
      this.record = this.cleanRecord;
      this.updating = false;
      this.$refs.form.reset();
    },
    update(record) {
      // Make sure we have a diff between the 2 records
      const currentRecord = this.record;
      const isOwnerDifferent = record.owner !== "" && record.owner !== currentRecord.owner;
      const isBackupOwnerDifferent = record.backup_owner !== "" && record.backup_owner !== currentRecord.backup_owner;
      const isValueDifferent = record.value !== currentRecord.value;
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

      this.showPasswordConfirmation({
        title: this.$t("dialog.lnsUpdate.title"),
        noPasswordMessage: this.$t("dialog.lnsUpdate.message"),
        ok: {
          label: this.$t("dialog.lnsUpdate.ok")
        }
      })
        .then(password => {
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
        .catch(() => {});
    },
    purchase(record) {
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
          const lns = objectAssignDeep.noMutate(record, {
            password
          });
          this.$gateway.send("wallet", "purchase_lns", lns);
        })
        .catch(() => {});
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
