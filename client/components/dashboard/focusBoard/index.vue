<template>
  <v-container fluid>
    <v-row>
      <v-col md="3">
        <instrument-search />
      </v-col>
      <v-col> </v-col>
    </v-row>
    <v-row v-if="instruments.length > 0">
      <v-col class="d-flex flex-row" style="overflow-x: scroll">
        <v-card min-width="428" v-for="item in instruments" :key="item.id">
          <v-card-title class="ma-0 pb-0">
            {{ item.name }}
            <v-spacer />
            <v-btn depressed height="24px" color="green" dark x-large>
              {{ $t("oms.buy") }}
            </v-btn>
            <v-btn
              depressed
              height="24px"
              color="red"
              dark
              x-large
              class="ms-1 pa-0"
            >
              {{ $t("oms.sell") }}
            </v-btn>
            <v-icon color="error" @click="() => close(item.id)" small>
              mdi-close-circle-outline
            </v-icon>
          </v-card-title>
          <v-card-text>
            <order-queue-card :insId="item.id" />
            <instrument-card :insId="item.id" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, useStore } from "@nuxtjs/composition-api";
import InstrumentSearch from "@/components/oms/instrumentSearch.vue";
import instrumentCard from "@/components/oms/instrumentCard.vue";
import OrderQueueCard from "~/components/oms/orderQueueCard.vue";

export default defineComponent({
  components: {
    instrumentCard,
    InstrumentSearch,
    OrderQueueCard,
  },
  name: "focus-board",
  setup(props) {
    const store = useStore();
    const instruments = computed(() => store.getters["instruments/getFocus"]);
    function close(id: number) {
      store.commit("instruments/removeFocus", id);
      store.commit("instruments/stopWatchQueue", id);
    }
    return {
      close,
      instruments,
    };
  },
});
</script>
