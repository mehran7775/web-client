import { AxiosInstance, AxiosResponse } from "axios";
import { PaginatedResult, AutoCompleteItem, AutoCompleteSearchModel } from "@/types";


export async function getIndustries(
    axios: AxiosInstance
  ): Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>>> {
    return axios.get("/oms/sector/list?offset=0&length=120");
  }

export async function autoComplete(
    value: AutoCompleteSearchModel, axios: AxiosInstance
    ): Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>>> {
    return axios.get('oms/sector/autocomplete', { params: value })
  }

  export default {
    getIndustries,
    autoComplete
  }
  