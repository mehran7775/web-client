import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Message } from '@/types/message'
import { Tabs, TabNames, DeepOptions, TabTitle, SameSectorQuery, Sector, MessageTemplate } from '@/types'


export const state = () => ({
  activeTab: <Tabs>Tabs.none,
  expanded: false,
  titles: <TabTitle[]>TabNames(),
  further_information: <Message>new Message(0, "", new MessageTemplate()),
  market_depth: {},
  the_bests: {},
  orders: {},
  loading: false,
})

export type RootState = ReturnType<typeof state>


export const getters: GetterTree<RootState, RootState> = {
  activeTab: (state): Tabs => state.activeTab,
  expanded: (state) => state.expanded,
  loading: (state) => state.loading,
  further_information: (state): Message => state.further_information,
  title: (state): TabTitle => state.titles[state.activeTab],
  market_depth: (state) => state.market_depth,
}

export const mutations: MutationTree<RootState> = {
  setActiveTab(state, payload: Tabs) {
    state.activeTab = payload
  },
  toggleExpand(state) {
    state.expanded = !state.expanded
  },
  setMessage(state, payload: Message) {
    state.further_information = payload
  },
  setTitle(state, payload: TabTitle) {
    Object.assign(state.titles[payload.tab], payload)
  },
  setDepthData(state, payload: { tab: Tabs, data: any }) {
    state.market_depth = payload
  },
  setLoading(state, payload: boolean) {
    state.loading = payload
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async getTeammates({ commit, dispatch }, payload: SameSectorQuery) {
    try {
      const sector = (await dispatch("oms/sector/getSector", payload.sector, { root: true })) as Sector
      commit("setTitle", new TabTitle(Tabs.depth, "bottom-panel." + DeepOptions.teammates, [sector.name]))
      const data = (await dispatch("oms/instruments/getTeammates", payload, { root: true }))
      commit("setDepthData", {
        type: DeepOptions.teammates,
        data: data
      })
      commit("setActiveTab", Tabs.depth)
    } catch (err: any) {
      if (err.response) {
        return err.response.status
      }
      return 450
    }
  }
}
