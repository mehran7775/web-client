<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row class="ma-0 pa-0" dense>
      <v-col class="ma-0 pa-0">
        <focus-board>
          <template #toolbar>
            <board-selector @input="select" />
          </template>
        </focus-board>
      </v-col>
    </v-row>
    <v-row class="ma-0 pa-0" dense>
      <v-col class="ma-0 pa-0" style="position: relative">
        <WatchList :watchlists="instruments" />
        <loading :loading="loading" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  ref,
  reactive,
  defineComponent,
  useStore,
} from "@nuxtjs/composition-api";
import { AutoCompleteItem } from "@/types";
import FocusBoard from "@/components/dashboard/focusBoard/index.vue";
import WatchList from "~/components/dashboard/WatchList/index.vue";
import BoardSelector from "~/components/oms/boardSelector.vue";

export default defineComponent({
  components: {
    WatchList,
    FocusBoard,
    BoardSelector,
  },
  setup(context) {
    const store = useStore();
    const instruments: Array<string> = reactive([]);
    const loading = ref(false);

    async function select(val: AutoCompleteItem) {
      loading.value = true;
      try {
        store.dispatch("oms/instruments/getInstrumentsDetail", {});
      } finally {
        loading.value = false;
      }
    }

    return {
      select,
      loading,
      instruments,
    };
  },
});
</script>

<style lang="sass" scoped>
.menu
  max-width: 164px
  background-color: rgba($c-primary,0.05)
  border-radius: $border-radius-root
</style>

