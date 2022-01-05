<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    @item-expanded="onExpand"
    class="mx-1 elevation-1 light"
    hide-default-footer
    dense
  >
    <template #item.name="{ item }">
      <v-row align="center" class="ma-0 pa-0" dense>
        <v-col class="ma-0 pa-0">
          <v-icon small> adaico-eye </v-icon>
          <v-icon color="success" @click="() => order(item, Side.Buy)" small>
            adaico-bag-tick
          </v-icon>
          <v-icon color="error" @click="() => order(item, Side.Sell)" small>
            adaico-bag-cross
          </v-icon>
        </v-col>
        <v-col class="ma-0 pa-0 text-right justify-start">
          <v-badge left dot class="ms-5" offset-x="-5" offset-y="75%">
            {{ item.name }}
          </v-badge>
        </v-col>
      </v-row>
    </template>
    <template #item.wealth="{ item }">
      {{ getWealth(item) }}
    </template>
    <template #item.opening="{ item }">
      <span dir="ltr">
        {{ formatter.format(item.opening) }}
      </span>
    </template>
    <template #item.closing="{ item }">
      <span dir="ltr">
        {{ formatter.format(item.closing) }}
      </span>
    </template>
    <template #item.yesterdayPrice="{ item }">
      <span dir="ltr">
        {{ formatter.format(item.yesterdayPrice) }}
      </span>
    </template>
    <template #item.lowest="{ item }">
      <span dir="ltr">
        {{ formatter.format(item.lowest) }}
      </span>
    </template>
    <template #item.highest="{ item }">
      <span dir="ltr">
        {{ formatter.format(item.highest) }}
      </span>
    </template>
    <template #item.totalTrades="{ item }">
      <span dir="ltr">
        {{ formatter.format(item.totalTrades) }}
      </span>
    </template>
    <template #item.totalShares="{ item }">
      <span dir="ltr">
        {{ formatter.format(item.totalShares) }}
      </span>
    </template>
    <template #item.totalTradesValue="{ item }">
      <span dir="ltr">
        {{ formatter.format(item.totalTradesValue) }}
      </span>
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
    const instruments: Array<InstrumentCache> = reactive([]);
    const wealth: Array<Wealth> = reactive([]);
    const formatter: ComputedRef<Intl.NumberFormat> = computed(
      () => store.getters["formatter"] as Intl.NumberFormat
    );
    const expanded = computed({
      set(value: Array<InstrumentCache>) {
        store.commit("oms/instruments/setFocus", value);
      },
      get(): Array<InstrumentCache> {
        return store.getters[
          "oms/instruments/getFocus"
        ] as Array<InstrumentCache>;
      },
    });
    expanded.value = [];
    function onExpand(data: { item: InstrumentCache; value: boolean }) {
      if (!data.value) {
        store.commit("oms/instruments/stopWatchQueue", data.item.id);
      }
    }
    const headers: ComputedRef<WatchlistColumns[]> = computed(() => {
      const res: Array<WatchlistColumns> = [
        new WatchlistColumns(i18n.t("instrument.name").toString(), "name"),
      ];
      res.push(
        ...((
          store.getters["sso/user/me"].settings.columns ?? DefaultCols()
        ).map((col: WatchlistColumns) =>
          Object.assign({}, col, {
            text: i18n.t("instrument." + col.text),
          })
        ) as WatchlistColumns[])
      );
      res.push(new WatchlistColumns("", "actions"));
      return res;
    });
    function order(item: InstrumentCache, side: Side) {
      if (expanded.value.findIndex((i) => item.id == i.id) == -1) {
        const tmp = [...expanded.value, item];
        expanded.value = tmp;
      }
      store.commit("oms/instruments/updateInstrument", { id: item.id, side });
      store.commit("oms/instruments/select", item);
      store.commit("oms/instruments/setFocusMode", 0);
    }
    const getWealth = computed(() => (item: InstrumentCache) => {
      return formatter.value.format(
        wealth.find((w) => w.id == item.id)?.amount ?? 0
      );
    });
    if (process.client) {
      store
        .dispatch("oms/instruments/getInstrumentsDetail", props.watchlists)
        .then(() => {
          instruments.push(
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
        key: "shift+a",
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
        key: "shift+s",
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
      Side,
      order,
      formatter,
      onExpand,
      headers: headers,
      inst: instruments,
      getWealth,
      expanded,
    };
    //TODO remove in vue3
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>

