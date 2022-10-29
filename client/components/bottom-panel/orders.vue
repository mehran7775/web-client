<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  Order,
  OrderSearchModel,
  PaginatedResult,
  WatchListColumns,
  OrderFlags,
  ValidationType,
} from "@/types";
import { useBottomPanel, useOrder } from "~~/composables";
import DateTime from "@/components/date/time.vue";
import NumericField from "@/components/numericField.vue";


const props = defineProps<{
  orders: Order[]
}>()


const bottomPanel = useBottomPanel();
const orderManager = useOrder();
const i18n = useI18n();
// const orders: Order[] = reactive([]);
const route = useRoute()
const cols = [
  new WatchListColumns(i18n.t("general.status").toString(), "flags"),
  new WatchListColumns(i18n.t("instrument.name").toString(), "name"),
  new WatchListColumns(i18n.t("wealth.order.vol").toString(), "quantity"),
  new WatchListColumns(i18n.t("wealth.order.vol-done").toString(), "doneQuantity"),
  new WatchListColumns(i18n.t("wealth.order.vol-rem").toString(), "remainQuantity"),
  new WatchListColumns(i18n.t("wealth.order.enteredPrice").toString(), "enteredPrice"),
  new WatchListColumns(i18n.t("wealth.order.creationDate").toString(), "creationDate"),
  new WatchListColumns(i18n.t("wealth.order.lastTransaction").toString(), "last"),
  new WatchListColumns(i18n.t("wealth.order.side.title").toString(), "side"),
  new WatchListColumns(i18n.t("wealth.order.validity").toString(), "validity"),
  new WatchListColumns("", "more"),
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
  return status.toString()
}

function parseValidityType(status: number) {
  if (status == ValidationType.Day) {
    return i18n.t("wealth.order.validationType.Day").toString();
  } else if (status == ValidationType.FillAndKill) {
    return i18n.t("wealth.order.validationType.FillAndKill").toString();
  } else if (status == ValidationType.GoodTillCancel) {
    return i18n.t("wealth.order.validationType.GoodTillCancel").toString();
  } else if (status == ValidationType.GoodTillDate) {
    return i18n.t("wealth.order.validationType.GoodTillDate").toString();
  } else if (status == ValidationType.Session) {
    return i18n.t("wealth.order.validationType.Session").toString();
  } else if (status == ValidationType.SlidingValidity) {
    return i18n.t("wealth.order.validationType.SlidingValidity").toString();
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


</script>

<template>
  <ada-data-table :items="orders" :headers="cols" item-key="id" class="tw-w-full">
    <template #item.creationDate="{ item }">
      <DateTime :value="item.creationDate" :format="$t('general.date.dt')" class="ltr" />
    </template>
    <template #item.last="{ item }">
      <DateTime :value="item.creationDate" :format="$t('general.date.dt')" class="ltr" />
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
    <template #item.flags="{ item }">
      {{ $t(parseOrderFlags(item.flags)) }}
    </template>
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
    <template #item.validity="{ item }">
      <span v-if="!hasValidityDate(item)">
        {{ parseValidityType(item.validity) }}
      </span>
      <DateTime v-else :value="item.validityDate" :format="$t('general.date.dt')" class="ltr" />
    </template>
  </ada-data-table>
</template>
