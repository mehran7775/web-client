import { GetterTree, MutationTree, ActionTree } from 'vuex'
import * as stores from '@/types/stores'



export const state = () => new stores.RootState()

export const getters: GetterTree<stores.RootState, stores.RootState> = {
  rtl: (state): boolean => ['fa', 'ar', 'azIr', 'ckb'].includes(state.locale),
  locale: (state): string => state.locale,
  menu: (state): number | null => state.menuIndex,
  currencyFormatter: (state): Intl.NumberFormat => Intl.NumberFormat(state.locale, { style: 'currency', currency: 'IRR' }),
  formatter: (state): Intl.NumberFormat => Intl.NumberFormat(state.locale)
}

export const mutations: MutationTree<stores.RootState> = {
  setMenu(state, payload: number | null) {
    state.menuIndex = payload
  },
  setLocale(state, payload: string) {
    state.locale = payload
  }
}
