import { Store } from "vuex/types"
import { UserState } from "~/types/stores"
import { InstrumentCache, InstrumentSearchModel, Order, OrderSearchModel, Paginated, PaginatedResult, Wealth, WealthSearchModel } from "~/types"
import { useInstrument, useAxios, useWealth } from ".."
import { doAsync } from '@/utils'
import orderManager from "@/repositories/wealth/order_manager"

export function useOrder(store: Store<any>) {

    const userState = store.state.sso.user as UserState

    const axios = useAxios(store)
    const instrumentManager = useInstrument(store)
    const wealthManager = useWealth(store)

    async function getOrders(payload: OrderSearchModel): Promise<PaginatedResult<Order> | undefined> {
        if (userState.userName) {
            const orders = (await orderManager.getOrders(userState.userName, payload, axios)).data as PaginatedResult<Order>

            const pi = instrumentManager.getInstrumentsDetail(new InstrumentSearchModel(orders.data.map((ord) => ord.instrumentId)))
            const pw = wealthManager.getWealth(new Paginated())

            const instruments = (await pi) as Array<InstrumentCache>
            const wealth = (await pw) as Array<Wealth>
            orders.data = orders.data.map((ord) => {
                return Object.assign({}, instruments.find((i) => i.id == ord.instrumentId), { wealth: wealth.find((w) => w.id == ord.instrumentId)?.amount ?? 0 }, ord)
            })
            return orders
        }
    }
}