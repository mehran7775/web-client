import { GetterTree, ActionTree, MutationTree } from 'vuex'
import message_manager from '~/repositories/message_manager'
import { message } from '~/types/message'
import { Tabs } from '~/types/panels'


export const state = () => ({
  activeTab: <Tabs>Tabs.none,
  expanded: false,
  further_information: <message>{},
  market_depth: {},
  the_bests: {},
  orders: {}
})

export type RootState = ReturnType<typeof state>


export const getters: GetterTree<RootState, RootState> = {
  activeTab: (state): Tabs => state.activeTab,
  icon: (state): string => (state.expanded ? 'mdi-arrow-collapse' : 'mdi-arrow-expand'),
  expanded: (state) => state.expanded,
  further_information: (state): message => state.further_information,
}

export const mutations: MutationTree<RootState> = {
  setActiveTab(state, payload: Tabs) {
    state.activeTab = payload
  },
  toggleExpand(state) {
    state.expanded = !state.expanded
  },
  setMessage(state, payload: message) {
    state.further_information = payload
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
