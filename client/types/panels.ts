import { ComputedRef } from "@vue/composition-api";

export enum BookmarkPosition {
  ToolBar = 1,
  RightPanel = 2,
}
export class MenuItem {
  icon: string;
  title: string;
  text?: string;
  color?: string;
  to?: string;
  children?: Array<MenuItem> | ComputedRef<Array<MenuItem>>;
  bookmarkPosition?: BookmarkPosition | null = null;
  click?: Function;
  constructor(icon: string, title: string) {
    this.icon = icon;
    this.title = title;
  }
}

export type Bookmark = {
  title: string;
  text?: string | undefined;
  to: string;
  icon: string;
  color?: string | undefined;
};
export function CreateBookmark(item: MenuItem): Bookmark {
  return {
    color: item.color,
    icon: item.icon,
    text: item.text,
    title: item.title,
    to: item.to ?? "#" + item.title,
  };
}

export enum Tabs {
  none = -1,
  activeOrders = 0,
  bests = 1,
  depth = 2,
  furtherInfo = 3,
}

export function TabNames(): TabTitle[] {
  return [
    { tab: Tabs.activeOrders, title: "bottom-panel.orders", params: [] },
    { tab: Tabs.bests, title: "bottom-panel.bests", params: [] },
    { tab: Tabs.depth, title: "bottom-panel.depth", params: [] },
    { tab: Tabs.furtherInfo, title: "bottom-panel.more", params: [] },
  ];
}

export enum DeepOptions {
  teammates = "teammates",
  tradeTypes = "tradeTypes",
  shareTypes = "shareTypes",
  holders = "holders",
  tradeHistory = "tradeHistory",
}

export interface TabTitle {
  tab: Tabs;
  title: string;
  params: string[];
}
