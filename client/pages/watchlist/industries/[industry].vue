<script setup lang="ts">
import { InstrumentSearchModel } from "@/types";

const route = useRoute();
const searchModel = ref(new InstrumentSearchModel());
searchModel.value.length = 105;
const secId = ref(0);
if (route.params.industry) {
  searchModel.value.secIds = [parseInt(route.params.industry as string)];
  secId.value = searchModel.value.secIds[0];
}

watch(
  () => route.params.industry,
  (sec) => {
    searchModel.value.secIds = [parseInt(sec as string)];
  }
);
</script>
<template>
  <div class="2xl:tw-container tw-p-0">
    <div class="tw-grid tw-grid-cols-1">
      <div class="tw-col-span-1">
        <dashboard-focus-board>
          <template #toolbar>
            <OmsIndustrySearch
              :secId="secId"
              class="ms-1"
              style="max-width: 164px"
            />
          </template>
        </dashboard-focus-board>
      </div>
      <div class="tw-col-span-1">
        <DashboardWatchList :searchModel="searchModel" paginated />
        <!-- <loading :loading="loading" /> -->
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.menu {
  @apply tw-bg-primary/5 tw-rounded;
  max-width: 164px;
}
</style>
