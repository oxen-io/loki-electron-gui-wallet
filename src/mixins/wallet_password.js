import { mapState } from "vuex";

export default {
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme
  }),
  methods: {
    hasPassword() {
      // Validate the address
      return new Promise(resolve => {
        this.$gateway.once("has_password", data => {
          resolve(!!data);
        });
        this.$gateway.send("wallet", "has_password");
      });
    },

    async showPasswordConfirmation(options) {
      const { noPasswordMessage, ...other } = options;
      return this.hasPassword()
        .then(hasPassword => {
          const sharedOpts = {
            cancel: {
              flat: true,
              label: this.$t("dialog.buttons.cancel"),
              color: this.theme === "dark" ? "white" : "dark"
            },
            ...other
          };
          const hasPasswordOpts = {
            ...sharedOpts,
            message: this.$t("dialog.password.message"),
            prompt: {
              model: "",
              type: "password"
            }
          };
          const noPasswordOpts = {
            ...sharedOpts,
            message: noPasswordMessage
          };
          let usedOpts = hasPassword ? hasPasswordOpts : noPasswordOpts;
          return this.$q.dialog(usedOpts);
        })
        .catch(() => {});
    }
  }
};
