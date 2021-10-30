import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { AxiosResponse } from "axios"
import { PaginatedResult, OrderSearchModel, Order } from "@/types"

export async function getOrders(userName: string, value: OrderSearchModel, axios: NuxtAxiosInstance): Promise<AxiosResponse<PaginatedResult<Order>>> {
  return axios.get<PaginatedResult<Order>>('/wealth-manager/order/' + userName, { params: value })
}