<template>
  <div class="service-node-stake-tab">
    <div class="q-pa-md">
      <div class="row align-items sn-contribution-info">
        <div class="col-md-8">
          <div class="header">{{ $t("titles.availableForContribution") }}</div>
        </div>
        <div class="col-md-4">
          <q-btn class="float-right vertical-top" icon="refresh" flat @click="updateServiceNodeList" />
        </div>
      </div>
      <div v-if="awaiting_service_nodes.length > 0">
        <ServiceNodeList
          v-if="awaiting_service_nodes"
          :service-nodes="awaiting_service_nodes"
          button-i18n="buttons.stake"
          :details="details"
          :action="contributeToNode"
        />
      </div>
      <div v-else>{{ $t("strings.noServiceNodesCurrentlyAvailable") }}</div>
    </div>
    <ServiceNodeDetails ref="serviceNodeDetailsContribute" :action="contributeToNode" action-i18n="buttons.stake" />
    <q-inner-loading :showing="fetching" :dark="theme == 'dark'">
      <q-spinner color="primary" size="30" />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ServiceNodeList from "./service_node_list";
import ServiceNodeDetails from "./service_node_details";
export default {
  name: "ServiceNodeContribute",
  components: {
    ServiceNodeList,
    ServiceNodeDetails
  },
  computed: mapState({
    awaiting_service_nodes(state) {
      const nodes = state.gateway.daemon.service_nodes.nodes;
      // a reserved node is one on which someone is a "contributor" of amount = 0
      const getOurContribution = node => node.contributors.find(c => c.address === this.our_address && c.amount > 0);
      const isAwaitingContribution = node => !node.active && !node.funded && node.requested_unlock_height === 0;
      const isAwaitingContributionNonReserved = node => isAwaitingContribution(node) && !getOurContribution(node);
      const isAwaitingContributionReserved = node => isAwaitingContribution(node) && getOurContribution(node);

      // we want the reserved nodes sorted by fee at the top
      const awaitingContributionNodesReserved = nodes.filter(isAwaitingContributionReserved).map(n => {
        return {
          ...n,
          awaitingContribution: true
        };
      });
      const awaitingContributionNodesNonReserved = nodes.filter(isAwaitingContributionNonReserved).map(n => {
        return {
          ...n,
          awaitingContribution: true
        };
      });

      const compareFee = (n1, n2) => (this.getFeeDecimal(n1) > this.getFeeDecimal(n2) ? 1 : -1);
      awaitingContributionNodesReserved.sort(compareFee);
      awaitingContributionNodesNonReserved.sort(compareFee);

      const nodesForContribution = [...awaitingContributionNodesReserved, ...awaitingContributionNodesNonReserved];
      return nodesForContribution;
    },
    theme: state => state.gateway.app.config.appearance.theme,
    fetching: state => state.gateway.daemon.service_nodes.fetching
  }),
  methods: {
    getFeeDecimal(node) {
      const operatorPortion = node.portions_for_operator;
      return (operatorPortion / 18446744073709551612) * 100;
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    contributeToNode(node, event) {
      // stop detail page from popping up
      event.stopPropagation();
      this.scrollToTop();
      const key = node.service_node_pubkey;
      const minContribution = node.minContribution;
      // close the detail popup if it's open
      this.$refs.serviceNodeDetailsContribute.isVisible = false;
      this.$emit("contribute", key, minContribution);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.serviceNodeInfoFilled")
      });
    },
    details(node) {
      this.$refs.serviceNodeDetailsContribute.isVisible = true;
      this.$refs.serviceNodeDetailsContribute.node = node;
    },
    updateServiceNodeList() {
      this.$gateway.send("wallet", "update_service_node_list");
    }
  }
};
</script>

<style lang="scss">
.sn-contribution-info {
  > * {
    line-height: 30px;
    margin: 20 400;
  }
  margin-bottom: 6px;
}
</style>
