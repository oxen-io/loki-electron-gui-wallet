<template>
  <q-page class="send">
    <template v-if="view_only">
      <div class="q-pa-md">
        {{ $t("strings.viewOnlyMode") }}
      </div>
    </template>
    <template v-else>
      <div class="q-pa-md">
        <div class="row gutter-md">
          <!-- Amount -->
          <div class="col-6 amount">
            <LokiField :label="$t('fieldLabels.amount')" :error="$v.newTx.amount.$error">
              <q-input
                v-model="newTx.amount"
                :dark="theme == 'dark'"
                type="number"
                min="0"
                :max="unlocked_balance / 1e9"
                placeholder="0"
                borderless
                dense
                @blur="$v.newTx.amount.$touch"
              />
              <q-btn
                color="secondary"
                :text-color="theme == 'dark' ? 'white' : 'dark'"
                @click="newTx.amount = unlocked_balance / 1e9"
              >
                {{ $t("buttons.all") }}
              </q-btn>
            </LokiField>
          </div>

          <!-- Priority -->
          <div class="col-6 priority">
            <LokiField :label="$t('fieldLabels.priority')">
              <q-select v-model="newTx.priority" :dark="theme == 'dark'" :options="priorityOptions" borderless dense />
            </LokiField>
          </div>
        </div>

        <!-- Address -->
        <div class="col q-mt-sm">
          <LokiField :label="$t('fieldLabels.address')" :error="$v.newTx.address.$error">
            <q-input
              v-model.trim="newTx.address"
              :dark="theme == 'dark'"
              :placeholder="address_placeholder"
              borderless
              dense
              @blur="$v.newTx.address.$touch"
            />
            <q-btn color="secondary" :text-color="theme == 'dark' ? 'white' : 'dark'" to="addressbook">
              {{ $t("buttons.contacts") }}
            </q-btn>
          </LokiField>
        </div>

        <!-- Payment ID -->
        <div class="col q-mt-sm">
          <LokiField :label="$t('fieldLabels.paymentId')" :error="$v.newTx.payment_id.$error" optional>
            <q-input
              v-model.trim="newTx.payment_id"
              :dark="theme == 'dark'"
              :placeholder="
                $t('placeholders.hexCharacters', {
                  count: '16 or 64'
                })
              "
              borderless
              dense
              @blur="$v.newTx.payment_id.$touch"
            />
          </LokiField>
        </div>

        <!-- Notes -->
        <div class="col q-mt-sm">
          <LokiField :label="$t('fieldLabels.notes')" optional>
            <q-input
              v-model="newTx.note"
              class="full-width text-area-loki"
              type="textarea"
              :dark="theme == 'dark'"
              :placeholder="$t('placeholders.transactionNotes')"
              borderless
              dense
            />
          </LokiField>
        </div>

        <q-checkbox
          v-model="newTx.address_book.save"
          :label="$t('strings.saveToAddressBook')"
          :dark="theme == 'dark'"
          color="dark"
        />
        <div v-if="newTx.address_book.save">
          <LokiField :label="$t('fieldLabels.name')" optional>
            <q-input
              v-model="newTx.address_book.name"
              :dark="theme == 'dark'"
              :placeholder="$t('placeholders.addressBookName')"
              borderless
              dense
            />
          </LokiField>
          <LokiField class="q-mt-sm" :label="$t('fieldLabels.notes')" optional>
            <q-input
              v-model="newTx.address_book.description"
              type="textarea"
              class="full-width text-area-loki"
              rows="2"
              :dark="theme == 'dark'"
              :placeholder="$t('placeholders.additionalNotes')"
              borderless
              dense
            />
          </LokiField>
        </div>
        <!-- div required so button below checkbox -->
        <div>
          <q-btn
            class="send-btn"
            :disable="!is_able_to_send"
            color="primary"
            :label="$t('buttons.send')"
            @click="send()"
          />
        </div>
      </div>

      <q-inner-loading :showing="tx_status.sending" :dark="theme == 'dark'">
        <q-spinner color="primary" size="30" />
      </q-inner-loading>
    </template>
  </q-page>
</template>

<script>
import { mapState } from "vuex";
import { required, decimal } from "vuelidate/lib/validators";
import { payment_id, address, greater_than_zero } from "src/validators/common";
import LokiField from "components/loki_field";
import WalletPassword from "src/mixins/wallet_password";
const objectAssignDeep = require("object-assign-deep");

