<template>
  <v-data-table
    :headers="headers"
    :items="inst"
    item-key="id"
    class="mx-1 elevation-1 watchlist"
    hide-default-header
    hide-default-footer
    dense
  >
    <template #header="{ on, props }">
      <thead>
        <tr>
          <th
            draggable="true"
            @dragstart="() => drag(header)"
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
                drop(header);
              }
            "
            v-on="on"
            v-for="header in props.headers"
            :key="header.value"
            :aria-label="header.text"
            role="columnheader"
            scope="col"
            :style="{
              width: header.width ? header.width : '',
              'min-width': header.width ? header.width : '',
            }"
            :class="['header', 'text-' + header.align, header.class]"
          >
            <div>
              {{ header.text }}
              <v-icon color="primary" v-if="header.icon" small>
                {{ header.icon }}
              </v-icon>
              <div
                v-if="header.value != 'actions' && header.value != 'more'"
                class="divider"
              >
                |
              </div>
            </div>
          </th>
        </tr>
      </thead>
    </template>
    <template #item.actions="{ item }">
      <div class="text-no-wrap">
        <v-icon color="default" @click="() => focus(item)" small>
          adaico-eye
        </v-icon>
        <v-icon color="success" @click="() => order(item, Side.Buy)" small>
          adaico-bag-tick-2
        </v-icon>
        <v-icon color="error" @click="() => order(item, Side.Sell)" small>
          adaico-bag-cross
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
    <template #item.status="{ item }">
      <div></div>
    </template>
    <template #item.more="{ item }">
      <v-dialog max-width="50%" v-model="confirmInstrumentRemoval">
        <template #activator="{ on, attrs }">
          <v-icon color="error" v-on="on" v-bind="attrs" small>
            adaico-trash
          </v-icon>
        </template>
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
                  remove(item);
                  confirmInstrumentRemoval = false;
                }
              "
            >
              {{ $t("general.yes") }}
            </v-btn>
            <v-btn
              width="65"
              color="error"
              @click="() => (confirmInstrumentRemoval = false)"
            >
              {{ $t("general.no") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-data-table>
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
import instrumentCard from "../oms/instrumentCardCompact.vue";
import LegalRealCard from "../oms/legalRealCard.vue";
import orderQueueCard from "../oms/orderQueueCard.vue";
import {
  WatchlistColumns,
  DefaultCols,
  InstrumentCache,
  Side,
  User,
} from "@/types";
import { useShortcut } from "@/utils/shortcutManager";

export default defineComponent({
  props: ["watchlists", "selected"],
  components: { instrumentCard, LegalRealCard, orderQueueCard },
  setup(props, context) {
    const store = useStore();
    const route = useRoute();
    const i18n = useI18n();
    const sh = useShortcut();
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
      const more = new WatchlistColumns("", "more");
      more.icon = "mdi-dots-horizontal-circle-outline";
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
    }
    let draggingCol: WatchlistColumns | null = null;
    function drag(item: WatchlistColumns) {
      draggingCol = item;
    }
    function drop(item: WatchlistColumns) {
      if (draggingCol && draggingCol != item) {
        const hrs = [...(me.value.settings.columns ?? DefaultCols())];
        const ind = hrs.findIndex((i) => i.value == draggingCol?.value);
        draggingCol = hrs[ind];
        hrs.splice(ind, 1);
        const target = hrs.findIndex((i) => i.value == item.value);
        hrs.splice(ind > target ? target : target + 1, 0, draggingCol);
        store.commit("sso/user/setCols", hrs);
      }
      draggingCol = null;
    }

    if (process.client) {
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

<style lang="sass" scoped>
.header
  position: relative
.divider
  position: absolute
  top: calc(50% - 6px)
  left: -4px
</style>