import { User, AnonymousUser, InstrumentCache, Notification } from "@/types/";
import { reactive, Ref, ref } from "vue";
import { KeyValuePairs } from "../collection";
import { ClientDistribution, OrderQueueItem } from "../wealth";

export interface RootState {
  locale: string;
  menu: string | number | null;
}

// User

export const refreshKey: string = "jwtRefreshKey";
export const tokenKey: string = "jwtKey";
export const userKey: string = "userCache";

export class UserState {
  tryCount: number;
  token: string | null;
  user: User;
  refresh: string | null;
  userName: string | null;
  renewToken: boolean;
  settingsChanged: Array<KeyValuePairs<string, any>>;
  addWatchListChanges: { [key: string]: Array<number> };

  constructor() {
    this.tryCount = 0;
    this.token = null;
    this.user = AnonymousUser();
    this.refresh = null;
    this.userName = null;
    this.renewToken = false;
    this.settingsChanged = reactive([]);
    this.addWatchListChanges = {};
  }
  toJSON() {
    return { ...this };
  }
}

// Instrument

export interface InstrumentState {
  cache: Map<string, InstrumentCache>;
  focus: Array<InstrumentCache>;
  focusViewMode: number;
  selected: InstrumentCache | null;
  activeTab: InstrumentCache | null;
  orderQueueCache: { [key: string]: Array<OrderQueueItem> };
  clientDistributionCache: { [key: string]: ClientDistribution };
  width: number;
}

// Message

export interface MessageState {}

export interface Snack {
  content: string;
  color?: string;
  timeout: number;
  bg?: string;
}
export interface Menu {
  active: boolean;
  left: string;
  top: string;
  content: any;
}

export interface SnackState {
  Snacks: Array<Snack>;
}

export interface NotificationState {
  cache: { [key: string]: Array<Notification> };
}
