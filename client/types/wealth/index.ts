import { Paginated } from ".."

export * from "./order"
export * from "./orderQueue"

export class Wealth {
  id: number
  amount: number
  constructor() {
    this.id = 0
    this.amount = 0
  }
}

export class WealthSearchModel extends Paginated {

}
