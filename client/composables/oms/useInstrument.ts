import { computed, reactive, ref } from "#app";
import { defineStore } from "pinia";
import { InstrumentState } from "@/types/stores";
import {
  ClientDistribution,
  DailyPrice,
  Instrument,
  InstrumentCache,
  InstrumentSearchModel,
  MarketHistory,
  OrderQueueItem,
  SameSectorQuery,
  Wealth,
} from "~/types";
import manager from "@/repositories/oms/instruments_manager";
import { useAxios } from "../useAxios";
import { useWebSocket } from "../useWebsocket";
import { object } from "yup";

export const useInstrument = defineStore("instrument", () => {
  const state = ref<InstrumentState>({
    cache: new Map<string, InstrumentCache>(),
    focus: reactive([]),
    focusViewMode: 0,
    selected: null,
    orderQueueCache: {},
    clientDistributionCache: new Map<string, ClientDistribution>(),
    width: process.client ? window.screen.availWidth : 800,
  });
  const axiosManager = useAxios();
  const axios = axiosManager.createInstance();

  const websocket = useWebSocket();

  websocket.registerHandler("TSE_UPDATE", (data) => {
    if (data.obj.queue) {
      if (state.value.orderQueueCache[data.obj.id]) {
        state.value.orderQueueCache[data.obj.id].splice(
          0,
          data.obj.queue.length,
          ...data.obj.queue
        );
      } else state.value.orderQueueCache[data.obj.id] = data.obj.queue;
    }
  });

  // Getters
  const width = computed({
    get(): number {
      return state.value.width;
    },
    set(data: number) {
      setWidth(data);
    },
  });
  const focusMode = computed(() => state.value.focusViewMode);
  const getByKey = computed(
    () =>
      (key: number): InstrumentCache | null =>
        state.value.cache.get(key.toString()) || null
  );
  const getFocus = computed((): Array<InstrumentCache> => state.value.focus);
  const getSelected = computed(
    (): InstrumentCache | null => state.value.selected
  );
  const getSelectedIndex = computed((): number =>
    state.value.focus.findIndex((item) => item.id == state.value.selected?.id)
  );

  // Mutations
  function updateInstrument(
    data: InstrumentCache | Instrument | DailyPrice | MarketHistory | Wealth
  ) {
    const inst = state.value.cache.get(data.id.toString());
    if (inst) Object.assign(inst, data);
    else
      state.value.cache.set(
        data.id.toString(),
        Object.assign(new InstrumentCache(), data)
      );
  }
  function setFocus(data: Array<InstrumentCache>) {
    state.value.focus = data;
  }
  function addFocus(data: InstrumentCache) {
    if (state.value.focus.findIndex((item) => item.id == data.id) == -1)
      state.value.focus.splice(0, 0, data);
  }
  function setFocusMode(data: number) {
    state.value.focusViewMode = data;
  }
  function removeFocus(data: number) {
    const index = state.value.focus.findIndex(
      (element: Instrument) => element.id == data
    );
    state.value.focus.splice(index, 1);
    state.value.selected =
      index >= state.value.focus.length
        ? state.value.focus[index - 1]
        : state.value.focus[index];
  }
  function select(active: InstrumentCache | null) {
    state.value.selected = active;
  }
  function selectByIndex(index: number) {
    state.value.selected = state.value.focus[index];
  }
  function selectById(id: number) {
    state.value.selected = state.value.cache.get(id.toString()) ?? null;
  }
  function setWidth(width: number) {
    state.value.width = width;
  }

  async function getInstrumentsDetail(
    searchModel: InstrumentSearchModel
  ): Promise<Array<InstrumentCache>> {
    const res: Array<InstrumentCache> = [];
    const missing: Array<number> = [];

    if (
      searchModel.boardIds.length == 0 &&
      searchModel.secIds.length == 0 &&
      searchModel.ids.length != 0
    ) {
      let tmp = null;
      for (let i in searchModel.ids) {
        tmp = state.value.cache.get(searchModel.ids[i].toString());
        if (tmp?.name) res.push(tmp);
        else missing.push(searchModel.ids[i]);
      }
    }

    if (
      missing.length > 0 ||
      searchModel.boardIds.length > 0 ||
      searchModel.secIds.length > 0
    ) {
      const {
        data: { data },
      } = await manager.getInstruments(
        Object.assign({}, searchModel, { ids: missing }),
        axios
      );
      data.forEach((item) => {
        updateInstrument(item);
        websocket.addInstrumentToWatch(item);
        res.push(state.value.cache.get(item.id.toString()) as InstrumentCache);
      });
    }

    res.sort((a, b) => {
      return searchModel.ids.indexOf(a.id) - searchModel.ids.indexOf(b.id);
    });
    websocket.watchInstruments(null);
    const ids = res.map((item) => item.id);
    if (ids.length > 0) {
      getInstrumentPrices(ids);
      getMarketHistory(ids);
    }

    return res;
  }
  async function getInstrumentPrices(
    ids: Array<number>
  ): Promise<Array<DailyPrice> | number> {
    const {
      data: { data },
    } = await manager.getDailyPrice(ids, axios);
    data.forEach((item) => {
      item.id = item.instrumentId;
      updateInstrument(item);
    });
    return data;
  }
  async function getMarketHistory(
    ids: Array<number>
  ): Promise<Array<MarketHistory> | number> {
    const {
      data: { data },
    } = await manager.getInstrumentMarketHistory(ids, axios);
    data.forEach((item) => {
      item.id = item.instrumentId;
      updateInstrument(item);
    });
    return data;
  }
  function getOrderQueue(
    inst: Instrument | InstrumentCache
  ): Array<OrderQueueItem> {
    let queue = state.value.orderQueueCache[inst.instrumentCode];
    if (queue) return queue;
    else {
      state.value.orderQueueCache[inst.instrumentCode] =reactive([
        new OrderQueueItem(),
        new OrderQueueItem(),
        new OrderQueueItem(),
        new OrderQueueItem(),
        new OrderQueueItem(),
      ]);
      manager.getOrderQueue(inst.id, axios).then((resp) => {
        if (resp.data.queue)
          state.value.orderQueueCache[inst.instrumentCode].splice(
            0,
            resp.data.queue.length,
            ...resp.data.queue
          );
      });
    }
    return state.value.orderQueueCache[inst.instrumentCode];
  }
  async function getClientDistribution(
    id: number
  ): Promise<ClientDistribution> {
    let clients = state.value.clientDistributionCache.get(id.toString());
    if (clients) return clients;
    const { data } = await manager.getClientDistribution(id, axios);
    return data.clients;
  }
  async function getTeammates(
    searchModel: SameSectorQuery
  ): Promise<{ queue: Array<OrderQueueItem> }> {
    const { data } = await manager.getTeammates(
      searchModel.instrument,
      searchModel.sector,
      axios
    );
    return data;
  }

  return {
    state,
    // Getters
    width,
    focusMode,
    getByKey,
    getFocus,
    getSelected,
    getSelectedIndex,
    //Mutations
    updateInstrument,
    setFocus,
    addFocus,
    setFocusMode,
    removeFocus,
    select,
    selectByIndex,
    selectById,
    setWidth,
    // Actions
    getInstrumentsDetail,
    getInstrumentPrices,
    getMarketHistory,
    getOrderQueue,
    getClientDistribution,
    getTeammates,
  };
});
