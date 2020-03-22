<template>
  <q-page class="lns-page">
    <LNSPurchase />
    <LNSRecordList />
  </q-page>
</template>

<script>
import LNSPurchase from "components/lns_purchase";
import LNSRecordList from "components/lns_record_list";

export default {
  components: {
    LNSPurchase,
    LNSRecordList
  }
};
</script>

<style lang="scss"></style>
