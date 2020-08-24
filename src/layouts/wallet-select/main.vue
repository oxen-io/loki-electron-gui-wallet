<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="shift-title">
      <template v-if="show_menu">
        <MainMenu :disable-switch-wallet="true" />
      </template>
      <template v-else>
        <q-btn class="cancel" icon="reply" flat round dense @click="cancel()" />
      </template>

      <q-toolbar-title v-if="page_title == 'Loki'">
        <div class="flex items-center justify-center" style="margin-top:7px">
          <img src="statics/loki.svg" height="32" />
        </div>
      </q-toolbar-title>
      <q-toolbar-title v-else>
        {{ page_title }}
      </q-toolbar-title>
    </q-header>

    <q-page-container>
      <router-view ref="page" />
    </q-page-container>

    <StatusFooter />
  </q-layout>
</template>

<script>
import StatusFooter from "components/footer";
import MainMenu from "components/mainmenu";

export default {
  components: {
    StatusFooter,
    MainMenu
  },
  data() {
    return {};
  },
  computed: {
    show_menu() {
      return this.$route.name === "wallet-select";
    },
    page_title() {
      switch (this.$route.name) {
        case "wallet-create":
          return this.$t("titles.wallet.createNew");
        case "wallet-restore":
          return this.$t("titles.wallet.restoreFromSeed");
        case "wallet-import":
          return this.$t("titles.wallet.importFromFile");
        case "wallet-import-view-only":
          return this.$t("titles.wallet.restoreViewOnly");
        case "wallet-import-legacy":
          return this.$t("titles.wallet.importFromLegacyGUI");
        case "wallet-import-old-gui":
          return this.$t("titles.wallet.importFromOldGUI");
        case "wallet-created":
          return this.$t("titles.wallet.createdOrRestored");

        default:
        case "wallet-select":
          return "Loki";
      }
    }
  },
  methods: {
    cancel() {
      this.$router.replace({ path: "/wallet-select" });
      this.$gateway.send("wallet", "close_wallet");
      setTimeout(() => {
        // short delay to prevent wallet data reaching the
        // websocket moments after we close and reset data
        this.$store.dispatch("gateway/resetWalletData");
      }, 250);
    }
  }
};
</script>

<style></style>
