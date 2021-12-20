import { DateTime } from "luxon"
import { Paginated } from "@/types"

export class Order {
  id: number
  instrumentId: number
  creationDate: string
  quantity: number
  remainQuantity: number
  minQuantity: number
  discloseQuantity: number
  enteredPrice: number
  triggerPrice: number
  side: Side
  orderType: OrderType
  validityType: ValidationType
  validityDate: string | null
  flags: number
  constructor(instrument_id: number,
    quantity: number,
    min_quantity: number,
    disclose_quantity: number,
    entered_price: number,
    trigger_price: number,
    side: Side,
    order_type: OrderType,
    validity_type: ValidationType,
    validity_date: string | null) {
    this.id = -1
    this.instrumentId = instrument_id
    this.creationDate = DateTime.now().toISO()
    this.quantity = quantity
    this.remainQuantity = quantity
    this.minQuantity = min_quantity
    this.discloseQuantity = disclose_quantity
    this.enteredPrice = entered_price
    this.triggerPrice = trigger_price
    this.side = side
    this.orderType = order_type
    this.validityType = validity_type
    this.validityDate = validity_date
    this.flags = Flags.Draft
  }
}

export class OrderSearchModel extends Paginated {
  id: number | null
  flags: number | null
  constructor(offset: number = 0, length: number = 10, flags: number | null = null, id: number | null = null) {
    super(offset, length)
    this.id = id
    this.flags = flags
  }
}

export enum Side {
  Buy = 1,
  Sell = 2,
  Cross = 3,
}

export enum OrderType {
  Limit = 1,
  MarketOnOpening = 2,
  Market = 3,
  Stop = 4,
  MarketToLimit = 5
}

export enum ValidationType {
  Day = 1,
  GoodTillDate = 2,
  GoodTillCancel = 3,
  FillAndKill = 4,
  Session = 5,
  SlidingValidity = 6,
}

export enum Flags {
  Draft = 1,
  Created = 2,
  Sent = 4,
  Canceled = 8,
  Confirmed = 16
}
