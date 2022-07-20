<script lang="ts">
import { ref, reactive, defineComponent } from "#app";
import { AutoCompleteItem, InstrumentSearchModel } from "@/types";
import FocusBoard from "@/components/dashboard/focusBoard/index.vue";
import WatchList from "~/components/dashboard/WatchList/index.vue";
import BoardSelector from "~/components/oms/boardSelector.vue";
import { useRoute, useRouter } from "#app";

export default defineComponent({
  components: {
    WatchList,
    FocusBoard,
    BoardSelector,
  },
  setup(context) {
    const route = useRoute();
    const router = useRouter();
    const instruments: Array<string> = reactive([]);
    const board = ref(-1);
    const loading = ref(false);
    const searchModel = ref(new InstrumentSearchModel());
    searchModel.value.length = 15;
    board.value = parseInt((route.params["board"] as string | null) ?? "-1");

    async function select(val: AutoCompleteItem) {
      loading.value = true;
      try {
        router.push("/watchlist/boards/" + val.id);
        searchModel.value.boardIds = [parseInt(val.id)];
      } finally {
        loading.value = false;
      }
    }

    return {
      select,
      board,
      loading,
      instruments,
      searchModel,
    };
  },
});
</script>

<template>
  <div class="2xl:tw-container tw-p-0">
    <div class="tw-grid tw-grid-cols-1">
      <div class="tw-col-span-1">
        <focus-board>
          <template #toolbar>
            <board-selector @input="select" :value="board" />
          </template>
        </focus-board>
      </div>
      <div class="tw-col-span-1">
        <WatchList :searchModel.sync="searchModel" paginated />
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
