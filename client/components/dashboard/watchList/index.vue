<script setup lang="ts">
import {
  WatchListColumns,
  DefaultCols,
  InstrumentCache,
  Side,
  InstrumentStatus,
  InstrumentSearchModel,
} from "@/types";
import {
  useInstrument,
  useOrder,
  useUser,
  useNotifications,
} from "@/composables";
import { useShortcut } from "@/utils/shortcutManager";
import { useI18n } from "vue-i18n";

const props = withDefaults(
  defineProps<{
    searchModel: InstrumentSearchModel;
    paginated?: boolean;
  }>(),
  {
    paginated: false,
  }
);

const i18n = useI18n();
const userManager = useUser();
const instrumentManager = useInstrument();
const orderManager = useOrder();
const route = useRoute();
const sh = useShortcut();
const itemToDelete = ref<InstrumentCache | null>(null);
const _instruments: Array<InstrumentCache> = reactive([]);
const confirmInstrumentRemoval = ref(false);
const notificationManager = useNotifications();

//////////////////////

const name = route.params.name as string;

const instruments = computed(() => {
  return _instruments.filter((item) => {
    return focused.findIndex((i) => i.id === item.id) == -1;
  });
});

async function refresh() {
  _instruments.splice(0, Infinity);
  _instruments.push(
    ...(await instrumentManager.getInstrumentsDetail(props.searchModel, true))
  );
  notificationManager.initNotifications(
    props.searchModel.ids.map((id) => id.toString())
  );
}

const watchLists = userManager.watchList;
const selected = computed(() => instrumentManager.state.selected);

const focused = instrumentManager.getFocus;
const canFocus = computed(() => {
  if (!process.client) return false;
  return (
    instrumentManager.getFocus.length <
    Math.floor(instrumentManager.width / 360)
  );
});
const me = userManager.me;

const headers = computed(() => {
  const res: Array<WatchListColumns> = [];
  const actions = new WatchListColumns("", "actions", "center", "100px");
  actions.draggable = false;
  actions.divider = false;
  res.push(actions);
  res.push(
    ...((me.settings.columns ?? DefaultCols()).map((col: WatchListColumns) => {
      if (col == null)
        return {
          text: "",
          value: "",
        };
      return Object.assign({}, col, {
        text: col.text == "" ? "" : i18n.t(col.text),
      });
    }) as WatchListColumns[])
  );
  const status = new WatchListColumns(
    i18n.t("instrument.notifications"),
    "notifications",
    "center",
    "123px"
  );
  res.push(status);
  const more = new WatchListColumns("", "more");
  more.draggable = false;
  more.divider = false;
  res.push(more);
  return res;
});

////////////////////////////

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
function select(item: InstrumentCache) {
  const crt = instrumentManager.state.selected;
  if (crt == null || crt.id != item.id) instrumentManager.select(item);
  else instrumentManager.select(null);
}
function order(item: InstrumentCache, side: Side) {
  orderManager.setSide(side, item.id.toString());
  instrumentManager.addFocus(item);
  instrumentManager.activateTab(item);
  instrumentManager.setFocusMode(0);
}
function focus(item: InstrumentCache) {
  instrumentManager.activateTab(item);
  instrumentManager.addFocus(item);
}

