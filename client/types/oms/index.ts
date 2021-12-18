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
