export class OrderItem {
  amount: number = 0
  count: number = 0
  price: number = 0.0
}

export class OrderQueueItem {
  buy: OrderItem = new OrderItem()
  sell: OrderItem = new OrderItem()
}

export class ClientDistributionResponse {
  lastUpdate: string = '2021-12-01T16:34:00'
  clients: ClientDistribution = new ClientDistribution()
}

export class ClientDistribution {
  legal: Distribution = new Distribution()
  real: Distribution = new Distribution()
}

export class Distribution {
  buy: DistributionItem = new DistributionItem()
  sell: DistributionItem = new DistributionItem()
}

export class DistributionItem {
  amount: number = 0
  count: number = 0
}
