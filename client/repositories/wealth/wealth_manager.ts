import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { AxiosResponse } from "axios"
import { PaginatedResult, Wealth, WealthSearchModel } from "@/types"

export async function getWealth(userName: string, value: WealthSearchModel, axios: NuxtAxiosInstance): Promise<AxiosResponse<PaginatedResult<Wealth>>> {
  return axios.get<PaginatedResult<Wealth>>('/wealth-manager/user-instrument/' + userName + '/', { params: value })
}