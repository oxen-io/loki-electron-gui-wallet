<template>
  <q-list class="loki-list-item" no-border @click.native="details(address)">
    <q-item>
      <q-item-main>
        <q-item-tile class="ellipsis" label>{{ address.address }}</q-item-tile>
        <q-item-tile v-if="sublabel" sublabel class="non-selectable">{{ sublabel }}</q-item-tile>
      </q-item-main>
      <q-item-side>
        <q-btn flat style="width:25px;" size="md" @click="showQR(address.address, $event)">
          <img :src="qrImage" height="20" />
          <q-tooltip anchor="bottom right" self="top right" :offset="[0, 5]">
            {{ $t("menuItems.showQRCode") }}
          </q-tooltip>
        </q-btn>
        <q-btn flat style="width:25px;" size="md" icon="file_copy" @click="copyAddress(address.address, $event)">
          <q-tooltip anchor="bottom right" self="top right" :offset="[0, 5]">
            {{ $t("menuItems.copyAddress") }}
          </q-tooltip>
        </q-btn>
      </q-item-side>
    </q-item>
    <template v-if="shouldShowInfo">
      <q-item-separator />
      <q-item class="info">
        <q-item-main class="flex justify-between">
          <div class="column">
            <span>{{ $t("strings.lokiBalance") }}</span>
            <span class="value">{{ address.balance | currency }}</span>
          </div>
          <div class="column">
            <span>{{ $t("strings.lokiUnlockedBalance") }}</span>
            <span class="value">{{ address.unlocked_balance | currency }}</span>
          </div>
          <div class="column">
            <span>{{ $t("strings.unspentOutputs") }}</span>
            <span class="value">{{ address.num_unspent_outputs | toString }}</span>
          </div>
        </q-item-main>
      </q-item>
    </template>
    <q-context-menu>
      <q-list link separator style="min-width: 150px; max-height: 300px;">
        <q-item v-close-overlay @click.native="details(address)">
          <q-item-main :label="$t('menuItems.showDetails')" />
        </q-item>

        <q-item v-close-overlay @click.native="copyAddress(address.address, $event)">
          <q-item-main :label="$t('menuItems.copyAddress')" />
        </q-item>
      </q-list>
    </q-context-menu>
  </q-list>
</template>

<script>
export default {
  name: "ReceiveItem",
  filters: {
    toString: function(value) {
      if (typeof value !== "number") return "N/A";
      return String(value);
    },
    currency: function(value) {
      if (typeof value !== "number") return "N/A";

      const amount = value / 1e9;
      return amount.toLocaleString();
    }
  },
  props: {
    address: {
      type: Object,
      required: true
    },
    sublabel: {
      type: String,
      required: false,
      default: undefined
    },
    shouldShowInfo: {
      type: Boolean,
      required: false,
      default: true
    },
    showQR: {
      type: Function,
      required: true
    },
    copyAddress: {
      type: Function,
      required: true
    },
    details: {
      type: Function,
      required: true
    },
    whiteQRIcon: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    qrImage() {
      const image = this.whiteQRIcon ? "qr-code" : "qr-code-grey";
      return `statics/${image}.svg`;
    }
  }
};
</script>

<style></style>
