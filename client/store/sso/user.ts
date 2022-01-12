import { AxiosError } from 'axios'
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { login, refreshToken, logout } from '~/repositories/sso/jwt_token'
import * as stores from '@/types/stores'
import { User, Setting, UserCredentials, AnonymousUser, Paginated, WatchlistColumns } from '@/types'
import { getProfileImage, getUser, getUserList, updateUserWatchlist, getUserLog, updateUserSettings } from '@/repositories/sso/user_manager';
import { SetClientCookie, DeleteClientCookie, GetClientCookies } from "@/utils/cookie"



export const refreshKey: string = 'jwtRefreshKey';
export const tokenKey: string = 'jwtKey';
export const userKey: string = 'userCache';

export const state = () => new stores.UserState()

export const getters: GetterTree<stores.UserState, stores.RootState> = {
  renewToken: (state) => state.renewToken,
  getBookmarks: (state) => state.bookmarks,
  getToken: (state) => state.token,
  getRefresh: (state) => state.refresh,
  me: (state) => state.user ?? AnonymousUser(),
  isLogin: (state) => !!(state && state.token),
  watchList: (state) => state.user?.settings?.watch_lists ?? {},
  tryCount: (state): number => {
    return state.tryCount
  },
  settingsChanged: (state) => state.settingsChanged,
  watchlistChanged: (state) => state.watchlistChanged,
}

export const mutations: MutationTree<stores.UserState> = {
  renewToken(state, data: boolean) {
    state.renewToken = data
  },
  addBookmark(state, data: object) {
    state.bookmarks.push(data)
  },
  removeBookmark(state, data: object) {
    state.bookmarks.splice(state.bookmarks.indexOf(data), 1)
  },
  tries(state, data: { user: string, tries: number }) {
    if (data.tries > 0)
      SetClientCookie(data.user + ".tryCount", data.tries.toString(), { maxAge: 300 })
    else
      DeleteClientCookie("tryCount")
    state.tryCount = data.tries
  },
  setToken(state, data) {
    if (!!data) {
      state.token = data
      const token = JSON.parse(Buffer.from(decodeURIComponent(data.split('.')[1]), 'base64').toString())
      state.userName = token.sub
      if (process.client)
        SetClientCookie(tokenKey, data, {
          expires: new Date(token.exp * 1000),
        })
    }
  },
  setRefresh(state, data) {
    state.refresh = data
    if (process.client)
      SetClientCookie(refreshKey, data, {})
  },
  logout(state) {
    if (process.client) {
      DeleteClientCookie(userKey)
      DeleteClientCookie(tokenKey)
      DeleteClientCookie(refreshKey)
    }
    if (process.client) {
      sessionStorage.clear()
      localStorage.clear()
    }
    state.token = null
    state.user = AnonymousUser()
    state.refresh = null
  },
  setUser(state, data) {
    state.user = data
    if (process.client)
      SetClientCookie(userKey, JSON.stringify(data), {})
  },
  setCols(state, data: Array<WatchlistColumns>) {
    state.user.settings.columns = data
    state.user = Object.assign({}, state.user)
    state.settingsChanged = true
  },
  setWatchlist(state, data: { watchlist: string, name: string }) {
    state.user.settings.watch_lists[data.name] = data.watchlist
    state.user = Object.assign({}, state.user)
    state.watchlistChanged = true
  },
  updateWatchlist(state, data: object) {
    state.user.settings.watch_lists = data
    state.user = Object.assign({}, state.user)
    state.watchlistChanged = true
  },
  setWatchlistChanged(state, data: boolean) {
    state.watchlistChanged = data
  },
  setSettingsChanged(state, data: boolean) {
    state.settingsChanged = data
  }
}

export const actions: ActionTree<stores.UserState, stores.RootState> = {
  async getUser({ commit, rootState }, userName) {
    if (!userName)
      return
    const { data, status } = await getUser(userName, this.$axios)
    commit('setUser', data)
    return status
  },
  checkTries({ commit, state }, userName: string) {
    const tries = GetClientCookies()[userName + ".tryCount"]
    if (tries && tries != "") {
      commit("tries", { user: userName, tries: parseInt(tries) })
    } else {
      commit("tries", { user: userName, tries: 0 })
    }
  },
  async login({ commit, dispatch, state, rootState }, payload) {
    try {
      commit("renewToken", true)
      commit("tries", { user: payload.userName, tries: state.tryCount + 1 })
      const { data, status } = await login(
        payload.userName,
        payload.password,
        payload.captcha,
        this.$axios
      )
      commit('setToken', 'Bearer ' + data.token)
      commit('setRefresh', data.refresh)
      await dispatch('getUser', payload.userName)
      return status
    } catch (err: unknown) {
      const resp = err as AxiosError<any>
      if (resp.response) {
        if (resp.response.data.tryCount)
          commit('tries', { user: payload.userName, tries: resp.response.data.tryCount })
        throw err
      }
      throw err
    } finally {
      commit("renewToken", false)
    }
  },
  async logout({ commit, rootState }) {
    try {
      await logout(this.$axios)
    } finally {
      commit('logout')
    }
  },
  async refreshToken({ commit, state }) {
    const token = state.refresh
    if (token) {
      try {
        commit("renewToken", true)
        const { data, status } = await refreshToken(token)
        if (status >= 200 && status < 300 && !!data.token) {
          commit('setToken', 'Bearer ' + data.token)
          commit('setRefresh', data.refresh)
        } else if (status >= 400) {
          commit('logout')
        }
        return status
      } catch (err) {
        commit('logout')
      } finally {
        commit("renewToken", false)
      }
    }
    return 401
  },
  async update_watchlist({ commit, state }) {
    commit("setWatchlistChanged", false)
    try {
      await updateUserWatchlist(state.user.settings.watch_lists, this.$axios)
      if (process.client)
        SetClientCookie(userKey, JSON.stringify(state.user), {})
    } catch (e) {
      commit("setWatchlistChanged", true)
      throw e
    }
  },
  async update_settings({ commit, state }) {
    commit("setSettingsChanged", false)
    try {
      await updateUserSettings(state.user.settings, this.$axios)
      if (process.client)
        SetClientCookie(userKey, JSON.stringify(state.user), {})
    } catch (e) {
      commit("setSettingsChanged", true)
      throw e
    }
  },
  async getProfilePic(_, name) {
    const img: Uint8Array = (await getProfileImage(name, this.$axios))?.data
    return 'data:image/jpeg;base64,' +
      Buffer.from(new Uint8Array(img)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')).toString('base64');
  },
  async getLogs({ state }, payload: Paginated) {
    return getUserLog(state.userName ?? '', payload?.offset, payload?.length, this.$axios)
  }

}
