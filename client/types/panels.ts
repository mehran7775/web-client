import { ComputedRef } from "#app";

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

export interface TabItem {
  tab?: Tabs;
  title: string;
  params: Array<any>;
  children?: Array<TabItem>;
  default?: string;
}

export function TabNames(): TabItem[] {
  return [
    {
      tab: Tabs.activeOrders,
      title: "bottom-panel.orders.all",
      params: [],
      children: [
        {
          title: "bottom-panel.orders.all",
          params: [],
        },
        {
          title: "bottom-panel.orders.drafts",
          params: [],
        },
        {
          title: "bottom-panel.orders.actives",
          params: [],
        },
        {
          title: "bottom-panel.orders.canceled",
          params: [],
        },
      ],
      default: "bottom-panel.orders.all",
    },
    {
      tab: Tabs.bests,
      title: "bottom-panel.bests",
      params: [],
      children: [{ tab: Tabs.bests, title: "bottom-panel.bests", params: [] }],
      default: "bottom-panel.bests",
    },
    {
      tab: Tabs.depth,
      title: "bottom-panel.depth",
      params: [],
      children: [{ tab: Tabs.depth, title: "bottom-panel.depth", params: [] }],
      default: "bottom-panel.depth",
    },
    {
      tab: Tabs.furtherInfo,
      title: "bottom-panel.more",
      params: [],
      children: [
        { tab: Tabs.furtherInfo, title: "bottom-panel.more", params: [] },
      ],
      default: "bottom-panel.more",
    },
  ];
}

export enum DeepOptions {
  teammates = "teammates",
  tradeTypes = "tradeTypes",
  shareTypes = "shareTypes",
  holders = "holders",
  tradeHistory = "tradeHistory",
}
