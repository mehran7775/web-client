<script setup lang="ts">
import { useBottomPanel, useInstrument } from "~~/composables";
import DateTime from "../../date/time.vue";
import NumericField from "../../numericField.vue";
import { TradesHistory, WatchListColumns, PaginatedResult, TradesHistorySerachModel, DailyPrice, MarketHistory } from "@/types";
import { useI18n } from "vue-i18n"

const i18n  = useI18n();
const bottomPanelManager = useBottomPanel();
const instrumentManager = useInstrument();

const props = withDefaults(
  defineProps<{
    modelValue?:TradesHistorySerachModel
  }>(),
  {
  modelValue:()=>({
    offset: 0,
    length: 17,
  })
});
const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get(){
    return props.modelValue
  },
  set(value){
    emit("update:modelValue",value)
  }})
const tradeHistories = reactive<Array<TradesHistory>>([]);
const dailyPrices = reactive<Array<DailyPrice>>([]);
const inst = computed(() => instrumentManager.state.selected)
const defaultCols = [
  new WatchListColumns(i18n.t("instrument.tradeDate").toString(), "dateTime"),
  new WatchListColumns(i18n.t("instrument.tradeCount").toString(), "totalTrades"),
  new WatchListColumns(i18n.t("instrument.totalShares").toString(), "totalShares"),
  new WatchListColumns(i18n.t("instrument.totalTradesValue").toString(), "totalTradeValue"),
];

const cols = computed(() => {
  const tmp = [...defaultCols];
  if (instrumentManager.state.selected)
    tmp.push(...[
      new WatchListColumns(i18n.t("instrument.opening").toString(), "opening"),
      new WatchListColumns(i18n.t("instrument.lowest").toString(), "lowest"),
      new WatchListColumns(i18n.t("instrument.highest").toString(), "highest"),
      new WatchListColumns(i18n.t("instrument.last").toString(), "lastPrice"),
      new WatchListColumns(i18n.t("instrument.closing").toString(), "closing"),
    ])
  return tmp;
});

async function getTradeHistories() {
  bottomPanelManager.setLoading(true);
  tradeHistories.splice(0, Infinity);
  let task: Promise<DailyPrice[]> | null = null;
  if (inst)
    task = getDailyPrices();
  if (task) {
    const { data } = await instrumentManager.getTradeHistories(model.value)
    const daily = await task;
    tradeHistories.push(...data.map((market) => {
      const ind = daily.findIndex((item) => item.dateTime == market.dateTime);
      return {
        ...market,
        ...(ind > -1 ? daily[ind] : {})
      }
    }));
  } else {
    const { data } = await instrumentManager.getTradeHistories(model.value)
    tradeHistories.push(...data);
  }
  bottomPanelManager.setLoading(false);

}
async function getDailyPrices() {
  return await instrumentManager.getDailyPrices(model.value.id ?? 0, model.value)
}

watch(() => inst.value, (update) => {
  model.value.id = update?.id || null
  getTradeHistories();
})

getTradeHistories();
</script>

<template>
  <ada-data-table :items="tradeHistories" :headers="cols" item-key="dateTime"
    class="tw-w-full tw-h-full tw-overflow-y-auto">
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
