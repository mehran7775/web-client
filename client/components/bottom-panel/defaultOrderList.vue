<template>
  <v-container fluid>
    <v-row dense>
      <v-col>
        <v-data-table :items="orders" :headers="cols"> </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive, useStore } from "@nuxtjs/composition-api";
import { Order, OrderSearchModel, PaginatedResult } from "@/types";

export default defineComponent({
  setup(params, context) {
    const store = useStore();
    const i18n = useI18n();
    const orders: Order[] = reactive([]);
    const cols = [
      {
        text: "id",
        value: "id",
      },
    ];

    store
      .dispatch("wealth/order/getOrders", new OrderSearchModel())
      .then((res: PaginatedResult<Order>) => {
        orders.push(...res.data);
      });

    return {
      cols,
      orders,
    };
    //TODO remove in vue3
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>

