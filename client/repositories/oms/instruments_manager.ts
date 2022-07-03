import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { AxiosResponse, AxiosInstance } from "axios"
import { PaginatedResult, AutoCompleteItem, OrderQueueItem, MarketHistory, 
  Instrument, DailyPrice, ClientDistributionResponse, AutoCompleteSearchModel, 
  InstrumentSearchModel, TradesHistory } from "@/types";

export async function getInstruments(searchModel: InstrumentSearchModel, axios: NuxtAxiosInstance | AxiosInstance): Promise<AxiosResponse<PaginatedResult<Instrument>>> {
  return axios.get('/oms/instruments/filter?ids=' + searchModel.ids
    + "&offset=" + searchModel.offset
    + "&length=" + searchModel.length
    + "&secIds=" + (searchModel.secIds ?? "")
    + "&boardIds=" + (searchModel.boardIds ?? ""))
}

export async function getDailyPrice(instruments: Array<string | number>, axios: NuxtAxiosInstance | AxiosInstance): Promise<AxiosResponse<PaginatedResult<DailyPrice>>> {
  return axios.get('/oms/instruments/daily-price?ids=' + instruments + "&offset=0&length=" + instruments.length)
}

export async function getInstrumentMarketHistory(instruments: Array<string | number>, axios: NuxtAxiosInstance | AxiosInstance): Promise<AxiosResponse<PaginatedResult<MarketHistory>>> {
  return axios.get('oms/instruments/market-history?ids=' + instruments + "&offset=0&length=" + instruments.length)
}

export async function autoComplete(value: AutoCompleteSearchModel, axios: NuxtAxiosInstance | AxiosInstance): Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>>> {
  return axios.get('oms/instruments/name-autocomplete', { params: value })
}

export async function getOrderQueue(value: number, axios: NuxtAxiosInstance | AxiosInstance): Promise<AxiosResponse<{ queue: OrderQueueItem[] }>> {
  return axios.get('oms/instruments/order-queue/' + value)
}

export async function getClientDistribution(value: number, axios: NuxtAxiosInstance | AxiosInstance): Promise<AxiosResponse<ClientDistributionResponse>> {
  return axios.get('oms/instruments/clients-distribution/' + value)
}

export async function getTeammates(instrumentId: number, sectorId: number, axios: NuxtAxiosInstance | AxiosInstance) {
  return axios.get('oms/instruments/same-sub-sectors/' + instrumentId + "/" + sectorId)
}

export async function getTradeHistories(ofste: number, length: number, axios: NuxtAxiosInstance | AxiosInstance): Promise<AxiosResponse<PaginatedResult<TradesHistory>>> {
  return axios.get('oms/market-history?offset='+ ofste + '&length=' + length)
}

export default {
  getInstruments,
  getDailyPrice,
  getInstrumentMarketHistory,
  autoComplete,
  getOrderQueue,
  getClientDistribution,
  getTeammates,
  getTradeHistories
}
