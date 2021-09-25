import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { KeyValuePairs as KeyValuePairs } from '@/types/collection'
import { Instrument } from '@/types/oms'
import { getInstrumentsDetail } from '~/repositories/instruments_manager'


export const state = () => (new RootState())

export class RootState {
  cache: Map<BigInteger, Instrument> = new Map<BigInteger, Instrument>()
}

export const getters: GetterTree<RootState, RootState> = {
  getAll: (state): Array<Instrument> => {
    return [...state.cache.values()]
  },
  getByKey: (state) => (key: BigInteger) => {
    return state.cache.get(key)
  }
}

export const mutations: MutationTree<RootState> = {
  setInstruments(state, data: Array<Instrument>) {
    for (let i in data) {
      state.cache.set(data[i].id, data[i])
    }
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async getInstrumentsDetail({ commit }, payload) {
    try {
      const { data, status } = await getInstrumentsDetail(payload, this.$axios)
      commit('setInstruments', data)
    } catch (err: any) {
      if (err.response) {
        return err.response.status
      }
      return 450
    }
  }
}
