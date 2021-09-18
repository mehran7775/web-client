<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    class="elevation-1"
  ></v-data-table>
</template>

<script lang="ts">
import { defineComponent, reactive, useStore } from "@nuxtjs/composition-api";

export default defineComponent({
  props: ["watchlists"],

  setup(context) {
    const store = useStore();

    const instruments: Array<object> = reactive([]);
    const headers: Array<any> = reactive([]);
    store
      .dispatch("instruments/getInstrimentsDetail", context.watchlists)
      .then(() => {
        instruments.push(store.getters["instruments/getAll"] as Array<object>);
        headers.push(
          store.getters["user/mae"].settings.colomns as Array<object>
        );
      });

    return {
      headers: headers,
      inst: instruments,
    };
  },
});
</script>
