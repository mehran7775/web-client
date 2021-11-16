import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { AxiosResponse } from "axios"
import * as stores from '@/types/stores'
import { Order, OrderSearchModel, PaginatedResult } from '@/types'
import { getOrders } from "@/repositories/wealth/order_manager"

export const state = () => (new OrderState())

export class OrderState {
  cache: Map<number, Order> = new Map<number, Order>()
}

export const actions: ActionTree<OrderState, stores.RootState> = {
  async getOrders({ state, commit, rootGetters }, payload: OrderSearchModel): Promise<PaginatedResult<Order> | undefined> {
    return (await getOrders(rootGetters["sso/user/me"].userName, payload, this.$axios)).data as PaginatedResult<Order>
  }
}
