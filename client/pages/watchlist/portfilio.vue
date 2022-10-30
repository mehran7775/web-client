<script lang="ts" setup>
import { WealthSearchModel, InstrumentSearchModel } from "@/types";
import { useWealth } from "~/composables";

definePageMeta({
  layout: "private-default"
})

const wealthManager = useWealth();
const searchModel = ref(new InstrumentSearchModel([]));
const loading = ref(true);
await wealthManager.getWealth(new WealthSearchModel()).then((wealth) => {
  if (wealth) {
      searchModel.value.ids.push(...wealth.map((item) => item.id));
  }
  loading.value = false;
});
</script>

<template>
  <div class="tw-mx-auto">
    <div class="tw-grid tw-col-span-1">
      <dashboard-focus-board>
        <template #toolbar>
          <div
            class="tw-rounded tw-w-52 tw-h-[28px] tw-bg-primary/10 tw-pr-2 tw-text-primary tw-text-right tw-flex tw-items-center"
          >
            <span class="tw-mb-1" v-text="$t('menu.wealth')"></span>
        </div>
        </template>
      </dashboard-focus-board>
    </div>
    <div class="tw-grid tw-scroll-p-1">
      <DashboardWatchList :searchModel="searchModel" paginated/>
    </div>
    <loading :loading="loading" />
  </div>
</template>

<style lang="postcss" scoped>
.menu {
  max-width: 164px;
  background-color: rgba(var(--c-primary), 0.05);
  border-radius: var(--border-radius-root);
}
</style>
