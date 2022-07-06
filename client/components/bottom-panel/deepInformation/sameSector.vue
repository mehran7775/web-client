<script lang="ts" setup>
import { useBottomPanel, useInstrument } from "~~/composables";
import { defineComponent, ref, Ref, computed, reactive } from "#app";
import { InstrumentSearchModel, WatchlistColumns, SameSectorQuery, InstrumentCache } from "@/types";
import { watch, useNuxtApp } from "#app";


const instrumentManager = useInstrument()

const items = reactive<InstrumentCache[]>([])

const { $i18n: i18n } = useNuxtApp();
const cols = [
  new WatchlistColumns(i18n.t("instrument.name").toString(), "name"),
  new WatchlistColumns(i18n.t("instrument.lastPrice").toString(), "lastPrice"),
  new WatchlistColumns(i18n.t("instrument.closing").toString(), "closing"),
  new WatchlistColumns(i18n.t("instrument.tradeCount").toString(), "tradeCount"),
  new WatchlistColumns(i18n.t("instrument.tradeVol").toString(), "tradeVol"),
  new WatchlistColumns(i18n.t("instrument.tradeVal").toString(), "tradeVal")
];

const bottomPanel = useBottomPanel();


watch(() => instrumentManager.state.selected, (val) => {
  items.splice(0, Infinity);
  if (val) {
    getMygroups()
    return
  }
})

async function getMygroups() {
  const selected = instrumentManager.state.selected!
  bottomPanel.setLoading(true)
  try {
    const searchModel = new SameSectorQuery(selected.id, selected.sector)
    const { data } = await instrumentManager.getTeammates(searchModel)
    if (data.length > 0) {
      const sameSectors = await instrumentManager.getInstrumentsDetail(new InstrumentSearchModel(data), false)
      items.push(...sameSectors)
    }
  } catch (e) {
    console.log(e)
  } finally {
    bottomPanel.setLoading(false)
  }
}

</script>

<template>
  <ada-data-table v-if="items.length > 0" :items="items" :headers="cols" dense item-key="id" class="tw-w-full">
    <template #item.name="{ item }">
      <span>{{ item.name }}</span>
    </template>
    <template #item.lastPrice="{ item }">
      <NumericField :value="item.lastPrice" />
    </template>
    <template #item.closing="{ item }">
      <NumericField :value="item.closing" />
    </template>
    <template #item.tradeCount="{ item }">
      <NumericField :value="item.totalTrades" />
    </template>
    <template #item.tradeVol="{ item }">
      <NumericField :value="item.totalShares" />
    </template>
    <template #item.tradeVal="{ item }">
      <NumericField :value="item.totalTradesValue" />
    </template>
  </ada-data-table>
  <div v-else class="tw-p-3">
    <span v-text="$t('general.notFound')"></span>
  </div>
</template>