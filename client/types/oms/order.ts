export enum OrderSide {
  Buy = 0,
  Sell = 1,
  Cross = 2
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
