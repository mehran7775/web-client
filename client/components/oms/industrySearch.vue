<script setup lang="ts">
import {
AutoCompleteItem,
AutoCompleteSearchModel,
Sector
} from "@/types";
import { useAxios, useSectors, useAutoComplete as acom, useDebounce } from "~/composables";
import { autoComplete } from "@/repositories/oms/industry_manager";

const props = withDefaults(defineProps<{
  secId?: number
}>(), {
  secId: 0,
})

const axios = useAxios().createInstance();
const sectorManager = useSectors();
const model = ref<Sector | null>(null);
const val = ref<Sector | null>(null);
const router = useRouter();
const ac = acom([])

sectorManager.getSector(props.secId).then((res) => {
  if (res != null) {
    ac.state.suggestions.push({
      id: res.id.toString(),
      name: res.name,
      fullName: res.name
    })
    val.value = res
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
  try {
    const res = await autoComplete(new AutoCompleteSearchModel(ac.state.userInput, 0, 10), axios);
    if (res.data.data.length) {
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
    } else {
      ac.state.suggestions = []
    }
  } finally {
    ac.state.loading = false
  }

}

</script>

<template>
  <ada-auto-complete v-model="ac.state.userInput" :suggestions="ac.state.suggestions"
    :loading="ac.state.loading" @select_item="item => generateAddress(item.id)" :placeholder="$t('instrument.search')"
    class="tw-w-[164px] tw-mx-auto tw-text-primary">
    <template #prepend>
      <ada-icon color="primary" :size="14"> isax-search-normal-1 </ada-icon>
    </template>
  </ada-auto-complete>

</template>

<style lang="postcss" scoped>
</style>
