<template>
  <div class="pb-1">
    <v-data-table
      :headers="headers"
      :items="inst"
      item-key="id"
      class="watchlist"
      hide-default-header
      hide-default-footer
      disable-pagination
      dense
    >
      <template #header="{ on, props, attrs }">
        <header-handler
          :headers="headers"
          v-on="on"
          v-bind="attrs"
          :props="props"
        >
          <template #header.more>
            <header-selector> </header-selector>
          </template>
        </header-handler>
      </template>
      <template #item="{ headers, item }">
        <row-handler
          draggable="true"
          @dragstart="(ev) => drag(item)"
          @dragover="
            (ev) => {
              ev.preventDefault();
              ev.dataTransfer.dropEffect = 'move';
            }
          "
          dropzone="true"
          @drop="
            (ev) => {
              ev.preventDefault();
              drop(item);
            }
          "
          :model="{ headers, item }"
        >
          <template #item.actions="{ item }">
            <div class="text-no-wrap">
              <v-icon
                class="ma-0 pa-0 mx-2"
                color="default"
                @click="() => focus(item)"
                small
              >
                isax-eye
              </v-icon>
              <v-icon
                class="ma-0 pa-0 mx-2"
                color="success"
                @click="() => order(item, Side.Buy)"
                small
              >
                isax-bag-tick-2
              </v-icon>
              <v-icon
                class="ma-0 pa-0 mx-2"
                color="error"
                @click="() => order(item, Side.Sell)"
                small
              >
                isax-bag-cross-1
              </v-icon>
            </div>
          </template>
          <template #item.name="{ item }">
            <span class="success--text">
              {{ item.name }}
            </span>
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
            <numeric-field class="success--text" :value="item.lowest" />
          </template>
          <template #item.highest="{ item }">
            <numeric-field class="error--text" :value="item.highest" />
          </template>
          <template #item.totalTrades="{ item }">
            <numeric-field :value="item.totalTrades" />
          </template>
          <template #item.totalShares="{ item }">
            <numeric-field class="info--text" :value="item.totalShares" />
          </template>
          <template #item.totalTradesValue="{ item }">
            <numeric-field :value="item.totalTradesValue" />
          </template>
          <template #item.status="{ item }"> </template>
          <template #item.more="{ item }">
            <v-icon
              color="error"
              @click="
                () => {
                  itemToDelete = item;
                  confirmInstrumentRemoval = true;
                }
              "
              small
            >
              isax-trash
            </v-icon>
          </template>
        </row-handler>
      </template>
    </v-data-table>
    <v-dialog max-width="50%" v-model="confirmInstrumentRemoval">
      <v-card>
        <v-card-title> {{ $t("general.alert") }} </v-card-title>
        <v-card-text>
          {{ $t("instrument.remove") }}
        </v-card-text>
        <v-card-actions>
          <v-btn
            width="65"
            color="primary"
            @click="
              () => {
                remove(itemToDelete);
                confirmInstrumentRemoval = false;
              }
            "
          >
            {{ $t("general.yes") }}
          </v-btn>
          <v-btn
            width="65"
            color="error"
            @click="
              () => {
                itemToDelete = null;
                confirmInstrumentRemoval = false;
              }
            "
          >
            {{ $t("general.no") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useStore,
  useRoute,
  ref,
  computed,
  ComputedRef,
  watch,
} from "@nuxtjs/composition-api";

import instrumentCard from "../../oms/instrumentCardCompact.vue";
import LegalRealCard from "../../oms/legalRealCard.vue";
import orderQueueCard from "../../oms/orderQueueCard.vue";
import {
  WatchlistColumns,
  DefaultCols,
  InstrumentCache,
  Side,
  User,
} from "@/types";
import { useShortcut } from "@/utils/shortcutManager";
import HeaderHandler from "./headerHandler.vue";
import RowHandler from "./rowHandler.vue";
import HeaderSelector from "./headerSelector.vue";

export default defineComponent({
  name: "WatchList",
  props: ["watchlists", "selected"],
  components: {
    instrumentCard,
    LegalRealCard,
    orderQueueCard,
    HeaderHandler,
    RowHandler,
    HeaderSelector,
  },
  setup(props, context) {
    const store = useStore();
    const route = useRoute();
    const i18n = useI18n();
    const sh = useShortcut();
    const itemToDelete = ref(null);
    const _instruments: Array<InstrumentCache> = reactive([]);
    const instruments: Array<InstrumentCache> = reactive([]);
    const confirmInstrumentRemoval = ref(false);

    const editMode = computed(() => store.getters["sso/user/watchlistChanged"]);
    const watchlists = computed(() => store.getters["sso/user/watchList"]);

    const focused = computed(() => {
      return store.getters[
        "oms/instruments/getFocus"
      ] as Array<InstrumentCache>;
    });
    const me: ComputedRef<User> = computed(() => store.getters["sso/user/me"]);

    const headers: ComputedRef<WatchlistColumns[]> = computed(() => {
      const res: Array<WatchlistColumns> = [];
      const actions = new WatchlistColumns("", "actions", "center", "100px");
      actions.draggable = false;
      res.push(actions);
      res.push(
        ...((me.value.settings.columns ?? DefaultCols()).map(
          (col: WatchlistColumns) =>
            Object.assign({}, col, {
              text: col.text == "" ? "" : i18n.t(col.text),
            })
        ) as WatchlistColumns[])
      );
      const more = new WatchlistColumns("", "more");
      more.draggable = false;
      res.push(more);
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
          return focused.value.findIndex((i) => i.id == item.id) == -1;
        })
      );
    }
    async function remove(val: InstrumentCache) {
      const name = route.value.params.name;
      const tmp = [...watchlists.value[name]];
      tmp.splice(tmp.lastIndexOf(val.id.toString()), 1);
      store.commit("sso/user/setWatchlist", {
        name,
        watchlist: tmp,
      });
      await store.dispatch("sso/user/update_watchlist");
      refresh();
    }

    let dragItem: InstrumentCache | null = null;
    function drag(item: InstrumentCache) {
      dragItem = item;
    }
    async function drop(item: InstrumentCache) {
      if (dragItem && dragItem != item) {
        const name = route.value.params.name;
        const wl = [...watchlists.value[name]];
        const ind = wl.findIndex((i) => i == dragItem?.id.toString());
        wl.splice(ind, 1);
        const target = wl.findIndex((i) => i == item.id.toString());
        wl.splice(
          ind > target ? target : target + 1,
          0,
          dragItem?.id.toString()
        );
        store.commit("sso/user/setWatchlist", {
          name,
          watchlist: wl,
        });
        await store.dispatch("sso/user/update_watchlist");
        refresh();
      }
      dragItem = null;
    }
    watch(_instruments, (val) => {
      refresh();
    });
    watch(focused, (val) => {
      refresh();
    });
    watch(
      () => props.watchlists,
      (val) => {
        getData(val);
      }
    );
    if (process.client) {
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
    getData(props.watchlists);
    return {
      itemToDelete,
      drag,
      drop,
      focus,
      remove,
      Side,
      order,
      editMode,
      headers,
      inst: instruments,
      confirmInstrumentRemoval,
    };
    //TODO remove in vue3
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>