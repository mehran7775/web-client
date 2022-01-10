import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Instrument, OrderQueueItem, Side, SameSectorQuery, InstrumentCache, MarketHistory, PaginatedResult, ClientDistributionResponse, ClientDistribution, Order, DailyPrice } from '@/types'
import { getInstruments, getOrderQueue, getTeammates, getInstrumentMarketHistory, getClientDistribution as Distribution, getDailyPrice } from '@/repositories/oms/instruments_manager'
import { RootState } from '@/types/stores'


export const state = () => (new InstrumentState())

export class InstrumentState {
  cache: Map<string, InstrumentCache> = new Map<string, InstrumentCache>()
  focus: Array<InstrumentCache> = []
  focusViewMode: number = 0
  selected: InstrumentCache | null = null
  orderQueueCache: Map<string, Array<OrderQueueItem>> = new Map<string, Array<OrderQueueItem>>()
  clientDistributionCache: Map<string, ClientDistribution> = new Map<string, ClientDistribution>()
}

export const getters: GetterTree<InstrumentState, RootState> = {
  getAll: (state) => (ids: Array<string>): Array<InstrumentCache> => {
    const res: Array<InstrumentCache> = []
    for (let id in ids) {
      const tmp = state.cache.get(ids[id]) as InstrumentCache
      if (tmp)
        res.push(tmp)
    }
    return res
  },
  getByKey: (state) => (key: number): InstrumentCache | null => state.cache.get(key.toString()) || null,
  getFocus: (state): Array<InstrumentCache> => state.focus,
  getFocusMode: (state): number => state.focusViewMode,
  getSelected: (state): InstrumentCache | null => state.selected,
  getSelectedIndex: (state): number =>
    state.focus.findIndex((item) => item.id == state.selected?.id),
  getSelectedId: (state): number => state.selected?.id ?? -1,
}

export const mutations: MutationTree<InstrumentState> = {
  updateInstrument(state, data: InstrumentCache) {
    const inst = state.cache.get(data.id.toString())
    if (inst)
      Object.assign(inst, data)
    else
      state.cache.set(data.id.toString(), Object.assign(new InstrumentCache(), data))
  },
  setFocus(state, data: Array<InstrumentCache>) {
    state.focus = data
  },
  addFocus(state, data: InstrumentCache) {
    if (state.focus.findIndex((item) => item.id == data.id) == -1)
      state.focus.push(data)
  },
  setFocusMode(state, data: number) {
    state.focusViewMode = data
  },
  removeFocus(state, data: number) {
    state.focus.splice(state.focus.findIndex((element: Instrument) => element.id == data), 1)
  },
  watchQueue(state, payload: { key: string, data: Array<OrderQueueItem> }) {
    state.orderQueueCache.set(payload.key, payload.data)
  },
  stopWatchQueue(state, key: string) {
    state.orderQueueCache.delete(key)
  },
  watchDist(state, payload: { key: string, data: ClientDistribution }) {
    state.clientDistributionCache.set(payload.key, payload.data)
  },
  stopWatchDist(state, key: string) {
    state.clientDistributionCache.delete(key)
  },
  select(state, active: InstrumentCache) {
    state.selected = active
  },
  selectByIndex(state, index: number) {
    state.selected = state.focus[index]
  },
  selectById(state, id: number) {
    state.selected = state.cache.get(id.toString()) ?? null
  }
}

export const actions: ActionTree<InstrumentState, InstrumentState> = {
  async getInstrumentsDetail({ state, commit, dispatch }, payload: Array<number>): Promise<Array<Instrument> | number> {
    let res: Array<Instrument> = []
    let missing: Array<number> = []
    let tmp = null
    for (let i in payload) {
      tmp = state.cache.get(payload[i].toString())
      if (tmp && tmp.baseVol) res.push(tmp)
      else missing.push(payload[i])
    }
    if (missing.length > 0) {
      const { data: { data } } = await getInstruments(missing, this.$axios)
      data.forEach((item) => {
        commit('updateInstrument', item)
      })
      res.push(...data)
      dispatch("getInstrumentPrices", missing)
      dispatch("getMarketHistory", missing)
    }
    return res
  },
  async getInstrumentPrices({ state, commit }, payload: Array<number>): Promise<Array<DailyPrice> | number> {
    const { data: { data } } = await getDailyPrice(payload, this.$axios)
    data.forEach((item) => {
      item.id = item.instrumentId
      commit('updateInstrument', item)
    })
    return data
  },
  async getMarketHistory({ state, commit }, payload: Array<number>): Promise<Array<MarketHistory> | number> {
    const { data: { data } } = await getInstrumentMarketHistory(payload, this.$axios)
    data.forEach((item) => {
      item.id = item.instrumentId
      commit('updateInstrument', item)
    })
    return data
  },
  async getOrderQueue({ state, commit }, payload: number): Promise<Array<OrderQueueItem>> {
    let queue = state.orderQueueCache.get(payload.toString())
    if (queue)
      return queue
    const { data } = await getOrderQueue(payload, this.$axios)
    commit('watchQueue', { key: payload.toString(), data: data })
    return data
  },
  async getClientDistribution({ state, commit }, payload: number): Promise<ClientDistribution> {
    let clients = state.clientDistributionCache.get(payload.toString())
    if (clients)
      return clients
    const { data } = await Distribution(payload, this.$axios)
    commit('watchDist', { key: payload.toString(), data: data.clients })
    return data.clients
  },
  async getTeammates({ state, commit }, payload: SameSectorQuery): Promise<Array<OrderQueueItem>> {
    const { data } = await getTeammates(payload.instrument, payload.sector, this.$axios)
    return data
  }
}
