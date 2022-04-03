import { computed, ref } from "#app";
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
  Side,
  Wealth,
} from "~/types";
import manager from "@/repositories/oms/instruments_manager";
import { useAxios } from "../useAxios";

export const useInstrument = defineStore("instrument", () => {
  const state = ref<InstrumentState>({
    cache: new Map<string, InstrumentCache>(),
    focus: [],
    focusViewMode: 0,
    selected: null,
    orderQueueCache: new Map<string, Array<OrderQueueItem>>(),
    clientDistributionCache: new Map<string, ClientDistribution>(),
    width: process.client ? window.screen.availWidth : 800,
  });
  const axiosManager = useAxios();
  const axios = axiosManager.createInstance();

  // Getters
  const width = computed({
    get(): number {
      return state.value.width;
    },
    set(data: number) {
      setWidth(data);
    },
  });
  const focusMode = computed({
    get(): number {
      return state.value.focusViewMode;
    },
    set(data: number) {
      setFocusMode(data);
    },
  });
  const selectedId = computed({
    get(): string {
      return (state.value.selected?.id ?? -1).toString();
    },
    async set(data: string) {
      selectById(parseInt(data));
    },
  });
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
    data:
      | InstrumentCache
      | Instrument
      | DailyPrice
      | MarketHistory
      | Wealth
      | { id: number; side: Side }
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
    state.value.focus.splice(
      state.value.focus.findIndex((element: Instrument) => element.id == data),
      1
    );
  }
  function select(active: InstrumentCache) {
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

  //TODO Move Actions Buisiness here
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
        res.push(state.value.cache.get(item.id.toString()) as InstrumentCache);
      });
    }

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
  async function getOrderQueue(
    id: number
  ): Promise<{ queue: Array<OrderQueueItem> }> {
    let queue = state.value.orderQueueCache.get(id.toString());
    if (queue) return { queue };
    const { data } = await manager.getOrderQueue(id, axios);
    return data;
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
    selectedId,
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
