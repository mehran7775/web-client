<script setup lang="ts">
import { defineComponent, ref, reactive, computed } from "#app";
import { autoComplete } from "@/repositories/oms/instruments_manager";
import {
  AutoCompleteItem,
  AutoCompleteSearchModel,
  InstrumentCache,
  InstrumentSearchModel,
} from "@/types";
import { useAxios, useInstrument, useUser, useAutoComplete, useDebounce, useMenu } from "~/composables";
import { useRoute, watch } from "#app";
import AutoCompleteFeild from '../AutoCompleteField.vue'
 
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
    const ac = useAutoComplete([])
const menu = useMenu()


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
      const autoCompleteElement = document.getElementById('auto-complete')
      const loc = autoCompleteElement!.getBoundingClientRect()
      let content= ref<any[]>([])
      if(ac.state.loading || ac.state.suggestions.length || ac.state.userInput != '') {
        if(ac.state.loading) {
          content.value.push(`<li class="tw-px-1 tw-py-2" v-text="$t('general.waiting')"></li>`)
        }else if(ac.state.suggestions.length) {
          ac.state.suggestions.forEach(item => {
            content.value.push(
            `<li
               class="hover:tw-bg-primary-100 tw-cursor-pointer tw-px-1 tw-py-2">
               <span v-html="${item.fullName}"></span>
             </li>`
            )
          })
        }else if(ac.state.userInput != '') {
          content.value.push(`<li class="tw-px-1 tw-py-2" v-text="$t('general.notFound')"></li>`)
        }
        menu.showMenu(`${loc.left}px`, `${loc.top+28}px`, content)
      }
     useDebounce(()=> {
       if(ac.state.suggestions.length < 1 && ac.state.userInput == ''){
        menu.hideMenu()
      }
     },1600)
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
      }finally{
         ac.state.loading = false
      }
    }

    function select_suggest(item: AutoCompleteItem): void {
      props.focusResult? select(item): emit('input', item)
      ac.state.userInput = ""
      ac.state.suggestions = []
    }

    async function select(val: AutoCompleteItem) {
      const name = route.params.name;
      ac.state.loading = true;
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
      ac.state.loading = false;
      model.value = null;
    }

</script>

<template>
  <div>
    <auto-complete-feild v-model="ac.state.userInput" borderColor="tw-border-gray-200" background="tw-bg-primary-100"
      :suggestions="ac.state.suggestions || ac.state.userInput != '' ? true : false"
      :placeholder="$t('instrument.search')" class="tw-w-[164px] tw-mx-auto tw-text-primary">
      <template #prepend>
        <ada-icon color="primary" :size="14"> isax-search-normal-1 </ada-icon>
      </template>
      
      
    </auto-complete-feild>
  </div>
</template>

<style lang="postcss" scoped>
</style>
