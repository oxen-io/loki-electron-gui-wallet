<template>
  <q-page>
    <div class="init-screen-page text-center">
      <div class="absolute-center">
        <img src="loki.svg" width="400" class="q-mb-md" />

        <div class="startup-icons q-mt-xl q-mb-lg">
          <div ref="backend">
            <svg
              width="64"
              viewBox="0 0 17 16"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              class="si-glyph si-glyph-link-3"
            >
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <path
                  d="M16.969,2 C16.969,0.896 16.075,0 14.973,0 C13.871,0 13.014,0.896 13.014,2 C13.014,2.723 13.422,3.332 14,3.683 L14,7.021 L10.688,7.021 C10.345,6.42 9.722,6 8.982,6 C8.241,6 7.618,6.42 7.274,7.021 L3,7.021 C2.447,7.021 2,7.468 2,8.021 L2,12.29 C1.412,12.643 0.994,13.271 0.994,14.001 C0.994,15.105 1.889,16.001 2.99,16.001 C4.093,16.001 4.988,15.105 4.988,14.001 C4.988,13.282 4.576,12.675 4,12.323 L4,8.938 L7.252,8.938 C7.59,9.562 8.225,10 8.982,10 C9.739,10 10.373,9.562 10.711,8.938 L15,8.938 C15.553,8.938 16,8.491 16,7.938 L16,3.684 C16.574,3.333 16.969,2.723 16.969,2 L16.969,2 Z"
                  fill="#434343"
                  class="si-glyph-fill"
                ></path>
              </g>
            </svg>
          </div>
          <div ref="settings">
            <svg
              width="64"
              viewBox="0 0 17 17"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              class="si-glyph si-glyph-gear-1"
            >
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(1.000000, 1.000000)" fill="#434343">
                  <path
                    d="M7.887,9.025 C7.799,8.449 7.569,7.92 7.229,7.475 L7.995,6.71 L7.307,6.023 L6.536,6.794 C6.093,6.467 5.566,6.245 4.994,6.161 L4.994,5.066 L4.021,5.066 L4.021,6.155 C3.444,6.232 2.913,6.452 2.461,6.777 L1.709,6.024 L1.021,6.712 L1.761,7.452 C1.411,7.901 1.175,8.437 1.087,9.024 L0.062,9.024 L0.062,9.025 L0.062,9.998 L1.08,9.998 C1.162,10.589 1.396,11.132 1.744,11.587 L1.02,12.31 L1.708,12.997 L2.437,12.268 C2.892,12.604 3.432,12.83 4.02,12.91 L4.02,13.958 L4.993,13.958 L4.993,12.904 C5.576,12.818 6.11,12.589 6.56,12.252 L7.306,12.999 L7.994,12.311 L7.248,11.564 C7.586,11.115 7.812,10.581 7.893,10 L8.952,10 L8.952,9.998 L8.952,9.026 L7.887,9.026 L7.887,9.025 Z M4.496,11.295 C3.512,11.295 2.715,10.497 2.715,9.512 C2.715,8.528 3.512,7.73 4.496,7.73 C5.481,7.73 6.28,8.528 6.28,9.512 C6.28,10.497 5.481,11.295 4.496,11.295 L4.496,11.295 Z"
                    class="si-glyph-fill"
                  ></path>
                  <path
                    d="M13.031,3.37 L14.121,3.089 L13.869,2.11 L12.778,2.392 C12.66,2.152 12.513,1.922 12.317,1.72 C12.125,1.524 11.902,1.376 11.67,1.256 L11.971,0.177 L10.998,-0.094 L10.699,0.978 C10.158,0.935 9.608,1.056 9.133,1.36 L8.373,0.584 L7.652,1.291 L8.408,2.061 C8.082,2.531 7.939,3.085 7.967,3.636 L6.927,3.904 L7.179,4.881 L8.217,4.613 C8.334,4.856 8.483,5.088 8.682,5.291 C8.885,5.499 9.121,5.653 9.368,5.776 L9.079,6.815 L10.05,7.086 L10.343,6.038 C10.885,6.071 11.435,5.938 11.906,5.623 L12.677,6.409 L13.397,5.702 L12.621,4.911 C12.928,4.446 13.06,3.905 13.031,3.37 L13.031,3.37 Z M10.514,4.987 C9.691,4.987 9.023,4.318 9.023,3.494 C9.023,2.672 9.691,2.005 10.514,2.005 C11.336,2.005 12.004,2.672 12.004,3.494 C12.004,4.318 11.336,4.987 10.514,4.987 L10.514,4.987 Z"
                    class="si-glyph-fill"
                  ></path>
                </g>
              </g>
            </svg>
          </div>
          <div ref="daemon">
            <svg
              width="64"
              viewBox="0 0 16 17"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              class="si-glyph si-glyph-network-2"
            >
              <defs></defs>
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(1.000000, 1.000000)" fill="#434343">
                  <path
                    d="M7.494,14.958 C3.361,14.958 0,11.622 0,7.52 C0,3.418 3.361,0.082 7.494,0.082 C11.627,0.082 14.989,3.418 14.989,7.52 C14.989,11.622 11.627,14.958 7.494,14.958 L7.494,14.958 Z M7.51,0.938 C3.887,0.938 0.938,3.886 0.938,7.51 C0.938,11.135 3.887,14.083 7.51,14.083 C11.135,14.083 14.083,11.135 14.083,7.51 C14.083,3.886 11.135,0.938 7.51,0.938 L7.51,0.938 Z"
                    class="si-glyph-fill"
                  ></path>
                  <rect x="7" y="1" width="0.922" height="14.084" class="si-glyph-fill"></rect>
                  <rect x="0" y="7" width="13.96" height="0.922" class="si-glyph-fill"></rect>
                  <rect x="1" y="4" width="12.406" height="0.906" class="si-glyph-fill"></rect>
                  <rect x="1" y="10" width="12.406" height="0.922" class="si-glyph-fill"></rect>
                  <path
                    d="M7.317,14.854 C4.72,13.581 3.043,10.662 3.043,7.417 C3.043,4.247 4.666,1.355 7.181,0.05 L7.642,0.937 C5.455,2.074 4.043,4.617 4.043,7.417 C4.043,10.282 5.502,12.849 7.757,13.955 L7.317,14.854 L7.317,14.854 Z"
                    class="si-glyph-fill"
                  ></path>
                  <path
                    d="M7.74,14.789 L7.271,13.906 C9.41,12.772 10.792,10.225 10.792,7.417 C10.792,4.642 9.433,2.107 7.332,0.96 L7.811,0.083 C10.229,1.401 11.792,4.28 11.792,7.417 C11.793,10.592 10.201,13.485 7.74,14.789 L7.74,14.789 Z"
                    class="si-glyph-fill"
                  ></path>
                </g>
              </g>
            </svg>
          </div>
          <div ref="wallet">
            <svg
              width="64"
              viewBox="0 0 17 16"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              class="si-glyph si-glyph-wallet"
            >
              <defs class="si-glyph-fill"></defs>
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(1.000000, 0.000000)" fill="#434343">
                  <path
                    d="M7.988,10.635 L7.988,8.327 C7.988,7.578 8.561,6.969 9.267,6.969 L13.964,6.969 L13.964,5.531 C13.964,4.849 13.56,4.279 13.007,4.093 L13.007,4.094 L11.356,4.08 L11.336,4.022 L3.925,4.022 L3.784,4.07 L1.17,4.068 L1.165,4.047 C0.529,4.167 0.017,4.743 0.017,5.484 L0.017,13.437 C0.017,14.269 0.665,14.992 1.408,14.992 L12.622,14.992 C13.365,14.992 13.965,14.316 13.965,13.484 L13.965,12.031 L9.268,12.031 C8.562,12.031 7.988,11.384 7.988,10.635 L7.988,10.635 Z"
                    class="si-glyph-fill"
                  ></path>
                  <path
                    d="M14.996,8.061 L14.947,8.061 L9.989,8.061 C9.46,8.061 9.031,8.529 9.031,9.106 L9.031,9.922 C9.031,10.498 9.46,10.966 9.989,10.966 L14.947,10.966 L14.996,10.966 C15.525,10.966 15.955,10.498 15.955,9.922 L15.955,9.106 C15.955,8.528 15.525,8.061 14.996,8.061 L14.996,8.061 Z M12.031,10.016 L9.969,10.016 L9.969,9 L12.031,9 L12.031,10.016 L12.031,10.016 Z"
                    class="si-glyph-fill"
                  ></path>
                  <path
                    d="M3.926,4.022 L10.557,1.753 L11.337,4.022 L12.622,4.022 C12.757,4.022 12.885,4.051 13.008,4.092 L11.619,0.051 L1.049,3.572 L1.166,4.048 C1.245,4.033 1.326,4.023 1.408,4.023 L3.926,4.023 L3.926,4.022 Z"
                    class="si-glyph-fill"
                  ></path>
                </g>
              </g>
            </svg>
          </div>
        </div>

        <div class="message">
          {{ message }}
        </div>

        <div v-if="daemonStatus" class="q-mt-xs">{{ $t("strings.syncingDaemon") }}: {{ daemonStatus }}</div>
      </div>

      <div class="absolute-bottom">
        {{ version }}
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      message: "",
      version: ""
    };
  },
  computed: mapState({
    status: state => state.gateway.app.status,
    config: state => state.gateway.app.config,
    isLocalDaemon() {
      if (!this.config || !this.config.app.net_type) return false;
      return this.config.daemons[this.config.app.net_type].type === "local";
    },
    daemon: state => state.gateway.daemon,
    daemonStatus() {
      // Check to see if config is loaded
      if (this.status.code < 3 || !this.isLocalDaemon) return null;

      const currentHeight = this.daemon.info.height_without_bootstrap;
      const targetHeight = Math.max(this.daemon.info.height, this.daemon.info.target_height);
      const percentage = ((100 * currentHeight) / targetHeight).toFixed(1);

      if (targetHeight === 0 || currentHeight >= targetHeight) return null;

      return `${currentHeight}/${targetHeight} (${percentage}%)`;
    }
  }),
  watch: {
    status: {
      handler() {
        this.updateStatus();
      },
      deep: true
    }
  },
  mounted() {
    this.updateStatus();
  },
  methods: {
    updateStatus() {
      switch (this.status.code) {
        case -1: // config not found, go to welcome screen
          this.$router.replace({ path: "welcome" });
          break;
        case 0: // start-up complete, go to wallet-select
          this.$router.replace({ path: "wallet-select" });
          break;
        case 1:
          this.message = this.$t("strings.connectingToBackend");
          this.$refs.backend.className = "pulse";
          this.$refs.settings.className = "grey";
          this.$refs.daemon.className = "grey";
          this.$refs.wallet.className = "grey";
          break;
        case 2:
          this.message = this.$t("strings.loadingSettings");
          this.$refs.backend.className = "solid";
          this.$refs.settings.className = "pulse";
          this.$refs.daemon.className = "grey";
          this.$refs.wallet.className = "grey";
          break;
        case 3:
          this.message = this.$t("strings.startingDaemon");
          this.$refs.backend.className = "solid";
          this.$refs.settings.className = "solid";
          this.$refs.daemon.className = "pulse";
          this.$refs.wallet.className = "grey";
          break;
        case 4:
          this.version = this.status.message;
          break;
        case 5:
          this.$q.notify({
            type: "warning",
            timeout: 2000,
            message: "Warning: " + this.$t("notification.warnings.usingRemoteNode")
          });
          break;
        case 6:
          this.message = this.$t("strings.startingWallet");
          this.$refs.backend.className = "solid";
          this.$refs.settings.className = "solid";
          this.$refs.daemon.className = "solid";
          this.$refs.wallet.className = "pulse";
          break;
        case 7:
          this.message = this.$t("strings.readingWalletList");
          this.$refs.backend.className = "solid";
          this.$refs.settings.className = "solid";
          this.$refs.daemon.className = "solid";
          this.$refs.wallet.className = "solid";
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.init-screen-page {
  height: 100vh;
  position: relative;
}
.startup-icons {
  & > div {
    display: inline-block;
    margin: 0 15px;
    color: #444;
    g,
    path {
      fill: #444;
    }
  }
  .pulse {
    color: #cecece;
    opacity: 0.6;
    animation: fade 2s infinite;
    g,
    path {
      fill: #cecece;
    }
  }
}

@keyframes fade {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
