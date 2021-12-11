import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { AxiosResponse } from "axios"
import { getMessage, getMessageFilters, getMessageList } from "~/repositories/oms/message_manager"
import { PaginatedResult, Message, AutoCompleteItem } from "@/types"

export class MessageState {

}

export const state = () => new MessageState()

export const actions: ActionTree<MessageState, MessageState> = {
  async getMessage(_, id: number): Promise<AxiosResponse<Message>> {
    return await getMessage(id, this.$axios)
  },
  async getMessages(_, searchModel: object): Promise<AxiosResponse<PaginatedResult<Message>>> {
    return await getMessageList(searchModel, this.$axios)
  },
  async getMessageFilters(_, name: string): Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>>> {
    return await getMessageFilters(name, this.$axios)
  }
}
