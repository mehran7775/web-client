

<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    class="elevation-1"
  ></v-data-table>
</template>

<script lang="ts">
import {  defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: ["watchlists"],

  setup(context) {
    return {
      headers: [
          {
            text: 'نماد',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          {
            text: 'دارایی سهم',
            align: 'start',
            sortable: false,

          },
          {
            text: 'قیمت دیروز',
            align: 'start',
            sortable: false,

          },
          {
            text: 'تعداد معادلات',
            align: 'start',
            sortable: false,

          },
          {
            text: 'حجم معادلات',
            align: 'start',
            sortable: false,

          },
          {
            text: 'ارزش معادلات',
            align: 'start',
            sortable: false,

          },
          {
            text: 'کمترین قیمت',
            align: 'start',
            sortable: false,

          },
          {
            text: 'بیشترین قیمت',
            align: 'start',
            sortable: false,

          },
          {
            text: 'اولین قیمت',
            align: 'start',
            sortable: false,

          },
          {
            text: 'أخرین قیمت',
            align: 'start',
            sortable: false,

          },
          {
            text: 'قیمت پایانی',
            align: 'start',
            sortable: false,

          },

        ],
        inst: context.watchlists.map((e:string)=>{
          return {name:e}
        })
    };
  },
});
</script>
