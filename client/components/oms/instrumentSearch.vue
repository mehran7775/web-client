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
      <v-icon color="primary" class="mt-2" small> adaico-search-normal </v-icon>
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
} from "@/types";

export default defineComponent({
  emits: ["input"],
  props: { "focus-result": { type: Boolean, default: false } },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const model = ref(null);
    const axios = useAxios();
    const loading = ref(false);
    const entries: Array<AutoCompleteItem> = reactive([]);

    const focus = computed(() => store.getters["oms/instruments/getFocus"]);
    const watchlists = computed(() => store.getters["sso/user/watchList"]);

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
      // If focus panel is open
      if (focus.value.length > 0 || !route.value.params.name) {
        store.commit("oms/instruments/addFocus", inst[0]);
        store.commit("oms/instruments/select", inst[0]);
      }

      const name = route.value.params.name;
      const tmp = [val.id.toString()];
      tmp.push(...watchlists.value[name]);
      store.commit("sso/user/setWatchlist", {
        name,
        watchlist: tmp,
      });

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
  border-radius: 8px
</style>
