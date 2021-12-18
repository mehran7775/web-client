<template>
  <v-card class="ma-0 pa-0 mx-1">
    <v-toolbar color="primary" dark :height="32" dense>
      <instrument-search style="max-width: 184px" />
      <v-spacer />
      <v-btn-toggle v-model="viewMode" mandatory light>
        <v-btn height="28" small>
          <v-icon small> mdi-view-headline </v-icon>
        </v-btn>
        <v-btn height="28" small>
          <v-icon small> mdi-view-grid-outline </v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <v-card-text v-if="instruments.length > 0" class="ma-0 pa-0 focus-board">
      <card-view @order="order" v-if="viewMode == 1" />
      <tab-view v-if="viewMode == 0" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  useStore,
  Ref,
  ref,
} from "@nuxtjs/composition-api";
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
    const instruments = computed(() => store.getters["oms/instruments/getFocus"]);
    const viewMode: Ref<number> = ref(0);
    function order() {
      viewMode.value = 0;
    }
    return {
      order,
      viewMode,
      instruments,
    };
  },
});
</script>

<style lang="sass">
.focus-board
  .row
    margin: 0
    padding: 0
    min-height: 32px
    .col
      min-height: 32px
</style>