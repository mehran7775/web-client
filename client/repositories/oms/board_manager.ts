import { AxiosInstance, AxiosResponse } from "axios";
import { PaginatedResult, AutoCompleteItem } from "@/types";

export async function getBoards(
  axios: AxiosInstance
): Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>>> {
  return axios.get("/oms/board/list?offset=0&length=120");
}
