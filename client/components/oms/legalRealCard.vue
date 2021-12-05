<template>
  <v-container class="text-center ma-0 py-0" fluid>
    <v-row v-if="!hideHeaders" dense>
      <v-col class="success--text">
        {{ $t("oms.buy") }}
      </v-col>
      <v-col class="error--text">
        {{ $t("oms.sell") }}
      </v-col>
    </v-row>
    <v-row v-show="!hideHeaders" class="text-no-wrap" dense>
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.count") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.amount") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.percent") }}</v-col
      >
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.count-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.amount-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.percent-short")
      }}</v-col>

      <v-col></v-col>

      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.count") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.amount") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.percent") }}</v-col
      >
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.count-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.amount-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.percent-short")
      }}</v-col>
    </v-row>
    <v-row class="striped" dense>
      <v-col>{{ distribution.real.buy.count }}</v-col>
      <v-col>{{ distribution.real.buy.amount }}</v-col>
      <v-col>{{ (distribution.real.buy.count / total) * 100 }}%</v-col>
      <v-col class="blue--text">{{ $t("user.personality.real") }}</v-col>
      <v-col>{{ distribution.real.sell.count }}</v-col>
      <v-col>{{ distribution.real.sell.amount }}</v-col>
      <v-col>{{ (distribution.real.buy.count / total) * 100 }}%</v-col>
    </v-row>
    <v-row class="striped" dense>
      <v-col>{{ distribution.legal.buy.count }}</v-col>
      <v-col>{{ distribution.legal.buy.amount }}</v-col>
      <v-col>{{ (distribution.legal.buy.count / total) * 100 }}%</v-col>
      <v-col class="blue--text">{{ $t("user.personality.legal") }}</v-col>
      <v-col>{{ distribution.legal.sell.count }}</v-col>
      <v-col>{{ distribution.legal.sell.amount }}</v-col>
      <v-col>{{ (distribution.legal.buy.count / total) * 100 }}%</v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useStore, ref, Ref } from "@nuxtjs/composition-api";
import { ClientDistribution } from "@/types";

export default defineComponent({
  name: "legal-real-card",
  props: {
    insId: Number,
    "hide-headers": Boolean,
    responsive: Boolean,
  },
  setup(props) {
    const store = useStore();
    const distribution: Ref<ClientDistribution> = ref(new ClientDistribution());
    const total = ref(1);
    store
      .dispatch("oms/instruments/getClientDistribution", props.insId)
      .then((result) => {
        if (result) {
          distribution.value = result;
          total.value =
            result.real.buy.count +
            result.real.sell.count +
            result.legal.buy.count +
            result.legal.sell.count;
          total.value = total.value == 0 ? 1 : total.value;
        }
      });
    return {
      distribution,
      total,
    };
  },
});
</script>
