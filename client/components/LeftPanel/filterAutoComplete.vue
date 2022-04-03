<template>
  <v-autocomplete
    class="ma-0 mt-3 pa-0 px-2 bordred no-translate"
    v-model="values"
    :loading="loading"
    :items="items"
    :item-text="(item) => $t(item.name)"
    item-value="id"
    :search-input.sync="search"
    label="filters"
    append-icon="mdi-comment-search-outline"
    hide-details
    multiple
    small-chips
    deletable-chips
    dense
  >
  </v-autocomplete>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "#app";
import { AutoCompleteItem, PaginatedResult } from "@/types";
import { AxiosResponse } from "axios";
import { useMessages } from "~~/composables/oms/useMessages";

export default defineComponent({
  name: "filter-auto-complete",
  setup() {
    const defaultItems: AutoCompleteItem[] = [
      new AutoCompleteItem("-1", "oms.marketModerator"),
      new AutoCompleteItem("-2", "oms.notifications"),
      new AutoCompleteItem("-3", "oms.news"),
      new AutoCompleteItem("-4", "oms.presentation"),
    ];
    const messageManager = useMessages();
    const loading = ref(false);
    const search = ref("");
    const items: AutoCompleteItem[] = reactive([]);
    const values = reactive([]);

    watch(search, (val: string) => {
      if (val && val.length > 1) querySelections(val);
    });

    function querySelections(value: string) {
      loading.value = true;
      setTimeout(() => {
        messageManager
          .getMessageFilters(value)
          .then((result: AxiosResponse<PaginatedResult<AutoCompleteItem>>) => {
            items.splice(0, items.length);
            items.push(...defaultItems);
            if (result?.data) items.push(...result.data.data);
          })
          .finally(() => {
            loading.value = false;
          });
      }, 500);
    }

    return {
      defaultItems,
      items,
      values,
      loading,
      search,
    };
  },
});
</script>
