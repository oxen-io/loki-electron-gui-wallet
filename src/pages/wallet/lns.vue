<template>
  <q-page class="lns-page">
    <LNSInput ref="input" />
    <LNSRecordList @onUpdate="onUpdate" />
  </q-page>
</template>

<script>
import LNSInput from "components/lns_input";
import LNSRecordList from "components/lns_record_list";

export default {
  components: {
    LNSInput,
    LNSRecordList
  },
  methods: {
    onUpdate(record) {
      this.$refs.input.startUpdating(record);
    }
  }
};
</script>

<style lang="scss"></style>
