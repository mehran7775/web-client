<script setup lang="ts">
import { useNuxtApp, reactive } from "#app";
import { Order, OrderSearchModel, PaginatedResult, WatchlistColumns } from "@/types";
import { useOrder } from "~~/composables";
import DateTime from "../DateTime/dateTime.vue";
import NumericField from "../numericField.vue";

const orderManager = useOrder();
const { $i18n: i18n } = useNuxtApp();
const orders: Order[] = reactive([]);
const cols = [
  new WatchlistColumns(i18n.t("general.status").toString(), "flags"),
  new WatchlistColumns(i18n.t("instrument.name").toString(), "name"),
  new WatchlistColumns(i18n.t("wealth.order.vol").toString(), "quantity"),
  new WatchlistColumns(i18n.t("wealth.order.vol-done").toString(), "doneQuantity"),
  new WatchlistColumns(i18n.t("wealth.order.vol-rem").toString(), "remainQuantity"),
  new WatchlistColumns(i18n.t("wealth.order.creationDate").toString(), "creationDate"),
  new WatchlistColumns(i18n.t("wealth.order.lastTransaction").toString(), "last"),
  new WatchlistColumns(i18n.t("wealth.order.type").toString(), "orderType"),
  new WatchlistColumns(i18n.t("wealth.order.side").toString(), "side"),
  new WatchlistColumns(i18n.t("wealth.order.validity").toString(), "validity"),
  new WatchlistColumns(i18n.t("general.status").toString(), "more"),
];

orderManager
  .getOrders(new OrderSearchModel())
  .then((res: PaginatedResult<Order> | undefined) => {
    if (res) orders.push(...res.data);
  });
</script>

<template>
  <ada-data-table :items="orders" :headers="cols" id="id" class="tw-w-full">
    <template #item.creationDate="{ item }">
      <DateTime :value="item.creationDate" />
    </template>
    <template #item.last="{ item }">
      <DateTime :value="item.creationDate" />
    </template>
    <template #item.validity="{ item }">
      <DateTime :value="item.validityDate" />
    </template>
    <template #item.quantity="{ item }">
      <NumericField :value="item.quantity"></NumericField>
    </template>
    <template #item.remainQuantity="{ item }">
      <NumericField :value="item.remainQuantity"></NumericField>
    </template>
    <template #item.doneQuantity="{ item }">
      <NumericField :value="item.quantity - item.remainQuantity"></NumericField>
    </template>
    <template #item.more="{ item }"> {{ item.status }} </template>
  </ada-data-table>
</template>
