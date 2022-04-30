import { AxiosInstance, AxiosResponse } from "axios";
import { PaginatedResult, AutoCompleteItem } from "@/types";

export async function getIndustries(
    axios: AxiosInstance
  ): Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>>> {
    return axios.get("/oms/sector/list?offset=0&length=120");
  }