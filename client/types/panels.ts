export enum Tabs {
  none = -1,
  activeOrders = 0,
  bests = 1,
  depth = 2,
  furtherInfo = 3,
}

export function TabNames() {
  return [
    "bottom-panel.orders",
    "bottom-panel.bests",
    "bottom-panel.depth",
    "bottom-panel.more",
  ]
}

export enum DeepOptions {
  teammates = "teammates",
  tradeTypes = "tradeTypes",
  shareTypes = "shareTypes",
  holders = "holders",
  tradeHistory = "tradeHistory",
}

export class TabTitle {
  tab: Tabs
  title: string
  constructor(tab: Tabs, title: string) {
    this.tab = tab
    this.title = title
  }
}
