<template>
  <v-card class="ma-0 pa-0">
    <v-toolbar class="pt-1" dense>
      <instrument-search style="max-width: 200pt" />
      <v-spacer />
      <v-btn-toggle v-model="viewMode" mandatory>
        <v-btn small>
          <v-icon small> mdi-view-headline </v-icon>
        </v-btn>
        <v-btn small>
          <v-icon small> mdi-view-grid-outline </v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <v-card-text v-if="instruments.length > 0">
      <card-view v-if="viewMode == 1" />
      <tab-view v-if="viewMode == 0" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, useStore } from "@nuxtjs/composition-api";
import InstrumentSearch from "@/components/oms/instrumentSearch.vue";
import CardView from "./cardView.vue";
import TabView from "./tabView.vue";

export default defineComponent({
  components: {
    InstrumentSearch,
    CardView,
    TabView,
  },
  name: "focus-board",
  setup(props) {
    const store = useStore();
    const instruments = computed(() => store.getters["instruments/getFocus"]);
    const viewMode = 0;
    return {
      viewMode,
      instruments,
    };
  },
});
</script>
