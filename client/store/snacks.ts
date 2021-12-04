import { MutationTree } from 'vuex'

export class Snack {
  content: string
  color: string
  constructor(content: string, color: string) {
    this.content = content
    this.color = color ?? 'warning'
  }
}

export const state = (): Snack => new Snack("", "")

export const mutations: MutationTree<Snack> = {
  showMessage(state, payload) {
    state.content = payload.content
    state.color = payload.color
  }
}
