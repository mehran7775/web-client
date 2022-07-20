<script setup lang="ts">
import { ref, reactive, computed, watch } from "#app";
import FocusBoard from "@/components/dashboard/focusBoard/index.vue";
import WatchList from "~/components/dashboard/WatchList/index.vue";
import WatchlistSelector from "@/components/dashboard/watchlistSelector.vue";
import InstrumentSearch from "@/components/oms/instrumentSearch.vue";
import { InstrumentCache, InstrumentSearchModel, SearchModel } from "~/types";
import Bar from "~/components/bar.vue";
import { useUser } from "~/composables";
import { useRoute, onMounted } from "#app";

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
  () => userManager.watchList[name]
  ,
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
  <div class="2xl:tw-container">
    <div class="tw-grid tw-col-span-1">
      <focus-board>
        <template #toolbar>
          <watchlist-selector auto-route class="tw-mt-0 tw tw-max-w-[164px]" />
          <instrument-search class="tw-mt-0 tw-mr-2 tw-max-w-[164px]" focus-result />
          <ada-btn dark v-if="edited" @click="apply" color="success" class="tw-m-0 tw-mx-1 tw-p-0 tw-text-sm"
            :height="28" :width="56">
            {{ $t("general.apply") }}
          </ada-btn>
          <ada-btn dark v-if="edited" @click="reset" color="error" class="tw-m-0 tw-mx-1 tw-p-0  tw-text-sm"
            :height="28" :width="56">
            {{ $t("general.cancel") }}
          </ada-btn>
          <bar v-if="edited" class="tw-mx-1 tw-static" />
        </template>
      </focus-board>
    </div>
    <div class="tw-grid tw-scroll-p-1">
      <WatchList :searchModel="searchModel" />
    </div>
    <loading :loading="loadingRef" />
  </div>
</template>
