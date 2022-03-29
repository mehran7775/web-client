<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row class="ma-0 pa-0" dense>
      <v-col class="ma-0 pa-0">
        <focus-board>
          <template #toolbar>
            <watchlist-selector style="max-width: 164px" auto-route />
            <instrument-search class="ms-1" style="max-width: 164px" focus-result />
            <v-btn
              v-if="edited"
              @click="apply"
              color="success"
              class="ma-0 ms-1 pa-0"
              height="28"
              width="56"
              depressed
            >
              {{ $t("general.apply") }}
            </v-btn>
            <v-btn
              v-if="edited"
              @click="reset"
              color="error"
              class="ma-0 ms-1 pa-0"
              height="28"
              width="56"
              depressed
            >
              {{ $t("general.cancel") }}
            </v-btn>
            <bar v-if="edited" class="ms-1" />
          </template>
        </focus-board>
      </v-col>
    </v-row>
    <v-row class="ma-0 pa-0" dense>
      <v-col class="ma-0 pa-0">
        <WatchList :searchModel="searchModel" />
      </v-col>
    </v-row>
    <loading :loading="loading" />
  </v-container>
</template>

<script lang="ts">
import { ref, computed, defineComponent, watch } from "@vue/composition-api";
import FocusBoard from "@/components/dashboard/focusBoard/index.vue";
import WatchList from "~/components/dashboard/WatchList/index.vue";
import WatchlistSelector from "@/components/dashboard/watchlistSelector.vue";
import InstrumentSearch from "@/components/oms/instrumentSearch.vue";
import { InstrumentSearchModel } from "~/types";
import Bar from "~/components/bar.vue";
import { useUser } from "~/composables";
import { useNuxtApp, useRoute } from "#app";

export default defineComponent({
  components: {
    WatchlistSelector,
    InstrumentSearch,
    WatchList,
    FocusBoard,
    Bar,
  },
  setup(context) {
    const route = useRoute();
    const { $store: store } = useNuxtApp();
    const userManager = useUser();
    const loading = ref(false);
    const name = route.params.name ?? "new";
    const watchlists = userManager.watchList;
    const edited = computed(
      () =>
        userManager.settingsChanged.value.findIndex(
          (item) => item.key == "/watch_lists/" + name
        ) != -1
    );

    const searchModel = ref(
      new InstrumentSearchModel(
        watchlists.value[name]?.map((item) => parseInt(item)) ?? []
      )
    );

    watch(
      () => userManager.watchList.value[name],
      (wls) => {
        searchModel.value.ids.splice(0, searchModel.value.ids.length);
        searchModel.value.ids.push(...(wls?.map((item) => parseInt(item)) ?? []));
      }
    );
    async function reset() {
      loading.value = true;
      try {
        await userManager.getUser(userManager.me.value.userName);
      } finally {
        loading.value = false;
      }
    }

    async function apply() {
      loading.value = true;
      const name = route.params.name;
      try {
        await userManager.update_settings({
          path: "/watch_lists/" + name,
          value: watchlists.value[name],
        });
      } finally {
        loading.value = false;
      }
    }
    return {
      apply,
      reset,
      loading,
      edited,
      searchModel,
    };
  },
});
</script>
