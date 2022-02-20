import { computed } from "@nuxtjs/composition-api"
import { Store } from "vuex/types"
import { InstrumentState } from "~/store/oms/instruments"
import { ClientDistribution, DailyPrice, Instrument, InstrumentCache, InstrumentSearchModel, MarketHistory, OrderQueueItem, SameSectorQuery, Wealth } from "~/types"
import manager from '@/repositories/oms/instruments_manager'
import { useAxios } from "../useAxios"

export function useInstrument(store: Store<any>) {

    const state = store.state.oms.instruments as InstrumentState
    const axios = useAxios(store)

    // Getters
    const width = computed({
        get(): number { return state.width },
        set(data: number) {
            setWidth(data)
        }
    })
    const focusMode = computed({
        get(): number { return state.focusViewMode },
        set(data: number) {
            setFocusMode(data)
        }
    })
    const selectedId = computed({
        get(): string { return (state.selected?.id ?? -1).toString() },
        async set(data: string) {
            selectById(parseInt(data))
        }
    })
    const getByKey = computed(() => (key: number): InstrumentCache | null => state.cache.get(key.toString()) || null)
    const getFocus = computed((): Array<InstrumentCache> => state.focus)
    const getSelected = computed((): InstrumentCache | null => state.selected)
    const getSelectedIndex = computed((): number =>
        state.focus.findIndex((item) => item.id == state.selected?.id))

    // Mutations
    function updateInstrument(data: InstrumentCache | Instrument | DailyPrice | MarketHistory | Wealth) {
        store.commit("oms/instruments/updateInstrument", data)
    }
    function setFocus(data: Array<InstrumentCache>) {
        store.commit("oms/instruments/setFocus", data)
    }
    function addFocus(data: InstrumentCache) {
        store.commit("oms/instruments/addFocus", data)
    }
    function setFocusMode(data: number) {
        store.commit("oms/instruments/setFocusMode", data)
    }
    function removeFocus(data: number) {
        store.commit("oms/instruments/removeFocus", data)
    }
    function select(data: InstrumentCache) {
        store.commit("oms/instruments/select", data)
    }
    function selectByIndex(data: number) {
        store.commit("oms/instruments/selectByIndex", data)
    }
    function selectById(data: number) {
        store.commit("oms/instruments/selectById", data)
    }
    function setWidth(data:number) {
        store.commit("oms/instruments/setWidth", data)
    }

    //TODO Move Actions Buisiness here
    async function getInstrumentsDetail(searchModel: InstrumentSearchModel): Promise<Array<InstrumentCache>> {
        const res: Array<InstrumentCache> = []
        const missing: Array<number> = []

        if (searchModel.boardIds.length == 0 && searchModel.secIds.length == 0 && searchModel.ids.length != 0) {
            let tmp = null
            for (let i in searchModel.ids) {
                tmp = state.cache.get(searchModel.ids[i].toString())
                if (tmp) res.push(tmp)
                else missing.push(searchModel.ids[i])
            }
        }

        if (missing.length > 0 || searchModel.boardIds.length > 0 || searchModel.secIds.length > 0) {
            const { data: { data } } = await manager.getInstruments(Object.assign({}, searchModel, { ids: missing }), axios)
            data.forEach((item) => {
                updateInstrument(item)
                res.push(state.cache.get(item.id.toString()) as InstrumentCache)
            })
        }

        const ids = res.map((item) => item.id)
        if (ids.length > 0) {
            getInstrumentPrices(ids)
            getMarketHistory(ids)
        }
        return res
    }
    async function getInstrumentPrices(ids: Array<number>): Promise<Array<DailyPrice> | number> {
        const { data: { data } } = await manager.getDailyPrice(ids, axios)
        data.forEach((item) => {
            item.id = item.instrumentId
            updateInstrument(item)
        })
        return data
    }
    async function getMarketHistory(ids: Array<number>): Promise<Array<MarketHistory> | number> {
        const { data: { data } } = await manager.getInstrumentMarketHistory(ids, axios)
        data.forEach((item) => {
            item.id = item.instrumentId
            updateInstrument(item)
        })
        return data
    }
    async function getOrderQueue(id: number): Promise<{ queue: Array<OrderQueueItem> }> {
        let queue = state.orderQueueCache.get(id.toString())
        if (queue)
            return { queue }
        const { data } = await manager.getOrderQueue(id, axios)
        return data
    }
    async function getClientDistribution(id: number): Promise<ClientDistribution> {
        let clients = state.clientDistributionCache.get(id.toString())
        if (clients)
            return clients
        const { data } = await manager.getClientDistribution(id, axios)
        return data.clients
    }
    async function getTeammates(searchModel: SameSectorQuery): Promise<{ queue: Array<OrderQueueItem> }> {
        const { data } = await manager.getTeammates(searchModel.instrument, searchModel.sector, axios)
        return data
    }

    return {
        // Getters
        width,
        focusMode,
        selectedId,
        getByKey,
        getFocus,
        getSelected,
        getSelectedIndex,
        //Mutations
        updateInstrument,
        setFocus,
        addFocus,
        setFocusMode,
        removeFocus,
        select,
        selectByIndex,
        selectById,
        setWidth,
        // Actions
        getInstrumentsDetail,
        getInstrumentPrices,
        getMarketHistory,
        getOrderQueue,
        getClientDistribution,
        getTeammates
    }
}