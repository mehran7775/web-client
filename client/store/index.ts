import { GetterTree, MutationTree, ActionTree } from 'vuex'
import * as stores from '@/types/stores'
import { ICookie } from "cookie-universal"



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
  setLocale(state, payload: string) {
    state.locale = payload
  },
  setCookieProvider(state, provider: ICookie) {
    state.cookie = provider
  }
}
