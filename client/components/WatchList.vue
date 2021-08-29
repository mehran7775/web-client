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
} from "@nuxtjs/composition-api";
import daily_instruments from "@/repositories/daily_instruments";

export default defineComponent({
  props: ["watchlists"],

  setup(context) {
    const instruments = ref([]);
    const getUserInstruments = async () => {
      const { data ,status } = await daily_instruments
      .getInstrumentsDetail(context.watchlists)
      console.log(data)
      instruments.value = data
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
