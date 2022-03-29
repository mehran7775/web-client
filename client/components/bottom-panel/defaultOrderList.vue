<template>
  <v-data-table :items="orders" :headers="cols">
    <template #item.validity="{ item }">
      {{ item.validityDate }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
import { Order, OrderSearchModel, PaginatedResult, WatchlistColumns } from "@/types";
import { useOrder } from "~~/composables";

export default defineComponent({
  setup(params, context) {
    const orderManager = useOrder();
    const i18n = useI18n();
    const orders: Order[] = reactive([]);
    const cols = [
      new WatchlistColumns(
        i18n.t("wealth.order.creationDate").toString(),
        "creationDate"
      ),
      new WatchlistColumns(i18n.t("instrument.name").toString(), "name"),
      new WatchlistColumns(i18n.t("wealth.wealth").toString(), "wealth"),
      new WatchlistColumns(i18n.t("wealth.order.vol").toString(), "quantity"),
      new WatchlistColumns(i18n.t("wealth.order.type").toString(), "orderType"),
      new WatchlistColumns(i18n.t("wealth.order.side").toString(), "side"),
      new WatchlistColumns(i18n.t("wealth.order.validity").toString(), "validity"),
      new WatchlistColumns(i18n.t("general.status").toString(), "flags"),
    ];

    orderManager
      .getOrders(new OrderSearchModel())
      .then((res: PaginatedResult<Order> | undefined) => {
        if (res) orders.push(...res.data);
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
