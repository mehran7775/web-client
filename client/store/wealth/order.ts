import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { AxiosResponse } from "axios"
import { Order, OrderSearchModel, PaginatedResult, stores } from '@/types'
import { getOrders } from "@/repositories/wealth/order_manager"

export const state = () => (new OrderState())

export class OrderState {
  cache: Map<number, Order> = new Map<number, Order>()
}

export const actions: ActionTree<OrderState, stores.RootState> = {
  async getSector({ state, commit, rootGetters }, payload: OrderSearchModel): Promise<PaginatedResult<Order> | undefined> {
    return (await getOrders(rootGetters["user/me"], payload, this.$axios)).data as PaginatedResult<Order>
  }
}
