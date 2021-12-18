export * from "./collection"
export * from "./message"
export * from "./panels"
export * from "./sso"
export * from "./oms"
export * from "./wealth"

import { Instrument, DailyPrice, MarketHistory } from "./oms"
import { Side } from "./wealth"

export interface InstrumentCache extends Instrument, DailyPrice, MarketHistory {
  side: Side
}

export type Error = {
  code: number
  detail: Array<ErrorDetail>
}

export type ErrorDetail = {
  loc: string
  type: string
}
