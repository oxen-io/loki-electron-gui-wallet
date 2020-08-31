<template>
  <q-dialog v-model="isVisible" maximized>
    <q-layout>
      <q-header>
        <q-toolbar color="dark" inverted>
          <q-btn flat round dense icon="reply" @click="isVisible = false" />
          <q-toolbar-title>
            {{ $t("titles.addressDetails") }}
          </q-toolbar-title>
          <q-btn flat :label="$t('buttons.showQRCode')" @click="isQRCodeVisible = true" />
          <q-btn class="q-ml-sm" color="primary" :label="$t('buttons.copyAddress')" @click="copyAddress()" />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <div class="layout-padding">
          <template v-if="address != null">
            <AddressHeader
              :address="address.address"
              :title="addressHeaderInfo.title"
              :extra="addressHeaderInfo.extra"
              :show-copy="false"
            />

            <template v-if="address.used">
              <div class="row justify-between" style="max-width: 768px">
                <div class="infoBox">
                  <div class="infoBoxContent">
                    <div class="text">
                      <span>{{ $t("strings.lokiBalance") }}</span>
                    </div>
                    <div class="value">
                      <span><FormatLoki :amount="address.balance"/></span>
                    </div>
                  </div>
                </div>

                <div class="infoBox">
                  <div class="infoBoxContent">
                    <div class="text">
                      <span>{{ $t("strings.lokiUnlockedBalance") }}</span>
                    </div>
                    <div class="value">
                      <span><FormatLoki :amount="address.unlocked_balance"/></span>
                    </div>
                  </div>
                </div>

                <div class="infoBox">
                  <div class="infoBoxContent">
                    <div class="text">
                      <span>{{ $t("strings.numberOfUnspentOutputs") }}</span>
                    </div>
                    <div class="value">
                      <span>{{ address.num_unspent_outputs }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="row justify-between" style="max-width: 768px">
                <div class="infoBox">
                  <div class="infoBoxContent">
                    <div class="text">
                      <span>{{ $t("strings.lokiBalance") }}</span>
                    </div>
                    <div class="value"><span>N/A</span></div>
                  </div>
                </div>

                <div class="infoBox">
                  <div class="infoBoxContent">
                    <div class="text">
                      <span>{{ $t("strings.lokiUnlockedBalance") }}</span>
                    </div>
                    <div class="value"><span>N/A</span></div>
                  </div>
                </div>

                <div class="infoBox">
                  <div class="infoBoxContent">
                    <div class="text">
                      <span>{{ $t("strings.numberOfUnspentOutputs") }}</span>
                    </div>
                    <div class="value"><span>N/A</span></div>
                  </div>
                </div>
              </div>
            </template>

            <div class="q-mt-sm">
              <div class="non-selectable recent-transactions-wrapper">
                <q-icon name="history" size="24px" />
                <span class="vertical-middle q-ml-xs">{{ $t("strings.recentIncomingTransactionsToAddress") }}</span>
              </div>

              <div style="margin: 12px -16px;">
                <TxList
                  :key="address.address"
                  type="all_in"
                  :limit="5"
                  :to-incoming-address-index="address.address_index"
                />
              </div>
            </div>
          </template>
        </div>
      </q-page-container>
    </q-layout>
    <template v-if="address != null">
      <q-dialog v-model="isQRCodeVisible" minimized :content-class="'qr-code-modal'">
        <q-card class="qr-code-card">
          <div class="text-center q-mb-sm q-pa-md" style="background: white;">
            <QrcodeVue ref="qr" :value="address.address" size="240"> </QrcodeVue>
            <q-menu content-menu>
              <q-list link separator style="min-width: 150px; max-height: 300px;">
                <q-item v-close-popup @click.native="copyQR()">
                  <q-item-label :label="$t('menuItems.copyQR')" />
                </q-item>
                <q-item v-close-popup @click.native="saveQR()">
                  <q-item-label :label="$t('menuItems.saveQR')" />
                </q-item>
              </q-list>
            </q-menu>
          </div>
          <q-card-actions>
            <q-btn color="primary" :label="$t('buttons.close')" @click="isQRCodeVisible = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </template>
  </q-dialog>
</template>

<script>
import { mapState } from "vuex";
const { clipboard, nativeImage } = require("electron");
import AddressHeader from "components/address_header";
import FormatLoki from "components/format_loki";
import QrcodeVue from "qrcode.vue";
import TxList from "components/tx_list";
export default {
  name: "AddressDetails",
  components: {
    AddressHeader,
    TxList,
    FormatLoki,
    QrcodeVue
  },
  data() {
    return {
      isVisible: false,
      isQRCodeVisible: false,
      address: null
    };
  },
  computed: mapState({
    addressHeaderInfo() {
      if (!this.address) return null;

      let title = this.$t("strings.addresses.primaryAddress");
      if (this.address.address_index !== 0) {
        title =
          this.$t("strings.addresses.subAddress") +
          " (" +
          this.$t("strings.addresses.subAddressIndex", {
            index: this.address.address_index
          }) +
          ")";
      }

      const extra = this.address.used ? this.$t("strings.userUsedAddress") : this.$t("strings.userNotUsedAddress");

      return {
        title,
        extra
      };
    }
  }),
  methods: {
    copyQR() {
      const data = this.$refs.qr.$el.childNodes[0].toDataURL();
      const img = nativeImage.createFromDataURL(data);
      clipboard.writeImage(img);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.qrCopied")
      });
    },
    saveQR() {
      let img = this.$refs.qr.$el.childNodes[0].toDataURL();
      this.$gateway.send("core", "save_png", { img, type: "QR Code" });
    },
    copyAddress() {
      clipboard.writeText(this.address.address);
      this.$q.notify({
        type: "positive",
        timeout: 1000,
        message: this.$t("notification.positive.addressCopied")
      });
    }
  }
};
</script>

<style></style>
