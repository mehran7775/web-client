<script setup lang="ts">
import { useNuxtApp, reactive } from "#app";
import { Order, OrderSearchModel, PaginatedResult, WatchlistColumns } from "@/types";
import { useOrder } from "~~/composables";

const orderManager = useOrder();
const { $i18n: i18n } = useNuxtApp();
const orders: Order[] = reactive([]);
const cols = [
  new WatchlistColumns(i18n.t("wealth.order.creationDate").toString(), "creationDate"),
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
</script>

<template>
  <v-data-table :items="orders" :headers="cols">
    <template #item.validity="{ item }">
      {{ item.validityDate }}
    </template>
  </v-data-table>
</template>
