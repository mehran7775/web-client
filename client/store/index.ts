import { GetterTree, MutationTree, ActionTree } from 'vuex'
import * as stores from '@/types/stores'



export const state = () => new stores.RootState()

export const getters: GetterTree<stores.RootState, stores.RootState> = {
  rtl(state: stores.RootState): boolean {
    return ['fa', 'ar', 'azIr', 'ckb'].includes(state.locale)
  },
  locale(state: stores.RootState): string {
    return state.locale
  }
}

export const mutations: MutationTree<stores.RootState> = {
  setLocale(state: stores.RootState, payload: string) {
    state.locale = payload
  }
}
