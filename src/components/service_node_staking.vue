<template>
  <div class="service-node-staking">
    <div class="q-px-md q-pt-md">
      <LokiField :label="$t('fieldLabels.serviceNodeKey')" :error="$v.service_node.key.$error">
        <q-input
          v-model.trim="service_node.key"
          :dark="theme == 'dark'"
          :placeholder="$t('placeholders.hexCharacters', { count: 64 })"
          borderless
          dense
          @blur="$v.service_node.key.$touch"
        />
      </LokiField>

      <LokiField :label="$t('fieldLabels.amount')" class="q-mt-md" :error="$v.service_node.amount.$error">
        <q-input
          v-model.trim="service_node.amount"
          :dark="theme == 'dark'"
          type="number"
          min="0"
          :max="unlocked_balance / 1e9"
          placeholder="0"
          borderless
          dense
          @blur="$v.service_node.amount.$touch"
        />
        <q-btn
          color="secondary"
          :text-color="theme == 'dark' ? 'white' : 'dark'"
          @click="service_node.amount = unlocked_balance / 1e9"
        >
          {{ $t("buttons.all") }}
        </q-btn>
      </LokiField>
      <div class="submit-button">
        <q-btn :disable="!is_able_to_send" color="primary" :label="$t('buttons.stake')" @click="stake()" />
        <q-btn
          :disable="!is_able_to_send"
          color="secondary"
          :label="$t('buttons.sweepAll')"
          @click="sweepAllWarning()"
        />
      </div>
    </div>

    <ServiceNodeUnlock />

    <q-inner-loading :showing="stake_status.sending || tx_status.sending" :dark="theme == 'dark'">
      <q-spinner color="primary" size="30" />
    </q-inner-loading>
  </div>
</template>

<script>
const objectAssignDeep = require("object-assign-deep");
import { mapState } from "vuex";
import { required, decimal } from "vuelidate/lib/validators";
import { service_node_key, greater_than_zero } from "src/validators/common";
import LokiField from "components/loki_field";
import WalletPassword from "src/mixins/wallet_password";
import ServiceNodeUnlock from "components/service_node_unlock";

export default {
  name: "ServiceNodeStaking",
  components: {
    LokiField,
    ServiceNodeUnlock
  },
  mixins: [WalletPassword],
  data() {
    return {
      service_node: {
        key: "",
        amount: 0
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    unlocked_balance: state => state.gateway.wallet.info.unlocked_balance,
    info: state => state.gateway.wallet.info,
    stake_status: state => state.gateway.service_node_status.stake,
    tx_status: state => state.gateway.tx_status,
    award_address: state => state.gateway.wallet.info.address,
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    is_able_to_send() {
      return this.$store.getters["gateway/isAbleToSend"];
    },
    address_placeholder(state) {
      const wallet = state.gateway.wallet.info;
      const prefix = (wallet && wallet.address && wallet.address[0]) || "L";
      return `${prefix}..`;
    }
  }),
  validations: {
    service_node: {
      key: { required, service_node_key },
      amount: {
        required,
        decimal,
        greater_than_zero
      }
    }
  },
  watch: {
    stake_status: {
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
            this.service_node = {
              key: "",
              amount: 0
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
    },
    tx_status: {
      handler(val, old) {
        if (val.code == old.code) return;
        switch (this.tx_status.code) {
          case 0:
            this.$q.notify({
              type: "positive",
              timeout: 1000,
              message: this.tx_status.message
            });
            break;
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message: this.tx_status.message
            });
            break;
        }
      },
      deep: true
    }
  },
  methods: {
    sweepAllWarning() {
      this.$q
        .dialog({
          title: this.$t("dialog.sweepAllWarning.title"),
          message: this.$t("dialog.sweepAllWarning.message"),
          ok: {
            label: this.$t("dialog.sweepAllWarning.ok"),
            color: "primary"
          },
          cancel: {
            flat: true,
            label: this.$t("dialog.buttons.cancel"),
            color: this.theme === "dark" ? "white" : "dark"
          },
          dark: this.theme === "dark"
        })
        .onOk(() => {
          this.sweepAll();
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    async sweepAll() {
      const { unlocked_balance } = this.info;

      const tx = {
        amount: unlocked_balance / 1e9,
        address: this.award_address,
        priority: 0
      };

      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.sweepAll.title"),
        noPasswordMessage: this.$t("dialog.sweepAll.message"),
        ok: {
          label: this.$t("dialog.sweepAll.ok"),
          color: "primary"
        },
        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark"
      });
      passwordDialog
        .onOk(password => {
          password = password || "";
          this.$store.commit("gateway/set_tx_status", {
            code: 1,
            message: "Sweeping all",
            sending: true
          });
          const newTx = objectAssignDeep.noMutate(tx, { password });
          this.$gateway.send("wallet", "transfer", newTx);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    async stake() {
      this.$v.service_node.$touch();

      if (this.$v.service_node.key.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidServiceNodeKey")
        });
        return;
      }

      if (this.service_node.amount < 0) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.negativeAmount")
        });
        return;
      } else if (this.service_node.amount == 0) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.zeroAmount")
        });
        return;
      } else if (this.service_node.amount > this.unlocked_balance / 1e9) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.notEnoughBalance")
        });
        return;
      } else if (this.$v.service_node.amount.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidAmount")
        });
        return;
      }

      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.stake.title"),
        noPasswordMessage: this.$t("dialog.stake.message"),
        ok: {
          label: this.$t("dialog.stake.ok"),
          color: "primary"
        },
        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark"
      });
      passwordDialog
        .onOk(password => {
          password = password || "";
          this.$store.commit("gateway/set_snode_status", {
            stake: {
              code: 1,
              message: "Staking...",
              sending: true
            }
          });
          const service_node = objectAssignDeep.noMutate(this.service_node, {
            password,
            destination: this.award_address
          });

          this.$gateway.send("wallet", "stake", service_node);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    }
  }
};
</script>

<style lang="scss">
.service-node-staking {
  .submit-button {
    .q-btn:not(:first-child) {
      margin-left: 8px;
    }
  }
}
</style>
