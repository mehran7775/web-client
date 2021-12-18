<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-tabs height="27" hide-slider v-model="tab" grow>
      <v-tab
        :key="Side.Buy"
        :href="'#' + Side.Buy"
        :class="{
          'success--text': tab != 1,
          'success lighten-5': tab == 1,
        }"
      >
        {{ $t("oms.buy") }}
      </v-tab>
      <v-tab
        :key="Side.Sell"
        :href="'#' + Side.Sell"
        :class="{
          'error--text': tab != 2,
          'error lighten-5': tab == 2,
        }"
      >
        {{ $t("oms.sell") }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="1">
        <v-form>
          <v-container fluid>
            <v-row align="center" dense>
              <v-col md="6" sm="12">
                <v-text-field
                  :label="$t('oms.count')"
                  type="number"
                  v-model="countVal"
                  hide-details
                  dense
                >
                  <template #append>
                    <v-icon small>mdi-lock-open</v-icon>
                    <v-icon small>mdi-calculator</v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col md="6" sm="12">
                <v-text-field
                  :label="$t('oms.price')"
                  type="number"
                  v-model="priceVal"
                  hide-details
                  dense
                >
                  <template #append>
                    <v-icon small>mdi-lock-open</v-icon>
                    <v-icon small>mdi-plus-circle-outline</v-icon>
                    <v-icon small>mdi-minus-circle-outline</v-icon>
                    <v-icon small>mdi-arrow-up-circle-outline</v-icon>
                    <v-icon small>mdi-arrow-down-circle-outline</v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col md="6" sm="12">
                <v-select
                  dense
                  :placeholder="$t('accounting.account.type')"
                  hide-details
                >
                </v-select>
              </v-col>
              <v-col md="6" sm="12">
                <v-select
                  dense
                  :placeholder="$t('accounting.account.credit')"
                  hide-details
                >
                </v-select>
              </v-col>
              <v-col md="6" sm="12">
                <span>{{ $t("oms.countThreshold") }}: </span>
                <span>1000 </span>
                <span>{{ $t("oms.priceThreshold") }}: </span>
                <span>1000 </span>
              </v-col>
              <v-col md="6" sm="12">
                <span>{{ $t("wealth.sharesCount") }}: </span>
                <span>1000 </span>
                <span>قیمت سر‌به‌سر: </span>
                <span>1000 </span>
              </v-col>
              <v-col md="6" sm="12">
                <span>{{ $t("oms.tradeWage") }}: </span>
                <span>1000 </span>
                <span>{{ $t("oms.tradeValue") }}: </span>
                <span>1000 </span>
              </v-col>
              <v-col md="12"> </v-col>
              <v-col md="6" sm="12">
                <v-checkbox
                  :label="$t('oms.splitOrders')"
                  dense
                  hide-details
                  class="ma-0 pa-0"
                />
              </v-col>
              <v-col md="6" sm="12">
                <v-checkbox :label="$t('general.acceptPolicy')" dense />
              </v-col>
              <v-col md="6" sm="12">
                <v-btn depressed> {{ $t("general.draft") }} </v-btn>
                <v-btn color="success" depressed>{{ $t("oms.buy") }}</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-tab-item>
      <v-tab-item value="2">
        <v-form>
          <v-container fluid>
            <v-row align="center" dense>
              <v-col md="6" sm="12">
                <v-text-field
                  :label="$t('oms.count')"
                  type="number"
                  v-model="countVal"
                  hide-details
                  dense
                >
                  <template #append>
                    <v-icon small>mdi-lock-open</v-icon>
                    <v-icon small>mdi-calculator</v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col md="6" sm="12">
                <v-text-field
                  :label="$t('oms.price')"
                  type="number"
                  v-model="priceVal"
                  hide-details
                  dense
                >
                  <template #append>
                    <v-icon small>mdi-lock-open</v-icon>
                    <v-icon small>mdi-plus-circle-outline</v-icon>
                    <v-icon small>mdi-minus-circle-outline</v-icon>
                    <v-icon small>mdi-arrow-up-circle-outline</v-icon>
                    <v-icon small>mdi-arrow-down-circle-outline</v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col md="12" sm="12">
                <v-select
                  dense
                  :placeholder="$t('accounting.account.credit')"
                  hide-details
                >
                </v-select>
              </v-col>
              <v-col md="6" sm="12">
                <v-checkbox
                  :label="$t('oms.splitOrders')"
                  dense
                  hide-details
                  class="ma-0 pa-0"
                />
              </v-col>
              <v-col md="6" sm="12">
                <span>{{ $t("oms.countThreshold") }}: </span>
                <span>1000 </span>
                <span>{{ $t("oms.priceThreshold") }}: </span>
                <span>1000 </span>
              </v-col>
              <v-col md="6" sm="12">
                <span>{{ $t("wealth.sharesCount") }}: </span>
                <span>1000 </span>
                <span>قیمت سر‌به‌سر: </span>
                <span>1000 </span>
              </v-col>
              <v-col md="6" sm="12">
                <span>{{ $t("oms.tradeWage") }}: </span>
                <span>1000 </span>
                <span>{{ $t("oms.tradeValue") }}: </span>
                <span>1000 </span>
              </v-col>
              <v-col md="12"> </v-col>
              <v-col md="6" sm="12">
                <v-checkbox :label="$t('general.acceptPolicy')" dense />
              </v-col>
              <v-col md="6" sm="12">
                <v-btn depressed> {{ $t("general.draft") }} </v-btn>
                <v-btn color="error" depressed>{{ $t("oms.sell") }}</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  computed,
  Ref,
  ref,
  watch,
  ComputedRef,
} from "@nuxtjs/composition-api";
import { InstrumentCache, Side } from "@/types";

export default defineComponent({
  props: {
    count: Number,
    price: Number,
    insId: Number,
  },
  setup(props, { emit }) {
    const store = useStore();
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
        return (
          active.value?.side == Side.Sell ? Side.Sell : Side.Buy
        ).toString();
      },
      set(value: string) {
        if (active.value)
          store.commit("oms/instruments/updateInstrument", {
            id: active.value.id,
            side: value == "2" ? Side.Sell : Side.Buy,
          });
      },
    });

    store
      .dispatch("oms/instruments/getInstrumentsDetail", [props.insId])
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


