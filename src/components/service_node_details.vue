<template>
  <q-dialog v-model="isVisible" class="serviceNodeDetails" maximized="">
    <q-layout>
      <q-header>
        <q-toolbar color="dark" inverted>
          <q-btn flat round dense icon="reply" @click="isVisible = false" />
          <q-toolbar-title>
            {{ $t("titles.serviceNodeDetails") }}
          </q-toolbar-title>
          <q-btn
            v-if="node.requested_unlock_height === 0"
            class="q-mr-sm"
            color="primary"
            :disabled="!is_ready || unlock_status.sending"
            :label="$t('buttons.unlock')"
            @click="unlock(node.service_node_pubkey, $event)"
          />
          <q-btn v-if="can_open" color="primary" :label="$t('buttons.viewOnExplorer')" @click="openExplorer" />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <div class="layout-padding">
          <h6 class="q-mt-xs q-mb-none text-weight-light">
            {{ $t("strings.serviceNodeDetails.serviceNodeKey") }}
          </h6>
          <p class="break-all">{{ node.service_node_pubkey }}</p>

          <div class="info row justify-between">
            <div class="infoBox">
              <div class="infoBoxContent">
                <div class="text">
                  <span>{{ $t("strings.serviceNodeDetails.stakingRequirement") }}</span>
                </div>
                <div class="value">
                  <span><FormatLoki :amount="node.staking_requirement" raw-value/></span>
                </div>
              </div>
            </div>
            <div class="infoBox">
              <div class="infoBoxContent">
                <div class="text">
                  <span>{{ $t("strings.serviceNodeDetails.totalContributed") }}</span>
                </div>
                <div class="value">
                  <span><FormatLoki :amount="node.total_contributed" raw-value/></span>
                </div>
              </div>
            </div>
            <div class="infoBox">
              <div class="infoBoxContent">
                <div class="text">
                  <span>{{ $t("strings.serviceNodeDetails.registrationHeight") }}</span>
                </div>
                <div class="value">
                  <span>{{ node.registration_height }}</span>
                </div>
              </div>
            </div>
            <div class="infoBox">
              <div class="infoBoxContent">
                <div class="text">
                  <span>{{ $t("strings.serviceNodeDetails.operatorFee") }}</span>
                </div>
                <div class="value">
                  <span>{{ operatorFee }}</span>
                </div>
              </div>
            </div>
            <div v-if="node.requested_unlock_height > 0" class="infoBox">
              <div class="infoBoxContent">
                <div class="text">
                  <span>{{ $t("strings.serviceNodeDetails.unlockHeight") }}</span>
                </div>
                <div class="value">
                  <span>{{ node.requested_unlock_height }}</span>
                </div>
              </div>
            </div>
            <div class="infoBox">
              <div class="infoBoxContent">
                <div class="text">
                  <span>{{ $t("strings.serviceNodeDetails.lastUptimeProof") }}</span>
                </div>
                <div class="value">
                  <span>{{ formatDate(node.last_uptime_proof * 1000) }}</span>
                </div>
              </div>
            </div>
            <div class="infoBox">
              <div class="infoBoxContent">
                <div class="text">
                  <span>{{ $t("strings.serviceNodeDetails.lastRewardBlockHeight") }}</span>
                </div>
                <div class="value">
                  <span>{{ node.last_reward_block_height }}</span>
                </div>
              </div>
            </div>
          </div>
          <q-list no-border :dark="theme == 'dark'" class="loki-list">
            <q-item-label class="contributors-title">{{ $t("strings.serviceNodeDetails.contributors") }}:</q-item-label>
            <q-item v-for="contributor in contributors" :key="contributor.address" class="loki-list-item">
              <q-item-label>
                <q-item-label v-if="isMe(contributor)" class="name non-selectable">{{ $t("strings.me") }}</q-item-label>
                <q-item-label v-else class="name non-selectable">{{ contributor.name }}</q-item-label>
                <q-item-label class="address ellipsis non-selectable">{{ contributor.address }}</q-item-label>
                <q-item-label class="non-selectable" caption>
                  <span v-if="isOperator(contributor)">{{ $t("strings.operator") }} • </span>
                  {{ $t("strings.contribution") }}:
                  <FormatLoki :amount="contributor.amount" raw-value />
                </q-item-label>
              </q-item-label>
              <q-menu context-menu>
                <q-list separator class="context-menu">
                  <q-item v-close-popup @click.native="copyAddress(contributor.address, $event)">
                    <q-item-section>
                      {{ $t("menuItems.copyAddress") }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
          </q-list>
        </div>

        <q-inner-loading :showing="unlock_status.sending" :dark="theme == 'dark'">
          <q-spinner color="primary" size="30" />
        </q-inner-loading>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
const { clipboard } = require("electron");
import { mapState } from "vuex";
import { date } from "quasar";
import FormatLoki from "components/format_loki";
export default {
  name: "ServiceNodeDetails",
  components: {
    FormatLoki
  },
  props: {
    unlock: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isVisible: false,
      node: {}
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    unlock_status: state => state.gateway.service_node_status.unlock,
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    our_address: state => {
      const primary = state.gateway.wallet.address_list.primary[0];
      return (primary && primary.address) || null;
    },
    can_open(state) {
      const { net_type } = state.gateway.app.config.app;
      return net_type !== "stagenet";
    },
    contributors(state) {
      if (!this.node.contributors) return [];
      const { address_book } = state.gateway.wallet.address_list;
      let contributors = [];

      for (const contributor of this.node.contributors) {
        let values = { ...contributor };
        const address = address_book.find(a => a.address === contributor.address);
        if (address) {
          const { name, description } = address;
          const separator = description === "" ? "" : " - ";
          values.name = `${name}${separator}${description}`;
        }
        contributors.push(values);
      }
      return contributors;
    },
    operatorFee() {
      const operatorPortion = this.node.portions_for_operator;
      const percentageFee = (operatorPortion / 18446744073709551612) * 100;
      return `${percentageFee}%`;
    }
  }),
  methods: {
    openExplorer() {
      this.$gateway.send("core", "open_explorer", {
        type: "service_node",
        id: this.node.service_node_pubkey
      });
    },
    formatDate(timestamp) {
      return date.formatDate(timestamp, "YYYY-MM-DD hh:mm a");
    },
    copyAddress(address, event) {
      event.stopPropagation();
      for (let i = 0; i < event.path.length; i++) {
        if (event.path[i].tagName == "BUTTON") {
          event.path[i].blur();
          break;
        }
      }
      clipboard.writeText(address);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.addressCopied")
      });
    },
    isMe(contributor) {
      return contributor.address === this.our_address;
    },
    isOperator(contributor) {
      return this.node.operator_address === contributor.address;
    }
  }
};
</script>

<style lang="scss">
.contributors-title {
  margin-bottom: 12px;
}

.serviceNodeDetails {
  .name {
    font-size: 0.92rem;
  }

  .infoBox {
    margin-left: 30px;
  }

  .info {
    margin-right: 30px;
  }
}
</style>
