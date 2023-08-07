import { SearchModel } from "..";

export * from "./order";
export * from "./orderQueue";

export class Wealth {
  id: number;
  amount: number;
  constructor() {
    this.id = 0;
    this.amount = 0;
  }
}

export class WealthSearchModel implements SearchModel {
  offset: number = 0;
  length: number = 1;
  echo: any;
}
