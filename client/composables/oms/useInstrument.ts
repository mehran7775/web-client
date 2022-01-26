import { computed } from "@nuxtjs/composition-api"
import { Store } from "vuex/types"
import { InstrumentState } from "~/store/oms/instruments"
import { ClientDistribution, DailyPrice, InstrumentCache, InstrumentSearchModel, MarketHistory, OrderQueueItem, SameSectorQuery } from "~/types"

export function useInstrument(store: Store<any>) {

    const state = store.state.oms.instruments as InstrumentState

    // Getters
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
    function updateInstrument(data: InstrumentCache) {
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

    //TODO Move Actions Buisiness here
    async function getInstrumentsDetail(searchModel: InstrumentSearchModel): Promise<Array<InstrumentCache>> {
        return await store.dispatch("oms/instruments/getInstrumentsDetail", searchModel) as Array<InstrumentCache>
    }
    async function getInstrumentPrices(ids: Array<number>): Promise<Array<DailyPrice> | number> {
        return await store.dispatch("oms/instruments/getInstrumentPrices", ids) as Array<DailyPrice>
    }
    async function getMarketHistory(ids: Array<number>): Promise<Array<MarketHistory> | number> {
        return await store.dispatch("oms/instruments/getMarketHistory", ids) as Array<MarketHistory>
    }
    async function getOrderQueue(id: number): Promise<{ queue: Array<OrderQueueItem> }> {
        return await store.dispatch("oms/instruments/getOrderQueue", id)
    }
    async function getClientDistribution(id: number): Promise<ClientDistribution> {
        return await store.dispatch("oms/instruments/getClientDistribution", id) as ClientDistribution
    }
    async function getTeammates(searchModel: SameSectorQuery): Promise<{ queue: Array<OrderQueueItem> }> {
        return await store.dispatch("oms/instruments/getTeammates", searchModel)
    }

    return {
        // Getters
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
        // Actions
        getInstrumentsDetail,
        getInstrumentPrices,
        getMarketHistory,
        getOrderQueue,
        getClientDistribution,
        getTeammates
    }
}