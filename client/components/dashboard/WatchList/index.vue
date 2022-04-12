<script setup lang="ts">
import { reactive, ref, computed, ComputedRef, watch } from "#app";

import {
  WatchlistColumns,
  DefaultCols,
  InstrumentCache,
  Side,
  InstrumentStatus,
  InstrumentSearchModel,
} from "@/types";
import { useInstrument, useUser } from "@/composables";
import { useShortcut } from "@/utils/shortcutManager";
import HeaderHandler from "./headerHandler.vue";
import RowHandler from "./rowHandler.vue";
import HeaderSelector from "./headerSelector.vue";
import { useRoute, useNuxtApp } from "#app";

const props = withDefaults(
  defineProps<{
    searchModel: InstrumentSearchModel;
    paginated: boolean;
  }>(),
  {
    paginated: false,
  }
);

const { $i18n: i18n } = useNuxtApp();
const userManager = useUser();
const instrumentManager = useInstrument();
const route = useRoute();
const sh = useShortcut();
const itemToDelete = ref<InstrumentCache | null>(null);
const name = route.params.name;
const _instruments: Array<InstrumentCache> = reactive([]);
const instruments: Array<InstrumentCache> = reactive([]);
const confirmInstrumentRemoval = ref(false);

const watchlists = computed(() => userManager.watchList);

const focused = computed(() => instrumentManager.getFocus);
const canfocus = computed(() => {
  if (!process.client) return false;
  return focused.value.length < Math.floor(instrumentManager.width / 360);
});
const me = userManager.me;

const headers: ComputedRef<WatchlistColumns[]> = computed(() => {
  const res: Array<WatchlistColumns> = [];
  const actions = new WatchlistColumns("", "actions", "center", "100px");
  actions.draggable = false;
  res.push(actions);
  res.push(
    ...((me.settings.columns ?? DefaultCols()).map((col: WatchlistColumns) =>
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

function parseStatus(state: number) {
  switch (state & 7) {
    case InstrumentStatus.Active:
      return "instrument.state.active";
    case InstrumentStatus.ActiveOrder:
      return "instrument.state.activeOrder";
    case InstrumentStatus.ActiveTrading:
      return "instrument.state.activeTrading";
    case InstrumentStatus.ActiveRead:
      return "instrument.state.activeRead";
    case InstrumentStatus.Inactive:
      return "instrument.state.inactive";
    case InstrumentStatus.Disabled:
      return "instrument.state.disabled";
    case InstrumentStatus.PreActive:
      return "instrument.state.preActive";
  }
}

function order(item: InstrumentCache, side: Side) {
  instrumentManager.updateInstrument(Object.assign({}, item, { side }));
  instrumentManager.addFocus(item);
  instrumentManager.select(item);
  instrumentManager.setFocusMode(0);
}
function focus(item: InstrumentCache) {
  instrumentManager.addFocus(item);
  instrumentManager.select(item);
}
async function getData(val: InstrumentSearchModel) {
  _instruments.splice(0, _instruments.length);
  _instruments.push(...(await instrumentManager.getInstrumentsDetail(val)));
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
  const name = route.params.name;
  const tmp = [...(watchlists.value[name] ?? [])];
  tmp.splice(tmp.lastIndexOf(val.id.toString()), 1);
  await userManager.update_settings({
    path: "/watch_lists/" + name,
    value: tmp,
  });
  refresh();
}

let dragItem: InstrumentCache | null = null;
function drag(item: InstrumentCache) {
  dragItem = item;
}
async function drop(item: InstrumentCache) {
  if (dragItem && dragItem != item) {
    const wl = [...(watchlists.value[name] ?? [])];
    const ind = wl.findIndex((i) => i == dragItem?.id.toString());
    wl.splice(ind, 1);
    const target = wl.findIndex((i) => i == item.id.toString());
    wl.splice(ind > target ? target : target + 1, 0, dragItem?.id.toString());
    userManager.setWatchlist({
      name,
      watchlist: wl,
      changeState: false,
    });
    await userManager.update_settings({
      path: "/watch_lists/" + name,
      value: wl,
    });
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
  () => [
    props.searchModel.ids,
    props.searchModel.boardIds,
    props.searchModel.secIds,
    props.searchModel.offset,
    props.searchModel.length,
  ],
  ([ids, boards, sectors, offset, len]) => {
    getData(props.searchModel);
  }
);
if (process.client) {
  sh.addShortcut({
    key: "alt+shift+a",
    action: () => {
      const item = instrumentManager.getSelected;
      if (item) {
        instrumentManager.updateInstrument(
          Object.assign({}, item, {
            side: Side.Buy,
          })
        );
        instrumentManager.setFocusMode(0);
      }
    },
  });
  sh.addShortcut({
    key: "alt+shift+s",
    action: () => {
      const item = instrumentManager.getSelected;
      if (item) {
        instrumentManager.updateInstrument(
          Object.assign({}, item, {
            id: item.id,
            side: Side.Sell,
          })
        );
        instrumentManager.setFocusMode(0);
      }
    },
  });
}
getData(props.searchModel);
</script>

<template>
  <div class="pb-1">
    <v-data-table
      :headers="headers"
      :items="instruments"
      item-key="id"
      class="watchlist"
      hide-default-header
      hide-default-footer
      disable-pagination
      dense
    >
      <template #header="{ on, props, attrs }">
        <header-handler :headers="headers" v-on="on" v-bind="attrs" :props="props">
          <template #header.more>
            <header-selector />
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
              if (ev.dataTransfer) {
                ev.dataTransfer.dropEffect = 'move';
              }
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
                color="info"
                @click="() => focus(item)"
                :disabled="!canfocus"
                small
              >
                isax-eye
              </v-icon>
              <v-icon
                class="ma-0 pa-0 mx-1"
                color="success"
                @click="() => order(item, Side.Buy)"
                :disabled="(item.status & 3) != 3"
                small
              >
                isax-bag-tick-2
              </v-icon>
              <v-icon
                class="ma-0 pa-0 ms-2 me-4"
                color="error"
                @click="() => order(item, Side.Sell)"
                :disabled="(item.status & 3) != 3"
                small
              >
                isax-bag-cross-1
              </v-icon>
            </div>
          </template>
          <template #item.name="{ item }">
            <v-badge
              left
              offset-y="65%"
              offset-x="-4px"
              :color="
                (item.status & 1) != 1
                  ? 'error'
                  : (item.status & 6) != 6
                  ? 'warning'
                  : 'success'
              "
              dot
            >
              <v-tooltip right>
                <template #activator="{ on }">
                  <span style="line-height: 2.5" v-on="on" class="d-block">
                    {{ item.name }}
                  </span>
                </template>
                {{ $t(parseStatus(item.status)) }}
              </v-tooltip>
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
            <span>
              {{ $t("instrument.state." + item.status) }}
            </span>
          </template>
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
