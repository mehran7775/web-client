import { ComputedRef } from "vue";

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
  match: RegExp;
  children?: Array<MenuItem>;
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

export interface TabItem {
  path?: string;
  title: string;
  icon?: string;
  color?: string;
  secondTitle?: string;
  params?: { [key: string]: any };
  match?: RegExp;
  children?: Array<TabItem>;
  current?: string;
  deletable: boolean;
  const?: boolean
}

export enum DeepOptions {
  teammates = "teammates",
  tradeTypes = "tradeTypes",
  shareTypes = "shareTypes",
  holders = "holders",
  tradeHistory = "tradeHistory",
}
