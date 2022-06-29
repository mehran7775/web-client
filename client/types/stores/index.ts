import { User, AnonymousUser, InstrumentCache } from "@/types/";
import { reactive, Ref, ref } from "#app";
import { KeyValuePairs } from "../collection";
import { ClientDistribution, OrderQueueItem } from "../wealth";

export class RootState {
  locale: string;
  menu: string | number | null;

  constructor() {
    this.locale = process.env.VUE_APP_I18N_LOCALE ?? "en-US";
    this.menu = null;
  }
  toJSON() {
    return { ...this };
  }
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
  constructor() {
    this.tryCount = 0;
    this.token = null;
    this.user = AnonymousUser();
    this.refresh = null;
    this.userName = null;
    this.renewToken = false;
    this.settingsChanged = reactive([]);
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
  orderQueueCache: { [key: string]: Array<OrderQueueItem> };
  clientDistributionCache: { [key: string]: ClientDistribution };
  width: number;
}

// Message

export interface MessageState {}

export interface Snack {
  content: string;
  color: string;
  show?: boolean;
}
