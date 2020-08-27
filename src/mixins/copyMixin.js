// Can generalise  copying functionality
import { mapState } from "vuex";
import { clipboard } from "electron";

export const copyMixin = {
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme
  }),
  methods: {
    copyContentMixin(content) {
      clipboard.writeText(content);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.addressCopied")
      });
    }
  }
};
