<template>
  <div class="settings-general">
    <div class="row justify-between q-mb-md">
      <div>
        <q-radio v-model="config_daemon.type" val="remote" :label="$t('strings.daemon.remote.title')" />
      </div>
      <div>
        <q-radio v-model="config_daemon.type" val="local_remote" :label="$t('strings.daemon.localRemote.title')" />
      </div>
      <div>
        <q-radio v-model="config_daemon.type" val="local" :label="$t('strings.daemon.local.title')" />
      </div>
    </div>

    <p v-if="config_daemon.type == 'local_remote'">
      {{ $t("strings.daemon.localRemote.description") }}
    </p>
    <p v-if="config_daemon.type == 'local'">
      {{ $t("strings.daemon.local.description") }}
    </p>
    <p v-if="is_remote">
      {{ $t("strings.daemon.remote.description") }}
    </p>

    <template v-if="config_daemon.type != 'remote'">
      <div class="row pl-sm">
        <LokiField class="col-8" :label="$t('fieldLabels.localDaemonIP')" disable>
          <q-input
            v-model="config_daemon.rpc_bind_ip"
            :placeholder="daemon_defaults.rpc_bind_ip"
            :dark="theme == 'dark'"
            disable
            borderless
            dense
          />
        </LokiField>
        <LokiField class="col-4" :label="$t('fieldLabels.localDaemonPort') + '(RPC)'">
          <q-input
            v-model="config_daemon.rpc_bind_port"
            :placeholder="toString(daemon_defaults.rpc_bind_port)"
            type="number"
            :decimals="0"
            :step="1"
            min="1024"
            max="65535"
            :dark="theme == 'dark'"
            borderless
            dense
          />
        </LokiField>
      </div>
    </template>

    <template v-if="config_daemon.type != 'local'">
      <div class="row q-mt-md pl-sm">
        <LokiField class="col-8" :label="$t('fieldLabels.remoteNodeHost')">
          <q-input
            v-model="config_daemon.remote_host"
            :placeholder="daemon_defaults.remote_host"
            :dark="theme == 'dark'"
            borderless
            dense
          />
          <!-- Remote node presets -->
          <q-btn-dropdown v-if="config.app.net_type === 'mainnet'" class="remote-dropdown" flat>
            <q-list link dark no-border>
              <q-item v-for="option in remotes" :key="option.host" v-close-popup @click.native="setPreset(option)">
                <q-item-label>
                  <q-item-label header>{{ option.host }}:{{ option.port }}</q-item-label>
                </q-item-label>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </LokiField>
        <LokiField class="col-4" :label="$t('fieldLabels.remoteNodePort')">
          <q-input
            v-model="config_daemon.remote_port"
            :placeholder="toString(daemon_defaults.remote_port)"
            type="number"
            :decimals="0"
            :step="1"
            min="1024"
            max="65535"
            :dark="theme == 'dark'"
            borderless
            dense
          />
        </LokiField>
      </div>
    </template>

    <div class="col q-mt-md pt-sm">
      <LokiField :label="$t('fieldLabels.dataStoragePath')" disable-hover>
        <q-input v-model="config.app.data_dir" disable :dark="theme == 'dark'" borderless dense />
        <input id="dataPath" ref="fileInputData" type="file" webkitdirectory directory hidden @change="setDataPath" />
        <q-btn color="secondary" :text-color="theme == 'dark' ? 'white' : 'dark'" @click="selectPath('data')">{{
          $t("buttons.selectLocation")
        }}</q-btn>
      </LokiField>
      <LokiField :label="$t('fieldLabels.walletStoragePath')" disable-hover>
        <q-input v-model="config.app.wallet_data_dir" disable :dark="theme == 'dark'" borderless dense />
        <input
          id="walletPath"
          ref="fileInputWallet"
          type="file"
          webkitdirectory
          directory
          hidden
          @change="setWalletDataPath"
        />
        <q-btn color="secondary" :text-color="theme == 'dark' ? 'white' : 'dark'" @click="selectPath('wallet')">{{
          $t("buttons.selectLocation")
        }}</q-btn>
      </LokiField>
    </div>

    <q-expansion-item
      :label="$t('strings.advancedOptions')"
      header-class="q-mt-sm non-selectable row reverse advanced-options-label"
    >
      <div class="row pl-sm q-mt-sm">
        <LokiField class="col-6" :label="$t('fieldLabels.daemonLogLevel')" :disable="is_remote">
          <q-input
            v-model="config_daemon.log_level"
            :placeholder="toString(daemon_defaults.log_level)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            type="number"
            :decimals="0"
            :step="1"
            min="0"
            max="4"
            borderless
            dense
          />
        </LokiField>
        <LokiField class="col-6" :label="$t('fieldLabels.walletLogLevel')">
          <q-input
            v-model="config.wallet.log_level"
            :placeholder="toString(defaults.wallet.log_level)"
            :dark="theme == 'dark'"
            type="number"
            :decimals="0"
            :step="1"
            min="0"
            max="4"
            borderless
            dense
          />
        </LokiField>
      </div>

      <div class="row pl-sm q-mt-md">
        <!-- TODO: Can be generalised to a "port" (or similar) field -->
        <LokiField class="col-3" :label="$t('fieldLabels.maxIncomingPeers')" :disable="is_remote">
          <q-input
            v-model="config_daemon.in_peers"
            :placeholder="toString(daemon_defaults.in_peers)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            type="number"
            :decimals="0"
            :step="1"
            min="-1"
            max="65535"
            borderless
            dense
          />
        </LokiField>
        <LokiField class="col-3" :label="$t('fieldLabels.maxOutgoingPeers')" :disable="is_remote">
          <q-input
            v-model="config_daemon.out_peers"
            :placeholder="toString(daemon_defaults.out_peers)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            type="number"
            :decimals="0"
            :step="1"
            min="-1"
            max="65535"
            borderless
            dense
          />
        </LokiField>
        <LokiField class="col-3" :label="$t('fieldLabels.limitUploadRate')" :disable="is_remote">
          <q-input
            v-model="config_daemon.limit_rate_up"
            :placeholder="toString(daemon_defaults.limit_rate_up)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            type="number"
            suffix="Kb/s"
            :decimals="0"
            :step="1"
            min="-1"
            max="65535"
            borderless
            dense
          />
        </LokiField>
        <LokiField class="col-3" :label="$t('fieldLabels.limitDownloadRate')" :disable="is_remote">
          <q-input
            v-model="config_daemon.limit_rate_down"
            :placeholder="toString(daemon_defaults.limit_rate_down)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            type="number"
            suffix="Kb/s"
            :decimals="0"
            :step="1"
            min="-1"
            max="65535"
            borderless
            dense
          />
        </LokiField>
      </div>
      <div class="row pl-sm q-mt-md">
        <LokiField class="col-3" :label="$t('fieldLabels.daemonP2pPort')" :disable="is_remote">
          <q-input
            v-model="config_daemon.p2p_bind_port"
            :placeholder="toString(daemon_defaults.p2p_bind_port)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            float-
            type="number"
            :decimals="0"
            :step="1"
            min="1024"
            max="65535"
            borderless
            dense
          />
        </LokiField>
        <LokiField class="col-3" :label="$t('fieldLabels.daemonZMQPort')" :disable="is_remote">
          <q-input
            v-model="config_daemon.zmq_rpc_bind_port"
            :placeholder="toString(daemon_defaults.zmq_rpc_bind_port)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            float-
            type="number"
            :decimals="0"
            :step="1"
            min="1024"
            max="65535"
            borderless
            dense
          />
        </LokiField>
        <LokiField class="col-3" :label="$t('fieldLabels.internalWalletPort')">
          <q-input
            v-model="config.app.ws_bind_port"
            :placeholder="toString(defaults.app.ws_bind_port)"
            :dark="theme == 'dark'"
            float-
            type="number"
            :decimals="0"
            :step="1"
            min="1024"
            max="65535"
            borderless
            dense
          />
        </LokiField>
        <LokiField class="col-3" :label="$t('fieldLabels.walletRPCPort')" :disable="is_remote">
          <q-input
            v-model="config.wallet.rpc_bind_port"
            :placeholder="toString(defaults.wallet.rpc_bind_port)"
            :disable="is_remote"
            :dark="theme == 'dark'"
            float-
            type="number"
            :decimals="0"
            :step="1"
            min="1024"
            max="65535"
            borderless
            dense
          />
        </LokiField>
      </div>
      <LokiField
        :helper="$t('fieldLabels.chooseNetwork')"
        :label="$t('fieldLabels.network')"
        class="network-group-field"
      >
        <q-option-group
          v-model="config.app.net_type"
          type="radio"
          :options="[
            { label: 'Main Net', value: 'mainnet' },
            { label: 'Stage Net', value: 'stagenet' },
            { label: 'Test Net', value: 'testnet' }
          ]"
        />
      </LokiField>
    </q-expansion-item>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LokiField from "components/loki_field";
