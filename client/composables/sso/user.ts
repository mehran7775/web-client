import { AxiosError, AxiosResponse } from "axios";
import { computed, ref, reactive } from "@vue/composition-api";
import { defineStore } from "pinia";
import {
  AnonymousUser,
  Log,
  LoginModel,
  Paginated,
  PaginatedResult,
  Setting,
  User,
  WatchlistColumns,
} from "~/types";
import { UserState } from "~/types/stores";
import userManager from "@/repositories/sso/user_manager";
import jwtManager from "~/repositories/sso/jwt_token";
import {
  DeleteClientCookie,
  GetClientCookies,
  SetClientCookie,
} from "~/utils/cookie";
import { useAxios } from "..";

export const refreshKey: string = "jwtRefreshKey";
export const tokenKey: string = "jwtKey";
export const userKey: string = "userCache";

export const useUser = defineStore("user", () => {
  const state = ref(new UserState());

  const axiosManager = useAxios();
  const axios = axiosManager.createInstance();

  // Getters
  const refreshingToken = computed({
    get() {
      return state.value.renewToken;
    },
    set(val: boolean) {
      setRefreshingToken(val);
    },
  });
  const getBookmarks = computed(
    () => state.value.user.settings.bookmarks || []
  );
  const getShourtcuts = computed(
    () => state.value.user.settings.shourtcuts || []
  );
  const getToken = computed(() => state.value.token);
  const getRefresh = computed(() => state.value.refresh);
  const me = computed(() => state.value.user ?? AnonymousUser());
  const isLogin = computed(() => !!(state && state.value.token));
  const watchList = computed(
    () => state.value.user?.settings?.watch_lists ?? {}
  );
  const tryCount = computed(() => state.value.tryCount);
  const settingsChanged = computed(() => state.value.settingsChanged);

  // Mutations
  function setHome(data: string) {
    state.value.user.settings.home = data;
  }
  function setRefreshingToken(data: boolean) {
    state.value.renewToken = data;
  }
  function tries(data: { user: string; tries: number }) {
    if (data.tries > 0)
      SetClientCookie(data.user + ".tryCount", data.tries.toString(), {
        maxAge: 300,
      });
    else DeleteClientCookie("tryCount");
    state.value.tryCount = data.tries;
  }
  function setToken(data: string) {
    if (!!data) {
      state.value.token = data;
      const token = JSON.parse(
        Buffer.from(decodeURIComponent(data.split(".")[1]), "base64").toString()
      );
      state.value.userName = token.sub;
      if (process.client)
        SetClientCookie(tokenKey, data, {
          expires: new Date(token.exp * 1000),
        });
    }
  }
  function setRefresh(data: string) {
    state.value.refresh = data;
    if (process.client) SetClientCookie(refreshKey, data, {});
  }
  function logout() {
    if (process.client) {
      DeleteClientCookie(userKey);
      DeleteClientCookie(tokenKey);
      DeleteClientCookie(refreshKey);
    }
    if (process.client) {
      sessionStorage.clear();
      localStorage.clear();
    }
    state.value.settingsChanged = reactive([]);
    state.value.token = null;
    state.value.user = AnonymousUser();
    state.value.refresh = null;
  }
  function setUser(data: User) {
    state.value.user = data;
    state.value.settingsChanged = reactive([]);
    if (process.client) {
      SetClientCookie(userKey, data.userName, {});
      localStorage.setItem(userKey, JSON.stringify(data));
    }
  }
  function setSettings(settings: Setting) {
    state.value.user.settings = settings;
  }
  function setCols(data: Array<WatchlistColumns>) {
    if (
      state.value.settingsChanged.findIndex((item) => item.key == "/columns") ==
      -1
    )
      state.value.settingsChanged.push({
        key: "/columns",
        value: [...state.value.user.settings.columns],
      });
    state.value.user.settings.columns = data;
  }
  function setWatchlist(data: {
    watchlist: Array<string>;
    name: string;
    changeState: boolean;
  }) {
    if (
      data.changeState &&
      state.value.settingsChanged.findIndex(
        (item) => item.key == "/watch_lists/" + data.name
      ) == -1
    )
      state.value.settingsChanged.push({
        key: "/watch_lists/" + data.name,
        value: [...state.value.user.settings.columns],
      });
    state.value.user.settings.watch_lists[data.name] = data.watchlist;
  }
  function setSettingsChanged(data: { key: string; value: any }) {
    if (
      state.value.settingsChanged.findIndex((item) => item.key == data.key) ==
      -1
    )
      state.value.settingsChanged.push({ key: data.key, value: data.value });
  }
  function settingsNotChanged(data: string) {
    state.value.settingsChanged.splice(
      state.value.settingsChanged.findIndex((item) => item.key == data),
      1
    );
  }

  // Actions TODO Move buisiness here
  async function getUser(userName: string): Promise<User | number> {
    const { data, status } = await userManager.getUser(
      userName ?? state.value.userName,
      axios
    );
    setUser(data);
    return data || status;
  }
  function checkTries(userName: string) {
    const tr = GetClientCookies()[userName + ".tryCount"];
    if (tr && tr != "") {
      tries({ user: userName, tries: parseInt(tr) });
    } else {
      tries({ user: userName, tries: 0 });
    }
  }
  async function login(payload: LoginModel): Promise<number> {
    try {
      refreshingToken.value = true;
      tries({ user: payload.userName, tries: state.value.tryCount + 1 });
      const { data, status } = await jwtManager.login(
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
      await jwtManager.logout(axios);
    } finally {
      logout();
    }
  }
  async function refreshToken(): Promise<number> {
    const token = state.value.refresh;
    if (token) {
      try {
        refreshingToken.value = true;
        const { data, status } = await jwtManager.refreshToken(token);
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
        axios
      );
      if (resp.data.setting) {
        setSettings(resp.data.setting);
        if (process.client)
          localStorage.setItem(userKey, JSON.stringify(state.value.user));
      }
      settingsNotChanged(payload.path);
    } catch (e) {
      setSettingsChanged({ key: payload.path, value: null });
      throw e;
    }
  }
  async function getProfilePic(name: string): Promise<string> {
    const img: Uint8Array = (await userManager.getProfileImage(name, axios))
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
      state.value.userName ?? "",
      payload?.offset,
      payload?.length,
      axios
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
    getProfilePic,
    getLogs,
  };
});
