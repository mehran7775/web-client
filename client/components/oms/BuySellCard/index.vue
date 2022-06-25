<script setup lang="ts">
import { computed, Ref, ref } from "#app";
import { useInstrument, useOrder, useAxios } from "@/composables";
import { InstrumentCache, InstrumentSearchModel, Side } from "@/types";
import accountType from "@/components/wealth/accountType.vue";
import credit from "@/components/wealth/validity/index.vue";
import percent from "./percent.vue";
import { object, number, AnyObjectSchema } from "yup";
import TextInput from "@/components/textInput.vue";
import ShowPercent from "./showPercent.vue";
import AdaBtn from "@/components/adaBtn.vue";
import { getWage } from "@/repositories/wealth/wealth_manager";
import { reactive } from "@vue/reactivity";

const props = defineProps<{
  count: number;
  price: number;
  insId: number;
  insName: string
}>();
const buyForm = ref<AnyObjectSchema | null>(null);
const sellForm = ref<AnyObjectSchema | null>(null);
const axios = useAxios();
const instrumentManager = useInstrument();
const orderManager = useOrder();
const active: Ref<InstrumentCache> = ref(new InstrumentCache());
const order = computed(() => orderManager.getForm(props.insId.toString()));
const priceLock = ref(false);
const countLock = ref(false);
const wage = ref({ buy: 0, sell: 0 });
const agreement = ref(true);
const orderDivision = ref(false);
const accountTypefield = ref(0);
const countVal = computed({
  get() {
    return order.value.quantity;
  },
  set(quantity) {
    if (countLock.value) return;
    orderManager.updateForm({
      instrumentId: order.value.instrumentId,
      quantity,
    });
  },
});
const priceVal = computed({
  get() {
    return order.value.enteredPrice;
  },
  set(enteredPrice) {
    if (priceLock.value) return;
    orderManager.updateForm({
      instrumentId: order.value.instrumentId,
      enteredPrice,
    });
  },
});
const baseTradeValue = computed(() => order.value.quantity * order.value.enteredPrice)
const buyWage = computed(() => baseTradeValue.value * wage.value.buy);
const sellWage = computed(() => baseTradeValue.value * wage.value.sell);
const buyTradeValue = computed(() => baseTradeValue.value + buyWage.value);
const sellTradeValue = computed(() => baseTradeValue.value + sellWage.value);
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

