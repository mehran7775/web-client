import { MutationTree } from 'vuex'
import { Instrument, OrderQueueItem, InstrumentCache, ClientDistribution } from '@/types'


export const state = () => (new InstrumentState())

export class InstrumentState {
  cache: Map<string, InstrumentCache> = new Map<string, InstrumentCache>()
  focus: Array<InstrumentCache> = []
  focusViewMode: number = 0
  selected: InstrumentCache | null = null
  orderQueueCache: Map<string, Array<OrderQueueItem>> = new Map<string, Array<OrderQueueItem>>()
  clientDistributionCache: Map<string, ClientDistribution> = new Map<string, ClientDistribution>()
}

export const mutations: MutationTree<InstrumentState> = {
  updateInstrument(state, data: InstrumentCache) {
    const inst = state.cache.get(data.id.toString())
    if (inst)
      Object.assign(inst, data)
    else
      state.cache.set(data.id.toString(), Object.assign(new InstrumentCache(), data))
  },
  setFocus(state, data: Array<InstrumentCache>) {
    state.focus = data
  },
  addFocus(state, data: InstrumentCache) {
    if (state.focus.findIndex((item) => item.id == data.id) == -1)
      state.focus.splice(0, 0, data)
  },
  setFocusMode(state, data: number) {
    state.focusViewMode = data
  },
  removeFocus(state, data: number) {
    state.focus.splice(state.focus.findIndex((element: Instrument) => element.id == data), 1)
  },
  select(state, active: InstrumentCache) {
    state.selected = active
  },
  selectByIndex(state, index: number) {
    state.selected = state.focus[index]
  },
  selectById(state, id: number) {
    state.selected = state.cache.get(id.toString()) ?? null
  }
}

