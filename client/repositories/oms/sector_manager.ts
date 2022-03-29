import { AxiosInstance, AxiosResponse } from "axios";
import {
  Paginated,
  Sector,
} from "@/types";

export async function getSector(
  value: number,
  axios: AxiosInstance
): Promise<AxiosResponse<Sector>> {
  return axios.get("oms/sub-sector/" + value);
}

export async function getSectors(
  value: Paginated,
  axios: AxiosInstance
): Promise<AxiosResponse<Sector[]>> {
  return axios.get(
    "oms/sub-sector/list?offset=" + value.offset + "&length=" + value.length
  );
}
