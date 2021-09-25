<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    :expanded="expanded"
    @click:row="toggleRow"
    show-expand
    class="elevation-1 light"
    :height="height"
    dense
  >
    <template #expanded-item="{ item, headers }">
      <td :colspan="headers.length" class="ma-0 pa-0">
        <v-card width="100%">
          <v-card-text>
            {{ item }}
          </v-card-text>
        </v-card>
      </td>
    </template>
  </v-data-table>
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
    const height = computed(() =>
      store.getters["bottom-panel/activeTab"] == "" ? "100%" : "40vh"
    );
    const instruments: Array<object> = reactive([]);
    const headers = computed(() => {
      console.log(store.getters["user/me"].settings.columns);
      return store.getters["user/me"].settings.columns;
    });
    store
      .dispatch("instruments/getInstrumentsDetail", context.watchlists)
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
      height,
      toggleRow,
    };
  },
});
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 15px;
}

::-webkit-scrollbar-track {
  background: #e6e6e6;
  border-left: 1px solid #dadada;
}

::-webkit-scrollbar-thumb {
  background: #b0b0b0;
  border: solid 3px #e6e6e6;
  border-radius: 7px;
}

::-webkit-scrollbar-thumb:hover {
  background: black;
}
</style>