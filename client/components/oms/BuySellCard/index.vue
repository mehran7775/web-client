<script setup lang="ts">
import { computed, Ref, ref } from "#app";
import { useInstrument, useOrder } from "@/composables";
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

const instrumentManager = useInstrument();
const orderManager = useOrder();
const active: Ref<InstrumentCache> = ref(new InstrumentCache());
const order = computed(() => orderManager.getForm(props.insId.toString()));
const countVal = ref(props.count);
const priceVal = ref(props.price);
const tab = computed({
  get() {
    return order.value.side.toString();
  },
  set(value: string) {
    if (active.value)
      orderManager.setSide(
        value == "2" ? Side.Sell : Side.Buy,
        active.value.id.toString()
      );
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
    countVal.value = active.value.minQuantityPerOrder;
    priceVal.value = active.value.minAllowedPrice;
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
  @apply tw-flex tw-flex-grow;
  &:hover {
    background-color: var(--c-success-rgb);
    color: white;
  }
  &:before {
    display: none;
  }
}
.draft {
  @apply tw-flex tw-flex-grow;
  &:hover {
    background-color: var(--c-info-rgb);
    color: white;
  }
  &:before {
    display: none;
  }
}
.rw {
  @apply tw-flex tw-flex-grow;
  min-height: 32px;
  height: 32px;
  min-width: 50%;
  padding: 0 12px 0 12px !important;
  position: relative;
  &-border {
    border: none;
    border-bottom: 1px solid #e0e0e0;
  }
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
        <v-form class="tw-m-0 tw-p-0 tw-grid tw-grid-cols-2"
          ><div class="rw rw-border tw-col-span-2 tw-justify-center">
            <span class="tw-mx-3">{{ $t("wealth.sharesCount") }}: </span>
            <numeric-field :value="1000" class="tw-pl-2" />
          </div>
          <div class="rw rw-border tw-justify-between">
            <span>{{ $t("oms.countThreshold") }}: </span>
            <numeric-field :value="1000" />
            <bar />
          </div>
          <div class="rw rw-border tw-justify-between">
            <span>{{ $t("oms.priceThreshold") }}: </span>
            <numeric-field :value="1000" />
          </div>
          <div class="rw rw-border tw-justify-between">
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
          </div>
          <div class="rw rw-border tw-justify-between">
            <text-input
              :label="$t('oms.price')"
              type="number"
              v-model="priceVal"
              class="tw-mt-1"
              :min="!!active ? active.minAllowedPrice : 1"
              :max="!!active ? active.maxAllowedPrice : null"
            >
              <template #append>
                <v-icon color="primary" class="tw-mx-1 rw-borderborder" x-small
                  >isax-lock-1</v-icon
                >
              </template>
            </text-input>
          </div>
          <div class="rw rw-border tw-justify-between">
            <account-type
              :placeholder="$t('accounting.account.type')"
              class="tw-my-1"
              height="24px"
            >
            </account-type>
            <bar />
          </div>
          <div class="rw rw-border tw-justify-between">
            <credit
              height="24px"
              class="tw-my-1"
              :placeholder="$t('accounting.account.credit')"
            >
            </credit>
          </div>
          <div class="rw rw-border tw-justify-between tw-col-span-2">
            <percent
              :label="$t('oms.view-count')"
              height="31px"
              class="tw-flex tw-flex-grow"
              :min="30"
              :total="countVal"
            >
            </percent>
          </div>
          <div class="rw rw-border tw-justify-between">
            <text-input
              :label="$t('wealth.order.creditPercent')"
              type="number"
              class="tw-mt-1"
              :min="0"
              :max="100"
            >
            </text-input>
            <bar />
          </div>
          <div class="rw rw-border tw-justify-between">
            <v-checkbox
              :label="$t('oms.splitOrders')"
              dense
              hide-details
              class="tw-m-0 tw-p-0 tw-mt-1 pa-0"
              :ripple="false"
            />
          </div>
          <div class="rw rw-border tw-justify-between">
            <span>{{ $t("oms.tradeWage") }}: </span>
            <numeric-field :value="1000" />
            <bar />
          </div>
          <div class="rw rw-border tw-justify-between">
            <span>{{ $t("oms.tradeValue") }}: </span> <numeric-field :value="1000" />
          </div>
          <div class="rw rw-border tw-justify-center">
            <v-btn
              class="draft tw-mt-1"
              height="24"
              @click="
                () => {
                  buyCheck();
                }
              "
              depressed
            >
              {{ $t("general.draft") }} </v-btn
            ><bar />
          </div>
          <div class="rw rw-border tw-justify-center">
            <v-btn
              class="buy tw-mt-1"
              height="24"
              :disabled="!active || (active.status & 3) != 3"
              depressed
              >{{ $t("oms.buy") }}</v-btn
            >
          </div>
        </v-form>
      </v-tab-item>
      <v-tab-item value="2">
        <v-form class="tw-m-0 tw-p-0 tw-grid tw-grid-cols-2">
          <div class="rw rw-border tw-col-span-2 tw-justify-center">
            <span class="tw-mx-3">{{ $t("wealth.sharesCount") }}: </span>
            <numeric-field :value="1000" class="tw-pl-2" />
          </div>
          <div class="rw rw-border tw-justify-between">
            <span>{{ $t("oms.countThreshold") }}: </span>
            <numeric-field :value="1000" />
            <bar />
          </div>
          <div class="rw rw-border tw-justify-between">
            <span>{{ $t("oms.priceThreshold") }}: </span>
            <numeric-field :value="1000" />
          </div>
          <div class="rw rw-border tw-justify-between">
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
          </div>
          <div class="rw rw-border tw-justify-between">
            <text-input
              :label="$t('oms.price')"
              type="number"
              v-model="priceVal"
              class="tw-mt-1"
              :min="!!active ? active.minAllowedPrice : 1"
              :max="!!active ? active.maxAllowedPrice : null"
            >
              <template #append>
                <v-icon color="primary" class="tw-mx-1 rw-borderborder" x-small
                  >isax-lock-1</v-icon
                >
              </template>
            </text-input>
          </div>
          <div class="rw rw-border tw-justify-between">
            <account-type
              :placeholder="$t('accounting.account.type')"
              class="tw-my-1"
              height="24px"
            >
            </account-type>
            <bar />
          </div>
          <div class="rw rw-border tw-justify-between">
            <credit
              height="24px"
              class="tw-my-1"
              :placeholder="$t('accounting.account.credit')"
            >
            </credit>
          </div>
          <div class="rw rw-border tw-justify-between tw-col-span-2">
            <percent
              :label="$t('oms.view-count')"
              height="31px"
              class="tw-flex tw-flex-grow"
              :min="30"
              :total="countVal"
            >
            </percent>
          </div>
          <div class="rw rw-border tw-justify-between">
            <text-input
              :label="$t('wealth.order.creditPercent')"
              type="number"
              class="tw-mt-1"
              :min="0"
              :max="100"
            >
            </text-input>
            <bar />
          </div>
          <div class="rw rw-border tw-justify-between">
            <v-checkbox
              :label="$t('oms.splitOrders')"
              dense
              hide-details
              class="tw-m-0 tw-p-0 tw-mt-1 pa-0"
              :ripple="false"
            />
          </div>
          <div class="rw rw-border tw-justify-between">
            <span>{{ $t("oms.tradeWage") }}: </span>
            <numeric-field :value="1000" />
            <bar />
          </div>
          <div class="rw rw-border tw-justify-between">
            <span>{{ $t("oms.tradeValue") }}: </span> <numeric-field :value="1000" />
          </div>
          <div class="rw rw-border tw-justify-center">
            <v-btn
              class="draft tw-mt-1"
              height="24"
              @click="
                () => {
                  buyCheck();
                }
              "
              depressed
            >
              {{ $t("general.draft") }} </v-btn
            ><bar />
          </div>
          <div class="rw rw-border tw-justify-center">
            <v-btn
              class="buy tw-mt-1"
              height="24"
              :disabled="!active || (active.status & 3) != 3"
              depressed
              >{{ $t("oms.buy") }}</v-btn
            >
          </div>
        </v-form>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>
