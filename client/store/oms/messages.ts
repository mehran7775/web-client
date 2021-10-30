import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { AxiosResponse } from "axios"
import { getMessage, getMessageFilters, getMessageList } from "~/repositories/oms/message_manager"
import { PaginatedResult, Message, AutoCompleteItem } from "@/types"

export class MessageState {

}

export const state = () => new MessageState()

export const actions: ActionTree<MessageState, MessageState> = {
  async getMessage(_, id: number): Promise<AxiosResponse<Message> | number> {
    try {
      return await getMessage(id, this.$axios)
    } catch (err: any) {
      return 500
    }
  },
  async getMessages(_, searchModel: object): Promise<AxiosResponse<PaginatedResult<Message>> | number> {
    try {
      return await getMessageList(searchModel, this.$axios)
    } catch (err: any) {
      return 500
    }
  },
  async getMessageFilters(_, name: string): Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>> | number> {
    try {
      return await getMessageFilters(name, this.$axios)
    } catch (err: any) {
      return 500
    }
  }
}
