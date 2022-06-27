import { SearchModel } from "@/types";

export interface Order {
  id: number;
  instrumentId: number;
  creationDate: string;
  quantity: number;
  remainQuantity: number;
  minQuantity: number;
  discloseQuantity: number;
  enteredPrice: number;
  triggerPrice: number;
  side: Side;
  orderType: OrderType;
  validityType: ValidationType;
  validityDate: string | null;
  flags: number;
}

export class OrderSearchModel implements SearchModel {
  id: number | null;
  flags: number | null;
  offset: number;
  length: number;
  echo: any;
  constructor(
    offset: number = 0,
    length: number = 10,
    flags: number | null = null,
    id: number | null = null
  ) {
    this.id = id;
    this.flags = flags;
    this.offset = offset;
    this.length = length;
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
  MarketToLimit = 5,
}

export enum ValidationType {
  Day = 1,
  GoodTillDate = 2,
  GoodTillCancel = 3,
  FillAndKill = 4,
  Session = 5,
  SlidingValidity = 6,
}

export enum OrderFlags {
  ClientRequest = 0x00,
  Draft = 0x01,
  Created = 0x02,
  Sent = 0x04,
  Cancelled = 0x08,
  Confirmed = 0x10,
  PreOpening = 0x20,
  Editable = OrderFlags.Cancelled | OrderFlags.Confirmed | OrderFlags.PreOpening,   
  Deleteable = OrderFlags.Cancelled | OrderFlags.Confirmed | OrderFlags.PreOpening, 
}

