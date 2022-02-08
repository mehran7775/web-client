import { AxiosResponse, AxiosInstance } from "axios"
import { PaginatedResult, Wealth, WealthSearchModel } from "@/types"

export async function getWealth(userName: string, value: WealthSearchModel, axios: AxiosInstance): Promise<AxiosResponse<PaginatedResult<Wealth>>> {
  return axios.get<PaginatedResult<Wealth>>('/wealth-manager/user-instrument/' + userName + '/', { params: value })
}

export default {
  getWealth
}
