<template>
  <q-btn ref="copy" color="primary" size="sm" padding="xs" icon="file_copy" @click="copyContent">
    <q-tooltip anchor="center right" self="center left" :offset="[5, 10]">
      {{ $t("menuItems.copyAddress") }}
    </q-tooltip>
  </q-btn>
</template>

<script>
const { clipboard } = require("electron");
import { copyMixin } from "../../mixins/copyMixin.js";
export default {
  name: "CopyIcon",
  mixins: [copyMixin],
  props: {
    content: {
      type: String,
      required: true
    },
    event: {
      type: Event,
      required: false,
      default: null
    }
  },
  methods: {
    copyContent() {
      console.log(this);
      clipboard.writeText(this.content);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.addressCopied")
      });
    }
  }
};
</script>

<style></style>
