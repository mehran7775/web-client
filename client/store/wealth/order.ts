import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { AxiosResponse } from "axios"
import * as stores from '@/types/stores'
import { InstrumentCache, Order, OrderSearchModel, PaginatedResult } from '@/types'
import { getOrders } from "@/repositories/wealth/order_manager"

export const state = () => (new OrderState())

export class OrderState {
  cache: Map<number, Order> = new Map<number, Order>()
}

export const actions: ActionTree<OrderState, stores.RootState> = {
  async getOrders({ state, commit, rootGetters, dispatch }, payload: OrderSearchModel): Promise<PaginatedResult<Order> | undefined> {
    const orders = (await getOrders(rootGetters["sso/user/me"].userName, payload, this.$axios)).data as PaginatedResult<Order>
    const instruments = (await dispatch("oms/instruments/getInstrumentsDetail", orders.data.map((ord) => ord.instrumentId), { root: true })) as Array<InstrumentCache>
    orders.data = orders.data.map((ord) => {
      return Object.assign({}, instruments.find((i) => i.id == ord.instrumentId), ord)
    })
    return orders
  }
}
