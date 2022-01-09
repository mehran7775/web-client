<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    item-key="id"
    class="mx-1 elevation-1 light"
    hide-default-footer
    dense
  >
    <template #item.actions="{ item }">
      <div v-if="!editMode">
        <v-icon color="default" @click="() => focus(item)" small>
          adaico-eye
        </v-icon>
        <v-icon color="success" @click="() => order(item, Side.Buy)" small>
          adaico-bag-tick
        </v-icon>
        <v-icon color="error" @click="() => order(item, Side.Sell)" small>
          adaico-bag-cross
        </v-icon>
      </div>
      <div v-else>
        <v-icon color="default" size="18"> mdi-cursor-move </v-icon>
      </div>
    </template>
    <template #item.name="{ item }">
      <v-badge left dot offset-x="-5" offset-y="75%">
        {{ item.name }}
      </v-badge>
    </template>
    <template #item.opening="{ item }">
      <numeric-field :value="item.wealth" />
    </template>
    <template #item.opening="{ item }">
      <numeric-field :value="item.opening" />
    </template>
    <template #item.closing="{ item }">
      <numeric-field :value="item.closing" />
    </template>
    <template #item.yesterdayPrice="{ item }">
      <numeric-field :value="item.yesterdayPrice" />
    </template>
    <template #item.lowest="{ item }">
      <numeric-field :value="item.lowest" />
    </template>
    <template #item.highest="{ item }">
      <numeric-field :value="item.highest" />
    </template>
    <template #item.totalTrades="{ item }">
      <numeric-field :value="item.totalTrades" />
    </template>
    <template #item.totalShares="{ item }">
      <numeric-field :value="item.totalShares" />
    </template>
    <template #item.totalTradesValue="{ item }">
      <numeric-field :value="item.totalTradesValue" />
    </template>
    <template #item.status="{ item }">
      <div v-if="!editMode">
        {{ item.status }}
      </div>
      <div v-else>
        <v-icon color="error" size="18"> mdi-delete-forever </v-icon>
      </div>
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
  watch,
} from "@nuxtjs/composition-api";
import instrumentCard from "../oms/instrumentCardCompact.vue";
import LegalRealCard from "../oms/legalRealCard.vue";
import orderQueueCard from "../oms/orderQueueCard.vue";
import { WatchlistColumns, DefaultCols, InstrumentCache, Side } from "@/types";
import { useShortcut } from "@/utils/shortcutManager";

export default defineComponent({
  props: ["watchlists", "selected"],
  components: { instrumentCard, LegalRealCard, orderQueueCard },
  setup(props, context) {
    const store = useStore();
    const i18n = useI18n();
    const sh = useShortcut();
    const _instruments: Array<InstrumentCache> = reactive([]);
    const instruments: Array<InstrumentCache> = reactive([]);

    const editMode = computed(
      () => store.getters["oms/instruments/editWatchlist"]
    );

    const expanded = computed(() => {
      return store.getters[
        "oms/instruments/getFocus"
      ] as Array<InstrumentCache>;
    });
    const me = computed(() => store.getters["sso/user/me"]);

    const headers: ComputedRef<WatchlistColumns[]> = computed(() => {
      const res: Array<WatchlistColumns> = [
        new WatchlistColumns("", "actions"),
      ];
      res.push(
        ...((me.value.settings.columns ?? DefaultCols()).map(
          (col: WatchlistColumns) =>
            Object.assign({}, col, {
              text: col.text == "" ? "" : i18n.t(col.text),
            })
        ) as WatchlistColumns[])
      );
      res.push(
        new WatchlistColumns(i18n.t("instrument.status").toString(), "status")
      );
      return res;
    });
    function order(item: InstrumentCache, side: Side) {
      store.commit("oms/instruments/updateInstrument", { id: item.id, side });
      store.commit("oms/instruments/addFocus", item);
      store.commit("oms/instruments/select", item);
      store.commit("oms/instruments/setFocusMode", 0);
    }
    function focus(item: InstrumentCache) {
      store.commit("oms/instruments/addFocus", item);
      store.commit("oms/instruments/select", item);
    }
    async function getData(val: any) {
      _instruments.splice(0, _instruments.length);
      await store.dispatch("oms/instruments/getInstrumentsDetail", val);
      _instruments.push(
        ...(store.getters["oms/instruments/getAll"](
          val
        ) as Array<InstrumentCache>)
      );
    }
    function refresh() {
      instruments.splice(0, instruments.length);
      instruments.push(
        ..._instruments.filter((item) => {
          return expanded.value.findIndex((i) => i.id == item.id) == -1;
        })
      );
    }
    if (process.client) {
      watch(_instruments, (val) => {
        refresh();
      });
      watch(expanded, (val) => {
        refresh();
      });
      watch(
        () => props.watchlists,
        (val) => {
          getData(val);
        }
      );
      sh.addShortcut({
        key: "alt+shift+a",
        action: () => {
          const item = store.getters["oms/instruments/getSelected"];
          if (item) {
            store.commit("oms/instruments/updateInstrument", {
              id: item.id,
              side: Side.Buy,
            });
            store.commit("oms/instruments/setFocusMode", 0);
          }
        },
      });
      sh.addShortcut({
        key: "alt+shift+s",
        action: () => {
          const item = store.getters["oms/instruments/getSelected"];
          if (item) {
            store.commit("oms/instruments/updateInstrument", {
              id: item.id,
              side: Side.Sell,
            });
            store.commit("oms/instruments/setFocusMode", 0);
          }
        },
      });
      getData(props.watchlists);
    }
    return {
      focus,
      Side,
      order,
      editMode,
      headers: headers,
      inst: instruments,
    };
    //TODO remove in vue3
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>

