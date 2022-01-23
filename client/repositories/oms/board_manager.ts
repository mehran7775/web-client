import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { AxiosResponse } from "axios"
import { PaginatedResult, AutoCompleteItem } from "@/types";

export async function getBoards(axios: NuxtAxiosInstance): Promise<AxiosResponse<PaginatedResult<AutoCompleteItem>>> {
    return axios.get('/oms/board/list?offset=0&length=120')
}