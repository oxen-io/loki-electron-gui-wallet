<template>
  <q-page class="welcome">
    <q-stepper ref="stepper" v-model="step" class="welcome-stepper" flat dark>
      <q-step :name="1" :title="$t('titles.welcome')" :done="step > 1" class="first-step">
        <div class="welcome-container">
          <img src="loki.svg" height="100" class="q-mb-md" />
          <div>Wallet Version: v{{ version }}</div>
          <div>Daemon Version: {{ daemonVersion }}</div>
          <LanguageSelect class="q-mt-lg" @select="onLanguageSelected" />
        </div>
      </q-step>

      <q-step :name="2" :title="$t('titles.configure')">
        <SettingsGeneral ref="settingsGeneral" randomise_remote />
      </q-step>
    </q-stepper>

    <q-footer v-if="!(step === 1)" class="no-shadow q-pa-sm">
      <div class="row justify-end">
        <div>
          <q-btn flat :label="$t('buttons.back')" @click="clickPrev()" />
        </div>
        <div>
          <q-btn class="q-ml-sm" color="primary" :label="$t('buttons.next')" @click="clickNext()" />
        </div>
      </div>
    </q-footer>
  </q-page>
</template>

<script>
import { version } from "../../../package.json";
import { mapState } from "vuex";
import LanguageSelect from "components/language_select";
import SettingsGeneral from "components/settings_general";

export default {
  components: {
    LanguageSelect,
    SettingsGeneral
  },
  data() {
    return {
      step: 1,
      version: ""
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    pending_config: state => state.gateway.app.pending_config,
    config_daemon() {
      return this.pending_config.daemons[this.pending_config.app.net_type];
    },
    daemon: state => state.gateway.daemon,

    // to be fixed
    daemonVersion() {
      const dVersion = this.daemon.info.version;
      return dVersion ? "v" + dVersion : "N/A";
    }
  }),
  mounted() {
    this.version = version;

    // set add status back to 2
    this.$store.commit("gateway/set_app_data", {
      status: {
        code: 2 // Loading config
      }
    });
  },
  methods: {
    clickNext() {
      // if the last step i s active, then we want to initialise the config
      if (this.step === 2) {
        this.$gateway.send("core", "save_config_init", this.pending_config);
        this.$router.replace({ path: "/" });
      } else {
        this.$refs.stepper.next();
      }
    },
    clickPrev() {
      this.$refs.stepper.previous();
    },
    onLanguageSelected() {
      this.clickNext();
    }
  }
};
</script>

<style lang="scss">
.welcome {
  height: 100vh;

  .welcome-stepper {
    height: 100%;
    // the Loki lighter grey is behind it
    background: transparent;
  }

  .welcome-container {
    padding-top: 14vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .first-step .q-stepper-step-inner {
    min-height: 250px;
    height: calc(100vh - 102px);
  }
}

.language-item {
  padding: 10px 30px 10px 20px;
  border: 1px solid #ccc;
  cursor: pointer;

  .language-item-circle {
    background: #cc90e2;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    display: inline-block;
    line-height: 50px;
    text-align: center;
    color: white;
    margin-right: 10px;
  }
}

.q-stepper-header {
  min-height: 10vh;
}
</style>
