<template>
  <q-page>
    <div class="q-mx-md">
      <LokiField class="q-mt-md" :label="$t('fieldLabels.walletName')" :error="$v.wallet.name.$error">
        <q-input
          v-model="wallet.name"
          :placeholder="$t('placeholders.walletName')"
          :dark="theme == 'dark'"
          borderless
          dense
          @keyup.enter="restore_wallet"
          @blur="$v.wallet.name.$touch"
        />
      </LokiField>

      <LokiField class="q-mt-md" :label="$t('fieldLabels.mnemonicSeed')" :error="$v.wallet.seed.$error">
        <q-input
          v-model="wallet.seed"
          class="full-width text-area-loki"
          :placeholder="$t('placeholders.mnemonicSeed')"
          type="textarea"
          :dark="theme == 'dark'"
          borderless
          dense
          @blur="$v.wallet.seed.$touch"
        />
      </LokiField>

      <div class="row items-end q-mt-md">
        <div class="col-md-9 col-sm-8">
          <LokiField v-if="wallet.refresh_type == 'date'" :label="$t('fieldLabels.restoreFromDate')">
            <q-input v-model="wallet.refresh_start_date" mask="date" borderless dense>
              <template v-slot:append>
                <q-icon v-if="wallet.refresh_type == 'date'" name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="wallet.refresh_start_date" :dark="theme == 'dark'" :options="dateRangeOptions">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </LokiField>
          <LokiField
            v-else-if="wallet.refresh_type == 'height'"
            :label="$t('fieldLabels.restoreFromBlockHeight')"
            :error="$v.wallet.refresh_start_height.$error"
          >
            <q-input
              v-model="wallet.refresh_start_height"
              type="number"
              min="0"
              :dark="theme == 'dark'"
              borderless
              dense
              @blur="$v.wallet.refresh_start_height.$touch"
            />
          </LokiField>
        </div>
        <div class="col-sm-4 col-md-3">
          <template v-if="wallet.refresh_type == 'date'">
            <q-btn
              class="restore-from-button"
              :text-color="theme == 'dark' ? 'white' : 'dark'"
              flat
              @click="wallet.refresh_type = 'height'"
            >
              <div class="column justify-center items-center">
                <q-icon name="clear_all" />
                {{ $t("strings.switchToHeightSelect") }}
              </div>
            </q-btn>
          </template>
          <template v-else-if="wallet.refresh_type == 'height'">
            <q-btn
              class="restore-from-button"
              :text-color="theme == 'dark' ? 'white' : 'dark'"
              flat
              @click="wallet.refresh_type = 'date'"
            >
              <div class="column justify-center items-center">
                <q-icon name="today" />
                {{ $t("strings.switchToDateSelect") }}
              </div>
            </q-btn>
          </template>
        </div>
      </div>

      <LokiField class="q-mt-md" :label="$t('fieldLabels.password')">
        <q-input
          v-model="wallet.password"
          :placeholder="$t('placeholders.walletPassword')"
          type="password"
          :dark="theme == 'dark'"
          borderless
          dense
          @keyup.enter="restore_wallet"
        />
      </LokiField>

      <LokiField class="q-mt-md" :label="$t('fieldLabels.confirmPassword')">
        <q-input
          v-model="wallet.password_confirm"
          type="password"
          :dark="theme == 'dark'"
          borderless
          dense
          @keyup.enter="restore_wallet"
        />
      </LokiField>
      <q-btn class="submit-button" color="primary" :label="$t('buttons.restoreWallet')" @click="restore_wallet" />
    </div>
  </q-page>
</template>

<script>
import { required, numeric } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import LokiField from "components/loki_field";
import { date } from "quasar";

const timeStampFirstBlock = 1525305600000;
const qDateFormat = "YYYY/MM/DD";
let dateFirstBlock = date.formatDate(timeStampFirstBlock, qDateFormat);

export default {
  components: {
    LokiField
  },
  data() {
    return {
      wallet: {
        name: "",
        seed: "",
        refresh_type: "date",
        refresh_start_height: 0,
        refresh_start_date: dateFirstBlock, // timestamp of block 1
        password: "",
        password_confirm: ""
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    status: state => state.gateway.wallet.status
  }),
  watch: {
    status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case 1:
            break;
          case 0:
            this.$q.loading.hide();
            this.$router.replace({
              path: "/wallet-select/created"
            });
            break;
          default:
            this.$q.loading.hide();
            this.$q.notify({
              type: "negative",
              timeout: 1000,
              message
            });
            break;
        }
      },
      deep: true
    }
  },
  validations: {
    wallet: {
      name: { required },
      seed: { required },
      refresh_start_height: { numeric }
    }
  },
  methods: {
    restore_wallet() {
      this.$v.wallet.$touch();

      if (this.$v.wallet.name.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterWalletName")
        });
        return;
      }
      if (this.$v.wallet.seed.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterSeedWords")
        });
        return;
      }

      let seed = this.wallet.seed
        .trim()
        .replace(/\n/g, " ")
        .replace(/\t/g, " ")
        .replace(/\s{2,}/g, " ")
        .split(" ");
      if (seed.length !== 14 && seed.length !== 24 && seed.length !== 25 && seed.length !== 26) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidSeedLength")
        });
        return;
      }

      if (this.$v.wallet.refresh_start_height.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidRestoreHeight")
        });
        return;
      }
      if (this.wallet.password != this.wallet.password_confirm) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.passwordNoMatch")
        });
        return;
      }

      this.$q.loading.show({
        delay: 0
      });

      this.$gateway.send("wallet", "restore_wallet", this.wallet);
    },
    // Ensures the date is valid
    dateRangeOptions(dateSelected) {
      const now = Date.now();
      const formattedNow = date.formatDate(now, qDateFormat);
      return dateSelected > timeStampFirstBlock && dateSelected <= formattedNow;
    },
    cancel() {
      this.$router.replace({ path: "/wallet-select" });
    }
  }
};
</script>

<style>
.restore-from-button {
  width: 100%;
  height: 54px;
}
</style>
