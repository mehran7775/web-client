import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { AxiosResponse } from "axios"
import { Sector } from '@/types'
import { getSector } from "@/repositories/sector_manager"

export const state = () => (new RootState())

export class RootState {
  cache: Map<number, Sector> = new Map<number, Sector>()
}

export const actions: ActionTree<RootState, RootState> = {
  async getSector({ state, commit }, payload: number): Promise<Sector | undefined> {
    if (state.cache.has(payload))
      return state.cache.get(payload)
    else {
      const sector: Sector = (await getSector(payload, this.$axios)).data
      state.cache.set(sector.id, sector)
      return sector
    }
  }
}
