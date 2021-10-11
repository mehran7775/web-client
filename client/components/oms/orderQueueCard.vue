<template>
  <v-container class="text-center ma-0 py-0" fluid>
    <v-row dense>
      <v-col class="success--text">
        {{ $t("oms.buy") }}
      </v-col>
      <v-col class="error--text">
        {{ $t("oms.sell") }}
      </v-col>
    </v-row>
    <v-row class="text-no-wrap" dense>
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
        >{{ $t("oms.price") }}</v-col
      >
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.count-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.amount-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.price-short")
      }}</v-col>

      <v-col v-if="extraCol"></v-col>

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
        >{{ $t("oms.price") }}</v-col
      >
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.count-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.amount-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.price-short")
      }}</v-col>
    </v-row>
    <v-row class="striped" v-for="(item, index) in queue" :key="index" dense>
      <v-col
        :class="{ 'copy-cursor': copy }"
        @click="
          () => {
            $emit('count', item.buy.count);
          }
        "
        >{{ item.buy.count }}</v-col
      >
      <v-col>{{ item.buy.amount }}</v-col>
      <v-col
        :class="{ 'copy-cursor': copy }"
        @click="
          () => {
            $emit('price', item.buy.price);
          }
        "
        >{{ item.buy.price }}</v-col
      >

      <v-col v-if="extraCol"></v-col>

      <v-col
        :class="{ 'copy-cursor': copy }"
        @click="
          () => {
            $emit('count', item.sell.count);
          }
        "
        >{{ item.sell.count }}</v-col
      >
      <v-col>{{ item.sell.amount }}</v-col>
      <v-col
        :class="{ 'copy-cursor': copy }"
        @click="
          () => {
            $emit('price', item.sell.price);
          }
        "
        >{{ item.sell.price }}</v-col
      >
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  computed,
  reactive,
} from "@nuxtjs/composition-api";
import { OrderQueueItem } from "~/types/oms";

export default defineComponent({
  name: "order-queue-card",
  emits: ["count", "price"],
  props: {
    insId: Number,
    copy: Boolean,
    responsive: Boolean,
    "extra-col": Boolean,
  },
  setup(props) {
    const store = useStore();
    const queue: Array<OrderQueueItem> = reactive([]);
    store
      .dispatch("instruments/getOrderQueue", props.insId)
      .then((result: Array<OrderQueueItem>) => {
        queue.push(...result);
      });
    return {
      queue,
    };
  },
});
</script>
