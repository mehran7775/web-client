export * from "./sector"
export * from "./order"
export * from "./instrument"

import { OrderSide } from "./order"

export class SameSectorQuery {
  instrument: number
  sector: number
  constructor(instrument: number, sector: number) {
    this.instrument = instrument
    this.sector = sector
  }
}

export class ActiveInstrument {
  instrumentId: number = 0
  side: OrderSide | null = OrderSide.Buy
  constructor(id: number, side: OrderSide | null = null) {
    this.instrumentId = id
    this.side = side
  }
}
