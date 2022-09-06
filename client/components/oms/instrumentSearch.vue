<script setup lang="ts">
import { autoComplete } from "@/repositories/oms/instruments_manager";
import {
  AutoCompleteItem,
  AutoCompleteSearchModel,
  InstrumentCache,
  InstrumentSearchModel,
} from "@/types";
import { useAxios, useInstrument, useUser, useAutoComplete as acom, useDebounce } from "~/composables";


const props = withDefaults(defineProps<{
  focusResult: boolean
}>(), {
  focusResult: false
})

const emit = defineEmits(['input'])

const userManager = useUser();
const instrumentManager = useInstrument();
const axios = useAxios().createInstance();
const route = useRoute();
const model = ref(null);
const entries: Array<AutoCompleteItem> = reactive([]);

const focus = instrumentManager.getFocus;
const watchlists = userManager.watchList;
const ac = acom([])

/////////////

watch(() => ac.state.userInput, (val) => {
  if (!val) {
    ac.state.loading = true
    useDebounce(() => {
      ac.state.suggestions = []
      ac.state.loading = false
    }, 1600)()

  } else {
    ac.state.loading = true
    useDebounce(search, 1500)()
  }
})


////////////

async function search() {
  // entries.splice(0, entries.length);
  try {
    const res = await autoComplete(new AutoCompleteSearchModel(ac.state.userInput, 0, 7), axios);
    ac.state.suggestions = res.data.data.map((item) => ({
      name: item.name,
      id: item.id,
      fullName: (item.name + " - " + item.fullName).replace(
        ac.state.userInput,
        `<span class="tw-text-red-900 tw-font-bold">${ac.state.userInput}</span>`
      ),
    }))

  } catch (e) {
    console.log(e)
  } finally {
    ac.state.loading = false
  }
}

function select_suggest(item: AutoCompleteItem): void {
  props.focusResult ? select(item) : emit('input', item)
  ac.state.userInput = ""
  ac.state.suggestions = []
}

async function select(val: AutoCompleteItem) {
  const name = route.params.name as string;
  ac.state.loading = true;
  if (
    val &&
    (!watchlists[name] || watchlists[name]?.indexOf(val.id.toString()) == -1)
  ) {
    const inst = await instrumentManager.getInstrumentsDetail(
      new InstrumentSearchModel([parseInt(val.id)])
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
  ac.state.loading = false;
  model.value = null;
}

</script>

<template>
  <div>
    <ada-auto-complete v-model="ac.state.userInput" id="instrument-search"
      :suggestions="ac.state.suggestions" :loading="ac.state.loading" @select_item="item => select_suggest(item)"
      :placeholder="$t('instrument.search')" class="tw-w-[164px] tw-mx-auto tw-text-primary">
      <template #prepend>
        <ada-icon class="tw-text-primary" :size="14"> isax-search-normal-1 </ada-icon>
      </template>
    </ada-auto-complete>
  </div>
</template>

<style lang="postcss" scoped>
</style>
