export interface InstrumentCache extends Instrument, DailyPrice, MarketHistory { }

export class Instrument {
  id: number
  code: string
  name: string
  fullName: string
  sectorCode: number
  categoryName: string
  baseVol: number
  tradeVal: number
  settlementDelay: number
  maxAllowedPrice: number
  minAllowedPrice: number
  namedPrice: number
  buyPrice: number
  sellPrice: number
  shares: number
  companyName: string
  maxQuantityPerOrder: number
  minQuantityPerOrder: number
  issuePrice: number
  firstTradeDate: string
  lastTradeDate: string
  expirationDate: string
  lastModification: string
  status: number

  constructor() {
    this.id = 0
    this.baseVol = 0
    this.categoryName = ""
    this.code = ""
    this.companyName = ""
    this.expirationDate = ""
    this.firstTradeDate = ""
    this.fullName = ""
    this.issuePrice = 0
    this.lastModification = ""
    this.lastTradeDate = ""
    this.maxAllowedPrice = 0
    this.maxQuantityPerOrder = 0
    this.minQuantityPerOrder = 0
    this.minAllowedPrice = 0
    this.name = ""
    this.namedPrice = 0
    this.buyPrice = 0
    this.sellPrice = 0
    this.sectorCode = 0
    this.settlementDelay = 0
    this.tradeVal = 0
    this.shares = 0
    this.status = 0
  }

}

export class DailyPrice {
  dateTime: string
  opening: number
  closing: number
  highest: number
  lowest: number
  constructor() {
    this.opening = 0
    this.lowest = 0
    this.highest = 0
    this.dateTime = ""
    this.closing = 0
  }
}

export class MarketHistory {
  instrumentId: number
  instrumentCode: string
  dateTime: string
  totalShares: number
  totalTrades: number
  totalTradesValue: number
  constructor(instrumentId: number, instrumentCode: string, dateTime: string) {
    this.instrumentId = instrumentId
    this.instrumentCode = instrumentCode
    this.dateTime = dateTime
    this.totalTrades = 0
    this.totalTradesValue = 0
    this.totalShares = 0
  }
}

