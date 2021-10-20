<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    :expanded.sync="expanded"
    @item-expanded="onExpand"
    class="elevation-1 light"
    show-expand
    dense
  >
    <template #item.data-table-expand="{ isExpanded, expand }">
      <v-icon
        @click="() => expand(!isExpanded)"
        :color="isExpanded ? 'warning' : 'blue'"
      >
        {{
          isExpanded ? "mdi-minus-circle-outline" : "mdi-plus-circle-outline"
        }}
      </v-icon>
    </template>
    <template #item.name="{ item }">
      <v-icon color="success">
        adaico-bag-tick
      </v-icon>
      <v-icon color="error">
        adaico-bag-cross
      </v-icon>
      <v-badge left dot class="ms-5" offset-x="-5" offset-y="75%">
        {{ item.name }}
      </v-badge>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useStore,
  computed,
  ComputedRef
} from "@nuxtjs/composition-api";
import instrumentCard from "../oms/instrumentCardCompact.vue";
import LegalRealCard from "../oms/legalRealCard.vue";
import orderQueueCard from "../oms/orderQueueCard.vue";
import { WatchlistColumns, DefaultCols, Instrument } from "@/types";


export default defineComponent({
  props: ["watchlists", "selected"],
  components: { instrumentCard, LegalRealCard, orderQueueCard },
  setup(props, context) {
    const store = useStore();
    const i18n = useI18n();
    const expanded = computed({
      set(value: Array<Instrument>) {
        store.commit("instruments/setFocus", value);
      },
      get(): Array<Instrument> {
        return store.getters["instruments/getFocus"] as Array<Instrument>;
      },
    });
    function onExpand(data: { item: Instrument; value: boolean }) {
      if (!data.value) {
        store.commit("instruments/stopWatchQueue", data.item.id);
      }
    }
    const instruments: Array<object> = reactive([]);
    const headers: ComputedRef<WatchlistColumns[]> = computed(() => {
      return (store.getters["user/me"].settings.columns ?? DefaultCols()).map(
        (col: WatchlistColumns) =>
          Object.assign({}, col, {
            text: i18n.t("instrument." + col.value),
          })
      ) as WatchlistColumns[];
    });
    store
      .dispatch("instruments/getInstrumentsDetail", props.watchlists)
      .then(() => {
        instruments.push(
          ...(store.getters["instruments/getAll"] as Array<object>)
        );
      });

    return {
      onExpand,
      headers: headers,
      inst: instruments,
      expanded,
    };
    //TODO remove in vue3
    function useI18n() {
      return context.root.$i18n;
    }
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