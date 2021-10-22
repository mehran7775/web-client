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
  //TODO remove fake result
  const fakeResult = new PaginatedResult<Message>([
    new Message(1, "msg1", new MessageTemplate_1("this is test 1."), null, 1, 1),
    new Message(2, "msg2", new MessageTemplate_1("this is test 2."), null, 0, 2),
    new Message(3, "msg3", new MessageTemplate_1("this is test 3."), null, 0, 3),
    new Message(4, "msg4", new MessageTemplate_1("this is test 4."), null, 1, 4),
    new Message(5, "msg5", new MessageTemplate_1("this is test 5."), null, 1, 1),
  ], 0, 2)
  const result = await axios.post("oms/messages/list", filters)
  result.data = fakeResult
  return result
}

export async function getMessageFilters(search: string, axios: NuxtAxiosInstance)
  : Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>>> {
  return await axios.get("oms/messages/filters?name=" + search)
}



