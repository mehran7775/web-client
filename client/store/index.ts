import { GetterTree, MutationTree, ActionTree } from 'vuex'


class RootState {
  locale: string

  constructor() {
    this.locale = process.env.VUE_APP_I18N_LOCALE ?? ''
  }
}

export const state = () => new RootState()

export const getters: GetterTree<RootState, RootState> = {
  rtl(state: RootState): boolean {
    return ['fa', 'ar', 'azIr', 'ckb'].includes(state.locale)
  },
  locale(state: RootState): string {
    return state.locale
  }
}

export const mutations: MutationTree<RootState> = {
  setLocale(state: RootState, payload: string) {
    state.locale = payload
  }
}
