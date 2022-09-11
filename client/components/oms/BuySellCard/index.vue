<script setup lang="ts">
import { Ref } from "vue";
import { useInstrument, useOrder, useAxios } from "@/composables";
import { InstrumentCache, InstrumentSearchModel, Side } from "@/types";
import { object, number, AnyObjectSchema } from "yup";
import { getWage } from "@/repositories/wealth/wealth_manager";
import { useBottomPanel } from "~/composables";

////////////////

const props = defineProps<{
  count: number;
  price: number;
  insId: number;
  insName: string;
}>();

//////////////

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
const validatePercent = ref<number>(0);
const activeCalculator = ref<boolean>(false);
const activeCalculatorSell = ref<boolean>(false);
const appManager = useAsrTrader();
const formatter = appManager.formatter;
////////////////////////

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
const baseTradeValue = computed(
  () => order.value.quantity * order.value.enteredPrice
);
const buyWage = computed(() => baseTradeValue.value * wage.value.buy);
const sellWage = computed(() => baseTradeValue.value * wage.value.sell);
const buyTradeValue = computed(() => baseTradeValue.value + buyWage.value);
const sellTradeValue = computed(() => baseTradeValue.value + sellWage.value);
const tab = computed({
  get() {
    return order.value.side.toString();
  },
  set(value: any) {
    if (active.value) {
      orderManager.setSide(value, active.value.id.toString());
      updateData();
    }
  },
});

const wholePriceBuy = ref<number>(0)
const uniqPriceBuy = computed(()=> wholePriceBuy.value/(order.value.quantity*(1 + buyWage.value)))
const wageCalculateBuy = computed(()=> {
  const res = (wholePriceBuy.value/uniqPriceBuy.value*order.value.quantity)-1
  if(isNaN(res)) return 0
  return res
})

const wholePriceSell = ref<number>(0)
const uniqPriceSell = computed(()=> wholePriceSell.value/(order.value.quantity*(1 + buyWage.value)))
const wageCalculateSell = computed(()=>{
  const res = (wholePriceSell.value/uniqPriceSell.value*order.value.quantity)-1
  if(isNaN(res)) return 0
  return res
})

///////////////////

// onMounted(()=> {
//   document.getElementById("buyCountInputText")!.focus()
// })

