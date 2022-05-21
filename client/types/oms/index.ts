export * from "./sector"
export * from "./instrument"
export * from "./restrictions"


export class SameSectorQuery {
  instrument: number
  sector: number
  constructor(instrument: number, sector: number) {
    this.instrument = instrument
    this.sector = sector
  }
}
