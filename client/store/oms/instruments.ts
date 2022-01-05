import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Instrument, OrderQueueItem, Side, SameSectorQuery, InstrumentCache, MarketHistory, PaginatedResult, ClientDistributionResponse, ClientDistribution, Order } from '@/types'
import { getInstrumentsDetail, getOrderQueue, getTeammates, getInstrumentMarketHistory, getClientDistribution as Distribution } from '@/repositories/oms/instruments_manager'
import { RootState } from '@/types/stores'


export const state = () => (new InstrumentState())

export class InstrumentState {
  cache: Map<string, InstrumentCache> = new Map<string, InstrumentCache>()
  focus: Array<InstrumentCache> = []
  focusViewMode: number = 0
  selected: InstrumentCache | null = null
  orderQueueCache: Map<string, Array<OrderQueueItem>> = new Map<string, Array<OrderQueueItem>>()
  clientDistributionCache: Map<string, ClientDistribution> = new Map<string, ClientDistribution>()
  editWatchlist: boolean = false
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
  editWatchlist: (state): boolean => state.editWatchlist,
}

export const mutations: MutationTree<InstrumentState> = {
  setEditMode(state, data: boolean) {
    state.editWatchlist = data
  },
  updateInstrument(state, data) {
    const inst = state.cache.get(data.id.toString())
    Object.assign(inst, data)
  },
  setInstruments(state, data: Array<InstrumentCache>) {
    for (let i in data) {
      state.cache.set(data[i].id.toString(), data[i])
    }
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
  async getInstrumentsDetail({ state, commit }, payload: Array<number>): Promise<Array<InstrumentCache> | number> {
    let res: Array<InstrumentCache> = []
    let missing: Array<number> = []
    let tmp = null
    for (let i in payload) {
      tmp = state.cache.get(payload[i].toString())
      if (tmp && tmp.baseVol) res.push(tmp)
      else missing.push(payload[i])
    }
    if (missing.length > 0) {
      const getins = getInstrumentsDetail(missing, this.$axios)
      const { data: { data: market } } = await getInstrumentMarketHistory(missing, this.$axios)
      const { data: { data } } = await getins
      res.push(...data.map(
        (ins) => Object.assign({ side: Side.Buy }, market.find((item) => item.instrumentId == ins.id), ins)))
      commit('setInstruments', res)
    }
    return res
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
