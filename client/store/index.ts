import { GetterTree } from 'vuex'

type RootState = ReturnType<typeof state>

export const state = () => ({
  locale: process.env.VUE_APP_I18N_LOCALE ?? ''
})

export const getters: GetterTree<RootState, RootState> = {
  rtl(state: RootState) {
    return ['fa', 'ar', 'azIr', 'ckb'].includes(state.locale)
  },
  locale(state: RootState) {
    return state.locale
  }
}
