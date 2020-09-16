<template>
  <div class="service-node-stake-tab">
    <div class="q-pa-md">
      <div class="q-pb-sm header">
        <span v-if="service_nodes.length">
          {{ $t("titles.currentlyStakedNodes") }}
        </span>
        <span v-else>{{
          $t("strings.serviceNodeStartStakingDescription")
        }}</span>
      </div>
      <div v-if="service_nodes">
        <ServiceNodeList
          :service-nodes="service_nodes"
          button-i18n="buttons.unlock"
          :details="details"
          :action="unlockWarning"
        />
      </div>
      <q-inner-loading
        :showing="unlock_status.sending || fetching"
        :dark="theme == 'dark'"
      >
        <q-spinner color="primary" size="30" />
      </q-inner-loading>
      <ServiceNodeDetails
        ref="serviceNodeDetailsUnlock"
        :action="unlockWarning"
        action-i18n="buttons.unlock"
      />
    </div>
  </div>
</template>

<script>
import { clipboard } from "electron";
import { mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import { service_node_key } from "src/validators/common";
import WalletPassword from "src/mixins/wallet_password";
import ServiceNodeDetails from "./service_node_details";
import ServiceNodeList from "./service_node_list";

export default {
  name: "ServiceNodeUnlock",
  components: {
    ServiceNodeDetails,
    ServiceNodeList
  },
  mixins: [WalletPassword],
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
    theme: state => state.gateway.app.config.appearance.theme,
    unlock_status: state => state.gateway.service_node_status.unlock,
    our_address: state => {
      const primary = state.gateway.wallet.address_list.primary[0];
      return (primary && primary.address) || null;
    },
    // just SNs the user has contributed to
    service_nodes(state) {
      let nodes = state.gateway.daemon.service_nodes.nodes;
      // don't count reserved nodes in my stakes (where they are a contributor of amount 0)
      const getOurContribution = node =>
        node.contributors.find(
          c => c.address === this.our_address && c.amount > 0
        );
      return nodes.filter(getOurContribution).map(n => {
        const ourContribution = getOurContribution(n);
        return {
          ...n,
          ourContributionAmount: ourContribution.amount
        };
      });
    },
    fetching: state => state.gateway.daemon.service_nodes.fetching
  }),
  validations: {
    node_key: { required, service_node_key }
  },
  watch: {
    unlock_status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case 0:
            this.key = null;
            this.password = null;

            this.$q.notify({
              type: "positive",
              timeout: 1000,
              message
            });
            this.$v.$reset();
            break;
          case 1:
            // Tell the user to confirm
            this.$q
              .dialog({
                title: this.$t("dialog.unlockServiceNode.confirmTitle"),
                message,
                ok: {
                  label: this.$t("dialog.unlockServiceNode.ok"),
                  color: "primary"
                },
                cancel: {
                  flat: true,
                  label: this.$t("dialog.buttons.cancel"),
                  color: this.theme == "dark" ? "white" : "dark"
                },
                style: "min-width: 500px; overflow-wrap: break-word;",
                dark: this.theme == "dark",
                color: this.theme == "dark" ? "white" : "dark"
              })
              .onOk(() => {
                let password = this.password || "";
                this.gatewayUnlock(password, this.key, true);
              })
              .onDismiss(() => null)
              .onCancel(() => null);
            break;
          case -1:
            this.key = null;
            this.password = null;

            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message
            });
            break;
          default:
            break;
        }
      },
      deep: true
    }
  },
  methods: {
    details(node) {
      this.$refs.serviceNodeDetailsUnlock.isVisible = true;
      this.$refs.serviceNodeDetailsUnlock.node = node;
    },
    unlockWarning(node, event) {
      const key = node.service_node_pubkey;
      // stop detail page from popping up
      this.$gateway.send("wallet", "update_service_node_list");
      event.stopPropagation();
      this.$q
        .dialog({
          title: this.$t("dialog.unlockServiceNodeWarning.title"),
          message: this.$t("dialog.unlockServiceNodeWarning.message"),
          ok: {
            label: this.$t("dialog.unlockServiceNodeWarning.ok"),
            color: "primary"
          },
          cancel: {
            flat: true,
            label: this.$t("dialog.buttons.cancel"),
            color: this.theme === "dark" ? "white" : "dark"
          },
          dark: this.theme == "dark",
          color: this.theme == "dark" ? "white" : "dark"
        })
        .onOk(() => {
          this.unlock(key);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    async unlock(key) {
      // We store this as it could change between the 2 step process
      this.key = key;

      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.unlockServiceNode.title"),
        noPasswordMessage: this.$t("dialog.unlockServiceNode.message"),
        ok: {
          label: this.$t("dialog.unlockServiceNode.ok"),
          color: "primary"
        },
        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark"
      });

      passwordDialog
        .onOk(password => {
          this.password = password || "";
          this.gatewayUnlock(this.password, this.key, false);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    },
    gatewayUnlock(password, key, confirmed = false) {
      password = password || "";
      this.$store.commit("gateway/set_snode_status", {
        unlock: {
          code: 2, // Code 1 is reserved for can_unlock
          message: "Unlocking...",
          sending: true
        }
      });
      this.$gateway.send("wallet", "unlock_stake", {
        password,
        service_node_key: key,
        confirmed
      });
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
    },
    getRole(node) {
      const key =
        node.operator_address === this.our_address
          ? "strings.operator"
          : "strings.contributor";
      return this.$t(key);
    },
    getFee(node) {
      const operatorPortion = node.portions_for_operator;
      const percentageFee = (operatorPortion / 18446744073709551612) * 100;
      return `${percentageFee}% ${this.$t("strings.transactions.fee")}`;
    }
  }
};
</script>

<style lang="scss"></style>
