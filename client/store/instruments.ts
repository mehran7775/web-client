import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { KeyValuePaire } from '@/types/collection'
import { Instrument } from '@/types/oms'


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

}