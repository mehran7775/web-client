import { AxiosResponse, AxiosInstance } from "axios";
import { PaginatedResult, OrderSearchModel, Order } from "@/types";

export async function getOrders(
  userName: string,
  value: OrderSearchModel,
  axios: AxiosInstance
): Promise<AxiosResponse<PaginatedResult<Order>>> {
  return axios.get<PaginatedResult<Order>>(
    "/wealth-manager/" + userName + "/orders/",
    { params: value }
  );
}

export default {
  getOrders,
};
