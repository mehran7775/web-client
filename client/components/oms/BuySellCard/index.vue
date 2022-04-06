<script setup lang="ts">
import { computed, Ref, ref } from "#app";
import { useInstrument } from "@/composables";
import { InstrumentCache, InstrumentSearchModel, Side } from "@/types";
import accountType from "@/components/wealth/accountType.vue";
import credit from "@/components/wealth/validity.vue";
import percent from "./percent.vue";

const props = defineProps<{
  count: number;
  price: number;
  insId: number;
}>();

const emit = defineEmits(["update:count", "update:price"]);

const instrumentManager = useInstrument();
const active: Ref<InstrumentCache> = ref(new InstrumentCache());
const countVal = computed({
  get() {
    return props.count?.toString();
  },
  set(val: string | undefined) {
    emit("update:count", val ? parseInt(val) : undefined);
  },
});
const priceVal = computed({
  get() {
    return props.price?.toString();
  },
  set(val: string | undefined) {
    emit("update:price", val ? parseInt(val) : undefined);
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

instrumentManager
  .getInstrumentsDetail(new InstrumentSearchModel([props.insId]))
  .then((data: Array<InstrumentCache>) => {
    active.value = data[0];
  });
</script>

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
      <v-tab-item value="1" class="px-3">
        <v-form class="tw-m-0 tw-p-0">
          <v-row align="center" dense>
            <v-col cols="6">
              <span>{{ $t("oms.countThreshold") }}: </span>
              <numeric-field :value="1000" />
            </v-col>
            <v-col cols="6">
              <span>{{ $t("oms.priceThreshold") }}: </span>
              <numeric-field :value="1000" />
            </v-col>
            <v-col cols="6" class="tw-pt-4">
              <text-input
                :label="$t('oms.count')"
                type="number"
                v-model="countVal"
                class="me-3 tw-mt-1"
              >
                <template #append>
                  <v-icon color="primary" class="tw-mx-1" x-small>isax-lock-1</v-icon>
                  <v-icon color="primary" class="tw-mx-1" x-small>isax-calculator</v-icon>
                </template>
              </text-input>
            </v-col>
            <v-col cols="6">
              <text-input
                :label="$t('oms.price')"
                type="number"
                v-model="priceVal"
                class="tw-mt-1"
              >
                <template #append>
                  <v-icon color="primary" class="tw-mx-1" x-small>isax-lock-1</v-icon>
                </template>
              </text-input>
            </v-col>
            <v-col cols="6" class="tw-pt-1">
              <account-type
                :placeholder="$t('accounting.account.type')"
                class="me-3 tw-my-1"
                height="24px"
              >
              </account-type>
            </v-col>
            <v-col cols="6">
              <credit
                height="24px"
                class="tw-my-1"
                :placeholder="$t('accounting.account.credit')"
              >
              </credit>
            </v-col>
            <v-col cols="6">
              <text-input
                :label="$t('oms.view-count')"
                type="number"
                v-model="countVal"
                class="me-3 tw-mt-1"
              >
                <template #append>
                  <span class="tw-w-6 tw-inline-block">0</span>
                </template>
              </text-input>
            </v-col>
            <v-col cols="6">
              <v-checkbox
                :label="$t('oms.splitOrders')"
                dense
                hide-details
                class="tw-m-0 tw-p-0 tw-mt-1"
                :ripple="false"
              />
            </v-col>
            <v-col class="d-flex justify-space-between" md="12">
              <span>{{ $t("wealth.sharesCount") }}: </span>
              <numeric-field :value="1000" />
              <span>{{ $t("oms.tradeWage") }}: </span>
              <numeric-field :value="1000" />
              <span>{{ $t("oms.tradeValue") }}: </span>
              <numeric-field :value="1000" />
            </v-col>
            <v-col class="d-flex justify-space-between" md="12"> </v-col>
            <v-col cols="6">
              <v-checkbox
                :label="$t('general.acceptPolicy')"
                dense
                :ripple="false"
                hide-details
              />
            </v-col>
            <v-col class="tw-flex-row ltr">
              <clock :format="$t('general.date.dt')" class="ltr" />
            </v-col>
            <v-col cols="12" class="d-flex justify-space-around">
              <v-btn class="draft" height="24" width="149" depressed>
                {{ $t("general.draft") }}
              </v-btn>
              <v-btn
                class="buy"
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
      <v-tab-item value="2" class="px-3">
        <v-form class="tw-m-0 tw-p-0">
          <v-row align="center" dense>
            <v-col cols="6">
              <span>{{ $t("oms.countThreshold") }}: </span>
              <numeric-field :value="1000" />
            </v-col>
            <v-col cols="6">
              <span>{{ $t("oms.priceThreshold") }}: </span>
              <numeric-field :value="1000" />
            </v-col>
            <v-col cols="6" class="tw-pt-4">
              <text-input
                :label="$t('oms.count')"
                type="number"
                v-model="countVal"
                class="me-3 tw-mt-1"
              >
                <template #append>
                  <v-icon color="primary" class="tw-mx-1" x-small>isax-lock-1</v-icon>
                  <v-icon color="primary" class="tw-mx-1" x-small>isax-calculator</v-icon>
                </template>
              </text-input>
            </v-col>
            <v-col cols="6">
              <text-input
                :label="$t('oms.price')"
                type="number"
                v-model="priceVal"
                class="tw-mt-1"
              >
                <template #append>
                  <v-icon color="primary" class="tw-mx-1" x-small>isax-lock-1</v-icon>
                </template>
              </text-input>
            </v-col>
            <v-col cols="6" class="tw-pt-1">
              <account-type
                :placeholder="$t('accounting.account.type')"
                class="me-3 tw-my-1"
                height="24px"
              >
              </account-type>
            </v-col>
            <v-col cols="6">
              <credit
                height="24px"
                class="tw-my-1"
                :placeholder="$t('accounting.account.credit')"
              >
              </credit>
            </v-col>
            <v-col cols="6">
              <text-input
                :label="$t('oms.view-count')"
                type="number"
                v-model="countVal"
                class="me-3 tw-mt-1"
              >
                <template #append>
                  <span class="tw-w-6 tw-inline-block">0</span>
                </template>
              </text-input>
            </v-col>
            <v-col cols="6">
              <v-checkbox
                :label="$t('oms.splitOrders')"
                dense
                hide-details
                class="tw-m-0 tw-p-0 tw-mt-1"
                :ripple="false"
              />
            </v-col>
            <v-col class="d-flex justify-space-between" md="12">
              <span>{{ $t("wealth.sharesCount") }}: </span>
              <numeric-field :value="1000" />
              <span>{{ $t("oms.tradeWage") }}: </span>
              <numeric-field :value="1000" />
              <span>{{ $t("oms.tradeValue") }}: </span>
              <numeric-field :value="1000" />
            </v-col>
            <v-col class="d-flex justify-space-between" md="12">
              <percent height="32px" class="tw-flex tw-flex-grow"> </percent>
            </v-col>
            <v-col cols="6"> </v-col>
            <v-col class="tw-flex-row ltr">
              <clock :format="$t('general.date.dt')" class="ltr" />
            </v-col>
            <v-col cols="12" class="d-flex justify-space-around">
              <v-btn class="draft" height="24" width="149" depressed>
                {{ $t("general.draft") }}
              </v-btn>
              <v-btn
                class="buy"
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
