<script setup lang="ts">
import { useNuxtApp, reactive } from "#app";
import {
  Order,
  OrderSearchModel,
  PaginatedResult,
  WatchlistColumns,
  OrderFlags,
} from "@/types";
import { useBottomPanel, useOrder } from "~~/composables";
import DateTime from "../DateTime/dateTime.vue";
import NumericField from "../numericField.vue";

const bottomPanel = useBottomPanel();
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
  new WatchlistColumns(i18n.t("wealth.order.side.title").toString(), "side"),
  new WatchlistColumns(i18n.t("wealth.order.validity").toString(), "validity"),
  new WatchlistColumns("", "more"),
];

function parseOrderFlags(status: number) {
  if (status == OrderFlags.Draft) {
    return "wealth.order.flags.Draft";
  } else if (status == OrderFlags.Cancelled) {
    return "wealth.order.flags.Cancelled";
  } else if (status == OrderFlags.Created) {
    return "wealth.order.flags.Created";
  } else if (status == (OrderFlags.Created | OrderFlags.Sent)) {
    return "wealth.order.flags.Sent";
  } else if (status == (OrderFlags.Created | OrderFlags.Sent | OrderFlags.Confirmed)) {
    return "wealth.order.flags.Confirmed";
  } else if (
    status ==
    (OrderFlags.Created | OrderFlags.Sent | OrderFlags.Confirmed | OrderFlags.PreOpening)
  ) {
    return "wealth.order.flags.PreOpening";
  }
}

function isRunabled(status: number) {
  return (status & OrderFlags.Draft) == OrderFlags.Draft;
}

function isEditDisabled(status: number) {
  return (status & OrderFlags.Editable) != 0;
}

function isDeleteDisabled(status: number) {
  return (status & OrderFlags.Deleteable) != 0;
}

function getOrders() {
  bottomPanel.setLoading(true);
  orderManager
    .getOrders(new OrderSearchModel())
    .then((res: PaginatedResult<Order> | undefined) => {
      if (res) orders.push(...res.data);
      bottomPanel.setLoading(false);
    });
}
getOrders();
</script>

<template>
  <ada-data-table :items="orders" :headers="cols" id="id" class="tw-w-full">
    <template #item.creationDate="{ item }">
      <DateTime :value="item.creationDate" :format="$t('general.date.dt')" class="ltr" />
    </template>
    <template #item.last="{ item }">
      <DateTime :value="item.creationDate" :format="$t('general.date.dt')" class="ltr" />
    </template>
    <template #item.validity="{ item }">
      <DateTime :value="item.validityDate" :format="$t('general.date.dt')" class="ltr" />
    </template>
    <template #item.quantity="{ item }">
      <NumericField :value="item.quantity" />
    </template>
    <template #item.remainQuantity="{ item }">
      <NumericField :value="item.remainQuantity" />
    </template>
    <template #item.doneQuantity="{ item }">
      <NumericField :value="item.quantity - item.remainQuantity" />
    </template>
    <template #item.side="{ item }">
      <span>{{ $t("wealth.order.side." + item.side) }}</span>
    </template>
    <template #item.flags="{ item }"> {{ $t(parseOrderFlags(item.flags)) }}</template>
    <template #item.more="{ item }">
      <v-btn
        color="transparent"
        class="ma-0 pa-0"
        width="24"
        height="24"
        depressed
        :disabled="!isRunabled(item.flags)"
      >
        <ada-icon color="success" size="16"> isax-play </ada-icon>
      </v-btn>
      <v-btn
        color="transparent"
        class="ma-0 pa-0"
        width="24"
        height="24"
        depressed
        :disabled="isEditDisabled(item.flags)"
      >
        <ada-icon color="info" size="16"> isax-edit-2 </ada-icon>
      </v-btn>
      <v-btn
        color="transparent"
        class="ma-0 pa-0"
        width="24"
        height="24"
        depressed
        :disabled="isDeleteDisabled(item.flags)"
      >
        <ada-icon color="error" size="16"> isax-trash </ada-icon>
      </v-btn>
    </template>
  </ada-data-table>
</template>
