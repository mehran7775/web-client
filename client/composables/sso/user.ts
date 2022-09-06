import Axios, { AxiosError, AxiosResponse } from "axios";
import { computed, ref, reactive } from "vue";
import { defineStore } from "pinia";
import { Buffer } from "buffer";
import {
  AnonymousUser,
  Log,
  LoginModel,
  Paginated,
  PaginatedResult,
  Setting,
  User,
  WatchListColumns,
} from "~/types";
import { refreshKey, tokenKey, userKey, UserState } from "~/types/stores";
import userManager from "@/repositories/sso/user_manager";
import jwtManager from "~/repositories/sso/jwt_token";
import { useAxios } from "..";

export const useUser = defineStore("user", () => {
  const appconfig = useRuntimeConfig();
  const state = reactive(new UserState());
  const axiosManager = useAxios();
  const axios = computed(() => axiosManager.createInstance());
  const bareAxios = Axios.create({
    baseURL: appconfig.public.VUE_APP_Host,
  });

  // Getters
  const refreshingToken = computed({
    get() {
      return state.renewToken;
    },
    set(val: boolean) {
      setRefreshingToken(val);
    },
  });
  const getBookmarks = computed(() => state.user?.settings?.bookmarks || []);
  const getShourtcuts = computed(() => state.user?.settings?.shourtcuts || []);
  const getToken = computed(() => state.token);
  const getRefresh = computed(() => state.refresh);
  const me = computed(() => state.user ?? AnonymousUser());
  const isLogin = computed(() => !!(state && state.token));
  const watchList = computed(() => state.user?.settings?.watch_lists ?? {});
  const tryCount = computed(() => state.tryCount);
  const settingsChanged = computed(() => state.settingsChanged);

  // Mutations
  function setHome(data: string) {
    state.user.settings.home = data;
  }
  function setRefreshingToken(data: boolean) {
    state.renewToken = data;
  }
  function tries(data: { user: string; tries: number }) {
    //TODO Cookie
    //if (data.tries > 0)
    //   SetClientCookie(data.user + ".tryCount", data.tries.toString(), {
    //     maxAge: 300,
    //   });
    // else DeleteClientCookie("tryCount");
    state.tryCount = data.tries;
  }
  function setToken(data: string) {
    if (!!data) {
      state.token = data;
      const token = JSON.parse(
        Buffer.from(decodeURIComponent(data.split(".")[1]), "base64").toString()
      );
      state.userName = token.sub;
      //TODO Cookie
      // if (process.client) {
      //   sessionStorage.setItem(tokenKey, data);
      //   SetClientCookie(tokenKey, data, {
      //     expires: new Date(token.exp * 1000),
      //   });
      // }
    }
  }
  function setRefresh(data: string) {
    state.refresh = data;
    //TODO Cookie
    // if (process.client) {
    //   SetClientCookie(refreshKey, data, {});
    //   localStorage.setItem(refreshKey, data);
    // }
  }
  function logout() {
    if (process.client) {
      //TODO Cookie
      // DeleteClientCookie(userKey);
      // DeleteClientCookie(tokenKey);
      // DeleteClientCookie(refreshKey);
      sessionStorage.clear();
      localStorage.clear();
    }

    state.settingsChanged = reactive([]);
    state.token = null;
    state.user = AnonymousUser();
    state.refresh = null;
  }
  function setUser(data: User) {
    state.user = data;
    state.settingsChanged = reactive([]);
    if (process.client) {
      //TODO Cookie
      // SetClientCookie(userKey, data.userName, {});
      localStorage.setItem(userKey, data.userName);
    }
  }
  function setSettings(settings: Setting) {
    console.log(settings)
    state.user.settings = settings;
  }
  function setCols(data: Array<WatchListColumns>) {
    if (state.settingsChanged.findIndex((item) => item.key == "/columns") == -1)
      state.settingsChanged.push({
        key: "/columns",
        value: [...state.user.settings.columns],
      });
    state.user.settings.columns = data;
  }
  function setWatchlist(data: {
    watchlist: Array<string>;
    name: string;
    changeState: boolean;
  }) {
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
  }
  function setSettingsChanged(data: { key: string; value: any }) {
    if (state.settingsChanged.findIndex((item) => item.key == data.key) == -1)
      state.settingsChanged.push({ key: data.key, value: data.value });
  }
  function settingsNotChanged(data: string) {
    state.settingsChanged.splice(
      state.settingsChanged.findIndex((item) => item.key == data),
      1
    );
  }

  // Actions
  async function getUser(userName: string): Promise<User> {
    const { data, status } = await userManager.getUser(
      userName ?? state.userName,
      axios.value
    );
    setUser(data);
    return data;
  }
  function checkTries(userName: string) {
    //TODO Cookie
    // const tr = GetClientCookies()[userName + ".tryCount"];
    // if (tr && tr != "") {
    //   tries({ user: userName, tries: parseInt(tr) });
    // } else {
    //   tries({ user: userName, tries: 0 });
    // }
  }
  async function login(payload: LoginModel): Promise<number> {
    try {
      refreshingToken.value = true;
      tries({ user: payload.userName, tries: state.tryCount + 1 });
      const { data, status } = await jwtManager.login(
        bareAxios,
        payload.userName,
        payload.password,
        payload.captcha
      );
      setToken("Bearer " + data.token);
      setRefresh(data.refresh);
      await getUser(payload.userName);
      return status;
    } catch (err: unknown) {
      const resp = err as AxiosError<any>;
      if (resp.response) {
        if (resp.response.data.tryCount)
          tries({ user: payload.userName, tries: resp.response.data.tryCount });
        throw err;
      }
      throw err;
    } finally {
      refreshingToken.value = false;
    }
  }
  async function doLogout(): Promise<void> {
    try {
      await jwtManager.logout(axios.value);
    } finally {
      logout();
    }
  }
  async function refreshToken(): Promise<number> {
    const token = state.refresh;
    if (token) {
      try {
        refreshingToken.value = true;
        const { data, status } = await jwtManager.refreshToken(
          token,
          bareAxios
        );
        if (status >= 200 && status < 300 && !!data.token) {
          setToken("Bearer " + data.token);
          setRefresh(data.refresh);
        } else if (status >= 400) {
          logout();
        }
        return status;
      } catch (err) {
        logout();
      } finally {
        refreshingToken.value = false;
      }
    }
    return 401;
  }
  async function update_settings(payload: {
    path: string;
    value: any;
  }): Promise<void> {
    try {
      const resp = await userManager.updateUserSettings(
        payload.path,
        payload.value,
        axios.value
      );
      if (resp.data.setting) {
        setSettings(resp.data.setting);
        if (process.client) localStorage.setItem(userKey, state.user.userName);
      }
      settingsNotChanged(payload.path);
    } catch (e) {
      setSettingsChanged({ key: payload.path, value: null });
      throw e;
    }
  }
  async function delete_settings(payload: { path: string }): Promise<void> {
    try {
      const resp = await userManager.deleteUserSettings(payload.path, axios.value);
      if (resp.data.setting) {
        setSettings(resp.data.setting);
        if (process.client) localStorage.setItem(userKey, state.user.userName);
      }
      settingsNotChanged(payload.path);
    } catch (e) {
      setSettingsChanged({ key: payload.path, value: null });
      throw e;
    }
  }
  async function getProfilePic(name: string): Promise<string> {
    const img: Uint8Array = (await userManager.getProfileImage(name, axios.value))
      ?.data;
    return (
      "data:image/jpeg;base64," +
      Buffer.from(
        new Uint8Array(img).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      ).toString("base64")
    );
  }
  async function getLogs(
    payload: Paginated
  ): Promise<AxiosResponse<PaginatedResult<Log>>> {
    return userManager.getUserLog(
      state.userName ?? "",
      payload?.offset,
      payload?.length,
      axios.value
    );
  }

  return {
    state,
    // Getters
    refreshingToken,
    getBookmarks,
    getShourtcuts,
    getToken,
    getRefresh,
    me,
    isLogin,
    watchList,
    tryCount,
    settingsChanged,
    // Mutations
    setHome,
    setRefreshingToken,
    tries,
    setToken,
    setRefresh,
    logout,
    setUser,
    setSettings,
    setCols,
    setWatchlist,
    // Actions
    getUser,
    checkTries,
    login,
    doLogout,
    refreshToken,
    update_settings,
    delete_settings,
    getProfilePic,
    getLogs,
  };
});
