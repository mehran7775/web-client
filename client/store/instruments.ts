import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Instrument } from '@/types/oms'
import { getInstrumentsDetail } from '~/repositories/instruments_manager'


export const state = () => (new RootState())

export class RootState {
  cache: Map<number, Instrument> = new Map<number, Instrument>()
  focus: Array<Instrument> = []
}

export const getters: GetterTree<RootState, RootState> = {
  getAll: (state): Array<Instrument> => {
    return [...state.cache.values()]
  },
  getByKey: (state) => (key: number) => {
    return state.cache.get(key)
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
  }
}
