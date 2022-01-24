import { Store } from "vuex/types"
import { InstrumentCache, InstrumentSearchModel } from "~/types"

export function useInstrument(store: Store<unknown>) {
    return {
        async getInstrumentsDetail(searchModel: InstrumentSearchModel): Promise<Array<InstrumentCache>> {
            return await store.dispatch("oms/instruments/getInstrumentsDetail", searchModel) as Array<InstrumentCache>
        }
    }
}