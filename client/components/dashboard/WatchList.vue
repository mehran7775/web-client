<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    :expanded.sync="expanded"
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
      <!-- <v-icon color="green"> mdi-basket-plus-outline </v-icon>
      <v-icon color="red"> mdi-basket-remove-outline </v-icon> -->

      <v-img
        max-width="32"
        src="/fonts/svg/bag-tick.svg"
        style="display: inline-block"
      />
      <v-img
        max-width="32"
        src="/fonts/svg/bag-cross.svg"
        style="display: inline-block"
      />
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
    const i18n = useI18n();
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
            text: i18n.t("instrument." + col.value),
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