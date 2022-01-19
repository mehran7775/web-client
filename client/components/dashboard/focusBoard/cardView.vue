<template>
  <div class="d-flex flex-row ma-0 pa-0" style="overflow-x: scroll">
    <v-card
      @click="() => select(item)"
      class="me-1 mb-1"
      min-width="430"
      max-width="430"
      v-for="item in instruments"
      :key="item.id"
    >
      <v-toolbar height="32" dense flat color="primary" dark>
        <v-card-title>
          <v-badge color="success" dot left offset-y="75%" offset-x="-5">
            {{ item.name }}
          </v-badge>
        </v-card-title>
        <v-spacer />
        <v-btn
          depressed
          height="24px"
          color="success"
          dark
          x-large
          class="ma-0 pa-0"
          @click.stop="() => order(item, Side.Buy)"
          :disabled="(item.status & 3) != 3"
        >
          {{ $t("oms.buy") }}
        </v-btn>
        <v-btn
          depressed
          height="24px"
          color="error"
          dark
          x-large
          class="ms-1 pa-0"
          @click.stop="() => order(item, Side.Sell)"
          :disabled="(item.status & 3) != 3"
        >
          {{ $t("oms.sell") }}
        </v-btn>
        <v-icon class="ms-1" color="error" @click.stop="() => close(item.id)" small>
          mdi-close-circle-outline
        </v-icon>
      </v-toolbar>
      <v-card-text class="text-caption ma-0 px-0">
        <order-queue-card :insId="item.id" extra-col />
        <legal-real-card :insId="item.id" hide-headers />
        <instrument-card :insId="item.id" hide-headers />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, useStore, computed } from "@nuxtjs/composition-api";
import { Side, InstrumentCache } from "@/types";
import instrumentCard from "@/components/oms/instrumentCardCompact.vue";
import OrderQueueCard from "@/components/oms/orderQueueCard.vue";
import LegalRealCard from "@/components/oms/legalRealCard.vue";

export default defineComponent({
  components: {
    instrumentCard,
    OrderQueueCard,
    LegalRealCard,
  },
  setup(props, context) {
    const store = useStore();
    const instruments = computed(
      () => store.getters["oms/instruments/getFocus"]
    );
    function close(item: InstrumentCache) {
      store.commit("oms/instruments/removeFocus", item.id);
      store.commit("oms/instruments/stopWatchQueue", item.id);
    }
    function order(item: InstrumentCache, side: Side) {
      store.commit("oms/instruments/updateInstrument", { id: item.id, side });
      store.commit("oms/instruments/select", item);
      store.commit("oms/instruments/setFocusMode", 0);
    }
    function select(item: InstrumentCache) {
      store.commit("oms/instruments/selectById", item.id);
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

