<template>
  <div>
    <q-item-section class="self-start">
      <q-item-label class="title non-selectable">{{ title }}</q-item-label>
      <q-item-label class="row">
        <q-item-section class="break-all" style="font-size: 18px">
          {{ address }}
        </q-item-section>
        <q-item-section v-if="showCopy" side>
          <q-btn ref="copy" color="primary" padding="xs" size="sm" icon="file_copy" @click="copyAddress">
            <q-tooltip anchor="center left" self="center right" :offset="[5, 10]">
              {{ $t("menuItems.copyAddress") }}
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item-label>
      <q-item-label v-if="paymentId" header>{{ $t("fieldLabels.paymentId") }}: {{ paymentId }}</q-item-label>
      <q-item-label v-if="extra" header class="extra non-selectable">{{ extra }}</q-item-label>
    </q-item-section>

    <q-menu context-menu>
      <q-list separator class="context-menu">
        <q-item v-close-popup clickable @click.native="copyAddress($event)">
          <q-item-section>
            {{ $t("menuItems.copyAddress") }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
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
          .onDismiss(() => null)
          .onCancel(() => null)
          .onOk(() => {
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
.title {
  font-size: 18px;
  margin-bottom: 4px;
  color: white;
}

.extra {
  margin-top: 8px;
  color: white;
}

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

  .q-item-label {
    .q-item-label {
      font-weight: 400;
    }
  }
}
</style>
