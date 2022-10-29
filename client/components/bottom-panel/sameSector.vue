<script lang="ts" setup>
import { useBottomPanel, useInstrument } from "~~/composables";
import { InstrumentSearchModel, WatchListColumns, SameSectorQuery, InstrumentCache } from "@/types";
import { useI18n } from "vue-i18n"


const instrumentManager = useInstrument()

const items = reactive<InstrumentCache[]>([])

const i18n = useI18n();
const cols = [
  new WatchListColumns(i18n.t("instrument.name").toString(), "name"),
  new WatchListColumns(i18n.t("instrument.lastPrice").toString(), "lastPrice"),
  new WatchListColumns(i18n.t("instrument.closing").toString(), "closing"),
  new WatchListColumns(i18n.t("instrument.tradeCount").toString(), "tradeCount"),
  new WatchListColumns(i18n.t("instrument.tradeVol").toString(), "tradeVol"),
  new WatchListColumns(i18n.t("instrument.tradeVal").toString(), "tradeVal")
];

const bottomPanel = useBottomPanel();


watch(() => instrumentManager.getSelected, (val) => {
  items.splice(0, Infinity);
  if (val) {
    getMygroups()
    return
  }
})

async function getMygroups() {
  bottomPanel.setLoading(true)
  try {
    const searchModel = new SameSectorQuery(instrumentManager.getSelected?.id || 0, instrumentManager.getSelected?.sector || 0)
    const { data } = await instrumentManager.getTeammates(searchModel)
    if (data?.length > 0) {
      const sameSectors = await instrumentManager.getInstrumentsDetail(new InstrumentSearchModel(data), false)
      items.push(...sameSectors)
    }
  } catch (e) {
    console.log(e)
  } finally {
    bottomPanel.setLoading(false)
  }
}

getMygroups()

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