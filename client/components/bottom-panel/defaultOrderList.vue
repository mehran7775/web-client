<script setup lang="ts">
import { useNuxtApp, reactive, ref } from "#app";
import {
  Order,
  OrderSearchModel,
  PaginatedResult,
  WatchlistColumns,
  OrderFlags,
  ValidationType,
} from "@/types";
import { useBottomPanel, useOrder } from "~~/composables";
import DateTime from "../DateTime/dateTime.vue";
import NumericField from "../numericField.vue";

const props = withDefaults(defineProps<{
  value: OrderSearchModel
}>(), {
  value: () => new OrderSearchModel()
})

const searchModel = ref(props.value)

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
const agreement = ref(true);


function parseOrderFlags(status: number) {
  if (status == OrderFlags.Draft) {
    return "wealth.order.flags.Draft";
  } else if (status == OrderFlags.ClientRequest) {
    return "wealth.order.flags.ClientRequest";
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

function parseValidityType(status: number) {
  if (status == ValidationType.Day) {
    return "wealth.order.validationType.Day";
  } else if (status == ValidationType.FillAndKill) {
    return "wealth.order.validationType.FillAndKill";
  } else if (status == ValidationType.GoodTillCancel) {
    return "wealth.order.validationType.GoodTillCancel";
  } else if (status == ValidationType.GoodTillDate) {
    return "wealth.order.validationType.GoodTillDate";
  } else if (status == ValidationType.Session) {
    return "wealth.order.validationType.Session";
  } else if (status == ValidationType.SlidingValidity) {
    return "wealth.order.validationType.SlidingValidity";
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

function executeDraftOrder(draftOrder: Order) {
  const param: any = { ...draftOrder };
  param.flags = OrderFlags.Created;
  param.termsAndConditions = agreement.value;
  orderManager.editOrder(param);
}

function hasValidityDate(order: Order) {
  return (order.validityType == ValidationType.GoodTillDate)
    && (order.validityDate != null)
}

function getOrders() {
  bottomPanel.setLoading(true);
  orderManager
    .getOrders(searchModel.value)
    .then((res: PaginatedResult<Order> | undefined) => {
      if (res) orders.push(...res.data);
      bottomPanel.setLoading(false);
    });
}
getOrders();
</script>

<template>
  <ada-data-table :items="orders" :headers="cols" item-key="id" class="tw-w-full">
    <template #item.creationDate="{ item }">
      <DateTime :value="item.creationDate" :format="$t('general.date.dt')" class="ltr" />
    </template>
    <template #item.last="{ item }">
      <DateTime :value="item.creationDate" :format="$t('general.date.dt')" class="ltr" />
    </template>
    <template #item.validity="{ item }">
      <span v-if="!hasValidityDate(item)">
        {{ $t(parseValidityType(item.validity)) }}
      </span>
      <DateTime v-else :value="item.validityDate" :format="$t('general.date.dt')" class="ltr" />
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
      <ada-btn color="transparent" class="tw-m-0 tw-p-0" :width="24" :height="24" depressed
        :disabled="!isRunabled(item.flags)" @click="executeDraftOrder(item)">
        <ada-icon color="success" :disabled="!isRunabled(item.flags)" :size="16"> isax-play </ada-icon>
      </ada-btn>
      <ada-btn color="transparent" class="tw-m-0 tw-p-0" :width="24" :height="24" depressed
        :disabled="isEditDisabled(item.flags)">
        <ada-icon color="info" :disabled="isEditDisabled(item.flags)" :size="16"> isax-edit-2 </ada-icon>
      </ada-btn>
      <ada-btn color="transparent" class="tw-m-0 tw-p-0" :width="24" :height="24" depressed
        :disabled="isDeleteDisabled(item.flags)">
        <ada-icon color="error" :disabled="isDeleteDisabled(item.flags)" :size="16"> isax-trash </ada-icon>
      </ada-btn>
    </template>
  </ada-data-table>
</template>
