<template>
  <div v-if="records.length > 0" class="lns-record-list">
    <!-- TODO: Add decrypting -->
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

export default {
  name: "LNSRecordList",
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
  computed: mapState({
    theme: state => state.gateway.app.config.appearance.theme,
    records(state) {
      const records = state.gateway.wallet.lnsRecords;
      // Sort the records by decrypted ones first, followed by non-decrypted
      return records.sort((a, b) => {
        if (a.name && !b.name) {
          return -1;
        } else if (b.name && !a.name) {
          return 1;
        } else if (a.name && b.name) {
          return a.name.localeCompare(b.name);
        }
        return b.register_height - a.register_height;
      });
    }
  }),
  methods: {
    isLocked(record) {
      return !record.name || !record.value;
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
}
</style>