async function remove(val: InstrumentCache) {
  const tmp = [...(watchLists[name] ?? [])];
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
    const wl = [...(watchLists[name] ?? [])];
    const ind = wl.findIndex((i) => i == dragItem?.id.toString());
    wl.splice(ind, 1);
    const target = wl.findIndex((i) => i == item.id.toString());
    wl.splice(ind > target ? target : target + 1, 0, dragItem?.id.toString());
    userManager.setWatchlist({
      name: name,
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
const removeWatchList = (item: InstrumentCache): void => {
  itemToDelete.value = item;
  confirmInstrumentRemoval.value = true;
};

////////////////////////////////////////////

watch(
  () => props.searchModel,
  (update) => {
    refresh();
  }
);

//////////////////////////////////////////

if (process.client) {
  sh.addShortcut({
    key: "alt+shift+a",
    action: () => {
      const item = instrumentManager.state.selected;
      if (item) {
        instrumentManager.activateTab(item);
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
      const item = instrumentManager.state.selected;
      if (item) {
        instrumentManager.activateTab(item);
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

//////////////////////////////////

refresh();
</script>

<style lang="postcss" scoped>
.watchlist {
  background-color: white;

  .header {
    padding: 0 4px;
    font-size: 0.8334rem;
  }

  .row-border {
    cursor: pointer;

    &:hover {
      background-color: rgba(var(--c-primary), 0.07);
    }

    td{
      @apply tw-transition-all;
    }

    &.active {
      position: relative;
      background-color: rgba(var(--c-selected-inst), 0.1);
      @apply tw-border tw-border-primary;

      &::befor {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: white;
        z-index: -1;
      }
      & :deep(td) {
        @apply tw-border-t-[1.2px] tw-border-b tw-border-primary tw-rounded-t tw-rounded-b;
      }
    }

    .ada-badge {
      .badge {
        @apply tw-ml-[1px];
      }

      &.error :deep(.badge) {
        @apply tw-bg-error;
      }

      &.warning :deep(.badge) {
        @apply tw-bg-warning;
      }

      &.success :deep(.badge) {
        @apply tw-bg-success;
      }
    }
  }
}

.dialog-delete {
  width: 40vw;

  .ada-button {
    @apply tw-text-white tw-w-16;

    &:first-child {
      @apply tw-bg-info tw-bg-opacity-80;
    }

    &:last-child {
      @apply tw-bg-error tw-mr-2 tw-bg-opacity-90;
    }

    &:hover {
      @apply tw-bg-opacity-100;
    }
  }
}
</style>

<template>
  <div class="pb-1">
    <ada-data-table
      :headers="headers"
      :items="instruments"
      item-key="id"
      class="watchlist"
      hide-default-header
      hide-default-footer
      disable-pagination
      dense
    >
      <template #header.more>
        <dashboard-watch-list-header-selector />
      </template>
      <ada-data-table-row-handler
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
        @click="() => select(item)"
        class="inst"
        v-for="item in instruments"
        :key="item.id"
        :model="{ headers, item }"
        :class="{ active: selected && selected.id == item.id }"
      >
        <template #item.actions="{ item }">
          <div class="text-no-wrap">
            <ada-icon
              class="tw-text-info tw-m-0 tw-p-0 tw-mx-2"
              @click.stop.prevent="() => focus(item)"
              :disabled="!canFocus"
              :size="16"
            >
              isax-eye
            </ada-icon>
            <ada-icon
              :class="[
                'tw-m-0 tw-p-0',
                (item.status & 3) != 3 ? null : 'tw-text-success',
              ]"
              @click.stop.prevent="() => order(item, Side.Buy)"
              :disabled="(item.status & 3) != 3"
              :size="16"
            >
              isax-bag-tick-2
            </ada-icon>
            <ada-icon
              :class="[
                'tw-m-0 tw-p-0 tw-mx-2',
                (item.status & 3) != 3 ? null : 'tw-text-error',
              ]"
              @click.stop="() => order(item, Side.Sell)"
              :disabled="(item.status & 3) != 3"
              :size="16"
            >
              isax-bag-cross-1
            </ada-icon>
          </div>
        </template>
        <template #item.name="{ item }">
          <ada-badge
            :class="[
              (item.status & 1) != 1
                ? 'error'
                : (item.status & 6) != 6
                ? 'warning'
                : 'success',
            ]"
            dot
          >
            <ada-tooltip position="right">
              <template #activator>
                <span style="line-height: 2.5" class="tw-block">
                  {{ item.name }}
                </span>
              </template>
              {{ $t(parseStatus(item.status)) }}
            </ada-tooltip>
          </ada-badge>
        </template>
        <template #item.wealth="{ item }">
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
          <numeric-field class="tw-text-success" :value="item.lowest" />
        </template>
        <template #item.highest="{ item }">
          <numeric-field class="tw-text-error" :value="item.highest" />
        </template>
        <template #item.totalTrades="{ item }">
          <numeric-field :value="item.totalTrades" />
        </template>
        <template #item.totalShares="{ item }">
          <numeric-field class="tw-text-info" :value="item.totalShares" />
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
          <ada-icon
            class="tw-text-error"
            @click.self.stop.prevent="removeWatchList(item)"
            :size="16"
          >
            isax-trash
          </ada-icon>
        </template>
        <template #item.notifications="{ item }">
          <dashboard-watch-list-instrument-notifications :value="item" />
        </template>
      </ada-data-table-row-handler>
    </ada-data-table>
    <lazy-ada-dialog :active="confirmInstrumentRemoval">
      <div class="dialog-delete">
        <h5 v-text="$t('general.alert')"></h5>
        <p v-text="$t('instrument.remove')"></p>
        <footer class="tw-flex tw-items-center tw-p-2">
          <ada-btn
            dark
            :width="65"
            @click.stop.prevent="
              () => {
                remove(itemToDelete);
                confirmInstrumentRemoval = false;
              }
            "
          >
            {{ $t("general.yes") }}
          </ada-btn>
          <ada-btn
            dark
            :width="65"
            @click.stop.prevent="
              () => {
                itemToDelete = null;
                confirmInstrumentRemoval = false;
              }
            "
          >
            {{ $t("general.no") }}
          </ada-btn>
        </footer>
      </div>
    </lazy-ada-dialog>
  </div>
</template>
