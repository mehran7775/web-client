<template>
  <v-autocomplete
    height="32"
    v-model="model"
    :placeholder="$t('instrument.search')"
    :loading="loading"
    :items="entries"
    class="instrument-search no-translate"
    append-icon=""
    prepend-inner-icon="mdi-magnify"
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
    flat
    no-filter
    rounded
    hide-details
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
import { autoComplete } from "@/repositories/oms/instruments_manager";
import { AutoCompleteItem, AutoCompleteSearchModel } from "@/types";

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
          const res = await autoComplete(
            new AutoCompleteSearchModel(value),
            axios
          );
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

<style lang="sass" scoped>
.instrument-search
  background-color: var(--v-common-base)
  border-radius: 8px
</style>
