

<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    class="elevation-1"
  ></v-data-table>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref, useStore } from "@nuxtjs/composition-api";

export default defineComponent({
  props: ["watchlists"],

  setup(context) {

    let store = useStore();
    return {
      headers: [
          {
            text: 'Dessert (100g serving)',
            align: 'start',
            sortable: false,
            value: 'name',
          },
        ],
        inst: context.watchlists.map((e:string)=>{
          return {name:e}
        })
    };
  },
});
</script>
