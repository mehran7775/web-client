import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { AxiosResponse } from "axios"
import { Instrument } from '@/types/oms';
import { PaginatedResult } from "@/types/collection";

async function getInstrumentsDetail(instruments: Array<string | number>, axios: NuxtAxiosInstance): Promise<AxiosResponse<PaginatedResult<Array<Instrument>>>> {
  return await axios.get('oms/instruments/daily-detail?ids=' + instruments + "&offset=0&length=" + instruments.length)
}

async function autoComplete(value: string, axios: NuxtAxiosInstance) {
  return await axios.get('oms/instruments/name-autocomplete?name=' + value)
}

export {
  getInstrumentsDetail,
  autoComplete
}
