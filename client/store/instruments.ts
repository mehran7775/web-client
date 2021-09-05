import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { KeyValuePaire } from '@/types/collection'
import { Instrument } from '@/types/oms'
import daily_instruments from '~/repositories/daily_instruments'


export const state = () => (new RootState())

export class RootState {
  cache: KeyValuePaire<BigInt,Instrument>[] = []
}

export const getters: GetterTree<RootState, RootState> = {
  getAll: (state): KeyValuePaire<BigInt,Instrument>[] => {
    return state.cache
  }
}

export const mutations: MutationTree<RootState> = {

}

export const actions: ActionTree<RootState, RootState> = {
    async getInstrimentsDetail({},payload){
      try {
        const { data, status } = await daily_instruments.getInstrumentsDetail(payload, this.$axios)
        return data
      } catch (err:any) {
        if (err.response) {
          return err.response.status
        }
        return 450
      }
    }
}
