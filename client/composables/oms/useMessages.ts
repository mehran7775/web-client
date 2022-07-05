import { defineStore } from "pinia";
import { ref } from "#app";
import {
  getMessage as GetMessage,
  getMessageFilters as GetMessageFilters,
  getMessageList as GetMessageList,
} from "~/repositories/oms/message_manager";
import {
  PaginatedResult,
  Message,
  AutoCompleteItem,
  MessageQuery,
} from "@/types";
import { MessageState } from "@/types/stores";
import { AxiosResponse } from "axios";
import { useAxios } from "../useAxios";

export const useMessages = defineStore("messages", () => {
  const state = ref<MessageState>({});
  const axios = useAxios().createInstance();

  async function getMessage(id: number): Promise<AxiosResponse<Message>> {
    return await GetMessage(id, axios);
  }
  async function getMessages(
    searchModel: MessageQuery
  ): Promise<AxiosResponse<PaginatedResult<Message>>> {
    return await GetMessageList(searchModel, axios);
  }
  async function getMessageFilters(
    name: string
  ): Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>>> {
    return await GetMessageFilters(name, axios);
  }
  return {
    state,
    getMessage,
    getMessages,
    getMessageFilters,
  };
});
