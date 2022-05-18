<script setup lang="ts">
import { ref, reactive, computed, useRouter, useRoute } from "#app";
import 
{ SectorAutoCompleteItem,
  AutoCompleteSearchModel
  } from "@/types";
import { useAxios, useUser, useInstrument } from "~/composables";
import { autoComplete } from "@/repositories/oms/industry_manager";

const axios = useAxios().createInstance();
const loading = ref(false);
const entries: Array<SectorAutoCompleteItem> = reactive([]);
const model = ref(null);
const route = useRoute();
const router = useRouter();


function generateAddress(id: string): void {
  router.push("/watchlist/industries/" + id);
}

async function searchSectors(value: string) {
  if (!!value && value.length > 0) {
    loading.value = true;
    entries.splice(0, entries.length);
    try {
      const res = await autoComplete(new AutoCompleteSearchModel(value, 0, 10), axios);
      entries.push(
        ...res.data.data.map((item) => ({
          name: item.name,
          id: item.id
        }))
      );
    } finally {
      loading.value = false;
    }
  }
}

</script>

<template>
  <v-autocomplete
    height="28"
    v-model="model"
    :placeholder="$t('oms.sectorAutoComplete')"
    :loading="loading"
    :items="entries"
    class="sector-search no-translate"
    return-object
    append-icon=""
    item-text="name"
    item-value="id"
    @input="
      (val) => {
        $emit('input', val);
        generateAddress(val.id);
      }
    "
    @update:search-input="
      (val) => {
        searchSectors(val);
      }
    "
    :menu-props="{
      bottom: true,
      'offset-y': true,
      'content-class': 'sector-search__content',
    }"
    flat
    no-filter
    rounded
    hide-details
    dense
  />
 
</template>

<style lang="postcss" scoped>
.sector-search {
  background-color: rgba(var(--c-primary), 0.05);
  border-radius: var(--border-radius-root);
  font-size: 0.75rem;
}
</style>
<style lang="postcss">
.v-autocomplete__content {
  .sector-search-text {
    color: var(--c-primary-rgb);
  }
}
.sector-search {
  input {
    color: var(--c-primary-rgb) !important;
    &::placeholder {
      color: var(--c-primary-rgb) !important;
    }
  }
}
</style>