<script lang="ts">
import { defineComponent, ref, reactive, computed } from "#app";
import { autoComplete } from "@/repositories/oms/instruments_manager";
import {
  AutoCompleteItem,
  AutoCompleteSearchModel,
  InstrumentCache,
  InstrumentSearchModel,
} from "@/types";
import { useAxios, useInstrument, useUser } from "~/composables";
import { useRoute } from "#app";

export default defineComponent({
  emits: ["input"],
  props: { focusResult: { type: Boolean, default: false } },
  setup() {
    const userManager = useUser();
    const instrumentManager = useInstrument();

    const axios = useAxios().createInstance();
    const route = useRoute();
    const model = ref(null);
    const loading = ref(false);
    const entries: Array<AutoCompleteItem> = reactive([]);

    const focus = instrumentManager.getFocus;
    const watchlists = userManager.watchList;

    async function search(value: string) {
      if (!!value && value.length > 0) {
        loading.value = true;
        entries.splice(0, entries.length);
        try {
          const res = await autoComplete(new AutoCompleteSearchModel(value, 0, 7), axios);
          entries.push(
            ...res.data.data.map((item) => ({
              name: item.name,
              id: item.id,
              fullName: (item.name + " - " + item.fullName).replace(
                value,
                '<span class="instrument-search-text">' + value + "</span>"
              ),
            }))
          );
        } finally {
          loading.value = false;
        }
      }
    }
    async function select(val: AutoCompleteItem) {
      const name = route.params.name;
      loading.value = true;
      if (
        val &&
        (!watchlists[name] || watchlists[name]?.indexOf(val.id.toString()) == -1)
      ) {
        const inst = await instrumentManager.getInstrumentsDetail(
          new InstrumentSearchModel([val.id])
        );

        // If focus panel is open
        if (focus.length > 0 || !route.params.name) {
          instrumentManager.addFocus(inst[0]);
          instrumentManager.select(inst[0]);
        }

        const tmp = [val.id.toString()];
        tmp.push(...(watchlists[name] ?? []));
        userManager.setWatchlist({
          name,
          watchlist: tmp,
          changeState: true,
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
  },
});
</script>

<template>
  <v-autocomplete height="28" v-model="model" :placeholder="$t('instrument.search')" :loading="loading" :items="entries"
    class="instrument-search no-translate tw-text-base" append-icon="" item-text="name" item-value="id" @input="
      (val) => {
        if (focusResult) select(val);
        else $emit('input', val);
      }
    " @update:search-input="
  (val) => {
    search(val);
  }
" :menu-props="{
  bottom: true,
  'offset-y': true,
  'content-class': 'instrument-search__content',
}" flat no-filter rounded hide-details return-object dense>
    <template #prepend-inner>
      <ada-icon color="primary" class="mt-2" :size="14"> isax-search-normal-1 </ada-icon>
    </template>
    <template #item="{ item, on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-title v-html="item.fullName"> </v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<style lang="postcss" scoped>
.instrument-search {
  background-color: rgba(var(--c-primary), 0.05);
  border-radius: var(--border-radius-root);
}
</style>
<style lang="postcss">
.v-autocomplete__content {
  .instrument-search-text {
    color: var(--c-primary-rgb);
  }
}

.instrument-search {
  input {
    color: var(--c-primary-rgb) !important;

    &::placeholder {
      color: var(--c-primary-rgb) !important;
    }
  }
}
</style>
