<script lang="ts">
import { ref, defineComponent } from "#app";
import { WealthSearchModel, InstrumentSearchModel } from "@/types";
import FocusBoard from "@/components/dashboard/focusBoard/index.vue";
import WatchList from "~/components/dashboard/WatchList/index.vue";
import { useWealth } from "~/composables";

export default defineComponent({
  components: {
    WatchList,
    FocusBoard,
  },
  setup() {
    const wealthManager = useWealth();
    const searchModel = ref(new InstrumentSearchModel());
    const loading = ref(true);
    wealthManager.getWealth(new WealthSearchModel()).then((wealth) => {
      if (wealth) {
        searchModel.value.ids.push(...wealth.map((item) => item.id));
      }
      loading.value = false;
    });

    return {
      loading,
      searchModel,
    };
  },
});
</script>

<template>
  <div class="tw-grid">
    <div class="tw-col-span-1" dense>
      <focus-board>
        <template #toolbar>
          <v-input class="menu px-2" height="28" dense hide-details>
            {{ $t("menu.wealth") }}
          </v-input>
        </template>
      </focus-board>
    </div>
    <div class="tw-col-span-1" dense>
      <div class="tw-relative">
        <WatchList :searchModel="searchModel" paginated />
        <loading :loading="loading" />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.menu {
  max-width: 164px;
  background-color: rgba(var(--c-primary), 0.05);
  border-radius: var(--border-radius-root);
}
</style>
