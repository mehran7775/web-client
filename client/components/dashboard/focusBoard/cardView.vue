<template>
  <div class="d-flex flex-row ma-0 pa-0 card-row">
    <v-card
      @click="() => select(item)"
      class="me-3 card-view"
      min-width="346"
      :width="maxwidth - 14"
      :max-width="maxwidth"
      v-for="item in instruments"
      :key="item.id"
      tile
      elevation="0"
    >
      <v-toolbar height="32" dense flat class="toolbar pa-0 ma-0">
        <v-badge
          left
          class="title"
          offset-y="65%"
          offset-x="-4px"
          :color="
            (item.status & 1) != 1
              ? 'error'
              : (item.status & 6) != 6
              ? 'warning'
              : 'success'
          "
          dot
        >
          {{ item.name }}
        </v-badge>
        ({{ $t("instrument.state." + item.status) }})
        <v-spacer />
        <v-btn
          depressed
          height="24px"
          width="56px"
          color="success"
          dark
          small
          class="ma-0 me-2 pa-0 buy"
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
        <order-queue-card :insId="item.id" />
        <instrument-card :insId="item.id" hide-headers />
        <v-row>
          <v-col class="justify-center text-center">
            <v-icon size="16"> isax-presention-chart </v-icon>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { Side, InstrumentCache } from "@/types";
import instrumentCard from "@/components/oms/instrumentCardCompact.vue";
import OrderQueueCard from "@/components/oms/orderQueueCard.vue";
import LegalRealCard from "@/components/oms/legalRealCard.vue";
import InstrumentFlag from "@/components/oms/instrumentFlag.vue";
import { useInstrument } from "~/composables";
import { useNuxtApp } from "#app";

export default defineComponent({
  components: {
    instrumentCard,
    OrderQueueCard,
    LegalRealCard,
    InstrumentFlag,
  },
  setup(props, context) {
    const { $store: store } = useNuxtApp();
    const instrumentManager = useInstrument();
    const instruments = instrumentManager.getFocus;
    const maxwidth = computed(
      () => instrumentManager.width / Math.floor(instrumentManager.width / 360)
    );

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
      maxwidth,
      Side,
      instruments,
    };
  },
});
</script>

<style lang="postcss" scoped>
.buy {
  background-color: rgba(var(--c-success), 0.7) !important;
}
.sell {
  background-color: rgba(var(--c-error), 0.7) !important;
}
.close {
  background-color: rgba(var(--c-primary), 0.1) !important;
}
.toolbar {
  background-color: rgba(var(--c-primary), 0.05) !important;
  .title {
    font-weight: 700;
    font-size: 1rem !important;
    color: var(--c-primary-rgb);
    margin: 0 8px;
  }
}
.card-view {
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
}
.card-row {
  overflow-x: auto;
  overflow-y: hidden;
  height: 320px;
}
</style>

<style lang="postcss">
.card-view {
  * {
    font-size: 0.8334rem;
    line-height: 31px !important;
  }
  .row {
    padding: 0 !important;
    background-color: white;
  }
  .col {
    padding: 0;
    position: relative;
  }
  .bar {
    opacity: 0.3;
  }
}
</style>
