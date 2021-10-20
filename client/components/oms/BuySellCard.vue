<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row dense>
      <v-col md="12">
        <v-tabs height="27" hide-slider v-model="tab" grow>
          <v-tab
            :class="{
              'success--text': tab != 0,
              'success lighten-5': tab == 0,
            }"
          >
            {{ $t("oms.buy") }}
          </v-tab>
          <v-tab
            :class="{
              'error--text': tab != 1,
              'error lighten-5': tab == 1,
            }"
          >
            {{ $t("oms.sell") }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
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
                    <v-btn color="success" depressed>{{ $t("oms.buy") }}</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-tab-item>
          <v-tab-item>
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
      </v-col>
    </v-row>
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
} from "@nuxtjs/composition-api";
import { OrderSide, ActiveInstrument } from "@/types";

export default defineComponent({
  props: {
    count: Number,
    price: Number,
  },
  setup(props, { emit }) {
    const store = useStore();
    let _count: Ref<number> = ref(0);
    let _price: Ref<number> = ref(0);
    const active = computed(
      () => store.getters["instruments/getSelected"] as ActiveInstrument
    );
    const countVal = computed({
      get() {
        return _count.value;
      },
      set(val) {
        if (typeof val == "string") _count.value = val ? parseInt(val) : 0;
        emit("update:count", _count.value);
      },
    });
    const priceVal = computed({
      get() {
        return _price.value;
      },
      set(val) {
        if (typeof val == "string")  _price.value = val ? parseInt(val) : 0;
        emit("update:price", _price.value);
      },
    });
    const tab = computed({
      get(): number {
        return active.value.side == OrderSide.Buy ? 0 : 1;
      },
      set(value: number) {
        store.commit(
          "instruments/selectSide",
          value ? OrderSide.Sell : OrderSide.Buy
        );
      },
    });

    watch(
      () => props.count,
      (val: number | undefined) => {
        _count.value = val ?? 0;
      }
    );
    watch(
      () => props.price,
      (val: number | undefined) => {
        _price.value = val ?? 0;
      }
    );
    return {
      tab,
      active,
      countVal,
      priceVal,
    };
  },
});
</script>


