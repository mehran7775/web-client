<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row class="ma-0 pa-0" dense>
      <v-col class="ma-0 pa-0">
        <focus-board />
      </v-col>
    </v-row>
    <v-row class="ma-0 pa-0" dense>
      <v-col class="ma-0 pa-0">
        <WatchList :watchlists="instruments" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { reactive, defineComponent, useStore } from "@nuxtjs/composition-api";
import { WealthSearchModel, Wealth } from "@/types";
import FocusBoard from "@/components/dashboard/focusBoard/index.vue";
import WatchList from "~/components/dashboard/WatchList/index.vue";

export default defineComponent({
  components: {
    WatchList,
    FocusBoard,
  },
  setup(context) {
    const store = useStore();
    const instruments: Array<string> = reactive([]);
    store
      .dispatch("wealth/getWealth", new WealthSearchModel())
      .then((wealth: Array<Wealth>) => {
        instruments.push(...wealth.map((item) => item.id.toString()));
      });

    return {
      instruments,
    };
  },
});
</script>
