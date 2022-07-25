<script setup lang="ts">
import { ref, reactive, useRouter, computed, useRoute, watch } from "#app";
import 
{ AutoCompleteItem,
  AutoCompleteSearchModel,
  Sector
  } from "@/types";
import { useAxios, useSectors, autoComplete as acom, useDebounce } from "~/composables";
import { autoComplete } from "@/repositories/oms/industry_manager";
import items from "../rightPanel/items";
import AutoCompleteFeild from '../AutoCompleteField.vue'

const props = withDefaults(defineProps<{
  secId?: number
}>(),{
  secId:0,
})

const axios = useAxios().createInstance();
const sectorManager = useSectors();
const model = ref<Sector|null>(null);
const val = ref<Sector|null>(null);
const router = useRouter();
const ac = acom([])

sectorManager.getSector(props.secId).then((res)=>{
  if(res != null){
    ac.state.suggestions.push({
       id: res.id.toString(),
      name: res.name,
      fullName: res.name
    })
    val.value=res
  }
  
})

////////////////

  watch(() => ac.state.userInput, (val) => {
    if (!val) {
      ac.state.loading = true
      useDebounce(() => {
        ac.state.suggestions.splice(0, Infinity)
        ac.state.loading = false
      }, 1600)()
      
    } else {
      ac.state.loading = true
      useDebounce(searchSectors, 1500)()
    }


  })





///////////////

function generateAddress(id: string): void {
  router.push("/watchlist/industries/" + id);
}

async function searchSectors() {
  console.log('me')
  try {
    const res = await autoComplete(new AutoCompleteSearchModel(ac.state.userInput, 0, 10), axios);
    if(res.data.data.length) {
      ac.state.suggestions.push(
         ...res.data.data.map((item) => ({
           fullName: (item.name).replace(
            ac.state.userInput,
            `<span class="tw-text-red-900 tw-font-bold">${ac.state.userInput}</span>`
          ),
          name: item.name,
          id: item.id
        }))
      )
    }else{
      ac.state.suggestions= []
    }
  } finally {
    ac.state.loading = false
  }
  
}

</script>

<template>
   <auto-complete-feild v-model="ac.state.userInput" borderColor="tw-border-gray-200" background="tw-bg-primary-100"
    :suggestions="ac.state.suggestions || ac.state.userInput != '' ? true : false"
    :placeholder="$t('oms.sectorAutoComplete')">
    <template #prepend>
      <ada-icon color="primary" :size="14"> isax-search-normal-1 </ada-icon>
    </template>
    <template #suggestions v-if="ac.state.loading || ac.state.suggestions.length || ac.state.userInput != ''">
      <ul class="tw-p-0 tw-m-0 tw-border tw-border-gray-200 tw-text-black tw-bg-white">
        <template v-if="ac.state.loading">
          <li class="tw-px-1 tw-py-2" v-text="$t('general.waiting')"></li>
        </template>
        <template v-else-if="ac.state.suggestions.length">
          <li v-for="item in ac.state.suggestions" :key="item.id"
            class="hover:tw-bg-primary-100 tw-cursor-pointer tw-px-1 tw-py-2" @click="select_suggest(item)">
            <span v-html="item.fullName"></span>
          </li>
        </template>
        <template v-else-if="ac.state.userInput != ''">
          <li class="tw-px-1 tw-py-2" v-text="$t('general.notFound')"></li>
        </template>
      </ul>
    </template>
  </auto-complete-feild>
 
</template>

<style lang="postcss" scoped>

</style>
