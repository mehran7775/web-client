<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row class="ma-0 pa-0" dense>
      <v-col class="ma-0 pa-0">
        <focus-board>
          <template #toolbar>
            <v-input class="menu px-2" height="28" dense hide-details>
              {{ $t("menu.wealth") }}
            </v-input>
          </template>
        </focus-board>
      </v-col>
    </v-row>
    <v-row class="ma-0 pa-0" dense>
      <v-col class="ma-0 pa-0" style="position: relative">
        <WatchList :searchModel="searchModel" paginated/>
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
import { WealthSearchModel, Wealth, InstrumentSearchModel } from "@/types";
import FocusBoard from "@/components/dashboard/focusBoard/index.vue";
import WatchList from "~/components/dashboard/WatchList/index.vue";

export default defineComponent({
  components: {
    WatchList,
    FocusBoard,
  },
  setup(context) {
    const store = useStore();
    const searchModel = ref(new InstrumentSearchModel());
    const loading = ref(true);
    store
      .dispatch("wealth/getWealth", new WealthSearchModel())
      .then((wealth: Array<Wealth>) => {
        searchModel.value.ids.push(...wealth.map((item) => item.id));
        loading.value = false;
      });

    return {
      loading,
      searchModel,
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

