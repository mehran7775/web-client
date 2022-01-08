<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    class="mx-1 elevation-1 light"
    hide-default-footer
    dense
  >
    <template #item.actions="{ item }">
      <v-icon small @click="() => focus(item)"> adaico-eye </v-icon>
      <v-icon color="success" @click="() => order(item, Side.Buy)" small>
        adaico-bag-tick
      </v-icon>
      <v-icon color="error" @click="() => order(item, Side.Sell)" small>
        adaico-bag-cross
      </v-icon>
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
import {
  WatchlistColumns,
  DefaultCols,
  InstrumentCache,
  Side,
  Wealth,
  WealthSearchModel,
} from "@/types";
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
    const wealth: Array<Wealth> = reactive([]);

    const expanded = computed(() => {
      return store.getters[
        "oms/instruments/getFocus"
      ] as Array<InstrumentCache>;
    });

    const headers: ComputedRef<WatchlistColumns[]> = computed(() => {
      const res: Array<WatchlistColumns> = [
        new WatchlistColumns("", "actions"),
      ];
      res.push(
        ...((
          store.getters["sso/user/me"].settings.columns ?? DefaultCols()
        ).map((col: WatchlistColumns) =>
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

    if (process.client) {
      watch(_instruments, (val) => {
        instruments.splice(0, instruments.length);
        instruments.push(
          ...val.filter((item) => {
            return expanded.value.findIndex((i) => i.id == item.id) == -1;
          })
        );
      });
      watch(expanded, (val) => {
        instruments.splice(0, instruments.length);
        instruments.push(
          ..._instruments.filter((item) => {
            return val.findIndex((i) => i.id == item.id) == -1;
          })
        );
      });
      store
        .dispatch("oms/instruments/getInstrumentsDetail", props.watchlists)
        .then(() => {
          _instruments.push(
            ...(store.getters["oms/instruments/getAll"](
              props.watchlists
            ) as Array<InstrumentCache>)
          );
        });

      store
        .dispatch("wealth/getWealth", new WealthSearchModel())
        .then((data) => {
          wealth.push(...data);
        });

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
    }
    return {
      focus,
      Side,
      order,
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

