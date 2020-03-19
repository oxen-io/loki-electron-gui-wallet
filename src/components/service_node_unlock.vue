<template>
  <div v-if="service_nodes.length > 0" class="service-node-unlock">
    <div class="q-pa-md">
      <div class="q-pb-sm header">
        {{ $t("titles.currentlyStakedNodes") }}
      </div>
      <q-list class="service-node-list" no-border>
        <q-item v-for="node in service_nodes" :key="node.service_node_pubkey" @click.native="details(node)">
          <q-item-main>
            <q-item-tile class="ellipsis" label>{{ node.service_node_pubkey }}</q-item-tile>
            <q-item-tile sublabel class="non-selectable"
              >{{ getRole(node) }} • {{ getFee(node) }} • {{ $t("strings.contribution") }}:
              <FormatLoki :amount="node.ourContributionAmount"
            /></q-item-tile>
          </q-item-main>
          <q-item-side>
            <q-btn
              v-if="node.requested_unlock_height === 0"
              color="primary"
              size="md"
              :label="$t('buttons.unlock')"
              :disabled="!is_ready || unlock_status.sending"
              @click.native="unlockWarning(node.service_node_pubkey, $event)"
            />
            <q-item-tile v-if="node.requested_unlock_height > 0" label>
              {{
                $t("strings.unlockingAtHeight", {
                  number: node.requested_unlock_height
                })
              }}
            </q-item-tile>
          </q-item-side>
          <q-context-menu>
            <q-list link separator style="min-width: 150px; max-height: 300px;">
              <q-item v-close-overlay @click.native="copyKey(node.service_node_pubkey, $event)">
                <q-item-main :label="$t('menuItems.copyServiceNodeKey')" />
              </q-item>
              <q-item v-close-overlay @click.native="openExplorer(node.service_node_pubkey)">
                <q-item-main :label="$t('menuItems.viewOnExplorer')" />
              </q-item>
            </q-list>
          </q-context-menu>
        </q-item>
      </q-list>
    </div>

    <ServiceNodeDetails ref="serviceNodeDetails" :unlock="unlockWarning" />

    <q-inner-loading :visible="unlock_status.sending" :dark="theme == 'dark'">
      <q-spinner color="primary" :size="30" />
    </q-inner-loading>
  </div>
</template>

<script>
import { clipboard } from "electron";
import { mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import { service_node_key } from "src/validators/common";
import WalletPassword from "src/mixins/wallet_password";
import FormatLoki from "components/format_loki";
import ServiceNodeDetails from "components/service_node_details";

export default {
  name: "ServiceNodeUnlock",
  components: {
    FormatLoki,
    ServiceNodeDetails
  },
  mixins: [WalletPassword],
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    unlock_status: state => state.gateway.service_node_status.unlock,
    our_address: state => {
      const primary = state.gateway.wallet.address_list.primary[0];
      return (primary && primary.address) || null;
    },
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    service_nodes(state) {
      const nodes = state.gateway.daemon.service_nodes;
      const getContribution = node => node.contributors.find(c => c.address === this.our_address);
      // Only show nodes that we contributed to
      return nodes.filter(getContribution).map(n => {
        const ourContribution = getContribution(n);
        return {
          ...n,
          ourContributionAmount: ourContribution.amount
        };
      });
    }
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
                  label: this.$t("dialog.unlockServiceNode.ok")
                },
                cancel: {
                  flat: true,
                  label: this.$t("dialog.buttons.cancel"),
                  color: this.theme == "dark" ? "white" : "dark"
                }
              })
              .then(() => {
                this.gatewayUnlock(this.password, this.key, true);
              })
              .catch(() => {});
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
      this.$refs.serviceNodeDetails.isVisible = true;
      this.$refs.serviceNodeDetails.node = node;
    },
    unlockWarning(key, event) {
      event.stopPropagation();
      this.$q
        .dialog({
          title: this.$t("dialog.unlockServiceNodeWarning.title"),
          message: this.$t("dialog.unlockServiceNodeWarning.message"),
          ok: {
            label: this.$t("dialog.unlockServiceNodeWarning.ok")
          },
          cancel: {
            flat: true,
            label: this.$t("dialog.buttons.cancel"),
            color: this.theme === "dark" ? "white" : "dark"
          }
        })
        .then(() => {
          this.unlock(key);
        })
        .catch(() => {});
    },
    unlock(key) {
      // We store this as it could change between the 2 step process
      this.key = key;

      this.showPasswordConfirmation({
        title: this.$t("dialog.unlockServiceNode.title"),
        noPasswordMessage: this.$t("dialog.unlockServiceNode.message"),
        ok: {
          label: this.$t("dialog.unlockServiceNode.ok")
        }
      })
        .then(password => {
          this.password = password;
          this.gatewayUnlock(this.password, this.key, false);
        })
        .catch(() => {});
    },
    gatewayUnlock(password, key, confirmed = false) {
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
    copyKey(key, event) {
      event.stopPropagation();
      for (let i = 0; i < event.path.length; i++) {
        if (event.path[i].tagName == "BUTTON") {
          event.path[i].blur();
          break;
        }
      }
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
      const key = node.operator_address === this.our_address ? "strings.operator" : "strings.contributor";
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

<style lang="scss">
.service-node-unlock {
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
