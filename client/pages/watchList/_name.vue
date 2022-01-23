<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row class="ma-0 pa-0" dense>
      <v-col class="ma-0 pa-0">
        <focus-board>
          <template #toolbar>
            <watchlist-selector style="max-width: 164px" auto-route />
            <instrument-search
              class="ms-1"
              style="max-width: 164px"
              focus-result
            />
            <v-btn
              v-if="edited"
              @click="apply"
              color="primary"
              class="ma-0 ms-1 pa-0"
              height="28"
              width="56"
            >
              {{ $t("general.apply") }}
            </v-btn>
          </template>
        </focus-board>
      </v-col>
    </v-row>
    <v-row class="ma-0 pa-0" dense>
      <v-col class="ma-0 pa-0">
        <WatchList :watchlists="instruments" />
      </v-col>
    </v-row>
    <loading :loading="loading" />
  </v-container>
</template>


<script lang="ts">
import {
  ref,
  computed,
  defineComponent,
  useContext,
  useRoute,
  useStore,
} from "@nuxtjs/composition-api";
import FocusBoard from "@/components/dashboard/focusBoard/index.vue";
import WatchList from "~/components/dashboard/WatchList/index.vue";
import WatchlistSelector from "@/components/dashboard/watchlistSelector.vue";
import InstrumentSearch from "@/components/oms/instrumentSearch.vue";

export default defineComponent({
  components: {
    WatchlistSelector,
    InstrumentSearch,
    WatchList,
    FocusBoard,
  },
  setup(context) {
    const route = useRoute();
    const store = useStore();
    const ctx = useContext();
    const loading = ref(false);
    const name = route.value.params.name;
    const watchlists = computed(() => store.getters["sso/user/watchList"]);
    const edited = computed(() => store.getters["sso/user/watchlistChanged"]);
    const instruments = computed(() => watchlists.value[name]);
    if (Object.keys(watchlists.value).length == 0) {
      store.commit("/sso/user/setWatchlist", { watchlist: [], name: "new" });
    }
    if (!name) {
      ctx.redirect(Object.keys(watchlists.value)[0]);
    }
    async function apply() {
      loading.value = true;
      const name = route.value.params.name;
      try {
        await store.dispatch("sso/user/update_settings", {
          path: "/watch_lists/" + name,
          value: watchlists.value[name],
        });
      } finally {
        loading.value = false;
      }
    }
    return {
      apply,
      loading,
      edited,
      instruments,
    };
  },
});
</script>
