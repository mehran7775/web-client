import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { AxiosResponse } from "axios"
import { Paginated, PaginatedResult, AutoCompleteItem, Instrument, OrderQueueItem, Sector } from "@/types";


export async function getSector(value: number, axios: NuxtAxiosInstance): Promise<AxiosResponse<Sector>> {
  return axios.get('oms/sub-sector/' + value)
}

export async function getSectors(value: Paginated, axios: NuxtAxiosInstance): Promise<AxiosResponse<Sector[]>> {
  return axios.get('oms/sub-sector/list?offset=' + value.offset + "&length=" + value.length)
}