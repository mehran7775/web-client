import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { message_1 } from '~/types/message'
import axios from "axios";



export const state = () => ({
    activeTab: "",
    expanded: false,
    further_information: {
      message: <message_1> {}
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
    further_information_message: (state) => state.further_information.message
}

export const mutations: MutationTree<RootState> = {
    setActiveTab (state, payload: string) {
        state.activeTab = payload
    },
    setPanelSize (state) {
      state.expanded = !state.expanded
    },
    setMessage (state, payload: message_1) {
      state.further_information.message = payload
    }
}

export const actions: ActionTree<RootState, RootState> = {
  getMessage({ commit }, payload: number) {
    axios.get("http://127.0.0.1:4010/oms/message/" + payload, {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLCJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX0.yRQYnWzskCZUxPwaQupWkiUzKELZ49eM7oWxAQK_ZXw",
          },
        })
        .then((response) => {
          commit('setMessage', response.data) ;
        });
  }
}
