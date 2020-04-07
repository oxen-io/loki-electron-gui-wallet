<template>
  <div v-if="records.length > 0" class="lns-record-list">
    <div v-if="needsDecryption" class="decrypt q-pa-md row justify-between items-end">
      <LokiField :label="$t('fieldLabels.decryptRecord')" :disable="decrypting" :error="$v.name.$error">
        <q-input
          v-model.trim="name"
          :dark="theme == 'dark'"
          hide-underline
          :placeholder="$t('placeholders.lnsDecryptName')"
          :disable="decrypting"
          @blur="$v.name.$touch"
        />
      </LokiField>
      <div class="btn-wrapper q-ml-md row items-center">
        <q-btn color="primary" :label="$t('buttons.decrypt')" :loading="decrypting" @click="decrypt()" />
      </div>
    </div>
    <q-list link no-border :dark="theme == 'dark'" class="loki-list">
      <q-item v-for="record in records" :key="record.name_hash" class="loki-list-item">
        <q-item-side class="type">
          <q-icon :name="isLocked(record) ? 'lock' : 'lock_open'" size="24px" />
        </q-item-side>
        <q-item-main class="main">
          <q-item-tile label :class="bindClass(record)">
            {{ isLocked(record) ? record.name_hash : record.name }}
          </q-item-tile>
          <q-item-tile v-if="!isLocked(record)" sublabel>{{ record.value }}</q-item-tile>
        </q-item-main>
        <template v-if="isLocked(record)">
          <q-item-side right class="height">
            {{ record.register_height | blockHeight }}
          </q-item-side>
        </template>
        <template v-else>
          <q-item-side right>
            <q-btn color="secondary" :label="$t('buttons.update')" @click="onUpdate(record)" />
          </q-item-side>
        </template>

        <q-item-side v-if="!isLocked(record)" right>
          {{ record.register_height | blockHeight }}
        </q-item-side>

        <q-context-menu>
          <q-list link separator style="min-width: 150px; max-height: 300px;">
            <template v-if="!isLocked(record)">
              <q-item v-close-overlay @click.native="copy(record.name, $event, $t('notification.positive.nameCopied'))">
                <q-item-main :label="$t('menuItems.copyName')" />
              </q-item>

              <q-item v-close-overlay @click.native="copyValue(record, $event)">
                <q-item-main :label="record | copyValue" />
              </q-item>
            </template>

            <q-item v-close-overlay @click.native="copy(record.owner, $event, $t('notification.positive.ownerCopied'))">
              <q-item-main :label="$t('menuItems.copyOwner')" />
            </q-item>

            <q-item
              v-if="record.backup_owner !== ''"
              v-close-overlay
              @click.native="copy(record.backup_owner, $event, $t('notification.positive.backupOwnerCopied'))"
            >
              <q-item-main :label="$t('menuItems.copyBackupOwner')" />
            </q-item>
          </q-list>
        </q-context-menu>
      </q-item>
    </q-list>
  </div>
</template>

<script>
const { clipboard } = require("electron");
import { mapState } from "vuex";
import { i18n } from "plugins/i18n";
import LokiField from "components/loki_field";
import { lns_name } from "src/validators/common";

export default {
  name: "LNSRecordList",
  components: {
    LokiField
  },
  filters: {
    blockHeight(value) {
      const heightString = i18n.t("strings.blockHeight");
      return `${heightString}: ${value}`;
    },
    copyValue(record) {
      if (record.type === "session") {
        return i18n.t("menuItems.copySessionId");
      }
      return i18n.t("menuItems.copyAddress");
    }
  },
  data() {
    return {
      name: "",
      decrypting: false
    };
  },
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    ourAddresses(state) {
      const { address_list } = state.gateway.wallet;
      const { used, unused, primary } = address_list;
      const all = [...used, ...unused, ...primary];
      return all.map(a => a.address).filter(a => !!a);
    },
    records(state) {
      const ourAddresses = this.ourAddresses;
      const records = state.gateway.wallet.lnsRecords;
      const ourRecords = records.filter(record => {
        return ourAddresses.includes(record.owner) || ourAddresses.includes(record.backup_owner);
      });

      // Sort the records by decrypted ones first, followed by non-decrypted
      return ourRecords.sort((a, b) => {
        if (a.name && !b.name) {
          return -1;
        } else if (b.name && !a.name) {
          return 1;
        } else if (a.name && b.name) {
          return a.name.localeCompare(b.name);
        }
        return b.register_height - a.register_height;
      });
    },
    needsDecryption() {
      return !!this.records.find(r => this.isLocked(r));
    }
  }),
  methods: {
    isLocked(record) {
      return !record.name || !record.value;
    },
    decrypt() {
      this.$v.name.$touch();

      if (!this.name || this.name.trim().length === 0) {
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: this.$t("notification.errors.enterName")
        });
        return;
      }

      if (this.$v.name.$error) {
        this.$q.notify({
          type: "negative",
          timeout: 3000,
          message: this.$t("notification.errors.invalidNameFormat")
        });
        return;
      }

      const name = this.name.trim();

      this.$gateway.once("decrypt_record_result", data => {
        if (data.decrypted) {
          this.$q.notify({
            type: "positive",
            timeout: 2000,
            message: this.$t("notification.positive.decryptedLNSRecord", { name })
          });
          this.name = "";
        } else {
          this.$q.notify({
            type: "negative",
            timeout: 3000,
            message: this.$t("notification.errors.decryptLNSRecord", { name })
          });
        }
        this.decrypting = false;
      });
      this.$gateway.send("wallet", "decrypt_record", {
        name,
        type: "session"
      });
      this.decrypting = true;
    },
    blurEventButton(event) {
      for (let i = 0; i < event.path.length; i++) {
        if (event.path[i].tagName == "BUTTON") {
          event.path[i].blur();
          break;
        }
      }
    },
    bindClass(record) {
      return [this.isLocked(record) ? "locked" : "unlocked"];
    },
    onUpdate(record) {
      this.$emit("onUpdate", record);
    },
    copyValue(record, event) {
      let message = this.$t("notification.positive.addressCopied");
      if (record.type === "session") {
        message = this.$t("notification.positive.sessionIdCopied");
      }
      this.copy(record.value, event, message);
    },
    copy(value, event, message) {
      event.stopPropagation();
      this.blurEventButton(event);
      if (!value) return;
      clipboard.writeText(value.trim());
      this.$q.notify({
        type: "positive",
        timeout: 2000,
        message
      });
    }
  },
  validations: {
    name: {
      lns_name
    }
  }
};
</script>

<style lang="scss">
.lns-record-list {
  .height {
    font-size: 0.9em;
  }
  .q-item {
    cursor: default;
  }

  .loki-field {
    flex: 1;
  }

  .decrypt {
    .btn-wrapper {
      height: 46px;
    }
  }
}
</style>
