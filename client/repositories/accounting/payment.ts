import { AxiosInstance, AxiosResponse } from "axios";
import { PaginatedResult, PaymentMethod } from "@/types";

export async function getMethods(
  axios: AxiosInstance
): Promise<AxiosResponse<PaginatedResult<PaymentMethod>>> {
  return axios.get("/accounting/payment/methods?offset=0&length=120");
}
