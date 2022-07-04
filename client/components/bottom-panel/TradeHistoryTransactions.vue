<script setup lang="ts">
import { useNuxtApp, reactive, ref } from "#app";
import { useBottomPanel, useInstrument} from "~~/composables";
import DateTime from "../DateTime/dateTime.vue";
import NumericField from "../numericField.vue";
import { TradesHistory,WatchlistColumns, PaginatedResult, TradesHistorySerachModel } from "@/types";

const props = defineProps<{
  value: TradesHistorySerachModel
}>()

const { $i18n: i18n } = useNuxtApp();
const bottomPanelManager = useBottomPanel();
const instrumentManager = useInstrument();
const model = ref(props.value)
const tradeHistories: TradesHistory[] = reactive([]);
const cols = [
  new WatchlistColumns(i18n.t("instrument.name").toString(), "name"),
  new WatchlistColumns(i18n.t("instrument.tradeCount").toString(), "totalTrades"),
  new WatchlistColumns(i18n.t("instrument.totalShares").toString(), "totalShares"),
  new WatchlistColumns(i18n.t("instrument.totalTradesValue").toString(), "totalTradeValue"),
  new WatchlistColumns(i18n.t("instrument.dateTime").toString(), "dateTime"),
];

function getTradeHistories() {
    console.log("trade history")
  bottomPanelManager.setLoading(true);
  instrumentManager
    .getTradeHistories(props.value)
    .then((res: PaginatedResult<TradesHistory> | undefined) => {
      if (res) tradeHistories.push(...res.data);
      bottomPanelManager.setLoading(false);
    });
}
getTradeHistories();
</script>

<template>
    <ada-data-table :items="tradeHistories" :headers="cols" item-key="id" class="tw-w-full">
    <template #item.name="{ item }">
      <span>item.validity</span>
    </template>
    <template #item.totalTrades="{ item }">
      <NumericField :value="item.totalTrades" />
    </template>
    <template #item.totalShares="{ item }">
      <NumericField :value="item.totalShares" />
    </template>
    <template #item.totalTradeValue="{ item }">
      <NumericField :value="item.totalTradeValue" />
    </template>
    <template #item.dateTime="{ item }">
      <DateTime :value="item.dateTime" :format="$t('general.date.dt')" class="ltr" />
    </template>
  </ada-data-table>
</template>
