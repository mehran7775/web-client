<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <v-tabs height="27" hide-slider v-model="tab" grow>
          <v-tab
            :class="{
              'green--text': tab != 0,
              'green lighten-4': tab == 0,
            }"
          >
            {{ $t("oms.buy") }}
          </v-tab>
          <v-tab
            :class="{
              'red--text': tab != 1,
              'red lighten-4': tab == 1,
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
                <v-select dense placeholder="نوع حساب"> </v-select>
              </v-col>
              <v-col cols="6">
                <v-select dense placeholder="اعتبار"> </v-select>
              </v-col>
              <v-col cols="6">
                <v-checkbox label="تقسیم سفارشات" dense />
              </v-col>
              <v-col cols="6">
                <span>آستانه‌ی تعداد: </span>
                <span>1000 </span>
                <span>آستانه‌ی قیمت: </span>
                <span>1000 </span>
              </v-col>
              <v-col cols="6">
                <span>تعداد دارایی: </span>
                <span>1000 </span>
                <span>قیمت سر‌به‌سر: </span>
                <span>1000 </span>
              </v-col>
              <v-col cols="6">
                <span>کارمزد معامله</span>
                <span>1000 </span>
                <span>ارزش معامله</span>
                <span>1000 </span>
              </v-col>
              <v-col cols="12"> </v-col>
              <v-col cols="6">
                <v-checkbox label="قوانین و مقررات را می‌پذیرم" dense />
              </v-col>
              <v-col cols="6">
                <v-btn depressed> پیش نویس </v-btn>
                <v-btn color="success" depressed>{{ $t("oms.buy") }}</v-btn>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item> sell </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const tab: Ref<number> = ref(0);

    return {
      tab,
    };
  },
});
</script>


