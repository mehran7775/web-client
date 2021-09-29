<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    :expanded.sync="expanded"
    class="elevation-1 light"
    show-expand
    dense
  >
    <!-- <template #expanded-item="{ item, headers }">
      <td :colspan="headers.length">
        <v-row justify="center" align="center" align-content="center">
          <v-col md="4">
            <order-queue-card :instId="item.id" />
          </v-col>
          <v-col md="5">
            <instrument-card :insId="item.id" />
          </v-col>
          <v-col md="3">
            <legal-real-card :insId="item.id" />
          </v-col>
        </v-row>
      </td>
    </template> -->
  </v-data-table>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useStore,
  computed,
} from "@nuxtjs/composition-api";
import instrumentCard from "../oms/instrumentCard.vue";
import LegalRealCard from "../oms/legalRealCard.vue";
import orderQueueCard from "../oms/orderQueueCard.vue";
import { WatchlistColumns } from "@/types/sso";
import { Instrument } from "~/types/oms";

export default defineComponent({
  props: ["watchlists", "selected"],
  components: { instrumentCard, LegalRealCard, orderQueueCard },
  setup(props, context) {
    const store = useStore();
    const expanded = computed({
      set(value: Array<Instrument>) {
        store.commit("instruments/setFocus", value);
      },
      get(): Array<Instrument> {
        return store.getters["instruments/getFocus"] as Array<Instrument>;
      },
    });
    const instruments: Array<object> = reactive([]);
    const headers = computed(() => {
      return store.getters["user/me"].settings.columns.map(
        (col: WatchlistColumns) =>
          Object.assign({}, col, {
            //TODO replace with something vue3 compatible!
            text: context.root.$t("instrument." + col.value),
          })
      );
    });
    store
      .dispatch("instruments/getInstrumentsDetail", props.watchlists)
      .then(() => {
        instruments.push(
          ...(store.getters["instruments/getAll"] as Array<object>)
        );
      });

    return {
      headers: headers,
      inst: instruments,
      expanded,
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