///////////////////

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
  if (await check()) {
    const param: any = { ...order.value };
    if (options.draft) param.flags = param.flags | 1;
    param.termsAndConditions = agreement.value;
    param.orderDivision = orderDivision.value;
    param.draft = options.draft;
    param.accountType = accountTypefield.value;
    orderManager
      .placeOrder(param)
      .then((res) => {
        if (res.status === 201) {
          options.draft
            ? (useBottomPanel().$state._titles[0].default =
                "bottom-panel.orders.drafts")
            : (useBottomPanel().$state._titles[0].default =
                "bottom-panel.orders.all");
          useBottomPanel()._activeTab = useBottomPanel().$state._titles[0];
          orderManager.last_update = new Date().toISOString();
          updateData();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

function toggleCountLock() {
  countLock.value = !countLock.value;
}
function togglePriceLock() {
  priceLock.value = !priceLock.value;
}

function updateData() {
  countVal.value = 0;
  priceVal.value = 0;
  orderDivision.value = false;
  validatePercent.value = 0;
  wholePriceBuy.value = 0
  wholePriceSell.value = 0

}

instrumentManager
  .getInstrumentsDetail(new InstrumentSearchModel([props.insId]))
  .then((data: Array<InstrumentCache>) => {
    active.value = data[0];
    countVal.value = 0;
    priceVal.value = active.value.minAllowedPrice;
    buyForm.value = object({
      quantity: number()
        .min(
          active.value.minQuantityPerOrder,
          "oms.order.validation.minQuantity: " +
            active.value.minQuantityPerOrder
        )
        .max(
          active.value.maxQuantityPerOrder > 0
            ? active.value.maxQuantityPerOrder
            : Infinity,
          "oms.order.validation.maxQuantity"
        ),
      fee: number()
        .min(active.value.minAllowedPrice, "oms.order.validation.minPrice")
        .max(
          active.value.maxAllowedPrice > 0
            ? active.value.maxAllowedPrice
            : Infinity,
          "oms.order.validation.MaxPrice"
        ),
    });
    getWage(
      props.insId.toString(),
      order.value.side,
      axios.createInstance()
    ).then((res) => {
      if (res.data)
        wage.value = {
          buy: res.data,
          sell: res.data,
        };
    });
  });
</script>

<style lang="postcss" scoped>
.buy-sell {
  @apply tw-h-full;

  .tabs {
    height: calc(100% - 32px);

    .frm {
      @apply tw-m-0 tw-p-0 tw-grid tw-grid-cols-2;

      .ada-input {
        @apply tw-flex;

        & :deep(.scaffold) {
          @apply tw-border-none tw-bg-transparent;
          input {
            @apply tw-bg-primary tw-bg-opacity-10;
          }
          button {
            @apply tw-bg-primary tw-bg-opacity-10 tw-py-1 tw-px-[6px] tw-rounded-sm;
            .icon {
              @apply tw-text-primary;
            }
            &.active {
              @apply tw-bg-opacity-100;
              .icon {
                @apply tw-text-white;
              }
            }
          }
        }
      }

      > div {
        @apply tw-flex tw-flex-grow tw-items-center;

        height: var(--row-height);
        min-width: 50%;
        padding: 0 12px !important;
        position: relative;
        border: none;
        border-bottom: 1px solid #e0e0e0;
        line-height: 0.83334rem !important;
        font-size: 0.83334rem;

        > label {
          /* @apply tw-h-8; */
        }
      }

      .input-checkbox {
        @apply tw-relative tw-w-5 tw-h-5 tw-border tw-border-solid tw-rounded-sm tw-cursor-pointer tw-transition-all tw-duration-150 tw-ml-1 tw-border-primary;
        appearance: none;
        outline: 0;

        &:checked {
          @apply tw-bg-primary;
        }
      }
    }
  }

  .draft,
  .sell,
  .buy {
    @apply tw-h-[24px] tw-w-full tw-bg-primary tw-bg-opacity-10;
  }
  .draft:hover {
    @apply tw-bg-info tw-text-white;
  }
  .sell:hover {
    @apply tw-bg-error tw-text-white;
  }
  .buy:hover {
    @apply tw-bg-success tw-text-white;
  }

  button.active {
    background-color: var(--c-primary-rgb);
    color: white !important;

    i {
      color: white !important;
    }
  }

  * {
    @apply tw-text-base;
  }
}
</style>

<style lang="postcss">
.buy-sell {
  @apply tw-m-0 tw-p-0;

  .toggle {
    .ada-button {
      @apply tw-transition-all;
      @apply tw-h-11;
      &.buy {
        @apply tw-w-1/2;
        &:hover {
          @apply tw-bg-success;
        }
        &.active {
          @apply tw-bg-success tw-bg-opacity-80;
          &:hover {
            @apply tw-bg-success;
          }
        }
      }
      &.sell {
        @apply tw-w-1/2;
        &:hover {
          @apply tw-bg-error;
        }
        &.active {
          @apply tw-bg-error tw-bg-opacity-80;
          &:hover {
            @apply tw-bg-error;
          }
        }
      }
    }
  }

  .tabs {
    .frm {
      .inputColor {
        @apply tw-text-primary;
        .label {
          @apply tw-text-primary;
        }
        .scaffold {
          @apply tw-w-full;
          input {
            @apply tw-font-bold tw-py-1;
          }
        }
      }
      .ada-select {
        .input {
          @apply tw-bg-primary tw-bg-opacity-10 tw-rounded tw-items-center;
        }
      }
    }
  }
}
.menu {
  .calculate {
    @apply tw-rounded tw-shadow-xl tw-flex tw-flex-col tw-py-[14px] tw-px-[8px] tw-bg-white tw-mx-auto tw-text-black;
    /* @apply  */
    .ada-input {
      @apply tw-flex tw-items-center;
      .label {
        @apply tw-w-[65px];
      }
      .scaffold {
        @apply tw-w-full;
        border-color: transparent;
      }
      &.active {
        .scaffold {
          @apply tw-border-primary;
        }
      }
      &>:nth-child(1) {
        @apply tw-mt-[8px];
      }
    }

    & > :first-child {
      @apply tw-mb-[16px];
    }

    & > :last-child {
      @apply tw-mt-[16px];
      >span:last-child {
        @apply tw-mr-6 tw-text-info;
      }
    }
  }
}
</style>

<template>
  <div class="buy-sell">
    <ada-toggle v-model="tab" class="header-tabs">
      <ada-btn class="buy tw-rounded-none" :height="32" :model="1">{{
        $t("oms.buy")
      }}</ada-btn>
      <ada-btn class="sell tw-rounded-none" :height="32" :model="2">{{
        $t("oms.sell")
      }}</ada-btn>
    </ada-toggle>
    <ada-tabs v-model="tab" class="tabs">
      <ada-tab :model="1">
        <form class="frm">
          <div class="tw-col-span-2 tw-justify-center">
            <span class="tw-mx-3"
              >{{ $t("wealth.sharesCount") }} ({{ insName }}):
            </span>
            <numeric-field :value="active.amount" class="tw-pl-2" />
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.countThreshold") }}: </span>
            <numeric-field :value="1000" />
            <div class="bar"></div>
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.priceThreshold") }}: </span>
            <numeric-field :value="1000" />
          </div>
          <div class="tw-justify-between">
            <ada-input
              :label="$t('oms.count')"
              type="number"
              v-model="countVal"
              :id="`buyCountInputText-${insId}`"
              :readonly="countLock"
              class="inputColor"
              :min="!!active ? active.minQuantityPerOrder : 1"
              :max="!!active ? active.maxQuantityPerOrder || null : null"
            >
              <template #append>
                <ada-btn
                  :class="['tw-mx-1', countLock ? 'active' : '']"
                  :width="24"
                  :height="24"
                  @click="toggleCountLock"
                  icon
                  tabindex="-1"
                >
                  <ada-icon>isax-lock-1</ada-icon>
                </ada-btn>

                <ada-menu
                  :active="activeCalculator"
                  :mWidth="205"
                  :mLeft="28"
                
                >
                  <template #activator>
                    <ada-btn
                      @click.stop="activeCalculator = !activeCalculator"
                      :width="24"
                      :height="24"
                      tabindex="-1"
                      :class="[activeCalculator ? 'tw-bg-primary' : null]"
                    >
                      <ada-icon
                        :class="[activeCalculator ? 'tw-text-white' : null]"
                        >isax-calculator</ada-icon
                      >
                    </ada-btn>
                  </template>
                  <template #items>
                    <div class="calculate" v-ada-click-outside="()=> activeCalculator = false">
                      <div class="tw-flex">
                        <h6 v-text="$t('instrument.WithdrawableAmount')"></h6>
                        <span class="tw-mr-2 tw-text-success">
                          <b v-text="formatter.format(150000)"></b>
                          <!-- <span ></span> -->
                        </span>
                      </div>
                      <ada-input :label="$t('instrument.wholePrice')" type="number" placeholder="0" v-model="wholePriceBuy">
                      </ada-input>
                      <ada-input :label="$t('instrument.price')" type="number" readonly :modelValue="uniqPriceBuy">
                      </ada-input>

                      <div>
                        <span>{{$t('oms.wage')}}:</span>
                        <span>
                          <numeric-field :value="wageCalculateBuy" />
                          <span v-if="wageCalculateBuy">تومان</span>
                          </span
                        >
                      </div>
                    </div>
                  </template>
                </ada-menu>
              </template>
            </ada-input>
            <div class="bar"></div>
          </div>
          <div class="tw-justify-between">
            <ada-input
              :label="$t('oms.price')"
              type="number"
              v-model="priceVal"
              activeBorder
              :readonly="priceLock"
              class="inputColor"
              :min="!!active ? active.minAllowedPrice : 1"
              :max="!!active ? active.maxAllowedPrice || null : null"
            >
              <template #append>
                <ada-btn
                  :class="['tw-mx-1', priceLock ? 'active' : '']"
                  :width="24"
                  :height="24"
                  @click="togglePriceLock"
                  icon
                  tabindex="-1"
                >
                  <ada-icon color="primary">isax-lock-1</ada-icon>
                </ada-btn>
              </template>
            </ada-input>
          </div>
          <div class="tw-justify-between">
            <wealth-account-type
              v-model="accountTypefield"
              :label="$t('accounting.account.type')"
              class="tw-my-1 inputColor"
              height="24px"
              tabindex="-1"
            >
            </wealth-account-type>
            <div class="bar"></div>
          </div>
          <div class="tw-justify-between">
            <wealth-validity
              height="24px"
              class="tw-my-1 inputColor"
              :label="$t('accounting.account.credit')"
              tabindex="-1"
            >
            </wealth-validity>
          </div>
          <div class="tw-justify-between tw-col-span-2">
            <oms-buy-sell-card-percent
              v-model="order.discloseQuantity"
              :label="$t('oms.view-count')"
              height="31px"
              class="tw-flex tw-flex-grow inputColor"
              :min="30"
              :max="100"
              :total="countVal"
              :amount="100"
              tabindex="-1"
            >
            </oms-buy-sell-card-percent>
          </div>
          <div class="tw-justify-between">
            <ada-input
              :label="$t('wealth.order.creditPercent')"
              type="number"
              class="tw-h-[24px] inputColor"
              :min="0"
              :max="100"
              v-model="validatePercent"
              tabindex="-1"
            >
            </ada-input>
            <div class="bar"></div>
          </div>
          <div class="tw-justify-between">
            <div class="tw-w-max tw-flex tw-items-center">
              <input
                type="checkbox"
                v-model="orderDivision"
                class="input-checkbox"
                tabindex="-1"
              />
              <label
                for="input-checkbox"
                class="inputColor"
                v-text="$t('oms.splitOrders')"
              ></label>
            </div>
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.tradeWage") }}: </span>
            <numeric-field :value="buyWage" />
            <div class="bar"></div>
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.tradeValue") }}: </span>
            <numeric-field :value="buyTradeValue" />
          </div>
          <div class="tw-justify-center">
            <ada-btn
              class="draft"
              @click="
                () => {
                  placeOrder({ draft: true });
                }
              "
              depressed
              :tabindex="tab == 1 ? '-1' : null"
            >
              {{ $t("general.draft") }}
            </ada-btn>
            <div class="bar"></div>
          </div>
          <div class="tw-justify-center" tabindex="2">
            <ada-btn
              class="buy"
              height="24px"
              :disabled="!active || (active.status & 3) != 3"
              @click="
                () => {
                  placeOrder({ draft: false });
                }
              "
              depressed
              v-bind:style="
                countVal > 1 && priceVal
                  ? 'background-color: var(--c-success-rgb)'
                  : null
              "
            >
              {{ $t("oms.buy-btn") }}
            </ada-btn>
          </div>
        </form>
      </ada-tab>
      <ada-tab :model="2">
        <form class="frm">
          <div class="tw-col-span-2 tw-justify-center">
            <span class="tw-mx-3"
              >{{ $t("wealth.sharesCount") }} ({{ insName }}):
            </span>
            <numeric-field :value="active.amount" class="tw-pl-2" />
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.countThreshold") }}: </span>
            <numeric-field :value="1000" />
            <div class="bar"></div>
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.priceThreshold") }}: </span>
            <numeric-field :value="1000" />
          </div>
          <div class="tw-justify-between">
            <ada-input
              :label="$t('oms.count')"
              type="number"
              v-model="countVal"
              :id="`sellCountInputText-${insId}`"
              :readonly="countLock"
              class="tw-mt-1 inputColor"
              activeBorder
              :min="!!active ? active.minQuantityPerOrder : 1"
              :max="!!active ? active.maxQuantityPerOrder || null : null"
            >
              <template #append>
                <ada-btn
                  :class="['tw-mx-1', countLock ? 'active' : '']"
                  :width="24"
                  :height="24"
                  @click="toggleCountLock"
                  icon
                  tabindex="-1"
                >
                  <ada-icon color="primary">isax-lock-1</ada-icon>
                </ada-btn>
                <ada-menu
                  :active="activeCalculatorSell"
                  :mWidth="205"
                  :mLeft="28"
                
                >
                  <template #activator>
                    <ada-btn
                      @click.stop="activeCalculatorSell = !activeCalculatorSell"
                      :width="24"
                      :height="24"
                      tabindex="-1"
                      :class="[activeCalculatorSell ? 'tw-bg-primary' : null]"
                    >
                      <ada-icon
                        :class="[activeCalculatorSell ? 'tw-text-white' : null]"
                        >isax-calculator</ada-icon
                      >
                    </ada-btn>
                  </template>
                  <template #items>
                    <div class="calculate" v-ada-click-outside="()=> activeCalculatorSell = false">
                      <div class="tw-flex">
                        <h6 v-text="$t('instrument.WithdrawableAmount')"></h6>
                        <span class="tw-mr-2 tw-text-success">
                          <b v-text="formatter.format(150000)"></b>
                          <!-- <span ></span> -->
                        </span>
                      </div>
                      <ada-input :label="$t('instrument.wholePrice')" type="number" placeholder="0" v-model="wholePriceSell">
                      </ada-input>
                      <ada-input :label="$t('instrument.price')" type="number" readonly :modelValue="uniqPriceSell">
                      </ada-input>

                      <div>
                        <span>{{$t('oms.wage')}}:</span>
                        <span>
                          <numeric-field :value="wageCalculateSell" />
                          <span v-if="wageCalculateSell">تومان</span>
                          </span
                        >
                      </div>
                    </div>
                  </template>
                </ada-menu>
              </template>
            </ada-input>
            <div class="bar"></div>
          </div>
          <div class="tw-justify-between">
            <ada-input
              :label="$t('oms.price')"
              type="number"
              v-model="priceVal"
              :readonly="priceLock"
              class="tw-mt-1 inputColor"
              activeBorder
              :min="!!active ? active.minAllowedPrice : 1"
              :max="!!active ? active.maxAllowedPrice || null : null"
            >
              <template #append>
                <ada-btn
                  @click="togglePriceLock"
                  :class="['tw-mx-1', priceLock ? 'active' : '']"
                  :width="24"
                  :height="24"
                  icon
                  tabindex="-1"
                >
                  <ada-icon color="primary">isax-lock-1</ada-icon>
                </ada-btn>
              </template>
            </ada-input>
          </div>
          <div class="tw-justify-between">
            <wealth-account-type
              :label="$t('accounting.account.type')"
              class="tw-my-1 inputColor"
              height="24px"
              tabindex="-1"
            >
            </wealth-account-type>
            <div class="bar"></div>
          </div>
          <div class="tw-justify-between">
            <wealth-validity
              height="24px"
              class="tw-my-1 inputColor"
              :label="$t('accounting.account.credit')"
              tabindex="-1"
            >
            </wealth-validity>
          </div>
          <div class="tw-justify-between tw-col-span-2">
            <oms-buy-sell-card-percent
              v-model="order.discloseQuantity"
              :label="$t('oms.view-count')"
              height="31px"
              class="tw-flex tw-flex-grow inputColor"
              :min="30"
              :total="countVal"
              :amount="100"
              tabindex="-1"
            >
            </oms-buy-sell-card-percent>
          </div>
          <div class="tw-justify-between">
            <ada-input
              label="درصد سهام"
              type="number"
              class="tw-h-[24px] inputColor"
              :min="0"
              :max="100"
              v-model="validatePercent"
              tabindex="-1"
              activeBorder
            >
            </ada-input>
            <div class="bar"></div>
          </div>
          <div class="tw-justify-between">
            <div class="tw-w-max tw-flex tw-items-center">
              <input
                type="checkbox"
                v-model="orderDivision"
                class="input-checkbox"
                tabindex="-1"
              />
              <label
                for="input-checkbox"
                class="inputColor"
                v-text="$t('oms.splitOrders')"
              >
              </label>
            </div>
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.tradeWage") }}: </span>
            <numeric-field :value="sellWage" />
            <div class="bar"></div>
          </div>
          <div class="tw-justify-between">
            <span>{{ $t("oms.tradeValue") }}: </span>
            <numeric-field :value="sellTradeValue" />
          </div>
          <div class="tw-justify-center">
            <ada-btn
              class="draft"
              height="24px"
              @click="
                () => {
                  placeOrder({ draft: true });
                }
              "
              depressed
            >
              {{ $t("general.draft") }}
            </ada-btn>
            <div class="bar"></div>
          </div>
          <div class="tw-justify-center">
            <ada-btn
              class="sell"
              :disabled="!active || (active.status & 3) != 3"
              @click="
                () => {
                  placeOrder({ draft: false });
                }
              "
              depressed
              :tabindex="tab == 2 ? '1' : null"
            >
              {{ $t("oms.sell-btn") }}
            </ada-btn>
          </div>
        </form>
      </ada-tab>
    </ada-tabs>
  </div>
</template>
