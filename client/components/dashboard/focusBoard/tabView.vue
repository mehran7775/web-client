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

<template>
  <div class="tab-view">
    <v-tabs :height="32" color="primary" v-model="tab" align-with-title>
      <v-tab
        v-for="item in instruments"
        :key="item.id"
        :href="'#' + item.id"
        class="pe-1 ps-5"
      >
        <v-badge color="success" dot left offset-y="75%" offset-x="-5">
          {{ item.name }}
        </v-badge>
        <v-spacer />
        <v-icon @click="() => close(item.id)" small> mdi-close </v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in instruments" :key="item.id" :value="item.id.toString()">
        <v-row dense>
          <v-col class="ma-0 pa-0 panel">
            <order-queue-card
              :insId="item.id"
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
              copy
              responsive
            />
            <legal-real-card :insId="item.id" hide-headers responsive />
            <v-row>
              <v-col class="justify-center text-center">
                <v-icon size="16"> isax-presention-chart </v-icon>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="ma-0 pa-0 mx-3 panel">
            <instrument-card
              :insId="item.id"
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
          </v-col>
          <v-col class="ma-0 pa-0 panel">
            <buy-sell-card :price.sync="price" :count.sync="count" :insId="item.id" />
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<style lang="postcss" scoped>
.panel {
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  max-width: calc(33% - 2px);
}
</style>

<style lang="postcss">
.tab-view {
  * {
    font-size: 0.8334rem;
  }
  .row {
    padding: 0;
    margin: 0;
    line-height: 30px !important;
  }
  .col {
    padding: 0;
    margin: 0;
    position: relative;
    line-height: 30px !important;
  }
}
</style>
