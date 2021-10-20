import { AxiosResponse } from "axios"
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { PaginatedResult, AutoCompleteItem } from '@/types/collection'
import { Message } from '@/types/message'

export async function getMessage(id: number, axios: NuxtAxiosInstance)
  : Promise<AxiosResponse<Message>> {
  return await axios.get("oms/messages/" + id)
}

//TODO List Filter Type
export async function getMessageList(filters: object, axios: NuxtAxiosInstance)
  : Promise<AxiosResponse<PaginatedResult<Message>>> {
  return await axios.post("oms/messages/list", filters)
}

export async function getMessageFilters(search: string, axios: NuxtAxiosInstance)
  : Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>>> {
  return await axios.get("oms/messages/filters?name=" + search)
}



