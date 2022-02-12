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
          buy: true,
        }"
        >{{ $t("oms.count") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          buy: true,
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
          sell: true,
        }"
        >{{ $t("oms.sell") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          sell: true,
        }"
        >{{ $t("oms.amount") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          sell: true,
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
      >
        <numeric-field v-model="item.buy.count"></numeric-field>
      </v-col>
      <v-col class="col-border">
        <numeric-field v-model="item.buy.amount"></numeric-field>
      </v-col>
      <v-col
        :class="{ 'copy-cursor': copy, 'col-border': true }"
        @click="
          () => {
            $emit('price', item.buy.price);
          }
        "
      >
        <numeric-field v-model="item.buy.price"></numeric-field>
        <bar />
      </v-col>
      <v-col
        :class="{ 'copy-cursor': copy, 'col-border': true }"
        @click="
          () => {
            $emit('price', item.sell.price);
          }
        "
      >
        <numeric-field v-model="item.sell.price"></numeric-field>
      </v-col>
      <v-col class="col-border">
        <numeric-field v-model="item.sell.amount"></numeric-field>
      </v-col>
      <v-col
        :class="{ 'copy-cursor': copy, 'col-border': true }"
        @click="
          () => {
            $emit('count', item.sell.count);
          }
        "
      >
        <numeric-field v-model="item.sell.count"></numeric-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useStore, reactive } from "@nuxtjs/composition-api";
import { OrderQueueItem } from "@/types";
import { useInstrument } from "~/composables";

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
    const instrumentManager = useInstrument(store);
    const queue: Array<OrderQueueItem> = reactive([
      new OrderQueueItem(),
      new OrderQueueItem(),
      new OrderQueueItem(),
      new OrderQueueItem(),
      new OrderQueueItem(),
    ]);
    instrumentManager.getOrderQueue(props.insId).then((result) => {
      if (result.queue) {
        queue.splice(0, queue.length);
        queue.push(...result.queue);
        for (let i = 5 - queue.length; i > 0; i--) {
          queue.push(new OrderQueueItem());
        }
      }
    });
    return {
      queue,
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
