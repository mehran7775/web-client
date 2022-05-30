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

export async function setOrder(
  order: Order,
  axios: AxiosInstance
): Promise<AxiosResponse> {
  return axios.post("/wealth-manager/order/", order);
}

export async function editOrder(
  order: Order,
  axios: AxiosInstance
): Promise<AxiosResponse> {
  return axios.put("/wealth-manager/order/", order);
}

export default {
  getOrders,
  setOrder,
  editOrder,
};
