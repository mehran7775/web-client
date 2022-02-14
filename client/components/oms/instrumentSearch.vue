<template>
  <v-autocomplete
    height="28"
    v-model="model"
    :placeholder="$t('instrument.search')"
    :loading="loading"
    :items="entries"
    class="instrument-search no-translate"
    append-icon=""
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
  >
    <template #prepend-inner>
      <v-icon color="primary" class="mt-2" size="14"> isax-search-normal-1 </v-icon>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  useContext,
  useStore,
  useRoute,
} from "@nuxtjs/composition-api";
import { autoComplete } from "@/repositories/oms/instruments_manager";
import {
  AutoCompleteItem,
  AutoCompleteSearchModel,
  InstrumentCache,
  InstrumentSearchModel,
} from "@/types";
import { useInstrument, useUser } from "~/composables";

export default defineComponent({
  emits: ["input"],
  props: { "focus-result": { type: Boolean, default: false } },
  setup(props) {
    const store = useStore();
    const userManager = useUser(store);
    const instrumentManager = useInstrument(store);
    const route = useRoute();
    const model = ref(null);
    const axios = useAxios();
    const loading = ref(false);
    const entries: Array<AutoCompleteItem> = reactive([]);

    const focus = instrumentManager.getFocus;
    const watchlists = userManager.watchList;

    async function search(value: string) {
      if (!!value && value.length > 0) {
        loading.value = true;
        entries.splice(0, entries.length);
        try {
          const res = await autoComplete(new AutoCompleteSearchModel(value), axios);
          entries.push(...res.data.data);
        } finally {
          loading.value = false;
        }
      }
    }
    async function select(val: InstrumentCache) {
      const name = route.value.params.name;
      loading.value = true;
      if (
        val &&
        (!watchlists.value[name] ||
          watchlists.value[name]?.indexOf(val.id.toString()) == -1)
      ) {
        const inst = await instrumentManager.getInstrumentsDetail(
          new InstrumentSearchModel([val.id])
        );

        // If focus panel is open
        if (focus.value.length > 0 || !route.value.params.name) {
          instrumentManager.addFocus(inst[0]);
          instrumentManager.select(inst[0]);
        }

        const tmp = [val.id.toString()];
        tmp.push(...(watchlists.value[name] ?? []));
        userManager.setWatchlist({
          name,
          watchlist: tmp,
        });
      }
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
  background-color: rgba($c-primary,0.05)
  border-radius: $border-radius-root
  font-size: 0.75rem
</style>
<style lang="sass">
.instrument-search
  input
    color: $c-primary !important
    &::placeholder
      color: $c-primary !important
</style>
