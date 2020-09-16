<template>
  <div class="service-node-stake-tab">
    <div class="q-pa-md">
      <div class="row align-items sn-contribution-info">
        <div class="col-md-8">
          <div class="header">{{ $t("titles.availableForContribution") }}</div>
        </div>
        <div class="col-md-4">
          <q-btn
            class="float-right vertical-top"
            icon="refresh"
            flat
            @click="updateServiceNodeList"
          />
        </div>
      </div>
      <div v-if="awaitingServiceNodes.length > 0">
        <ServiceNodeList
          v-if="awaitingServiceNodes"
          :service-nodes="awaitingServiceNodes"
          button-i18n="buttons.stake"
          :details="details"
          :action="contributeToNode"
        />
      </div>
      <div v-else>{{ $t("strings.noServiceNodesCurrentlyAvailable") }}</div>
    </div>
    <ServiceNodeDetails
      ref="serviceNodeDetailsContribute"
      :action="contributeToNode"
      action-i18n="buttons.stake"
    />
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
  props: {
    awaitingServiceNodes: {
      type: Array,
      required: true
    }
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    fetching: state => state.gateway.daemon.service_nodes.fetching
  }),
  methods: {
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
