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

<script lang="ts">
import { defineComponent, useStore, computed, ref, Ref } from "@nuxtjs/composition-api";
import { Tabs, DeepOptions, TabTitle, Instrument, SameSectorQuery } from "@/types";
import instrumentCard from "@/components/oms/instrumentCard.vue";
import OrderQueueCard from "@/components/oms/orderQueueCard.vue";
import LegalRealCard from "@/components/oms/legalRealCard.vue";
import BuySellCard from "@/components/oms/BuySellCard/index.vue";
import { useInstrument } from "~/composables";

export default defineComponent({
  components: {
    instrumentCard,
    OrderQueueCard,
    LegalRealCard,
    BuySellCard,
  },
  setup(props, context) {
    const store = useStore();
    const instrumentManager = useInstrument(store);
    const instruments = instrumentManager.getFocus;

    const count: Ref<number> = ref(0);
    const price: Ref<number> = ref(0);
    const tab = instrumentManager.selectedId;
    function close(id: number) {
      instrumentManager.removeFocus(id);
    }
    async function deep(option: DeepOptions, instrument: Instrument) {
      store.commit("bottom-panel/setDepthData", null);
      switch (option) {
        case DeepOptions.teammates:
          try {
            store.commit("bottom-panel/setLoading", true);
            await store.dispatch(
              "bottom-panel/getTeammates",
              new SameSectorQuery(instrument.id, instrument.sectorCode)
            );
          } finally {
            store.commit("bottom-panel/setLoading", false);
          }
          break;
        default:
          store.commit(
            "bottom-panel/setTitle",
            new TabTitle(Tabs.depth, "oms." + option)
          );
          break;
      }
      store.commit("bottom-panel/setActiveTab", Tabs.depth);
    }
    return {
      close,
      deep,
      price,
      count,
      tab,
      instruments,
      deepOptions: DeepOptions,
    };
  },
});
</script>

<style lang="scss">
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
  .bar {
    opacity: 0.3;
  }
}
</style>

<style lang="scss" scoped>
.panel {
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
}
</style>
