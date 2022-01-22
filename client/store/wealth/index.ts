import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { AxiosResponse } from "axios"
import * as stores from '@/types/stores'
import { Wealth, WealthSearchModel } from '@/types'
import { getWealth } from "@/repositories/wealth/wealth_manager"

export class WealthState {
}

async function doAsync(fn: Function) {
  return fn()
}

export const actions: ActionTree<WealthState, stores.RootState> = {
  async getWealth({ state, commit, rootGetters, dispatch }, payload: WealthSearchModel): Promise<Array<Wealth> | undefined> {
    const wealth = (await getWealth(rootGetters["sso/user/me"].userName, payload, this.$axios)).data?.data
    doAsync(() =>
      wealth.every((item) =>
        commit("oms/instruments/updateInstrument", item, { root: true })
      ))
    return wealth
  }
}