async function check() {
  if (buyForm.value) {
    try {
      await buyForm.value.validate({
        quantity: countVal.value,
        fee: priceVal.value,
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  return false;
}

async function placeOrder(options: { draft: boolean }) {
  if (
    await check()) {
    const param: any = { ...order.value };
    if (options.draft) param.flags = param.flags | 1;
    param.termsAndConditions = agreement.value;
    param.orderDivision = orderDivision.value;
    param.draft = options.draft;
    param.accountType = accountTypefield.value;
    orderManager.placeOrder(param);
  }
}

function toggleCountLock() {
  countLock.value = !countLock.value;
}
function togglePriceLock() {
  priceLock.value = !priceLock.value;
}
// function setFocusOnCountInputText() {
//   this.
// }

instrumentManager
  .getInstrumentsDetail(new InstrumentSearchModel([props.insId]))
  .then((data: Array<InstrumentCache>) => {
    active.value = data[0];
    countVal.value = active.value.minQuantityPerOrder;
    priceVal.value = active.value.minAllowedPrice;
    buyForm.value = object({
      quantity: number()
        .min(active.value.minQuantityPerOrder, "oms.order.validation.minQuantity: " + active.value.minQuantityPerOrder)
        .max(
          active.value.maxQuantityPerOrder > 0
            ? active.value.maxQuantityPerOrder
            : Infinity,
          "oms.order.validation.maxQuantity"
        ),
      fee: number()
        .min(active.value.minAllowedPrice, "oms.order.validation.minPrice")
        .max(
          active.value.maxAllowedPrice > 0 ? active.value.maxAllowedPrice : Infinity,
          "oms.order.validation.MaxPrice"
        ),
    });
    getWage(props.insId.toString(), order.value.side, axios.createInstance()).then(
      (res) => {
        if (res.data)
          wage.value = {
            buy: res.data,
            sell: res.data,
          };
      }
    );
  });
</script>

<style lang="postcss" scoped>
.inputColor{
  color: #3554d1!important;
}
.buy-sell {
  .frm {
    @apply tw-m-0 tw-p-0 tw-grid tw-grid-cols-2;

    >div {
      @apply tw-flex tw-flex-grow tw-items-center;
      min-height: var(--row-height);
      height: var(--row-height);
      min-width: 50%;
      padding: 0 12px !important;
      position: relative;
      border: none;
      border-bottom: 1px solid #e0e0e0;
      line-height: 0.83334rem !important;
      font-size: 0.83334rem;

      >label {
        @apply tw-h-8;
      }
    }
    /*the class must define globaly */
    .input-checkbox{
      @apply tw-relative tw-w-5 tw-h-5 tw-border tw-border-solid  tw-rounded tw-cursor-pointer tw-transition-all tw-duration-150 tw-ml-1;
      border-color: var(--c-primary-rgb);
      appearance: none;
      outline: 0;
      &:checked {
        background: var(--c-blue-rgb);
      }
    }
  }

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

  .sell {
    @apply tw-flex tw-flex-grow;

    &:hover {
      background-color: var(--c-error-rgb);
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

  button.active {
    background-color: var(--c-primary-rgb);
    color: white !important;

    i {
      color: white !important;
    }
  }
}
</style>

<style lang="postcss">
.buy-sell {
  @apply tw-m-0 tw-p-0;

  .v-tab {
    color: black !important;
    background-color: #e0e0e0;
    font-weight: bold;

    &:hover {
      color: white !important;
    }

    &--active {
      color: white !important;

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
  <div class="buy-sell">
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
        <form class="frm">
          <div class="tw-col-span-2 tw-justify-center">
            <span class="tw-mx-3">{{ $t("wealth.sharesCount") }} ({{ insName }}): </span>
            <numeric-field :value="active.amount" class="tw-pl-2" />
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.countThreshold") }}: </span>
            <numeric-field :value="1000" />
            <bar />
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.priceThreshold") }}: </span>
            <numeric-field :value="1000" />
          </div>
          <div class="tw-justify-between">
            <text-input :label="$t('oms.count')" type="number" v-model="countVal" 
              :readonly="countLock" class="tw-mt-1 inputColor" 
              :min="!!active ? active.minQuantityPerOrder : 1"
              :max="!!active ? active.maxQuantityPerOrder || null : null"
              id="countTextInput">
              <template #append>
                <ada-btn :class="['tw-mx-1', countLock ? 'active' : '']" :width="24" :height="24"
                  @click="toggleCountLock" icon>
                  <ada-icon color="primary">isax-lock-1</ada-icon>
                </ada-btn>
                <ada-btn :width="24" :height="24" icon>
                  <ada-icon color="primary">isax-calculator</ada-icon>
                </ada-btn>
              </template>
            </text-input>
            <bar />
          </div>
          <div class="tw-justify-between">
            <text-input :label="$t('oms.price')" type="number" v-model="priceVal" 
            :readonly="priceLock" class="tw-mt-1 inputColor"
              :min="!!active ? active.minAllowedPrice : 1" 
              :max="!!active ? active.maxAllowedPrice || null : null">
              <template #append>
                <ada-btn :class="['tw-mx-1', priceLock ? 'active' : '']" :width="24" :height="24"
                  @click="togglePriceLock" icon>
                  <ada-icon color="primary">isax-lock-1</ada-icon>
                </ada-btn>
              </template>
            </text-input>
          </div>
          <div class="tw-justify-between">
            <account-type v-model="accountTypefield" :label="$t('accounting.account.type')" 
            class="tw-my-1 inputColor" height="24px">
            </account-type>
            <bar />
          </div>
          <div class="tw-justify-between">
            <credit height="24px" class="tw-my-1 inputColor" :label="$t('accounting.account.credit')">
            </credit>
          </div>
          <div class="tw-justify-between tw-col-span-2">
            <percent v-model="order.discloseQuantity" :label="$t('oms.view-count')" height="31px"
              class="tw-flex tw-flex-grow tw-h-[24px] inputColor" :min="30" :total="countVal" :value="100">
            </percent>
          </div>
          <div class="tw-justify-between">
            <text-input :label="$t('wealth.order.creditPercent')" type="number" class="tw-h-[24px] inputColor" :min="0" :max="100">
            </text-input>
            <bar />
          </div>
          <div class="tw-justify-between">
           <div class="tw-w-max tw-flex tw-items-center">
              <input type="checkbox" v-model="orderDivision" class="input-checkbox">
              <label for="checked-checkbox" class="inputColor" v-text="$t('oms.splitOrders')"></label>
           </div>
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.tradeWage") }}: </span>
            <numeric-field :value="buyWage" />
            <bar />
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.tradeValue") }}: </span>
            <numeric-field :value="buyTradeValue" />
          </div>
          <div class="tw-justify-center">
            <ada-btn class="draft" height="24px" @click="
              () => {
                placeOrder({ draft: true });
              }
            " depressed>
              {{ $t("general.draft") }}
            </ada-btn>
            <bar />
          </div>
          <div class="tw-justify-center">
            <ada-btn class="buy" height="24px" :disabled="!active || (active.status & 3) != 3" @click="
              () => {
                placeOrder({ draft: false });
              }
            " depressed v-bind:style="countVal > 1 && priceVal ? 'background-color: var(--c-success-rgb)' : null">
              {{ $t("oms.buy-btn") }}
            </ada-btn>
          </div>
        </form>
      </v-tab-item>
      <v-tab-item value="2">
        <form class="frm">
          <div class="tw-col-span-2 tw-justify-center">
            <span class="tw-mx-3">{{ $t("wealth.sharesCount") }} ({{ insName }}): </span>
            <numeric-field :value="active.amount" class="tw-pl-2" />
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.countThreshold") }}: </span>
            <numeric-field :value="1000" />
            <bar />
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.priceThreshold") }}: </span>
            <numeric-field :value="1000" />
          </div>
          <div class="tw-justify-between">
            <text-input :label="$t('oms.count')" type="number" v-model="countVal" 
              :readonly="countLock" class="tw-mt-1 inputColor"
              :min="!!active ? active.minQuantityPerOrder : 1"
              :max="!!active ? active.maxQuantityPerOrder || null : null">
              <template #append>
                <ada-btn :class="['tw-mx-1', countLock ? 'active' : '']" :width="24" :height="24"
                  @click="toggleCountLock" icon>
                  <ada-icon color="primary">isax-lock-1</ada-icon>
                </ada-btn>
                <ada-btn :width="24" :height="24" icon>
                  <ada-icon color="primary">isax-calculator</ada-icon>
                </ada-btn>
              </template>
            </text-input>
            <bar />
          </div>
          <div class="tw-justify-between">
            <text-input :label="$t('oms.price')" type="number" v-model="priceVal" 
              :readonly="priceLock" class="tw-mt-1 inputColor"
              :min="!!active ? active.minAllowedPrice : 1" 
              :max="!!active ? active.maxAllowedPrice || null : null">
              <template #append>
                <ada-btn @click="togglePriceLock" :class="['tw-mx-1', priceLock ? 'active' : '']" :width="24"
                  :height="24" icon>
                  <ada-icon color="primary">isax-lock-1</ada-icon>
                </ada-btn>
              </template>
            </text-input>
          </div>
          <div class="tw-justify-between">
            <account-type :label="$t('accounting.account.type')" class="tw-my-1 inputColor" height="24px">
            </account-type>
            <bar />
          </div>
          <div class="tw-justify-between">
            <credit height="24px" class="tw-my-1 inputColor" :label="$t('accounting.account.credit')">
            </credit>
          </div>
          <div class="tw-justify-between tw-col-span-2">
            <percent v-model="order.discloseQuantity" :label="$t('oms.view-count')" height="31px"
              class="tw-flex tw-flex-grow tw-h-[24px] inputColor" :min="30" :total="countVal" :value="100">
            </percent>
          </div>
          <div class="tw-justify-between">
            <text-input :label="$t('wealth.order.creditPercent')" type="number" class="tw-h-[24px] inputColor" :min="0" :max="100">
            </text-input>
            <bar />
          </div>
          <div class="tw-justify-between">
           <div class="tw-w-max tw-flex tw-items-center">
              <input type="checkbox" v-model="orderDivision" class="input-checkbox">
              <label for="checked-checkbox" class="inputColor" v-text="$t('oms.splitOrders')"></label>
           </div>
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.tradeWage") }}: </span>
            <numeric-field :value="sellWage" />
            <bar />
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.tradeValue") }}: </span>
            <numeric-field :value="sellTradeValue" />
          </div>
          <div class="tw-justify-center">
            <ada-btn class="draft" height="24px" @click="
              () => {
                placeOrder({ draft: true });
              }
            " depressed>
              {{ $t("general.draft") }}
            </ada-btn>
            <bar />
          </div>
          <div class="tw-justify-center">
            <ada-btn class="sell" height="24px" :disabled="!active || (active.status & 3) != 3" @click="
              () => {
                placeOrder({ draft: false });
              }
            " depressed>
              {{ $t("oms.sell-btn") }}
            </ada-btn>
          </div>
        </form>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
