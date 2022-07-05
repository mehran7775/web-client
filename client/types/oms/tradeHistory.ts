import { SearchModel } from "@/types";

export interface TradesHistory {
  name: string;
  dateTime: string;
  totalTrades: number;
  totalShares: number;
  totalTradeValue: number;
}

export interface TradesHistorySerachModel extends SearchModel {
  instrumentId: number | null;
}
