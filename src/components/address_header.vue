<template>
  <q-item class="address-header">
    <q-item-main class="self-start">
      <q-item-tile sublabel class="title non-selectable">{{ title }}</q-item-tile>
      <q-item-tile class="break-all" label>{{ address }}</q-item-tile>
      <q-item-tile v-if="paymentId" sublabel>{{ $t("fieldLabels.paymentId") }}: {{ paymentId }}</q-item-tile>
      <q-item-tile v-if="extra" sublabel class="extra non-selectable">{{ extra }}</q-item-tile>
    </q-item-main>
    <q-item-side v-if="showCopy">
      <q-btn ref="copy" color="primary" style="width:25px;" size="sm" icon="file_copy" @click="copyAddress">
        <q-tooltip anchor="center left" self="center right" :offset="[5, 10]">
          {{ $t("menuItems.copyAddress") }}
        </q-tooltip>
      </q-btn>
    </q-item-side>

    <q-context-menu>
      <q-list link separator style="min-width: 150px; max-height: 300px;">
        <q-item v-close-overlay @click.native="copyAddress($event)">
          <q-item-main :label="$t('menuItems.copyAddress')" />
        </q-item>
      </q-list>
    </q-context-menu>
  </q-item>
</template>

<script>
const { clipboard } = require("electron");
export default {
  name: "AddressHeader",
  props: {
    title: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    paymentId: {
      type: String,
      required: false,
      default: undefined
    },
    extra: {
      type: String,
      required: false,
      default: undefined
    },
    showCopy: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {};
  },
  methods: {
    copyAddress(event) {
      if (event) {
        event.stopPropagation();
      }
      if (this.$refs.copy) {
        this.$refs.copy.$el.blur();
      }
      clipboard.writeText(this.address);
      if (this.paymentId) {
        this.$q
          .dialog({
            title: this.$t("dialog.copyAddress.title"),
            message: this.$t("dialog.copyAddress.message"),
            ok: {
              label: this.$t(`dialog.copyAddress.ok`)
            }
          })
          .catch(() => null)
          .then(() => {
            this.$q.notify({
              type: "positive",
              timeout: 1000,
              message: this.$t("notification.positive.addressCopied")
            });
          });
      } else {
        this.$q.notify({
          type: "positive",
          timeout: 1000,
          message: this.$t("notification.positive.addressCopied")
        });
      }
    }
  }
};
</script>

<style lang="scss">
.address-header {
  padding: 0;
  img {
    float: left;
    margin-right: 15px;
  }
  h3 {
    margin: 15px 0 0;
  }
  p {
    word-break: break-all;
  }
  &::after {
    content: "";
    clear: both;
    display: table;
  }

  .q-item-main {
    .q-item-label {
      font-weight: 400;
    }

    .q-item-sublabel,
    .q-list-header {
      font-size: 13px;
    }

    .title {
      font-size: 14px;
      margin-bottom: 2px;
    }

    .extra {
      margin-top: 8px;
    }
  }
}
</style>