export default {
  components: {
    LokiField
  },
  mixins: [WalletPassword],
  data() {
    let priorityOptions = [
      { label: this.$t("strings.priorityOptions.blink"), value: 5 }, // Blink
      { label: this.$t("strings.priorityOptions.slow"), value: 1 } // Slow
    ];
    return {
      newTx: {
        amount: 0,
        address: "",
        payment_id: "",
        priority: priorityOptions[0],
        address_book: {
          save: false,
          name: "",
          description: ""
        }
      },
      priorityOptions: priorityOptions
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    view_only: state => state.gateway.wallet.info.view_only,
    unlocked_balance: state => state.gateway.wallet.info.unlocked_balance,
    tx_status: state => state.gateway.tx_status,
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    is_able_to_send() {
      return this.$store.getters["gateway/isAbleToSend"];
    },
    address_placeholder(state) {
      const wallet = state.gateway.wallet.info;
      const prefix = (wallet && wallet.address && wallet.address[0]) || "L";
      return `${prefix}..`;
    }
  }),
  validations: {
    newTx: {
      amount: {
        required,
        decimal,
        greater_than_zero
      },
      address: {
        required,
        isAddress(value) {
          if (value === "") return true;

          return new Promise(resolve => {
            address(value, this.$gateway)
              .then(() => resolve(true))
              .catch(() => resolve(false));
          });
        }
      },
      payment_id: { payment_id }
    }
  },
  watch: {
    tx_status: {
      handler(val, old) {
        if (val.code == old.code) return;
        const { code, message } = val;
        switch (code) {
          case 0:
            this.$q.notify({
              type: "positive",
              timeout: 1000,
              message
            });
            this.$v.$reset();
            this.newTx = {
              amount: 0,
              address: "",
              payment_id: "",
              priority: 0,
              address_book: {
                save: false,
                name: "",
                description: ""
              },
              note: ""
            };
            break;
          case -1:
            this.$q.notify({
              type: "negative",
              timeout: 3000,
              message
            });
            break;
        }
      },
      deep: true
    },
    $route(to) {
      if (to.path == "/wallet/send" && to.query.hasOwnProperty("address")) {
        this.autoFill(to.query);
      }
    }
  },
  mounted() {
    if (this.$route.path == "/wallet/send" && this.$route.query.hasOwnProperty("address")) {
      this.autoFill(this.$route.query);
    }
  },
  methods: {
    autoFill: function(info) {
      this.newTx.address = info.address;
      this.newTx.payment_id = info.payment_id;
    },

    async send() {
      this.$v.newTx.$touch();

      if (this.newTx.amount < 0) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.negativeAmount")
        });
        return;
      } else if (this.newTx.amount == 0) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.zeroAmount")
        });
        return;
      } else if (this.newTx.amount > this.unlocked_balance / 1e9) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.notEnoughBalance")
        });
        return;
      } else if (this.$v.newTx.amount.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidAmount")
        });
        return;
      }

      if (this.$v.newTx.address.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidAddress")
        });
        return;
      }

      if (this.$v.newTx.payment_id.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidPaymentId")
        });
        return;
      }

      let passwordDialog = await this.showPasswordConfirmation({
        title: this.$t("dialog.transfer.title"),
        noPasswordMessage: this.$t("dialog.transfer.message"),
        ok: {
          label: this.$t("dialog.transfer.ok"),
          color: "primary"
        },
        dark: this.theme == "dark",
        color: this.theme == "dark" ? "white" : "dark"
      });
      passwordDialog
        .onOk(password => {
          password = password || "";
          this.$store.commit("gateway/set_tx_status", {
            code: 1,
            message: "Sending transaction",
            sending: true
          });
          const newTx = objectAssignDeep.noMutate(this.newTx, {
            password
          });
          this.$gateway.send("wallet", "transfer", newTx);
        })
        .onDismiss(() => {})
        .onCancel(() => {});
    }
  }
};
</script>

<style lang="scss">
.send {
  .send-btn {
    margin-top: 6px;
    width: 200px;
  }
}

.amount {
  padding-right: 10px;
}

.priority {
  padding-left: 10px;
}
</style>
