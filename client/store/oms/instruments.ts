import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Instrument, OrderQueueItem, Side, ActiveInstrument, SameSectorQuery } from '@/types'
import { getInstrumentsDetail, getOrderQueue, getTeammates } from '@/repositories/oms/instruments_manager'


export const state = () => (new RootState())

export class RootState {
  cache: Map<number, Instrument> = new Map<number, Instrument>()
  focus: Array<Instrument> = []
  selected: ActiveInstrument = new ActiveInstrument(0, Side.Buy)
  orderQueueCache: Map<number, Array<OrderQueueItem>> = new Map<number, Array<OrderQueueItem>>()
}

export const getters: GetterTree<RootState, RootState> = {
  getAll: (state): Array<Instrument> => {
    return [...state.cache.values()]
  },
  getByKey: (state) => (key: number): Instrument | null => {
    return state.cache.get(key) || null
  },
  getFocus: (state): Array<Instrument> => {
    return state.focus
  },
  getSelected: (state): ActiveInstrument => {
    return state.selected
  },
  getSelectedIndex: (state): number => {
    return state.focus.findIndex((item) => item.id == state.selected.instrumentId)
  }
}

export const mutations: MutationTree<RootState> = {
  setInstruments(state, data: Array<Instrument>) {
    for (let i in data) {
      state.cache.set(data[i].id, data[i])
    }
  },
  setFocus(state, data: Array<Instrument>) {
    state.focus = data
  },
  removeFocus(state, data: number) {
    state.focus.splice(state.focus.findIndex((element: Instrument) => element.id == data), 1)
  },
  watchQueue(state, payload: { key: number, data: Array<OrderQueueItem> }) {
    state.orderQueueCache.set(payload.key, payload.data)
  },
  stopWatchQueue(state, key: number) {
    state.orderQueueCache.delete(key)
  },
  select(state, active: ActiveInstrument) {
    active.side = active.side ?? state.selected.side
    state.selected = active
  },
  selectByIndex(state, index: number) {
    state.selected.instrumentId = state.focus[index]?.id
  },
  selectSide(state, side: Side) {
    state.selected.side = side
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async getInstrumentsDetail({ state, commit }, payload: Array<number>): Promise<Array<Instrument> | number> {
    try {
      let res: Array<Instrument> = []
      let missing: Array<number> = []
      let tmp = null
      for (let i in payload) {
        tmp = state.cache.get(payload[i])
        if (tmp) res.push(tmp)
        else missing.push(payload[i])
      }
      if (missing.length > 0) {
        const { data: { data } } = await getInstrumentsDetail(missing, this.$axios)
        commit('setInstruments', data)
        res.push(...data)
      }
      return res
    } catch (err: any) {
      if (err.response) {
        return err.response.status as number
      }
      return 450
    }
  },
  async getOrderQueue({ state, commit }, payload: number): Promise<Array<OrderQueueItem> | number> {
    try {
      let queue = state.orderQueueCache.get(payload)
      if (queue)
        return queue
      const { data } = await getOrderQueue(payload, this.$axios)
      commit('watchQueue', { key: payload, data: data })
      return data
    } catch (err: any) {
      if (err.response) {
        return err.response.status as number
      }
      return 450
    }
  },
  async getTeammates({ state, commit }, payload: SameSectorQuery): Promise<Array<OrderQueueItem> | number> {
    try {
      const { data } = await getTeammates(payload.instrument, payload.sector, this.$axios)
      return data
    } catch (err: any) {
      if (err.response) {
        return err.response.status as number
      }
      return 450
    }
  }
}
