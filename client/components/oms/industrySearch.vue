<script setup lang="ts">
import { ref, reactive, useRouter, computed, useRoute } from "#app";
import 
{ AutoCompleteItem,
  AutoCompleteSearchModel,
  Sector
  } from "@/types";
import { useAxios, useSectors } from "~/composables";
import { autoComplete } from "@/repositories/oms/industry_manager";
import items from "../rightPanel/items";

const props = withDefaults(defineProps<{
  secId?: number
}>(),{
  secId:0,
})

const axios = useAxios().createInstance();
const sectorManager = useSectors();
const loading = ref(false);
const entries: Array<AutoCompleteItem> = reactive([]);
const model = ref<Sector|null>(null);
const val = ref<Sector|null>(null);
const router = useRouter();


sectorManager.getSector(props.secId).then((res)=>{
  if(res != null){
    entries.push({
      id: res.id.toString(),
      name: res.name,
      fullName: res.name
      })
    val.value=res
  }
  
})


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
          fullName:item.name,
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
    :value="val"
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