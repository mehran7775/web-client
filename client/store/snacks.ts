import { MutationTree } from 'vuex'

export const state = () => ({
  content: '',
  color: ''
})

type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState>= {
  showMessage (state, payload) {
    state.content = payload.content
    state.color = payload.color
  }
}
