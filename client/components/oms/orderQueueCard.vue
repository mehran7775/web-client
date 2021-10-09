<template>
  <v-container class="text-center" fluid>
    <v-row dense>
      <v-col class="success--text">
        {{ $t("oms.buy") }}
      </v-col>
      <v-col class="error--text">
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
      <v-col
        cols="2"
        :class="{copy: copy}"
        @click="
          () => {
            $emit('count', item.buy.count);
          }
        "
        >{{ item.buy.count }}</v-col
      >
      <v-col>{{ item.buy.amount }}</v-col>
      <v-col
        cols="2"
        :class="{copy: copy}"
        @click="
          () => {
            $emit('price', item.buy.price);
          }
        "
        >{{ item.buy.price }}</v-col
      >
      <v-col
        cols="2"
        :class="{copy: copy}"
        @click="
          () => {
            $emit('count', item.sell.count);
          }
        "
        >{{ item.sell.count }}</v-col
      >
      <v-col>{{ item.sell.amount }}</v-col>
      <v-col
        cols="2"
        :class="{copy: copy}"
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
    insId: {
      require: true,
      type: Number,
    },
    copy: Boolean
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

<style scoped>
.copy {
  cursor: copy;
}
</style>
