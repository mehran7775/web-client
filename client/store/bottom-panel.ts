import { GetterTree, ActionTree, MutationTree } from 'vuex'
import message_manager from '@/repositories/message_manager'
import { Message } from '@/types/message'
import { Tabs, TabNames, TabTitle } from '@/types/panels'


export const state = () => ({
  activeTab: <Tabs>Tabs.none,
  expanded: false,
  titles: TabNames(),
  title: "",
  further_information: <Message>{},
  market_depth: {},
  the_bests: {},
  orders: {}
})

export type RootState = ReturnType<typeof state>


export const getters: GetterTree<RootState, RootState> = {
  activeTab: (state): Tabs => state.activeTab,
  expanded: (state) => state.expanded,
  further_information: (state): Message => state.further_information,
  title: (state): string => state.title,
}

export const mutations: MutationTree<RootState> = {
  setActiveTab(state, payload: Tabs) {
    state.title = state.titles[payload]
    state.activeTab = payload
  },
  toggleExpand(state) {
    state.expanded = !state.expanded
  },
  setMessage(state, payload: Message) {
    state.further_information = payload
  },
  setTitle(state, payload: TabTitle) {
    state.titles[payload.tab] = payload.title
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async getMessage({ commit }, payload: number) {
    try {
      const { data, status } = await message_manager.getMessage(payload, this.$axios)
      commit('setMessage', data);
      return status
    } catch (err: any) {
      if (err.response) {
        return err.response.status
      }
      return 450
    }
  }
}
