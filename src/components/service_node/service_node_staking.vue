<template>
  <div class="service-node-staking">
    <div class="q-px-md q-pt-md">
      <p style="color: #cecece">
        {{ $t("strings.serviceNodeContributionDescription") }}
        <span
          style="cursor: pointer; text-decoration: underline;"
          @click="lokiWebsite"
          >Loki {{ $t("strings.website") }}.</span
        >
      </p>
      <LokiField
        :label="$t('fieldLabels.serviceNodeKey')"
        :error="$v.service_node.key.$error"
      >
        <q-input
          v-model.trim="service_node.key"
          :dark="theme == 'dark'"
          :placeholder="$t('placeholders.hexCharacters', { count: 64 })"
          borderless
          dense
          @blur="$v.service_node.key.$touch"
        />
      </LokiField>
      <LokiField
        :label="$t('fieldLabels.amount')"
        class="q-mt-md"
        :error="$v.service_node.amount.$error"
      >
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
          :label="$t('buttons.min')"
          :disable="!areButtonsEnabled()"
          @click="service_node.amount = minStake(service_node.key)"
        />
        <q-btn
          color="secondary"
          :text-color="theme == 'dark' ? 'white' : 'dark'"
          :label="$t('buttons.max')"
          :disable="!areButtonsEnabled()"
          @click="service_node.amount = maxStake(service_node.key)"
        />
      </LokiField>
      <div class="submit-button">
        <q-btn
          :disable="!is_able_to_send"
          color="primary"
          :label="$t('buttons.stake')"
          @click="stake()"
        />
        <q-btn
          :disable="!is_able_to_send"
          color="secondary"
          :label="$t('buttons.sweepAll')"
          @click="sweepAllWarning()"
        />
      </div>
    </div>
    <ServiceNodeContribute
      :awaiting-service-nodes="awaiting_service_nodes"
      class="contribute"
      @contribute="fillStakingFields"
    />
    <q-inner-loading
      :showing="stake_status.sending || tx_status.sending"
      :dark="theme == 'dark'"
    >
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
import ConfirmDialogMixin from "src/mixins/confirm_dialog_mixin";
import ServiceNodeContribute from "./service_node_contribute";
import ServiceNodeMixin from "src/mixins/service_node_mixin";

// the case for doing nothing on a tx_status update
const DO_NOTHING = 10;

export default {
  name: "ServiceNodeStaking",
  components: {
    LokiField,
    ServiceNodeContribute
  },
  mixins: [WalletPassword, ConfirmDialogMixin, ServiceNodeMixin],
  data() {
    return {
      service_node: {
        key: "",
        amount: 0,
        // the min and max are for that particular SN,
        // start at min/max for the wallet
        minStakeAmount: 0,
        maxStakeAmount: this.unlocked_balance / 1e9
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
    },
    awaiting_service_nodes(state) {
      const nodes = state.gateway.daemon.service_nodes.nodes;
      // a reserved node is one on which someone is a "contributor" of amount = 0
      const getOurContribution = node =>
        node.contributors.find(
          c => c.address === this.our_address && c.amount > 0
        );
      const isAwaitingContribution = node =>
        !node.active && !node.funded && node.requested_unlock_height === 0;
      const isAwaitingContributionNonReserved = node =>
        isAwaitingContribution(node) && !getOurContribution(node);
      const isAwaitingContributionReserved = node =>
        isAwaitingContribution(node) && getOurContribution(node);

      // we want the reserved nodes sorted by fee at the top
      const awaitingContributionNodesReserved = nodes
        .filter(isAwaitingContributionReserved)
        .map(n => {
          return {
            ...n,
            awaitingContribution: true
          };
        });
      const awaitingContributionNodesNonReserved = nodes
        .filter(isAwaitingContributionNonReserved)
        .map(n => {
          return {
            ...n,
            awaitingContribution: true
          };
        });

      const compareFee = (n1, n2) =>
        this.getFeeDecimal(n1) > this.getFeeDecimal(n2) ? 1 : -1;
      awaitingContributionNodesReserved.sort(compareFee);
      awaitingContributionNodesNonReserved.sort(compareFee);

      const nodesForContribution = [
        ...awaitingContributionNodesReserved,
        ...awaitingContributionNodesNonReserved
      ];
      return nodesForContribution;
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
    }
  },
  methods: {
    lokiWebsite() {
      const url = "https://loki.network/service-nodes/";
      this.$gateway.send("core", "open_url", {
        url
      });
    },
    fillStakingFields(key, minContribution) {
      this.service_node.key = key;
      this.service_node.amount = minContribution;
    },
    minStake() {
      const node = this.getNodeWithPubKey();
      return this.getMinContribution(node);
    },
    maxStake() {
      const node = this.getNodeWithPubKey();
      return this.openForContributionLoki(node);
    },
    getFeeDecimal(node) {
      const operatorPortion = node.portions_for_operator;
      return (operatorPortion / 18446744073709551612) * 100;
    },
    buildDialogFieldsSweep(txData) {
      this.buildDialogFields(txData);
    },
    getNodeWithPubKey() {
      const key = this.service_node.key;
      const nodeOfKey = this.awaiting_service_nodes.find(
        n => n.service_node_pubkey === key
      );
      if (!nodeOfKey) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidServiceNodeKey")
        });
        return;
      } else {
        return nodeOfKey;
      }
    },
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
    areButtonsEnabled() {
      // if we can find the service node key in the list of service nodes
      const key = this.service_node.key;
      return !!this.awaiting_service_nodes.find(
        n => n.service_node_pubkey === key
      );
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
            code: DO_NOTHING,
            message: "Sweeping all",
            sending: true
          });
          const newTx = objectAssignDeep.noMutate(tx, { password });
          const txWithSweepAll = {
            ...newTx,
            isSweepAll: true
          };
          this.$gateway.send("wallet", "transfer", txWithSweepAll);
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
.contribute {
  margin-top: 16px;
  padding-left: 8px;
}
.service-node-stake-tab {
  margin-top: 4px;
  user-select: none;
  .header {
    font-weight: 450;
  }
  .q-item-sublabel,
  .q-list-header {
    font-size: 14px;
  }
}
</style>
