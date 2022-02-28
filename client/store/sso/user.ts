import { reactive, ref } from "@nuxtjs/composition-api";
import { MutationTree } from "vuex";
import * as stores from "@/types/stores";
import {
  User,
  Setting,
  UserCredentials,
  AnonymousUser,
  Paginated,
  WatchlistColumns,
  LoginModel,
} from "@/types";
import {
  SetClientCookie,
  DeleteClientCookie,
  GetClientCookies,
} from "@/utils/cookie";

export const refreshKey: string = "jwtRefreshKey";
export const tokenKey: string = "jwtKey";
export const userKey: string = "userCache";

export const state = () => new stores.UserState();

export const mutations: MutationTree<stores.UserState> = {
  setHome(state, data: string) {
    state.user.settings.home = data;
  },
  renewToken(state, data: boolean) {
    state.renewToken = data;
  },
  tries(state, data: { user: string; tries: number }) {
    if (data.tries > 0)
      SetClientCookie(data.user + ".tryCount", data.tries.toString(), {
        maxAge: 300,
      });
    else DeleteClientCookie("tryCount");
    state.tryCount = data.tries;
  },
  setToken(state, data) {
    if (!!data) {
      state.token = data;
      const token = JSON.parse(
        Buffer.from(decodeURIComponent(data.split(".")[1]), "base64").toString()
      );
      state.userName = token.sub;
      if (process.client)
        SetClientCookie(tokenKey, data, {
          expires: new Date(token.exp * 1000),
        });
    }
  },
  setRefresh(state, data) {
    state.refresh = data;
    if (process.client) SetClientCookie(refreshKey, data, {});
  },
  logout(state) {
    if (process.client) {
      DeleteClientCookie(userKey);
      DeleteClientCookie(tokenKey);
      DeleteClientCookie(refreshKey);
    }
    if (process.client) {
      sessionStorage.clear();
      localStorage.clear();
    }
    state.settingsChanged = reactive([]);
    state.token = null;
    state.user = AnonymousUser();
    state.refresh = null;
  },
  setUser(state, data: User) {
    state.user = data;
    state.settingsChanged = reactive([]);
    if (process.client) {
      SetClientCookie(userKey, data.userName, {});
      localStorage.setItem(userKey, JSON.stringify(data));
    }
  },
  setSettings(state, settings: Setting) {
    state.user.settings = settings;
  },
  setCols(state, data: Array<WatchlistColumns>) {
    if (state.settingsChanged.findIndex((item) => item.key == "/columns") == -1)
      state.settingsChanged.push({
        key: "/columns",
        value: [...state.user.settings.columns],
      });
    state.user.settings.columns = data;
  },
  setWatchlist(
    state,
    data: { watchlist: Array<string>; name: string; changeState: boolean }
  ) {
    if (
      data.changeState &&
      state.settingsChanged.findIndex(
        (item) => item.key == "/watch_lists/" + data.name
      ) == -1
    )
      state.settingsChanged.push({
        key: "/watch_lists/" + data.name,
        value: [...state.user.settings.columns],
      });
    state.user.settings.watch_lists[data.name] = data.watchlist;
  },
  settingsChanged(state, data: { key: string; value: any }) {
    if (state.settingsChanged.findIndex((item) => item.key == data.key) == -1)
      state.settingsChanged.push({ key: data.key, value: data.value });
  },
  settingsNotChanged(state, data: string) {
    state.settingsChanged.splice(
      state.settingsChanged.findIndex((item) => item.key == data),
      1
    );
  },
};
