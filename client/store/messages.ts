import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { getMessage, getMessageFilters, getMessageList } from "@/repositories/message_manager"
import { PaginatedResult } from "@/types/collection"
import { Message } from "@/types/message"

export class MessageState {

}

export const state = () => new MessageState()

export const actions: ActionTree<MessageState, MessageState> = {
  async getMessage(_, id: number) {
    try {
      await getMessage(id, this.$axios)
    } catch (err: any) {
      return 500
    }
  },
  async getMessages(_, searchModel: object) {
    try {
      await getMessageList(searchModel, this.$axios)
    } catch (err: any) {
      return 500
    }
  },
  async getMessageFilters(_, name: string) {
    try {
      await getMessageFilters(name, this.$axios)
    } catch (err: any) {
      return 500
    }
  }
}
