import { SearchModel } from "..";

export class Instrument {
  id: number;
  code: string;
  name: string;
  fullName: string;
  sectorCode: number;
  categoryName: string;
  baseVol: number;
  tradeVal: number;
  settlementDelay: number;
  maxAllowedPrice: number;
  minAllowedPrice: number;
  namedPrice: number;
  buyPrice: number;
  sellPrice: number;
  shares: number;
  companyName: string;
  maxQuantityPerOrder: number;
  minQuantityPerOrder: number;
  issuePrice: number;
  firstTradeDate: string;
  lastTradeDate: string;
  expirationDate: string;
  lastModification: string;
  status: number;

  constructor() {
    this.id = 0;
    this.baseVol = 0;
    this.categoryName = "";
    this.code = "";
    this.companyName = "";
    this.expirationDate = "";
    this.firstTradeDate = "";
    this.fullName = "";
    this.issuePrice = 0;
    this.lastModification = "";
    this.lastTradeDate = "";
    this.maxAllowedPrice = 0;
    this.maxQuantityPerOrder = 0;
    this.minQuantityPerOrder = 0;
    this.minAllowedPrice = 0;
    this.name = "";
    this.namedPrice = 0;
    this.buyPrice = 0;
    this.sellPrice = 0;
    this.sectorCode = 0;
    this.settlementDelay = 0;
    this.tradeVal = 0;
    this.shares = 0;
    this.status = 0;
  }
}

export class DailyPrice {
  id: number;
  instrumentCode: string;
  instrumentId: number;
  dateTime: string;
  opening: number;
  closing: number;
  highest: number;
  lowest: number;
  last: number;
  priceChange: number;
  yesterdayPrice: number;
  constructor() {
    this.instrumentCode = "";
    this.instrumentId = 0;
    this.id = this.instrumentId;
    this.opening = 0;
    this.lowest = 0;
    this.highest = 0;
    this.dateTime = "";
    this.closing = 0;
    this.last = 0;
    this.priceChange = 0;
    this.yesterdayPrice = 0;
  }
}

export class MarketHistory {
  id: number;
  instrumentId: number;
  instrumentCode: string;
  dateTime: string;
  totalShares: number;
  totalTrades: number;
  totalTradesValue: number;
  constructor(instrumentId: number, instrumentCode: string, dateTime: string) {
    this.instrumentId = instrumentId;
    this.id = instrumentId;
    this.instrumentCode = instrumentCode;
    this.dateTime = dateTime;
    this.totalTrades = 0;
    this.totalTradesValue = 0;
    this.totalShares = 0;
  }
}

export class InstrumentSearchModel implements SearchModel {
  ids: Array<number>;
  boardIds: Array<number>;
  secIds: Array<number>;
  offset: number;
  length: number;
  echo: any;
  constructor(
    ids: Array<number> = [],
    boards: Array<number> = [],
    secids: Array<number> = [],
    offset: number = 0,
    length: number = 10
  ) {
    this.ids = ids;
    this.boardIds = boards;
    this.secIds = secids;
    this.offset = offset
    this.length = ids.length > 0 ? ids.length : length;
  }
}

export enum InstrumentStatus {
  ActiveRead = 0x01,
  ActiveTrading = 0x05,
  ActiveOrder = 0x03,
  Active = 0x07,
  Inactive = 0x04,
  Disabled = 0x00,
  PreActive = 0x02,
}
