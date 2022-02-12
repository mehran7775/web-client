<template lang="vue">
  <div class="d-flex flex-row ma-0 pa-0" style="overflow-x: scroll">
    <v-card
      @click="() => select(item)"
      class="me-1 mb-1 card-view"
      min-width="346"
      max-width="346"
      v-for="item in instruments"
      :key="item.id"
    >
      <v-toolbar height="32" dense flat class="toolbar pa-0 ma-0">
        <v-card-title>
          <v-badge color="success" dot left offset-y="75%" offset-x="-5">
            {{ item.name }}
          </v-badge>
        </v-card-title>
        <v-spacer />
        <v-btn
          depressed
          height="24px"
          width="56px"
          color="success"
          dark
          small
          class="ma-0 me-3 pa-0 buy"
          @click.stop="() => order(item, Side.Buy)"
        >
          {{ $t("oms.buy") }}
        </v-btn>
        <v-btn
          depressed
          height="24px"
          width="56px"
          color="error"
          dark
          small
          class="me-3 pa-0 sell"
          @click.stop="() => order(item, Side.Sell)"
        >
          {{ $t("oms.sell") }}
        </v-btn>
        <v-btn
          @click.stop="() => close(item)"
          height="24px"
          width="24px"
          class="close me-1"
          depressed
          small
        >
          <v-icon color="primary" x-small> mdi-close </v-icon>
        </v-btn>
      </v-toolbar>
      <div class="text-caption ma-0 px-0">
        <order-queue-card :insId="item.id" extra-col />
        <instrument-card :insId="item.id" hide-headers />
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, useStore, computed } from "@nuxtjs/composition-api";
import { Side, InstrumentCache } from "@/types";
import instrumentCard from "@/components/oms/instrumentCardCompact.vue";
import OrderQueueCard from "@/components/oms/orderQueueCard.vue";
import LegalRealCard from "@/components/oms/legalRealCard.vue";
import { useInstrument } from "~/composables";

export default defineComponent({
  components: {
    instrumentCard,
    OrderQueueCard,
    LegalRealCard,
  },
  setup(props, context) {
    const store = useStore();
    const instrumentManager = useInstrument(store);
    const instruments = instrumentManager.getFocus;

    function close(item: InstrumentCache) {
      instrumentManager.removeFocus(item.id);
    }
    function order(item: InstrumentCache, side: Side) {
      instrumentManager.updateInstrument(Object.assign({}, item, { side }));
      instrumentManager.select(item);
      instrumentManager.setFocusMode(0);
    }
    function select(item: InstrumentCache) {
      instrumentManager.selectById(item.id);
    }
    return {
      close,
      order,
      select,
      Side,
      instruments,
    };
  },
});
</script>

<style lang="sass" scoped>
.buy
  background-color: rgba($c-success,0.7) !important
.sell
  background-color: rgba($c-error,0.7) !important
.close
  background-color: rgba($c-primary,0.1) !important
.toolbar
  background-color: rgba($c-primary,0.05) !important
</style>

<style lang="sass">
.card-view
  *
    font-size: 0.75rem !important
    line-height: 31px  !important
  .row
    padding: 0 !important
    background-color: white
  .col
    padding: 0
    position: relative
  .bar
    opacity: 0.3
</style>
