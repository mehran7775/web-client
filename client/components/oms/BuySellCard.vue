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
        <v-form>
          <v-row align="center" dense>
            <v-col cols="6">
              <span>{{ $t("oms.countThreshold") }}: </span>
              <numeric-field :value="1000" />
            </v-col>
            <v-col cols="6">
              <span>{{ $t("oms.priceThreshold") }}: </span>
              <numeric-field :value="1000" />
            </v-col>
            <v-col cols="6">
              <v-text-field
                :label="$t('oms.count')"
                type="number"
                v-model="countVal"
                hide-details
                dense
              >
                <template #append>
                  <v-icon color="primary" small>isax-lock-bold</v-icon>
                  <v-icon color="primary" small>isax-calculator</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                :label="$t('oms.price')"
                type="number"
                v-model="priceVal"
                hide-details
                dense
              >
                <template #append>
                  <v-icon color="primary" small>isax-lock-bold</v-icon>
                  <v-icon color="primary" small>isax-arrow-up-2</v-icon>
                  <v-icon color="primary" small>isax-arrow-down-2</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select dense :placeholder="$t('accounting.account.type')" hide-details>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select dense :placeholder="$t('accounting.account.credit')" hide-details>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                :label="$t('oms.count')"
                type="number"
                v-model="countVal"
                hide-details
                dense
              >
                <template #append>
                  <v-icon color="primary" small>isax-lock-bold</v-icon>
                  <v-icon color="primary" small>isax-calculator</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-checkbox
                :label="$t('oms.splitOrders')"
                dense
                hide-details
                class="ma-0 pa-0"
                :ripple="false"
              />
            </v-col>
            <v-col class="d-flex justify-space-between" md="12">
              <span>{{ $t("wealth.sharesCount") }}: </span>
              <numeric-field :value="1000" />
              <span>قیمت سر‌به‌سر: </span>
              <numeric-field :value="1000" />
              <span>{{ $t("oms.tradeWage") }}: </span>
              <numeric-field :value="1000" />
              <span>{{ $t("oms.tradeValue") }}: </span>
              <numeric-field :value="1000" />
            </v-col>
            <v-col class="d-flex justify-space-between" md="12"> درصد سهم </v-col>
            <v-col cols="6">
              <v-checkbox
                :label="$t('general.acceptPolicy')"
                dense
                :ripple="false"
                hide-details
              />
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

<script lang="ts">
import { defineComponent, useStore, computed, Ref, ref } from "@nuxtjs/composition-api";
import { useInstrument } from "@/composables";
import { InstrumentCache, InstrumentSearchModel, Side } from "@/types";

export default defineComponent({
  props: {
    count: Number,
    price: Number,
    insId: { type: Number, required: true },
  },
  setup(props, { emit }) {
    const store = useStore();
    const instrumentManager = useInstrument(store);
    const active: Ref<InstrumentCache | null> = ref(null);
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
          instrumentManager.updateInstrument(
            Object.assign({}, active.value, {
              side: value == "2" ? Side.Sell : Side.Buy,
            })
          );
      },
    });

    instrumentManager
      .getInstrumentsDetail(new InstrumentSearchModel([props.insId]))
      .then((data: Array<InstrumentCache>) => {
        active.value = data[0];
      });

    return {
      tab,
      active,
      countVal,
      priceVal,
      Side,
    };
  },
});
</script>

<style lang="sass" scoped>
.buy
  &:hover
    background-color: $c-success
    color: white
  &:before
    display: none
    
.draft
  &:hover
    background-color: $c-info
    color: white
  &:before
    display: none
</style>

<style lang="sass">
.buy-sell
  .v-tab
    color: black
    background-color: #e0e0e0
    &--active
      &::before
        background-color: rgba(0,0,0,0)
        opacity: 0
      &.buy
        background-color: rgba($c-success,0.7)
      &.sell
        background-color: rgba($c-error,0.7)
</style>
