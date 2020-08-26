<template>
  <q-page>
    <div class="row q-pt-sm q-mx-md q-mb-sm items-end non-selectable">
      <div class="col-5">
        {{ $t("titles.transactions") }}
      </div>

      <LokiField class="col-5 q-px-sm" :label="$t('fieldLabels.filter')">
        <q-input
          v-model="tx_filter"
          :dark="theme == 'dark'"
          :placeholder="$t('placeholders.filterTx')"
          borderless
          dense
        />
      </LokiField>

      <LokiField class="col-2" :label="$t('fieldLabels.filterTransactionType')">
        <q-select v-model="tx_type" :dark="theme == 'dark'" :options="tx_type_options" borderless dense />
      </LokiField>
    </div>
    <TxList :type="tx_type" :filter="tx_filter" />
  </q-page>
</template>

<script>
import { mapState } from "vuex";
import TxList from "components/tx_list";
import LokiField from "components/loki_field";
export default {
  components: {
    TxList,
    LokiField
  },
  data() {
    return {
      tx_type: "all",
      tx_filter: "",
      tx_type_options: [
        {
          label: this.$t("strings.transactions.types.all"),
          value: "all"
        },
        {
          label: this.$t("strings.transactions.types.incoming"),
          value: "in"
        },
        {
          label: this.$t("strings.transactions.types.outgoing"),
          value: "out"
        },
        {
          label: this.$t("strings.transactions.types.pending"),
          value: "all_pending"
        },
        {
          label: this.$t("strings.transactions.types.miner"),
          value: "miner"
        },
        {
          label: this.$t("strings.transactions.types.serviceNode"),
          value: "snode"
        },
        {
          label: this.$t("strings.transactions.types.governance"),
          value: "gov"
        },
        {
          label: this.$t("strings.transactions.types.stake"),
          value: "stake"
        },
        {
          label: this.$t("strings.transactions.types.failed"),
          value: "failed"
        }
      ]
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    tx_list: state => state.gateway.wallet.transactions.tx_list
  })
};
</script>

<style lang="scss"></style>
