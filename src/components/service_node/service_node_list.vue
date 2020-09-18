<template>
  <div>
    <q-list class="service-node-list" no-border>
      <q-item
        v-for="node in serviceNodes"
        :key="node.service_node_pubkey"
        @click.native="details(nodeWithMinContribution(node))"
      >
        <q-item-section>
          <q-item-label class="ellipsis"
            >{{ $t("strings.serviceNodeDetails.snKey") }}:
            {{ node.service_node_pubkey }}</q-item-label
          >
          <q-item-label class="non-selectable">
            <span v-if="node.ourContributionAmount > 0">
              <span v-if="getRole(node)">{{ getRole(node) }} •</span>
              <span>
                {{ $t("strings.contribution") }}:
                <FormatLoki :amount="node.ourContributionAmount" />
              </span>
            </span>
            <!-- you only have a contribution amount of 0 if you are a "contributor"
            by way of the node having reserved a spot for you on the node -->
            <span
              v-if="
                node.ourContributionAmount === 0 && node.awaitingContribution
              "
            >
              {{ $t("strings.serviceNodeDetails.reserved") }} •
            </span>
            <span v-if="node.awaitingContribution">
              {{ $t("strings.serviceNodeDetails.minContribution") }}:
              {{ getMinContribution(node) }} LOKI •
              {{ $t("strings.serviceNodeDetails.maxContribution") }}:
              {{ openForContributionLoki(node) }} LOKI
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <span style="font-size: 16px; color: #cecece">{{
            getFee(node)
          }}</span>
        </q-item-section>
        <q-item-section side>
          <q-btn
            v-if="node.requested_unlock_height === 0"
            color="primary"
            size="md"
            :label="$t(buttonI18n)"
            :disabled="!is_ready"
            side
            @click="action(nodeWithMinContribution(node), $event)"
          />
          <q-item-label v-if="node.requested_unlock_height > 0" header>
            {{
              $t("strings.unlockingAtHeight", {
                number: node.requested_unlock_height
              })
            }}
          </q-item-label>
        </q-item-section>
        <ContextMenu
          :menu-items="menuItems"
          @viewOnExplorer="openExplorer(node.service_node_pubkey)"
          @copyServiceNodeKey="copyKey(node.service_node_pubkey)"
        />
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { clipboard } from "electron";
import ContextMenu from "components/menus/contextmenu";
import FormatLoki from "components/format_loki";
import ServiceNodeMixin from "src/mixins/service_node_mixin";
import { mapState } from "vuex";

export default {
  name: "ServiceNodeList",
  components: {
    ContextMenu,
    FormatLoki
  },
  mixins: [ServiceNodeMixin],
  props: {
    serviceNodes: {
      type: Array,
      required: true
    },
    details: {
      type: Function,
      required: true
    },
    buttonI18n: {
      type: String,
      required: true
    },
    action: {
      type: Function,
      required: true
    }
  },
  data() {
    const menuItems = [
      { action: "copyServiceNodeKey", i18n: "menuItems.copyServiceNodeKey" },
      { action: "viewOnExplorer", i18n: "menuItems.viewOnExplorer" }
    ];
    return {
      menuItems
    };
  },
  computed: mapState({
    our_address: state => {
      const primary = state.gateway.wallet.address_list.primary[0];
      return (primary && primary.address) || null;
    }
  }),
  methods: {
    nodeWithMinContribution(node) {
      const nodeWithMinContribution = {
        ...node,
        minContribution: this.getMinContribution(node)
      };
      return nodeWithMinContribution;
    },
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    getRole(node) {
      let role = "";
      const opAddress = node.operator_address;
      if (opAddress === this.our_address) {
        role = "strings.operator";
      } else if (node.ourContributionAmount && opAddress !== this.our_address) {
        // if we're not the operator and we have a contribution amount
        role = "strings.contributor";
      }
      return this.$t(role);
    },
    getNumContributors(node) {
      return node.contributors.length;
    },
    getFee(node) {
      const operatorPortion = node.portions_for_operator;
      const percentageFee = (operatorPortion / 18446744073709551612) * 100;
      return `${percentageFee.toFixed(2)}% ${this.$t(
        "strings.transactions.fee"
      )}`;
    },
    copyKey(key) {
      clipboard.writeText(key);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.copied", {
          item: "Service node key"
        })
      });
    },
    openExplorer(key) {
      this.$gateway.send("core", "open_explorer", {
        type: "service_node",
        id: key
      });
    }
  }
};
</script>

<style></style>