export default {
  name: "SettingsGeneral",
  components: {
    LokiField
  },
  props: {
    randomiseRemote: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      select: 0
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    remotes: state => state.gateway.app.remotes,
    config: state => state.gateway.app.pending_config,
    config_daemon() {
      return this.config.daemons[this.config.app.net_type];
    },
    is_remote() {
      return this.config_daemon.type === "remote";
    },
    defaults: state => state.gateway.app.defaults,
    daemon_defaults() {
      return this.defaults.daemons[this.config.app.net_type];
    }
  }),
  mounted() {
    if (this.randomise_remote && this.remotes.length > 0 && this.config.app.net_type === "mainnet") {
      const index = Math.floor(Math.random() * Math.floor(this.remotes.length));
      this.setPreset(this.remotes[index]);
    }
  },
  methods: {
    selectPath(type) {
      const fileInput = type === "data" ? "fileInputData" : "fileInputWallet";
      this.$refs[fileInput].click();
    },
    setDataPath(file) {
      if (file.target.files && file.target.files.length > 0) {
        this.config.app.data_dir = file.target.files[0].path;
      }
    },
    setWalletDataPath(file) {
      if (file.target.files && file.target.files.length > 0) {
        this.config.app.wallet_data_dir = file.target.files[0].path;
      }
    },
    setPreset(option) {
      if (!option) return;

      const { host, port } = option;
      if (host) this.config_daemon.remote_host = host;
      if (port) this.config_daemon.remote_port = port;
    },
    toString(value) {
      if (!value && typeof value !== "number") return "";
      return String(value);
    }
  }
};
</script>

<style lang="scss">
.settings-general {
  .q-field {
    margin: 20px 0;
  }

  .q-if-disabled {
    cursor: default !important;
    .q-input-target {
      cursor: default !important;
    }
  }

  .network-group-field {
    color: white;
    display: inline-block;
  }

  .q-item,
  .q-collapsible-sub-item {
    padding: 0;
  }

  .row.pl-sm {
    > * + * {
      padding-left: 16px;
    }
  }

  .col.pt-sm {
    > * + * {
      padding-top: 16px;
    }
  }

  .remote-dropdown {
    padding: 0 !important;
  }
}
</style>
