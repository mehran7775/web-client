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
  completeInfo = 1,
  dateInfo = 2,
  furtherInfo = 3,
  statisticsKeys = 4
}

export interface TabItem {
  tab?: Tabs;
  title: string;
  params: Array<any>;
  children?: Array<TabItem>;
  default?: string;
}

export const defaultItem = { title: "", params: [] };

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
      tab: Tabs.completeInfo,
      title: "bottom-panel.completeInfo.index",
      params: [],
      children: [
        {
          title: "bottom-panel.completeInfo.depth",
          params: [],
        },
        {
          title: "bottom-panel.completeInfo.myGroups",
          params: [],
        },
        {
          title: "bottom-panel.completeInfo.holdersCombination",
          params: [],
        },
        {
          title: "bottom-panel.completeInfo.type",
          params: [],
        },
      
      ],
      default: "bottom-panel.completeInfo.depth",
    },
    {
      tab: Tabs.dateInfo,
      title: "bottom-panel.dateInfo.index",
      params: [],
      children: [
        {
          title: "bottom-panel.dateInfo.tradesHistory",
          params: [],
        },
        {
          title: "bottom-panel.dateInfo.holdersCompition",
          params: [],
        },
        {
          title: "bottom-panel.dateInfo.type",
          params: [],
        },
      ],
      default: "bottom-panel.dateInfo.tradesHistory",
    },
    {
      tab: Tabs.furtherInfo,
      title: "bottom-panel.more.index",
      params: [],
      children: [
        {
          title: "bottom-panel.more.presentation",
          params: [],
        },
        {
          title: "bottom-panel.more.directorate",
          params: [],
        },
      ],
      default: "bottom-panel.more.presentation",
    },
    {
      tab: Tabs.statisticsKeys,
      title: "bottom-panel.statisticsKeys.index",
      params: [],
      children: [
        {
          title: "bottom-panel.statisticsKeys.fiveDay",
          params: [],
        },
        {
          title: "bottom-panel.statisticsKeys.threeDay",
          params: [],
        },
      ],
      default: "bottom-panel.statisticsKeys.fiveDay",
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
