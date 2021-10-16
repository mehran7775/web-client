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
  dateTime: string
  opening: number
  closing: number
  highest: number
  lowest: number

  constructor() {
    this.id = 0
    this.baseVol = 0
    this.categoryName = ""
    this.closing = 0
    this.code = ""
    this.companyName = ""
    this.dateTime = ""
    this.expirationDate = ""
    this.firstTradeDate = ""
    this.fullName = ""
    this.highest = 0
    this.issuePrice = 0
    this.lastModification = ""
    this.lastTradeDate = ""
    this.lowest = 0
    this.maxAllowedPrice = 0
    this.maxQuantityPerOrder = 0
    this.minQuantityPerOrder = 0
    this.minAllowedPrice = 0
    this.name = ""
    this.namedPrice = 0
    this.buyPrice = 0
    this.sellPrice = 0
    this.opening = 0
    this.sectorCode = 0
    this.settlementDelay = 0
    this.tradeVal = 0
    this.shares = 0
    this.status = 0
  }

}

export enum OrderSide {
  Buy = 0,
  Sell = 1,
  Cross = 2
}

export class ActiveInstrument {
  instrumentId: number = 0
  side: OrderSide | null = OrderSide.Buy
  constructor(id: number, side: OrderSide | null = null) {
    this.instrumentId = id
    this.side = side
  }
}

export class OrderItem {
  amount: number = 0
  count: number = 0
  price: number = 0.0
}

export class OrderQueueItem {
  buy: OrderItem = new OrderItem()
  sell: OrderItem = new OrderItem()
}
