import { defineStore } from "pinia";
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
  MessageOrigin
} from "@/types";
import { MessageState } from "@/types/stores";
import { AxiosResponse } from "axios";
import { useAxios } from "../useAxios";
type Code = "RLC" | "SUPPORT" | "ADMIN" | "TEDAN" | "CODAL" | "NEWS";

export const useMessages = defineStore("messages", () => {
  const state = reactive({
    categories: [
      {
        title: "categories.marketModerator",
        bg: "tw-bg-primary tw-bg-opacity-10",
        color: "tw-text-primary",
        active: true,
        code: "RLC",
      },
      {
        title: "categories.codal",
        bg: "tw-bg-success tw-bg-opacity-10",
        color: "tw-text-success",
        active: false,
        code: "CODAL",
      },
      {
        title: "categories.tedan",
        bg: "tw-bg-error tw-bg-opacity-10",
        color: "tw-text-error",
        active: false,
        code: "TEDAN",
      },
      {
        title: "categories.news",
        bg: "tw-bg-info tw-bg-opacity-10",
        color: "tw-text-info",
        active: false,
        code: "NEWS",
      },
    ],
    origins: ["RLC"] as Code[]
  });
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
  function activeExactCategory(code: Code) {
    state.categories.forEach((item)=> {
      if (item.code === code){
        item.active = true
      }else {
        item.active = false
      }
    })
    state.origins.splice(0, state.origins.length)
    state.origins.push(code)
  }

  return {
    state,
    getMessage,
    getMessages,
    getMessageFilters,
    activeExactCategory
  };
});
