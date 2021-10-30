import { DateTime } from "luxon"
import { Paginated } from "@/types"

export class Order {
  id: number
  instrument_id: number
  creation_date: string
  quantity: number
  remain_quantity: number
  min_quantity: number
  disclose_quantity: number
  entered_price: number
  trigger_price: number
  side: Side
  order_type: OrderType
  validity_type: ValidationType
  validity_date: string | null
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
    this.instrument_id = instrument_id
    this.creation_date = DateTime.now().toISO()
    this.quantity = quantity
    this.remain_quantity = quantity
    this.min_quantity = min_quantity
    this.disclose_quantity = disclose_quantity
    this.entered_price = entered_price
    this.trigger_price = trigger_price
    this.side = side
    this.order_type = order_type
    this.validity_type = validity_type
    this.validity_date = validity_date
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
