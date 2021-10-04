<template>
  <v-container class="text-center">
    <v-row dense>
      <v-col>
        {{ $t("oms.buy") }}
      </v-col>
      <v-col>
        {{ $t("oms.sell") }}
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-row>
          <v-col>{{ $t("oms.count") }}</v-col>
          <v-col>{{ $t("oms.amount") }}</v-col>
          <v-col>{{ $t("oms.price") }}</v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-row>
          <v-col>{{ $t("oms.count") }}</v-col>
          <v-col>{{ $t("oms.amount") }}</v-col>
          <v-col>{{ $t("oms.price") }}</v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-for="(item, index) in queue" :key="index" dense>
      <v-col>{{ item.buy.count }}</v-col>
      <v-col>{{ item.buy.amount }}</v-col>
      <v-col>{{ item.buy.price }}</v-col>
      <v-col>{{ item.sell.count }}</v-col>
      <v-col>{{ item.sell.amount }}</v-col>
      <v-col>{{ item.sell.price }}</v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useStore, computed } from "@nuxtjs/composition-api";
import { OrderQueueItem } from "~/types/oms";

export default defineComponent({
  name: "order-queue-card",
  props: ["instId"],
  setup(props) {
    const store = useStore();
    const queue = computed(
      () =>
        store.getters["instruments/getOrderQueue"](
          props.instId
        ) as Array<OrderQueueItem>
    );
    return {
      queue,
    };
  },
});
</script>
