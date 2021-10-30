import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { AxiosResponse } from "axios"
import { PaginatedResult, AutoCompleteItem, Instrument, OrderQueueItem } from "@/types";

export async function getInstrumentsDetail(instruments: Array<string | number>, axios: NuxtAxiosInstance): Promise<AxiosResponse<PaginatedResult<Instrument>>> {
  return axios.get('oms/instruments/daily-detail?ids=' + instruments + "&offset=0&length=" + instruments.length)
}

export async function autoComplete(value: string, axios: NuxtAxiosInstance): Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>>> {
  return axios.get('oms/instruments/name-autocomplete?name=' + value)
}

export async function getOrderQueue(value: number, axios: NuxtAxiosInstance): Promise<AxiosResponse<OrderQueueItem[]>> {
  return axios.get('oms/instruments/order-queue/' + value)
}

export async function getTeammates(instrumentId: number, sectorId: number, axios: NuxtAxiosInstance) {
  return axios.get('oms/instruments/same-sub-sectors/' + instrumentId + "/" + sectorId)
}