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
  title2?: string;
  params: Array<any>;
  children?: Array<TabItem>;
  default?: string;
  body?: string
  deleteAble?: boolean
}

export const defaultItem = { title: "", params: [] };


export enum DeepOptions {
  teammates = "teammates",
  tradeTypes = "tradeTypes",
  shareTypes = "shareTypes",
  holders = "holders",
  tradeHistory = "tradeHistory",
}
