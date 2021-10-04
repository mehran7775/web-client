import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Instrument, OrderQueueItem } from '@/types/oms'
import { getInstrumentsDetail, getOrderQueue } from '~/repositories/instruments_manager'


export const state = () => (new RootState())

export class RootState {
  cache: Map<number, Instrument> = new Map<number, Instrument>()
  focus: Array<Instrument> = []
  orderQueueCache: Map<number, Array<OrderQueueItem>> = new Map<number, Array<OrderQueueItem>>()
}

export const getters: GetterTree<RootState, RootState> = {
  getAll: (state): Array<Instrument> => {
    return [...state.cache.values()]
  },
  getByKey: (state) => (key: number): Instrument | null => {
    return state.cache.get(key) || null
  },
  getFocus: (state) => {
    return state.focus
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
    state.orderQueueCache.get(payload.key)?.push(...payload.data)
  },
  stopWatchQueue(state, key: number) {
    state.orderQueueCache.delete(key)
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async getInstrumentsDetail({ commit }, payload: Array<number>): Promise<Array<Instrument> | number> {
    try {
      const { data: { data } } = await getInstrumentsDetail(payload, this.$axios)
      commit('setInstruments', data)
      return data
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
  }
}
