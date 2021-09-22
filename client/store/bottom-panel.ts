import { GetterTree, ActionTree, MutationTree } from 'vuex'
import message_manager from '~/repositories/message_manager'
import { message } from '~/types/message'



export const state = () => ({
    activeTab: undefined,
    expanded: false,
    further_information: {
      message: <message> {}
    },
    market_depth: {},
    the_bests: {},
    orders: {}
  })

export type RootState = ReturnType<typeof state>


export const getters: GetterTree<RootState, RootState> = {
    activeTab: (state) => state.activeTab,
    icon: (state) => (state.expanded ? 'mdi-arrow-collapse' : 'mdi-arrow-expand'),
    panelSize: (state) => (state.expanded ? '80vh' : '30vh'),
    further_information_message: (state) => state.further_information.message,
}

export const mutations: MutationTree<RootState> = {
    setActiveTab (state, payload) {
        state.activeTab = payload
    },
    setPanelSize (state) {
      state.expanded = !state.expanded
    },
    setMessage (state, payload: message) {
      state.further_information.message = payload
    }
}

export const actions: ActionTree<RootState, RootState> = {
    async getMessage({ commit }, payload: number) {
      try {
        const { data, status } = await message_manager.getMessage(payload, this.$axios)
        commit('setMessage', data) ;
        return status
      } catch (err: any) {
        if (err.response) {
          return err.response.status
        }
        return 450
      }
    }
}
