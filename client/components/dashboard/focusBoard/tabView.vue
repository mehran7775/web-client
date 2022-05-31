<script setup lang="ts">
import { ref, computed } from "#app";
import { Tabs, DeepOptions, Instrument, SameSectorQuery } from "@/types";
import instrumentCard from "@/components/oms/instrumentCard.vue";
import OrderQueueCard from "@/components/oms/orderQueueCard.vue";
import LegalRealCard from "@/components/oms/legalRealCard.vue";
import BuySellCard from "@/components/oms/BuySellCard/index.vue";
import { useBottomPanel, useInstrument } from "~/composables";

const bottomPanel = useBottomPanel();
const instrumentManager = useInstrument();
const instruments = instrumentManager.getFocus;
console.log(instrumentManager)

const count = ref(0);
const price = ref(0);
const tab = computed({
  get: () => {
    return instrumentManager.selectedId;
  },
  set: (val) => {
    instrumentManager.selectById(parseInt(val));
  },
});
function close(id: number) {
  instrumentManager.removeFocus(id);
}
async function deep(option: DeepOptions, instrument: Instrument) {
  bottomPanel.setDepthData(null);
  switch (option) {
    case DeepOptions.teammates:
      try {
        bottomPanel.setLoading(true);
        await bottomPanel.getTeammates(
          new SameSectorQuery(instrument.id, instrument.sectorCode)
        );
      } finally {
        bottomPanel.setLoading(false);
      }
      break;
    default:
      bottomPanel.setTitle({ tab: Tabs.depth, title: "oms." + option, params: [] });
      break;
  }
  bottomPanel.setActiveTab(Tabs.depth);
}
defineExpose({
  close,
  deep,
  price,
  count,
  tab,
  instruments,
  deepOptions: DeepOptions,
});
</script>

<style lang="postcss" scoped>
.tab-view {
  .detail {
    @apply tw-flex tw-flex-grow tw-justify-between;

    .panel {
      border-left: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
      width: calc(33% - 2px);
    }
  }
}
</style>

<template>
  <div class="tab-view">
    <v-tabs :height="32" color="primary" v-model="tab" align-with-title>
      <v-tab v-for="item in instruments" :key="item.id" :href="'#' + item.id" class="pe-1 ps-5">
        <v-badge color="success" dot left offset-y="75%" offset-x="-5">
          {{ item.name }}
        </v-badge>
        <ada-spacer />
        <ada-icon @click="() => close(item.id)" :size="12"> mdi-close </ada-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in instruments" :key="item.id" :value="item.id.toString()">
        <div class="detail">
          <div class="panel">
            <order-queue-card :insId="item.id" @count="
              (val) => {
                count = val;
              }
            " @price="
  (val) => {
    price = val;
  }
" copy responsive />
            <legal-real-card :insId="item.id" hide-headers responsive />
            <ada-col class="col-border tw-align-middle tw-justify-center">
              <ada-icon size="16"> isax-presention-chart </ada-icon>
            </ada-col>
          </div>
          <div class="panel">
            <instrument-card
              :insId="item.id"
              :insName="item.name"
              @count="
                (val) => {
                  count = val;
                }
              "
              @price="
                (val) => {
                  price = val;
                }
              "
              responsive
            />
          </div>
          <div class="panel">
            <buy-sell-card :price.sync="price" :count.sync="count" :insId="item.id" :insName="item.name" />
          </div>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
