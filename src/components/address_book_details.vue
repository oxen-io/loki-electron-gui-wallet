<template>
  <q-dialog v-model="isVisible" maximized class="address-book-details">
    <q-layout v-if="mode == 'edit' || mode == 'new'" container>
      <q-toolbar slot="header" color="dark" inverted>
        <q-btn flat round dense icon="reply" @click="close()" />
        <q-toolbar-title v-if="mode == 'new'">
          {{ $t("strings.addAddressBookEntry") }}
        </q-toolbar-title>
        <q-toolbar-title v-else-if="mode == 'edit'">
          {{ $t("strings.editAddressBookEntry") }}
        </q-toolbar-title>

        <q-btn v-if="mode == 'edit'" flat no-ripple :label="$t('buttons.cancel')" @click="cancelEdit()" />
        <q-btn class="q-ml-sm" color="primary" :label="$t('buttons.save')" @click="save()" />
      </q-toolbar>
      <div class="address-book-modal q-mx-md">
        <LokiField :label="$t('fieldLabels.address')" :error="$v.newEntry.address.$error">
          <q-input
            v-model.trim="newEntry.address"
            :placeholder="address_placeholder"
            :dark="theme == 'dark'"
            hide-underline
            @blur="$v.newEntry.address.$touch"
          />
          <q-checkbox
            v-model="newEntry.starred"
            checked-icon="star"
            unchecked-icon="star_border"
            class="star-entry"
            dark
          />
        </LokiField>
        <LokiField :label="$t('fieldLabels.name')">
          <q-input v-model.trim="newEntry.name" :dark="theme == 'dark'" hide-underline />
        </LokiField>
        <LokiField :label="$t('fieldLabels.paymentId')" :error="$v.newEntry.payment_id.$error" optional>
          <q-input
            v-model.trim="newEntry.payment_id"
            :placeholder="
              $t('placeholders.hexCharacters', {
                count: '16 or 64'
              })
            "
            :dark="theme == 'dark'"
            hide-underline
            @blur="$v.newEntry.payment_id.$touch"
          />
        </LokiField>
        <LokiField :label="$t('fieldLabels.notes')" optional>
          <q-input
            v-model="newEntry.description"
            :placeholder="$t('placeholders.additionalNotes')"
            type="textarea"
            :dark="theme == 'dark'"
            hide-underline
          />
        </LokiField>

        <q-field v-if="mode == 'edit'">
          <q-btn class="float-right" color="red" :label="$t('buttons.delete')" @click="deleteEntry()" />
        </q-field>
      </div>
    </q-layout>

    <q-layout v-else container>
      <q-toolbar slot="header" color="dark" inverted>
        <q-btn flat round dense icon="reply" @click="close()" />
        <q-toolbar-title>
          {{ $t("strings.addressBookDetails") }}
        </q-toolbar-title>
        <q-btn class="q-mr-sm" flat no-ripple :disable="!is_ready" :label="$t('buttons.edit')" @click="edit()" />
        <q-btn color="primary" :disabled="view_only" :label="$t('buttons.sendCoins')" @click="sendToAddress" />
      </q-toolbar>
      <div class="layout-padding">
        <template v-if="entry != null">
          <AddressHeader
            :address="entry.address"
            :title="entry.name"
            :payment_id="entry.payment_id"
            :extra="entry.description ? $t('strings.notes') + ': ' + entry.description : ''"
          />

          <div class="q-mt-lg">
            <div class="non-selectable">
              <q-icon name="history" size="24px" />
              <span class="vertical-middle q-ml-xs">{{ $t("strings.recentTransactionsWithAddress") }}</span>
            </div>

            <TxList :key="entry.address" type="all_in" :limit="5" :to-outgoing-address="entry.address" />
          </div>
        </template>
      </div>
    </q-layout>
  </q-dialog>
</template>

<script>
import { mapState } from "vuex";
import AddressHeader from "components/address_header";
import TxList from "components/tx_list";
import LokiField from "components/loki_field";
import { payment_id, address } from "src/validators/common";
import { required } from "vuelidate/lib/validators";
export default {
  name: "AddressBookDetails",
  components: {
    AddressHeader,
    TxList,
    LokiField
  },
  data() {
    return {
      isVisible: false,
      entry: null,
      mode: "view",
      newEntry: {
        index: false,
        address: "",
        payment_id: "",
        name: "",
        description: "",
        starred: false
      }
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    view_only: state => state.gateway.wallet.info.view_only,
    is_ready() {
      return this.$store.getters["gateway/isReady"];
    },
    address_placeholder(state) {
      const wallet = state.gateway.wallet.info;
      const prefix = (wallet && wallet.address && wallet.address[0]) || "L";
      return `${prefix}..`;
    }
  }),
  validations: {
    newEntry: {
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
  methods: {
    save() {
      this.$v.newEntry.$touch();

      if (this.$v.newEntry.address.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidAddress")
        });
        return;
      }

      if (this.$v.newEntry.payment_id.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 1000,
          message: this.$t("notification.errors.invalidPaymentId")
        });
        return;
      }

      this.$gateway.send("wallet", "add_address_book", this.newEntry);
      this.close();
    },
    deleteEntry() {
      this.$gateway.send("wallet", "delete_address_book", this.newEntry);
      this.close();
    },
    sendToAddress() {
      this.close();
      this.$router.replace({
        path: "send",
        query: {
          address: this.entry.address,
          payment_id: this.entry.payment_id
        }
      });
    },
    edit() {
      this.mode = "edit";
      this.newEntry = this.entry;
    },
    cancelEdit() {
      this.mode = "view";
      this.$v.$reset();
      this.newEntry = {
        index: false,
        address: "",
        payment_id: "",
        name: "",
        description: "",
        starred: false
      };
    },
    close() {
      this.isVisible = false;
      this.$v.$reset();
      this.newEntry = {
        index: false,
        address: "",
        payment_id: "",
        name: "",
        description: "",
        starred: false
      };
    }
  }
};
</script>

<style lang="scss">
.address-book-details {
  .address-book-modal {
    > .loki-field {
      margin-top: 16px;
    }

    .star-entry {
      padding: 4px;
    }
  }
}
</style>
