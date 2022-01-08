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
        if (focusResult) select(val);
        else $emit('input', val);
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
  useStore,
} from "@nuxtjs/composition-api";
import { autoComplete } from "@/repositories/oms/instruments_manager";
import {
  AutoCompleteItem,
  AutoCompleteSearchModel,
  InstrumentCache,
} from "@/types";

export default defineComponent({
  emits: ["input"],
  props: { "focus-result": { type: Boolean, default: false } },
  setup(props) {
    const store = useStore();
    const model = ref(null);
    const axios = useAxios();
    const loading = ref(false);
    const entries: Array<AutoCompleteItem> = reactive([]);
    async function search(value: string) {
      if (!!value) {
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
    async function select(val: InstrumentCache) {
      loading.value = true;
      const inst = await store.dispatch(
        "oms/instruments/getInstrumentsDetail",
        [val.id]
      );
      store.commit("oms/instruments/addFocus", inst[0]);
      loading.value = false;
      model.value = null;
    }
    return {
      model,
      loading,
      entries,
      search,
      select,
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
