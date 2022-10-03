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
  const getShortcuts = computed(() => state.user?.settings?.shortcuts || []);
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
    const tryCookie = useCookie(data.user + ".tryCount", {
      maxAge: 300,
    });
    if (data.tries > 0) {
      tryCookie.value = data.tries.toString();
    } else tryCookie.value = null;
    state.tryCount = data.tries;
  }
  function setToken(data: string) {
    if (!!data) {
      state.token = data;
      const token = JSON.parse(
        Buffer.from(decodeURIComponent(data.split(".")[1]), "base64").toString()
      );
      state.userName = token.sub;
      if (process.client) {
        sessionStorage.setItem(tokenKey, data);
      }
      const tkCookie = useCookie(tokenKey, {
        expires: new Date(token.exp * 1000),
      });
      tkCookie.value = data;
    }
  }
  function setRefresh(data: string) {
    state.refresh = data;
    if (process.client) {
      const refCookie = useCookie(refreshKey, {});
      refCookie.value = data;
      localStorage.setItem(refreshKey, data);
    }
  }
  function logout() {
    if (process.client) {
      sessionStorage.clear();
      localStorage.clear();
    }
    const refCookie = useCookie(refreshKey);
    const tkCookie = useCookie(tokenKey);
    const usrCookie = useCookie(userKey);
    refCookie.value = null;
    tkCookie.value = null;
    usrCookie.value = null;

    state.settingsChanged = reactive([]);
    state.token = null;
    state.user = AnonymousUser();
    state.refresh = null;
  }
  function setUser(data: User) {
    state.user = data;
    state.settingsChanged = reactive([]);
    if (process.client) {
      const usrCookie = useCookie(userKey);
      usrCookie.value = data.userName;
      localStorage.setItem(userKey, data.userName);
    }
  }
  function setSettings(settings: Setting) {
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
  // function setWatchlist(data: {
  //   watchlist: Array<string>;
  //   name: string;
  //   changeState: boolean;
  // }) {
  //   if (
  //     data.changeState &&
  //     state.settingsChanged.findIndex(
  //       (item) => item.key == "/watch_lists/" + data.name
  //     ) == -1
  //   )
  //     state.settingsChanged.push({
  //       key: "/watch_lists/" + data.name,
  //       value: [...state.user.settings.columns],
  //     });
  //   state.user.settings.watch_lists[data.name] = data.watchlist;
  // }
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
    const tr = useCookie(userName + ".tryCount", {
      maxAge: 300,
    });
    if (tr.value && tr.value != "") {
      tries({ user: userName, tries: parseInt(tr.value) });
    } else {
      tries({ user: userName, tries: 0 });
    }
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
    name?: string
  }): Promise<void> {
    try {
      const resp = await userManager.updateUserSettings(
        payload.path,
        payload.value,
        axios.value
      );
      if (resp.data.setting) {
        setSettings(resp.data.setting);
        state.addWatchListChanges[payload.name] ? delete state.addWatchListChanges[payload.name] : null
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
      const resp = await userManager.deleteUserSettings(
        payload.path,
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
  async function getProfilePic(name: string): Promise<string> {
    const img: Uint8Array = (
      await userManager.getProfileImage(name, axios.value)
    )?.data;
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
    getShortcuts,
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
    // setWatchlist,
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
    setSettingsChanged,
    settingsNotChanged
  };
});
