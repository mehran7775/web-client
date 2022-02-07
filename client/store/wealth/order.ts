import { ActionTree } from 'vuex'
import * as stores from '@/types/stores'
import { InstrumentCache, InstrumentSearchModel, Order, OrderSearchModel, Paginated, PaginatedResult, Wealth } from '@/types'
import { getOrders } from "@/repositories/wealth/order_manager"

export const state = () => (new OrderState())

export class OrderState {
  cache: Map<number, Order> = new Map<number, Order>()
}

export const actions: ActionTree<OrderState, stores.RootState> = {
  async getOrders({ state, commit, rootGetters, dispatch }, payload: OrderSearchModel): Promise<PaginatedResult<Order> | undefined> {
    const orders = (await getOrders(rootGetters["sso/user/me"].userName, payload, this.$axios)).data as PaginatedResult<Order>

    const pi = dispatch("oms/instruments/getInstrumentsDetail", new InstrumentSearchModel(orders.data.map((ord) => ord.instrumentId)), { root: true })
    const pw = dispatch("wealth/getWealth", new Paginated(), { root: true })

    const instruments = (await pi) as Array<InstrumentCache>
    const wealth = (await pw) as Array<Wealth>
    orders.data = orders.data.map((ord) => {
      return Object.assign({}, instruments.find((i) => i.id == ord.instrumentId), { wealth: wealth.find((w) => w.id == ord.instrumentId)?.amount ?? 0 }, ord)
    })
    return orders
  }
}
