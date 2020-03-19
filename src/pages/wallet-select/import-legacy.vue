<template>
  <q-page>
    <div class="q-mx-md">
      <template v-if="wallets_legacy.length == 2">
        <q-field>
          <div class="row gutter-md">
            <div>
              <q-radio v-model="legacy_type" val="0" label="Full wallet" />
            </div>
            <div>
              <q-radio v-model="legacy_type" val="1" label="LITE wallet" />
            </div>
          </div>
        </q-field>
      </template>

      <q-field class="q-mt-none">
        <q-input
          v-model="wallet.name"
          float-label="New wallet name"
          :error="$v.wallet.name.$error"
          :dark="theme == 'dark'"
          @blur="$v.wallet.name.$touch"
        />
      </q-field>

      <q-field>
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="wallet_path" stack-label="Wallet file" disable :dark="theme == 'dark'" />
          </div>
        </div>
      </q-field>

      <q-field>
        <q-input v-model="wallet.password" type="password" float-label="Password" :dark="theme == 'dark'" />
      </q-field>

      <q-field>
        <q-input
          v-model="wallet.password_confirm"
          type="password"
          float-label="Confirm Password"
          :dark="theme == 'dark'"
        />
      </q-field>

      <q-field>
        <q-btn color="primary" label="Import wallet" @click="import_wallet" />
      </q-field>
    </div>
  </q-page>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";
export default {
  data() {
    return {
      wallet: {
        name: "",
        path: "",
        password: "",
        password_confirm: ""
      },
      legacy_type: "0"
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    status: state => state.gateway.wallet.status,
    wallets_legacy: state => state.gateway.wallets.legacy,
    wallet_path(state) {
      return state.gateway.wallets.legacy[this.legacy_type].path;
    }
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
      name: { required }
    }
  },
  methods: {
    import_wallet() {
      this.$v.wallet.$touch();

      if (this.$v.wallet.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.enterWalletName")
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

      this.wallet.path = this.wallet_path;

      this.$gateway.send("wallet", "import_wallet", this.wallet);
    },
    cancel() {
      this.$router.replace({ path: "/wallet-select" });
    }
  }
};
</script>

<style></style>
