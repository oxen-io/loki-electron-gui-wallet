<template>
  <q-dialog v-model="isVisible" maximized class="settings-modal">
    <q-layout>
      <q-header>
        <q-toolbar color="dark" inverted>
          <q-btn flat round dense icon="reply" @click="isVisible = false" />
          <q-toolbar-title shrink>{{ $t("titles.settings.title") }}</q-toolbar-title>

          <div class="row col justify-center q-pr-xl">
            <q-btn-toggle v-model="page" toggle-color="primary" color="tertiary" size="md" :options="tabs" />
          </div>

          <q-btn color="primary" :label="$t('buttons.save')" @click="save" />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <div v-if="page == 'general'">
          <div class="q-pa-lg">
            <SettingsGeneral ref="settingsGeneral"></SettingsGeneral>
          </div>
        </div>

        <div v-if="page == 'peers'">
          <q-list :dark="theme == 'dark'" no-border>
            <q-list-header>{{ $t("strings.peerList") }}</q-list-header>

            <q-item
              v-for="entry in daemon.connections"
              :key="entry.address"
              link
              @click.native="showPeerDetails(entry)"
            >
              <q-item-label>
                <q-item-label header>{{ entry.address }}</q-item-label>
                <q-item-label caption>{{ $t("strings.blockHeight") }}: {{ entry.height }}</q-item-label>
              </q-item-label>
            </q-item>

            <template v-if="daemon.bans.length">
              <q-list-header>{{ $t("strings.bannedPeers.title") }}</q-list-header>
              <q-item v-for="entry in daemon.bans" :key="entry.host">
                <q-item-label>
                  <q-item-label header>{{ entry.host }}</q-item-label>
                  <q-item-label caption>
                    {{
                      $t("strings.bannedPeers.bannedUntil", {
                        time: new Date(Date.now() + entry.seconds * 1000).toLocaleString()
                      })
                    }}
                  </q-item-label>
                </q-item-label>
              </q-item>
            </template>
          </q-list>
        </div>

        <div v-if="page === 'language'">
          <LanguageSelect />
        </div>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
import { mapState } from "vuex";
import SettingsGeneral from "components/settings_general";
import LanguageSelect from "components/language_select";

export default {
  name: "SettingsModal",
  components: {
    LanguageSelect,
    SettingsGeneral
  },
  data() {
    return {
      page: "general",
      isVisible: false
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    daemon: state => state.gateway.daemon,
    pending_config: state => state.gateway.app.pending_config,
    config: state => state.gateway.app.config,
    tabs: function(state) {
      const { app, daemons } = state.gateway.app.config;
      let tabs = [
        {
          label: this.$t("titles.settings.tabs.general"),
          value: "general",
          icon: "settings"
        },
        {
          label: this.$t("titles.settings.tabs.language"),
          value: "language",
          icon: "language"
        }
      ];
      if (daemons[app.net_type].type != "remote") {
        tabs.push({
          label: this.$t("titles.settings.tabs.peers"),
          value: "peers",
          icon: "cloud_queue"
        });
      }
      return tabs;
    }
  }),
  watch: {
    isVisible: function() {
      if (this.isVisible == false) {
        this.$store.dispatch("gateway/resetPendingConfig");
      }
    }
  },
  methods: {
    save() {
      this.$gateway.send("core", "save_config", this.pending_config);
      this.isVisible = false;
    },
    showPeerDetails(entry) {
      this.$q
        .dialog({
          title: this.$t("dialog.banPeer.peerDetailsTitle"),
          message: JSON.stringify(entry, null, 2),
          ok: {
            label: this.$t("dialog.banPeer.ok"),
            color: "negative"
          },
          cancel: {
            flat: true,
            label: "Close",
            color: this.theme == "dark" ? "white" : "dark"
          }
        })
        .onOk(() => {
          this.$q
            .dialog({
              title: this.$t("dialog.banPeer.title"),
              message: this.$t("dialog.banPeer.message"),
              prompt: {
                model: "",
                type: "number"
              },
              ok: {
                label: this.$t("dialog.banPeer.ok"),
                color: "negative"
              },
              cancel: {
                flat: true,
                label: this.$t("dialog.buttons.cancel"),
                color: this.theme == "dark" ? "white" : "dark"
              }
            })
            .onOk(seconds => {
              this.$gateway.send("daemon", "ban_peer", {
                host: entry.host,
                seconds
              });
            })
            .onCancel(() => {})
            .onDismiss(() => null);
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    }
  }
};
</script>

<style lang="scss"></style>
