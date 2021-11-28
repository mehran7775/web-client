<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    :expanded.sync="expanded"
    @item-expanded="onExpand"
    class="mx-1 elevation-1 light"
    hide-default-footer
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
      <v-icon color="success"> adaico-bag-tick </v-icon>
      <v-icon color="error"> adaico-bag-cross </v-icon>
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
  ComputedRef,
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
    const instruments: Array<Instrument> = reactive([]);
    const expanded = computed({
      set(value: Array<Instrument>) {
        store.commit("oms/instruments/setFocus", value);
      },
      get(): Array<Instrument> {
        return store.getters["oms/instruments/getFocus"] as Array<Instrument>;
      },
    });
    function onExpand(data: { item: Instrument; value: boolean }) {
      if (!data.value) {
        store.commit("oms/instruments/stopWatchQueue", data.item.id);
      }
    }
    const headers: ComputedRef<WatchlistColumns[]> = computed(() => {
      return (
        store.getters["sso/user/me"].settings.columns ?? DefaultCols()
      ).map((col: WatchlistColumns) =>
        Object.assign({}, col, {
          text: i18n.t("instrument." + col.text),
        })
      ) as WatchlistColumns[];
    });
    store
      .dispatch("oms/instruments/getInstrumentsDetail", props.watchlists)
      .then(() => {
        instruments.push(
          ...(store.getters["oms/instruments/getAll"](
            props.watchlists
          ) as Array<Instrument>)
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