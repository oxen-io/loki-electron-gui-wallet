<template>
<div class="service-node-staking">
    <div class="q-pa-md">
        <LokiField :label="$t('fieldLabels.serviceNodeKey')" :error="$v.service_node.key.$error">
            <q-input v-model="service_node.key"
                :dark="theme=='dark'"
                @blur="$v.service_node.key.$touch"
                :placeholder="$t('placeholders.hexCharacters', { count: 64 })"
                hide-underline
            />
        </LokiField>

        <div class="q-mt-md col">
            <LokiField :label="$t('fieldLabels.awardRecepientAddress')" :error="$v.service_node.award_address.$error">
                <q-input v-model="service_node.award_address"
                    :dark="theme=='dark'"
                    @blur="$v.service_node.award_address.$touch"
                    :placeholder="address_placeholder"
                    hide-underline
                />
            </LokiField>
            <div class="address-type" :class="[addressType]">( {{ addressType | addressTypeString }} )</div>
        </div>

            <LokiField :label="$t('fieldLabels.amount')" class="q-mt-md" :error="$v.service_node.amount.$error">
            <q-input v-model="service_node.amount"
                :dark="theme=='dark'"
                type="number"
                min="0"
                :max="unlocked_balance / 1e9"
                placeholder="0"
                @blur="$v.service_node.amount.$touch"
                hide-underline
            />
            <q-btn color="secondary" @click="service_node.amount = unlocked_balance / 1e9" :text-color="theme=='dark'?'white':'dark'">
                {{ $t("buttons.all") }}
            </q-btn>
        </LokiField>



        <q-field class="q-pt-sm">
            <q-btn
                :disable="!is_able_to_send"
                color="primary" @click="stake()" :label="$t('buttons.stake')" />
        </q-field>

    </div>

    <q-inner-loading :visible="stake_status.sending" :dark="theme=='dark'">
        <q-spinner color="primary" :size="30" />
    </q-inner-loading>
</div>
</template>

<script>
const { clipboard } = require("electron")
const objectAssignDeep = require("object-assign-deep");
import { mapState } from "vuex"
import { required, decimal } from "vuelidate/lib/validators"
import { payment_id, service_node_key, greater_than_zero, address } from "src/validators/common"
import LokiField from "components/loki_field"
import WalletPassword from "src/mixins/wallet_password"
import { i18n } from "plugins/i18n"

export default {
    name: "ServiceNodeStaking",
    computed: mapState({
        theme: state => state.gateway.app.config.appearance.theme,
        unlocked_balance: state => state.gateway.wallet.info.unlocked_balance,
        info: state => state.gateway.wallet.info,
        address_list: state => state.gateway.wallet.address_list,
        stake_status: state => state.gateway.service_node_status.stake,
        is_ready (state) {
            return this.$store.getters["gateway/isReady"]
        },
        is_able_to_send (state) {
            return this.$store.getters["gateway/isAbleToSend"]
        },
        address_placeholder (state) {
            const wallet = state.gateway.wallet.info;
            const prefix = (wallet && wallet.address && wallet.address[0]) || "L";
            return `${prefix}..`;
        },
        addressType (state) {
            const address = this.service_node.award_address;
            const inArray = (array) => array.map(o => o.address).includes(address);

            const { primary, used, unused } = this.address_list
            if (inArray(primary)) {
                return "primary"
            } else if (inArray(used)) {
                return "used"
            } else if (inArray(unused)) {
                return "unsued"
            } else {
                return "not-ours"
            }
        },
    }),
    data () {
        return {
            service_node: {
                key: "",
                amount: 0,
                award_address: "",
            },
        }
    },
    filters: {
        addressTypeString: function (value) {
            switch (value) {
                case "primary":
                    return i18n.t("strings.addresses.yourPrimaryAddress")
                case "used":
                    return i18n.t("strings.addresses.yourUsedAddress")
                case "ununsed":
                    return i18n.t("strings.addresses.yourUnusedAddress")
                default:
                    return i18n.t("strings.addresses.notYourAddress")
            }
        }
    },
    validations: {
        service_node: {
            key: { required, service_node_key },
            amount: {
                required,
                decimal,
                greater_than_zero,
            },
            award_address: {
                required,
                isAddress(value) {
                    if (value === '') return true

                    return new Promise(resolve => {
                        address(value, this.$gateway)
                            .then(() => resolve(true))
                            .catch(e => resolve(false))
                    });
                }
            }
        }
    },
    watch: {
        stake_status: {
            handler(val, old){
                if(val.code == old.code) return
                switch(this.stake_status.code) {
                    case 0:
                        this.$q.notify({
                            type: "positive",
                            timeout: 1000,
                            message: this.stake_status.message
                        })
                        this.$v.$reset();
                        this.service_node = {
                            ...this.service_node,
                            key: "",
                            amount: 0,
                        }
                        break;
                    case -1:
                        this.$q.notify({
                            type: "negative",
                            timeout: 1000,
                            message: this.stake_status.message
                        })
                        break;
                }
            },
            deep: true
        },
    },
    created () {
        const { address } = this.info;
        if (!this.service_node.award_address || this.service_node.award_address === "") {
            this.service_node.award_address = address || ""
        }
    },
    methods: {
        isOurAddress (address) {
            const { primary, used, unused } = this.address_list
            const addresses = [...primary, ...used, ...unused].map(o => o.address);
            console.log(addresses);
            return addresses.includes(address);
        },
        stake: function () {

            this.$v.service_node.$touch()

            if (this.$v.service_node.key.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.invalidServiceNodeKey")
                })
                return
            }

            if (this.$v.service_node.award_address.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.invalidAddress")
                })
                return
            }

            if(this.service_node.amount < 0) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.negativeAmount")
                })
                return
            } else if(this.service_node.amount == 0) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.zeroAmount")
                })
                return
            } else if(this.service_node.amount > this.unlocked_balance / 1e9) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.notEnoughBalance")
                })
                return
            } else if (this.$v.service_node.amount.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.invalidAmount")
                })
                return
            }

            this.showPasswordConfirmation({
                title: this.$t("dialog.stake.title"),
                noPasswordMessage: this.$t("dialog.stake.message"),
                ok: {
                    label: this.$t("dialog.stake.ok")
                },
            }).then(password => {
                this.$store.commit("gateway/set_snode_status", {
                    stake: {
                        code: 1,
                        message: "Staking...",
                        sending: true
                    }
                })
                const service_node = objectAssignDeep.noMutate(this.service_node, {password})
                this.$gateway.send("wallet", "stake", {
                    ...service_node,
                    destination: service_node.award_address,
                })
            }).catch(() => {
            })
        }
    },
    mixins: [WalletPassword],
    components: {
        LokiField
    }
}
</script>

<style lang="scss">
.service-node-staking {
    .address-type {
        margin-top: 4px;
        font-size: 13px;
        font-weight: 400;
        text-align: right;
        &.not-ours {
            font-weight: bold;
        }
    }
}
</style>
