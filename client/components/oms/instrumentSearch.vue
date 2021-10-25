<template>
  <v-autocomplete
    v-model="model"
    :placeholder="$t('instrument.search')"
    :loading="loading"
    :items="entries"
    append-icon=""
    append-outer-icon="mdi-magnify"
    item-text="name"
    item-value="id"
    @input="
      (val) => {
        $emit('input', val);
      }
    "
    @update:search-input="
      (val) => {
        search(val);
      }
    "
    hide-details
    outlined
    return-object
    dense
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  useContext,
} from "@nuxtjs/composition-api";
import { autoComplete } from "@/repositories/instruments_manager";
import { AutoCompleteItem } from "@/types";

export default defineComponent({
  emits: ["input"],
  setup(props) {
    const model = null;
    const axios = useAxios();
    const loading = ref(false);
    const entries: Array<AutoCompleteItem> = reactive([]);
    async function search(value: string) {
      if (value && value.length > 2) {
        loading.value = true;
        entries.splice(0, entries.length);
        try {
          const res = await autoComplete(value, axios);
          entries.push(...res.data.data);
        } finally {
          loading.value = false;
        }
      }
    }
    return {
      model,
      loading,
      entries,
      search,
    };
    //TODO Use vue3 version
    function useAxios() {
      return useContext().$axios;
    }
  },
});
</script>

