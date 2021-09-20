<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    :expanded="expanded"
    @click:row="toggleRow"
    show-expand
    class="elevation-1"
  ></v-data-table>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useStore,
  computed,
} from "@nuxtjs/composition-api";

export default defineComponent({
  props: ["watchlists"],
  setup(context) {
    const store = useStore();
    const expanded: Array<any> = reactive([]);

    const instruments: Array<object> = reactive([]);
    const headers = computed(() => {
      console.log(store.getters["user/me"].settings.columns);
      return store.getters["user/me"].settings.columns;
    });
    store
      .dispatch("instruments/getInstrimentsDetail", context.watchlists)
      .then(() => {
        instruments.push(
          ...(store.getters["instruments/getAll"] as Array<object>)
        );
      });

    function toggleRow(value: any) {
      const index = expanded.indexOf(value);
      if (index > -1) {
        expanded.splice(index, 1);
      } else {
        expanded.push(value);
      }
    }

    return {
      headers: headers,
      inst: instruments,
      expanded,
      toggleRow,
    };
  },
});
</script>
