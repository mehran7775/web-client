import { Store } from "vuex/types"
import { InstrumentState } from "~/store/oms/instruments"
import { ClientDistribution, DailyPrice, InstrumentCache, InstrumentSearchModel, MarketHistory, OrderQueueItem, SameSectorQuery } from "~/types"

export function useInstrument(store: Store<any>) {

    const state = store.state.oms.instruments as InstrumentState

    return {
        //TODO Getters
        //TODO Mutations
        updateInstrument(data: InstrumentCache) {
            store.commit("oms/instruments/updateInstrument", data)
        },
        setFocus(data: Array<InstrumentCache>) {
            store.commit("oms/instruments/setFocus", data)
        },
        addFocus(data: InstrumentCache) {
            store.commit("oms/instruments/addFocus", data)
        },
        setFocusMode(data: number) {
            store.commit("oms/instruments/setFocusMode", data)
        },
        removeFocus(data: number) {
            store.commit("oms/instruments/removeFocus", data)
        },
        select(data: InstrumentCache) {
            store.commit("oms/instruments/select", data)
        },
        selectByIndex(data: number) {
            store.commit("oms/instruments/selectByIndex", data)
        },
        selectById(data: number) {
            store.commit("oms/instruments/selectById", data)
        },
        //TODO Move Actions Buisiness here
        async getInstrumentsDetail(searchModel: InstrumentSearchModel): Promise<Array<InstrumentCache>> {
            return await store.dispatch("oms/instruments/getInstrumentsDetail", searchModel) as Array<InstrumentCache>
        },
        async getInstrumentPrices(ids: Array<number>): Promise<Array<DailyPrice> | number> {
            return await store.dispatch("oms/instruments/getInstrumentPrices", ids) as Array<DailyPrice>
        },
        async getMarketHistory(ids: Array<number>): Promise<Array<MarketHistory> | number> {
            return await store.dispatch("oms/instruments/getMarketHistory", ids) as Array<MarketHistory>
        },
        async getOrderQueue(id: number): Promise<{ queue: Array<OrderQueueItem> }> {
            return await store.dispatch("oms/instruments/getOrderQueue", id)
        },
        async getClientDistribution(id: number): Promise<ClientDistribution> {
            return await store.dispatch("oms/instruments/getClientDistribution", id) as ClientDistribution
        },
        async getTeammates(searchModel: SameSectorQuery): Promise<{ queue: Array<OrderQueueItem> }> {
            return await store.dispatch("oms/instruments/getTeammates", searchModel)
        }
    }
}