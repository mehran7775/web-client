<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    class="elevation-1"
  ></v-data-table>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  useContext,
  useStore,
} from "@nuxtjs/composition-api";
import daily_instruments from "~/repositories/instruments_manager";


export default defineComponent({
  props: ["watchlists"],

  setup(context) {

    const ctnx  = useContext()

    const instruments = ref([]);
    const getUserInstruments = async () => {
      await ctnx.store.dispatch('instruments/getInstrimentsDetail',context.watchlists)

      instruments.value = await ctnx.store.getters['instruments/getAll']
    };

    onMounted(getUserInstruments)

    return {
      headers: [
        {
          text: "نماد",
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: "دارایی سهم",
          align: "start",
          sortable: false,
          value: "baseVol",
        },
        {
          text: "قیمت دیروز",
          align: "start",
          sortable: false,
          value: "boardName",
        },
        {
          text: "تعداد معادلات",
          align: "start",
          sortable: false,
          value: "categoryName",
        },
        {
          text: "حجم معادلات",
          align: "start",
          sortable: false,
          value: "closing",
        },
        {
          text: "ارزش معادلات",
          align: "start",
          sortable: false,
          value: "firstTradeDate",
        },
        {
          text: "کمترین قیمت",
          align: "start",
          sortable: false,
          value: "lowest",
        },
        {
          text: "بیشترین قیمت",
          align: "start",
          sortable: false,
          value: "highest",
        },
        {
          text: "اولین قیمت",
          align: "start",
          sortable: false,
          value: "minAllowedPrice",
        },
        {
          text: "أخرین قیمت",
          align: "start",
          sortable: false,
          value: "maxAllowedPrice",
        },
        {
          text: "قیمت پایانی",
          align: "start",
          sortable: false,
          value: "lowest",
        },
      ],
      // inst: context.watchlists.map((e: string) => {
      //   return { name: e };
      // }),
      inst: instruments
    };
  },
});
</script>
