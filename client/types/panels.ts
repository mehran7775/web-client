export type Bookmark = {
  title: string,
  name: string,
  to: string,
  icon: string
}

export enum Tabs {
  none = -1,
  activeOrders = 0,
  bests = 1,
  depth = 2,
  furtherInfo = 3,
}

export function TabNames() {
  return [
    new TabTitle(Tabs.activeOrders, "bottom-panel.orders", []),
    new TabTitle(Tabs.bests, "bottom-panel.bests", []),
    new TabTitle(Tabs.depth, "bottom-panel.depth", []),
    new TabTitle(Tabs.furtherInfo, "bottom-panel.more", []),
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
  params: string[]
  constructor(tab: Tabs, title: string, params: string[] = []) {
    this.tab = tab
    this.title = title
    this.params = params
  }
}
