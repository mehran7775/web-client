import { AxiosResponse } from "axios"
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { PaginatedResult, AutoCompleteItem, Message, MessageTemplate_1 } from '@/types'


export async function getMessage(id: number, axios: NuxtAxiosInstance)
  : Promise<AxiosResponse<Message>> {
  return await axios.get("oms/messages/" + id)
}

//TODO List Filter Type
export async function getMessageList(filters: object, axios: NuxtAxiosInstance)
  : Promise<AxiosResponse<PaginatedResult<Message>>> {
  const result = await axios.post("oms/messages/list", filters)
  return result
}

export async function getMessageFilters(search: string, axios: NuxtAxiosInstance)
  : Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>>> {
  return await axios.get("oms/messages/filters?name=" + search)
}



