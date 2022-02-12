<template>
  <v-container class="text-center ma-0 pa-0" fluid>
    <v-row dense v-if="responsive" class="d-md-none headers">
      <v-col class="success--text">
        {{ $t("oms.buy") }}
      </v-col>
      <v-col class="error--text">
        {{ $t("oms.sell") }}
      </v-col>
    </v-row>
    <v-row class="text-no-wrap headers" dense>
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          'buy': true
        }"
        >{{ $t("oms.count") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          'buy': true
        }"
        >{{ $t("oms.amount") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          'success--text buy': true,
        }"
        >{{ $t("oms.buy") }}</v-col
      >
      <v-col v-if="responsive" class="d-md-none buy">{{ $t("oms.count-short") }}</v-col>
      <v-col v-if="responsive" class="d-md-none buy">{{ $t("oms.amount-short") }}</v-col>
      <v-col v-if="responsive" class="d-md-none buy">{{ $t("oms.price-short") }}</v-col>
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          'error--text': true,
          'sell': true
        }"
        >{{ $t("oms.sell") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          'sell': true
        }"
        >{{ $t("oms.amount") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          'sell': true
        }"
        >{{ $t("oms.count") }}</v-col
      >
      <v-col v-if="responsive" class="d-md-none sell">{{ $t("oms.price-short") }}</v-col>
      <v-col v-if="responsive" class="d-md-none sell">{{ $t("oms.amount-short") }}</v-col>
      <v-col v-if="responsive" class="d-md-none sell">{{ $t("oms.count-short") }}</v-col>
    </v-row>
    <v-row v-for="(item, index) in queue" :key="index" dense>
      <v-col
        :class="{ 'copy-cursor': copy, 'col-border': true }"
        @click="
          () => {
            $emit('count', item.buy.count);
          }
        "
        >{{ formatter.format(item.buy.count) }}</v-col
      >
      <v-col class="col-border">{{ formatter.format(item.buy.amount) }}</v-col>
      <v-col
        :class="{ 'copy-cursor': copy, 'col-border': true }"
        @click="
          () => {
            $emit('price', item.buy.price);
          }
        "
        >{{ formatter.format(item.buy.price) }}
        <bar />
      </v-col>
      <v-col
        :class="{ 'copy-cursor': copy, 'col-border': true }"
        @click="
          () => {
            $emit('price', item.sell.price);
          }
        "
        >{{ formatter.format(item.sell.price) }}</v-col
      >
      <v-col class="col-border">{{ formatter.format(item.sell.amount) }}</v-col>
      <v-col
        :class="{ 'copy-cursor': copy, 'col-border': true }"
        @click="
          () => {
            $emit('count', item.sell.count);
          }
        "
        >{{ formatter.format(item.sell.count) }}</v-col
      >
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  computed,
  ComputedRef,
  reactive,
} from "@nuxtjs/composition-api";
import { OrderQueueItem } from "@/types";
import { useAsrTrader, useInstrument } from "~/composables";

export default defineComponent({
  name: "order-queue-card",
  emits: ["count", "price"],
  props: {
    insId: { type: Number, required: true },
    copy: Boolean,
    responsive: Boolean,
    "extra-col": Boolean,
  },
  setup(props) {
    const store = useStore();
    const appManager = useAsrTrader(store);
    const instrumentManager = useInstrument(store);
    const queue: Array<OrderQueueItem> = reactive([]);
    const formatter = appManager.formatter;
    instrumentManager.getOrderQueue(props.insId).then((result) => {
      if (result.queue) {
        queue.push(...result.queue);
        for (let i = 5 - queue.length; i > 0; i--) {
          queue.push(new OrderQueueItem());
        }
      }
    });
    return {
      queue,
      formatter,
    };
  },
});
</script>

<style lang="sass" scoped>
.headers
  .sell
    background-color: #efeff1
  .buy
    background-color: #e0e0e0
</style>
