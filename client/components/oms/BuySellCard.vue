<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <v-tabs height="27" hide-slider v-model="tab" grow>
          <v-tab
            :class="{
              'success--text': tab != 0,
              'success lighten-4': tab == 0,
            }"
          >
            {{ $t("oms.buy") }}
          </v-tab>
          <v-tab
            :class="{
              'error--text': tab != 1,
              'error lighten-4': tab == 1,
            }"
          >
            {{ $t("oms.sell") }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-row dense>
              <v-col cols="6" class="d-flex justify-space-between">
                <span>{{ $t("oms.count") }}</span>
                <v-icon small>mdi-calculator</v-icon>
              </v-col>
              <v-col cols="6" class="d-flex justify-space-between">
                <span>{{ $t("oms.price") }}</span>
                <span>0 </span>
                <span>
                  <v-icon small>mdi-lock-open</v-icon>
                  <v-icon small>mdi-plus-circle-outline</v-icon>
                  <v-icon small>mdi-minus-circle-outline</v-icon>
                  <v-icon small>mdi-arrow-up-circle-outline</v-icon>
                  <v-icon small>mdi-arrow-down-circle-outline</v-icon>
                </span>
              </v-col>
              <v-col cols="6">
                <v-select dense :placeholder="$t('accounting.account.type')">
                </v-select>
              </v-col>
              <v-col cols="6">
                <v-select dense :placeholder="$t('accounting.account.credit')">
                </v-select>
              </v-col>
              <v-col cols="6">
                <v-checkbox :label="$t('oms.splitOrders')" dense />
              </v-col>
              <v-col cols="6">
                <span>{{ $t("oms.countThreshold") }}: </span>
                <span>1000 </span>
                <span>{{ $t("oms.priceThreshold") }}: </span>
                <span>1000 </span>
              </v-col>
              <v-col cols="6">
                <span>{{ $t("wealth.sharesCount") }}: </span>
                <span>1000 </span>
                <span>قیمت سر‌به‌سر: </span>
                <span>1000 </span>
              </v-col>
              <v-col cols="6">
                <span>{{ $t("oms.tradeWage") }}: </span>
                <span>1000 </span>
                <span>{{ $t("oms.tradeValue") }}: </span>
                <span>1000 </span>
              </v-col>
              <v-col cols="12"> </v-col>
              <v-col cols="6">
                <v-checkbox :label="$t('general.acceptPolicy')" dense />
              </v-col>
              <v-col cols="6">
                <v-btn depressed> {{ $t("general.draft") }} </v-btn>
                <v-btn color="success" depressed>{{ $t("oms.buy") }}</v-btn>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item>
            <v-row dense>
              <v-col cols="6" class="d-flex justify-space-between">
                <span>{{ $t("oms.count") }}</span>
                <v-icon small>mdi-calculator</v-icon>
              </v-col>
              <v-col cols="6" class="d-flex justify-space-between">
                <span>{{ $t("oms.price") }}</span>
                <span>0 </span>
                <span>
                  <v-icon small>mdi-lock-open</v-icon>
                  <v-icon small>mdi-plus-circle-outline</v-icon>
                  <v-icon small>mdi-minus-circle-outline</v-icon>
                  <v-icon small>mdi-arrow-up-circle-outline</v-icon>
                  <v-icon small>mdi-arrow-down-circle-outline</v-icon>
                </span>
              </v-col>
              <v-col cols="6">
                <v-select dense :placeholder="$t('accounting.account.type')">
                </v-select>
              </v-col>
              <v-col cols="6">
                <v-select dense :placeholder="$t('accounting.account.credit')">
                </v-select>
              </v-col>
              <v-col cols="6">
                <v-checkbox :label="$t('oms.splitOrders')" dense />
              </v-col>
              <v-col cols="6">
                <span>{{ $t("oms.countThreshold") }}: </span>
                <span>1000 </span>
                <span>{{ $t("oms.priceThreshold") }}: </span>
                <span>1000 </span>
              </v-col>
              <v-col cols="6">
                <span>{{ $t("wealth.sharesCount") }}: </span>
                <span>1000 </span>
                <span>قیمت سر‌به‌سر: </span>
                <span>1000 </span>
              </v-col>
              <v-col cols="6">
                <span>{{ $t("oms.tradeWage") }}: </span>
                <span>1000 </span>
                <span>{{ $t("oms.tradeValue") }}: </span>
                <span>1000 </span>
              </v-col>
              <v-col cols="12"> </v-col>
              <v-col cols="6">
                <v-checkbox :label="$t('general.acceptPolicy')" dense />
              </v-col>
              <v-col cols="6">
                <v-btn depressed> {{ $t("general.draft") }} </v-btn>
                <v-btn color="error" depressed>{{ $t("oms.sell") }}</v-btn>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useStore, computed } from "@nuxtjs/composition-api";
import { OrderSide, ActiveInstrument } from "@/types/oms";

export default defineComponent({
  props: {},
  setup(props) {
    const store = useStore();
    const active = computed(
      () => store.getters["instruments/getSelected"] as ActiveInstrument
    );
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
    return {
      tab,
      active,
    };
  },
});
</script>


