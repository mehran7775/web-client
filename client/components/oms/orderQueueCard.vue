<template>
  <v-container class="text-center ma-0 pa-0" fluid>
    <v-row dense v-if="responsive" class="d-md-none">
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
          'success--text': true,
        }"
        >{{ $t("oms.buy") }}</v-col
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
          'error--text': true,
        }"
        >{{ $t("oms.sell") }}</v-col
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
        >{{ $t("oms.count") }}</v-col
      >
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.price-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.amount-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.count-short")
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
        >{{ formatter.format(item.buy.count) }}</v-col
      >
      <v-col>{{ formatter.format(item.buy.amount) }}</v-col>
      <v-col
        :class="{ 'copy-cursor': copy }"
        @click="
          () => {
            $emit('price', item.buy.price);
          }
        "
        >{{ formatter.format(item.buy.price) }}</v-col
      >

      <v-col v-if="extraCol"></v-col>

      <v-col
        :class="{ 'copy-cursor': copy }"
        @click="
          () => {
            $emit('price', item.sell.price);
          }
        "
        >{{ formatter.format(item.sell.price) }}</v-col
      >
      <v-col>{{ formatter.format(item.sell.amount) }}</v-col>
      <v-col
        :class="{ 'copy-cursor': copy }"
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
    const queue: Array<OrderQueueItem> = reactive([]);
    const formatter: ComputedRef<Intl.NumberFormat> = computed(
      () => store.getters["formatter"] as Intl.NumberFormat
    );
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
