<template>
  <v-autocomplete
    v-model="values"
    :loading="loading"
    :items="items"
    :item-text="(item) => $t(item.name)"
    item-value="id"
    :search-input.sync="search"
    cache-items
    flat
    hide-no-data
    hide-details
    placeholder="filters"
    multiple
    deletable-chips
    small-chips
  >
  </v-autocomplete>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  useContext,
  watch,
} from "@nuxtjs/composition-api";
import { getMessageFilters } from "@/repositories/message_manager";
import { AutoCompleteItem } from "@/types/collection";
import { autoComplete } from "~/repositories/instruments_manager";

export default defineComponent({
  name: "filter-auto-complete",
  setup() {
    const defaultItems: AutoCompleteItem[] = [
      new AutoCompleteItem("-1", "oms.marketModerator"),
      new AutoCompleteItem("-2", "oms.notifications"),
      new AutoCompleteItem("-3", "oms.news"),
      new AutoCompleteItem("-4", "oms.presentation"),
    ];
    const context = useContext();
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
        getMessageFilters(value, context.$axios)
          .then((result) => {
            items.splice(0, items.length);
            items.push(...defaultItems);
            items.push(...result.data.data);
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
