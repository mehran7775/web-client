<script setup lang="ts">
import { computed, Ref, ref } from "#app";
import { useInstrument } from "@/composables";
import { InstrumentCache, InstrumentSearchModel, Side } from "@/types";
import accountType from "@/components/wealth/accountType.vue";
import credit from "@/components/wealth/validity/index.vue";
import percent from "./percent.vue";
import { object, number, AnyObjectSchema } from "yup";
import TextInput from "~~/components/textInput.vue";
import ShowPercent from "./showPercent.vue";

const props = defineProps<{
  count: number;
  price: number;
  insId: number;
}>();

const buyForm = ref<AnyObjectSchema | null>(null);

const emit = defineEmits(["update:count", "update:price"]);

const instrumentManager = useInstrument();
const active: Ref<InstrumentCache> = ref(new InstrumentCache());
const countVal = computed({
  get() {
    return props.count?.toString();
  },
  set(val: string | undefined) {
    emit("update:count", val ? parseInt(val) : 0);
  },
});
const priceVal = computed({
  get() {
    return props.price?.toString();
  },
  set(val: string | undefined) {
    emit("update:price", val ? parseInt(val) : 0);
  },
});
const tab = computed({
  get() {
    return (active.value?.side == Side.Sell ? Side.Sell : Side.Buy).toString();
  },
  set(value: string) {
    if (active.value)
      instrumentManager.updateInstrument({
        id: active.value.id,
        side: value == "2" ? Side.Sell : Side.Buy,
      });
  },
});

