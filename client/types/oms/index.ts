export * from "./sector"
export * from "./instrument"

import { Side } from "../wealth"

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
  side: Side | null = Side.Buy
  constructor(id: number, side: Side | null = null) {
    this.instrumentId = id
    this.side = side
  }
}
