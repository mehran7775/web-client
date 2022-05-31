<script setup lang="ts">
import { ref, reactive, computed, watch } from "#app";
import FocusBoard from "@/components/dashboard/focusBoard/index.vue";
import WatchList from "~/components/dashboard/WatchList/index.vue";
import WatchlistSelector from "@/components/dashboard/watchlistSelector.vue";
import InstrumentSearch from "@/components/oms/instrumentSearch.vue";
import { InstrumentSearchModel } from "~/types";
import Bar from "~/components/bar.vue";
import { useUser } from "~/composables";
import { useRoute } from "#app";

const route = useRoute();
const userManager = useUser();
const loadingRef = ref(false);
const name = route.params.name ?? "new";
const watchlists = userManager.watchList;
const edited = computed(
  () =>
    userManager.settingsChanged.findIndex(
      (item) => item.key == "/watch_lists/" + name
    ) != -1
);

const searchModel = reactive(
  new InstrumentSearchModel(watchlists[name]?.map((item) => parseInt(item)) ?? [])
);

watch(
  () => userManager.watchList[name],
  (wls) => {
    searchModel.ids.splice(0, searchModel.ids.length);
    searchModel.ids.push(...(wls?.map((item) => parseInt(item)) ?? []));
  }
);
async function reset() {
  loadingRef.value = true;
  try {
    await userManager.getUser(userManager.me.userName);
  } finally {
    loadingRef.value = false;
  }
}

async function apply() {
  loadingRef.value = true;
  const name = route.params.name;
  try {
    await userManager.update_settings({
      path: "/watch_lists/" + name,
      value: watchlists[name],
    });
  } finally {
    loadingRef.value = false;
  }
}
defineExpose({
  apply,
  reset,
  loadingRef,
  edited,
  searchModel,
});

</script>

<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row class="ma-0 pa-0" dense>
      <v-col class="ma-0 pa-0">
        <focus-board>
          <template #toolbar>
            <watchlist-selector style="max-width: 164px" auto-route />
            <instrument-search class="ms-1" style="max-width: 164px" focus-result />
            <ada-btn dark v-if="edited" @click="apply" color="success" class="tw-m-0 tw-mx-1 tw-p-0 tw-text-sm" :height="28"
              :width="56">
              {{ $t("general.apply") }}
            </ada-btn>
            <ada-btn dark v-if="edited" @click="reset" color="error" class="tw-m-0 tw-mx-1 tw-p-0  tw-text-sm" :height="28"
              :width="56">
              {{ $t("general.cancel") }}
            </ada-btn>
            <bar v-if="edited" class="tw-mx-1 tw-static" />
          </template>
        </focus-board>
      </v-col>
    </v-row>
    <v-row class="ma-0 pa-0" dense>
      <v-col class="ma-0 pa-0">
        <WatchList :searchModel="searchModel" />
      </v-col>
    </v-row>
    <loading :loading="loadingRef" />
  </v-container>
</template>