async function buyCheck() {
  if (buyForm.value) {
    try {
      await buyForm.value.validate({
        quantity: props.count,
        fee: props.price,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

instrumentManager
  .getInstrumentsDetail(new InstrumentSearchModel([props.insId]))
  .then((data: Array<InstrumentCache>) => {
    active.value = data[0];
    emit("update:count", active.value.minQuantityPerOrder);
    emit("update:price", active.value.minAllowedPrice);
    buyForm.value = object({
      quantity: number()
        .min(active.value.minQuantityPerOrder, "oms.order.validation.minQuantity")
        .max(active.value.maxQuantityPerOrder, "oms.order.validation.maxQuantity"),
      fee: number()
        .min(active.value.minAllowedPrice, "oms.order.validation.minPrice")
        .max(active.value.maxAllowedPrice, "oms.order.validation.MaxPrice"),
    });
  });
</script>

<style lang="postcss" scoped>
.buy {
  &:hover {
    background-color: var(--c-success-rgb);
    color: white;
  }
  &:before {
    display: none;
  }
}
.draft {
  &:hover {
    background-color: var(--c-info-rgb);
    color: white;
  }
  &:before {
    display: none;
  }
}
.col-border {
  padding: 0 12px 0 12px !important;
}
</style>

<style lang="postcss">
.buy-sell {
  .v-tab {
    color: black;
    background-color: #e0e0e0;
    &--active {
      &::before {
        background-color: rgba(0, 0, 0, 0);
        opacity: 0;
      }
      &.buy {
        background-color: rgba(var(--c-success), 0.7);
      }
      &.sell {
        background-color: rgba(var(--c-error), 0.7);
      }
    }
  }
}
</style>

<template>
  <v-container class="ma-0 pa-0 buy-sell">
    <v-tabs height="32" hide-slider v-model="tab" grow>
      <v-tab class="buy" :key="Side.Buy" :href="'#' + Side.Buy">
        {{ $t("oms.buy") }}
      </v-tab>
      <v-tab class="sell" :key="Side.Sell" :href="'#' + Side.Sell">
        {{ $t("oms.sell") }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="1">
        <v-form class="tw-m-0 tw-p-0">
          <v-row align="center" dense>
            <v-col cols="6" class="col-border">
              <span>{{ $t("oms.countThreshold") }}: </span>
              <numeric-field :value="1000" />
              <bar />
            </v-col>
            <v-col cols="6" class="col-border">
              <span>{{ $t("oms.priceThreshold") }}: </span>
              <numeric-field :value="1000" />
            </v-col>
            <v-col cols="6" class="col-border">
              <text-input
                :label="$t('oms.count')"
                type="number"
                v-model="countVal"
                class="tw-mt-1"
                :min="!!active ? active.minQuantityPerOrder : 1"
                :max="!!active ? active.maxQuantityPerOrder : null"
              >
                <template #append>
                  <v-icon color="primary" class="tw-mx-1" x-small>isax-lock-1</v-icon>
                  <v-icon color="primary" class="tw-mx-1" x-small>isax-calculator</v-icon>
                </template>
              </text-input>
              <bar />
            </v-col>
            <v-col cols="6" class="col-border">
              <text-input
                :label="$t('oms.price')"
                type="number"
                v-model="priceVal"
                class="tw-mt-1"
                :min="!!active ? active.minAllowedPrice : 1"
                :max="!!active ? active.maxAllowedPrice : null"
              >
                <template #append>
                  <v-icon color="primary" class="tw-mx-1 col-border" x-small
                    >isax-lock-1</v-icon
                  >
                </template>
              </text-input>
            </v-col>
            <v-col cols="6" class="col-border">
              <account-type
                :placeholder="$t('accounting.account.type')"
                class="tw-my-1"
                height="24px"
              >
              </account-type>
              <bar />
            </v-col>
            <v-col cols="6" class="col-border">
              <credit
                height="24px"
                class="tw-my-1"
                :placeholder="$t('accounting.account.credit')"
              >
              </credit>
            </v-col>
            <v-col cols="6" class="col-border">
              <show-percent :value="countVal"></show-percent>
              <bar />
            </v-col>
            <v-col cols="6" class="col-border">
              <v-checkbox
                :label="$t('oms.splitOrders')"
                dense
                hide-details
                class="tw-m-0 tw-p-0 tw-mt-1 pa-0"
                :ripple="false"
              />
            </v-col>
            <v-col class="tw-flex tw-justify-between col-border" md="12">
              <div class="tw-flex tw-flex-grow tw-relative tw-justify-between">
                <span>{{ $t("wealth.sharesCount") }}: </span>
                <numeric-field :value="1000" class="tw-pl-2" />
                <bar />
              </div>
              <div class="tw-flex tw-flex-grow tw-relative tw-px-3 tw-justify-between">
                <span>{{ $t("oms.tradeWage") }}: </span>
                <numeric-field :value="1000" />
                <bar />
              </div>
              <div class="tw-flex tw-flex-grow tw-relative tw-px-3 tw-justify-between">
                <span>{{ $t("oms.tradeValue") }}: </span>
                <numeric-field :value="1000" />
              </div>
            </v-col>
            <v-col class="col-border" md="12"> </v-col>
            <v-col cols="6" class="col-border">
              <v-checkbox
                class="pa-0"
                :label="$t('general.acceptPolicy')"
                dense
                :ripple="false"
                hide-details
              />
            </v-col>
            <v-col class="tw-flex-row ltr col-border">
              <clock :format="$t('general.date.dt')" class="ltr" />
            </v-col>
            <v-col cols="12" class="tw-flex tw-justify-around col-border">
              <v-btn
                class="draft tw-mt-1"
                height="24"
                width="149"
                @click="
                  () => {
                    buyCheck();
                  }
                "
                depressed
              >
                {{ $t("general.draft") }}
              </v-btn>
              <v-btn
                class="buy tw-mt-1"
                height="24"
                width="149"
                :disabled="!active || (active.status & 3) != 3"
                depressed
                >{{ $t("oms.buy") }}</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-tab-item>
      <v-tab-item value="2">
        <v-form class="tw-m-0 tw-p-0">
          <v-row align="center" dense>
            <v-col cols="6" class="col-border">
              <span>{{ $t("oms.countThreshold") }}: </span>
              <numeric-field :value="1000" />
              <bar />
            </v-col>
            <v-col cols="6" class="col-border">
              <span>{{ $t("oms.priceThreshold") }}: </span>
              <numeric-field :value="1000" />
            </v-col>
            <v-col cols="6" class="col-border">
              <text-input
                :label="$t('oms.count')"
                type="number"
                v-model="countVal"
                class="tw-mt-1"
                :min="!!active ? active.minQuantityPerOrder : 1"
                :max="!!active ? active.maxQuantityPerOrder : null"
              >
                <template #append>
                  <v-icon color="primary" class="tw-mx-1" x-small>isax-lock-1</v-icon>
                  <v-icon color="primary" class="tw-mx-1" x-small>isax-calculator</v-icon>
                </template>
              </text-input>
              <bar />
            </v-col>
            <v-col cols="6" class="col-border">
              <text-input
                :label="$t('oms.price')"
                type="number"
                v-model="priceVal"
                class="tw-mt-1"
                :min="!!active ? active.minAllowedPrice : 1"
                :max="!!active ? active.maxAllowedPrice : null"
              >
                <template #append>
                  <v-icon color="primary" class="tw-mx-1" x-small>isax-lock-1</v-icon>
                </template>
              </text-input>
            </v-col>
            <v-col cols="6" class="col-border">
              <account-type
                :placeholder="$t('accounting.account.type')"
                class="tw-my-1"
                height="24px"
              >
              </account-type>
              <bar />
            </v-col>
            <v-col cols="6" class="col-border">
              <credit
                height="24px"
                class="tw-my-1"
                :placeholder="$t('accounting.account.credit')"
              >
              </credit>
            </v-col>
            <v-col cols="6" class="col-border">
              <show-percent :value="countVal"></show-percent>
              <bar />
            </v-col>
            <v-col cols="6" class="col-border">
              <v-checkbox
                :label="$t('oms.splitOrders')"
                dense
                hide-details
                class="tw-m-0 tw-p-0 tw-mt-1 pa-0"
                :ripple="false"
              />
            </v-col>
            <v-col class="tw-flex tw-justify-between col-border" md="12">
              <div class="tw-flex tw-flex-grow tw-relative tw-justify-between">
                <span>{{ $t("wealth.sharesCount") }}: </span>
                <numeric-field :value="1000" class="tw-pl-2" />
                <bar />
              </div>
              <div class="tw-flex tw-flex-grow tw-relative tw-px-3 tw-justify-between">
                <span>{{ $t("oms.tradeWage") }}: </span>
                <numeric-field :value="1000" />
                <bar />
              </div>
              <div class="tw-flex tw-flex-grow tw-relative tw-px-3 tw-justify-between">
                <span>{{ $t("oms.tradeValue") }}: </span>
                <numeric-field :value="1000" />
              </div>
            </v-col>
            <v-col md="12" class="col-border">
              <percent height="31px" class="tw-flex tw-flex-grow"> </percent>
            </v-col>
            <v-col cols="6" class="col-border"> </v-col>
            <v-col class="tw-flex-row ltr col-border">
              <clock :format="$t('general.date.dt')" class="ltr" />
            </v-col>
            <v-col cols="12" class="tw-flex tw-justify-around col-border">
              <v-btn
                class="draft tw-mt-1"
                height="24"
                width="149"
                @click="
                  () => {
                    buyCheck();
                  }
                "
                depressed
              >
                {{ $t("general.draft") }}
              </v-btn>
              <v-btn
                class="buy tw-mt-1"
                height="24"
                width="149"
                :disabled="!active || (active.status & 3) != 3"
                depressed
                >{{ $t("oms.buy") }}</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>
