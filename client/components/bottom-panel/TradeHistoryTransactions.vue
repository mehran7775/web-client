<script setup lang="ts">
import { useNuxtApp, reactive, ref, computed, watch } from "#app";
import { useBottomPanel, useInstrument } from "~~/composables";
import DateTime from "../DateTime/dateTime.vue";
import NumericField from "../numericField.vue";
import { TradesHistory, WatchlistColumns, PaginatedResult, TradesHistorySerachModel } from "@/types";

const { $i18n: i18n } = useNuxtApp();
const bottomPanelManager = useBottomPanel();
const instrumentManager = useInstrument();
const model = ref<TradesHistorySerachModel>({
  offset: 0,
  length: 17,
  instrumentId: null,
  echo: null
})
const tradeHistories: TradesHistory[] = reactive([]);
const inst = computed(() => instrumentManager.state.selected)
const defaultCols = [
  new WatchlistColumns(i18n.t("instrument.tradeDate").toString(), "dateTime"),
  new WatchlistColumns(i18n.t("instrument.tradeCount").toString(), "totalTrades"),
  new WatchlistColumns(i18n.t("instrument.totalShares").toString(), "totalShares"),
  new WatchlistColumns(i18n.t("instrument.totalTradesValue").toString(), "totalTradeValue"),
];

const cols = computed(() => {
  const tmp = [...defaultCols];
  if (instrumentManager.state.selected)
    tmp.push(...[
      new WatchlistColumns(i18n.t("instrument.opening").toString(), "opening"),
      new WatchlistColumns(i18n.t("instrument.lowest").toString(), "lowest"),
      new WatchlistColumns(i18n.t("instrument.highest").toString(), "highest"),
      new WatchlistColumns(i18n.t("instrument.last").toString(), "last"),
      new WatchlistColumns(i18n.t("instrument.closing").toString(), "closing"),
    ])
  return tmp;
});

function getTradeHistories() {
  bottomPanelManager.setLoading(true);
  tradeHistories.splice(0, Infinity);
  instrumentManager
    .getTradeHistories(model.value)
    .then((res: PaginatedResult<TradesHistory> | undefined) => {
      if (res) tradeHistories.push(...res.data);
    }).finally(() => {
      bottomPanelManager.setLoading(false);
    });
}

watch(() => inst.value, (update) => {
  model.value.id = update?.id || null
  getTradeHistories();
})

getTradeHistories();
</script>

<template>
  <ada-data-table :items="tradeHistories" :headers="cols" item-key="id" class="tw-w-full tw-h-full tw-overflow-y-auto">
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
      <DateTime :value="item.dateTime" :format="$t('general.date.d')" class="ltr" />
    </template>
  </ada-data-table>
</template>
