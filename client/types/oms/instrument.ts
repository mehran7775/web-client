import { SearchModel } from "..";

export class Instrument {
  [x: string]: any;
  id: number;
  instrumentId: number;
  instrumentCode: string;
  code: string;
  name: string;
  fullName: string;
  sector: number;
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
    this.instrumentId = 0;
    this.instrumentCode = this.instrumentId.toString();
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
    this.sector = 0;
    this.settlementDelay = 0;
    this.tradeVal = 0;
    this.shares = 0;
    this.status = 0;
  }
}

export interface DailyPrice {
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
}

export interface MarketHistory {
  id: number;
  instrumentId: number;
  instrumentCode: string;
  dateTime: string;
  totalShares: number;
  totalTrades: number;
  totalTradesValue: number;
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
    this.offset = offset;
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
