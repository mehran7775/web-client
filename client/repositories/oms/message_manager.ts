import { AxiosResponse, AxiosInstance } from "axios";
import { PaginatedResult, AutoCompleteItem, Message, MessageSourceResult } from "@/types";

export async function getMessage(
  id: number,
  axios: AxiosInstance
): Promise<AxiosResponse<Message>> {
  return await axios.get("oms/messages/" + id);
}

//TODO List Filter Type
export async function getMessageList(
  filters: object,
  axios: AxiosInstance
): Promise<AxiosResponse<PaginatedResult<Message>>> {
  const result = await axios.post("oms/messages/list", filters);
  return result;
}

export async function getMessageSource(
  instruments: Array<string>,
  axios: AxiosInstance
): Promise<AxiosResponse<PaginatedResult<MessageSourceResult>>> {
  const result = await axios.get(
    "oms/messages/available-sources?ids=" + instruments
  );
  return result;
}

export async function getMessageFilters(
  search: string,
  axios: AxiosInstance
): Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>>> {
  return await axios.get("oms/messages/filters?name=" + search);
}
