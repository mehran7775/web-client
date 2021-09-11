import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { KeyValuePaire } from '@/types/collection'
import { Instrument } from '@/types/oms'
import { getInstrumentsDetail } from '~/repositories/instruments_manager'


export const state = () => (new RootState())

export class RootState {
  cache: KeyValuePaire<BigInt, Instrument>[] = []
}

export const getters: GetterTree<RootState, RootState> = {
  getAll: (state): KeyValuePaire<BigInt, Instrument>[] => {
    return state.cache
  },
  getByKey: (state) => (key: string) => {

  }
}

export const mutations: MutationTree<RootState> = {
  setInstruments(state, data) {
    state.cache = data
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async getInstrimentsDetail({ commit }, payload) {
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
