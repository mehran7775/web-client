import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { login, refreshToken } from '~/repositories/sso/jwt_token'
import * as stores from '@/types/stores'
import { User, Setting, UserCredentials, AnonymousUser } from '@/types'
import { getProfileImage, getUser, getUserList, updateUserWatchlist } from '@/repositories/sso/user_manager';

export const RefreshKey: string = 'jwtRefreshKey';
export const tokenKey: string = 'jwtKey';
export const userKey: string = 'userCache';

export const state = () => new stores.UserState()

export const getters: GetterTree<stores.UserState, stores.RootState> = {
  getToken: (state, getters, store) => {
    return state.token
  },
  me: (state) => {
    if (state && state.user) {
      return state.user
    } else {
      return AnonymousUser()
    }
  },
  isLogin: (state) => {
    return !!(state && state.token)
  },
  watchList(state) {
    if (state && state.user && state.user.settings) {
      return state.user.settings.watch_lists
    } else {
      return {}
    }
  }
}

export const mutations: MutationTree<stores.UserState> = {
  setToken(state, { data, ck }) {
    if (!!data) {
      state.token = data
      state.userName = JSON.parse(Buffer.from(decodeURIComponent(data.split('.')[1]), 'base64').toString()).sub
      ck.set(tokenKey, data)
    }
  },
  setRefresh(state, { data, ck }) {
    ck.set(RefreshKey, data)
    state.refresh = data
  },
  logout(state, ck) {
    ck.remove(tokenKey)
    ck.remove(RefreshKey)
    ck.remove(userKey)
    if (process.client) {
      sessionStorage.clear()
      localStorage.clear()
    }
    state.token = null
    state.user = AnonymousUser()
    state.refresh = null
  },
  setUser(state, { data, ck }) {
    state.user = data
    ck.set(userKey, JSON.stringify(data))
  },
  setWatchlist(state, { data, ck }) {
    state.user.settings.watch_lists = data
    ck.set(userKey, JSON.stringify(data))
  }
}

export const actions: ActionTree<stores.UserState, stores.RootState> = {
  async getUser({ commit, rootState }, userName) {
    if (!userName)
      return
    try {
      const { data, status } = await getUser(userName, this.$axios)
      commit('setUser', { data, ck: rootState.cookie })
      return status
    } catch (err: any) {
      if (err.response) {
        return err.response.status
      }
      return 450
    }
  },
  async login({ commit, dispatch, rootState }, payload) {
    try {
      const { data, status } = await login(
        payload.userName,
        payload.password,
        payload.captcha,
        this.$axios
      )
      commit('setToken', { data: 'Bearer ' + data.token, ck: rootState.cookie })
      commit('setRefresh', { data: data.refresh, ck: rootState.cookie })
      await dispatch('getUser', payload.userName)
      return status
    } catch (err: any) {
      if (err.response) {
        return err.response.status
      }
      return 500
    }
  },
  logout({ commit, rootState }) {
    commit('logout', rootState.cookie)
  },
  async refreshToken({ commit, rootState }) {
    const token = rootState.cookie?.get(RefreshKey)
    if (token) {
      try {
        const { data, status } = await refreshToken(token)
        if (status >= 200 && status < 300 && !!data.token) {
          commit('setToken', { data: 'Bearer ' + data.token, ck: rootState.cookie })
          commit('setRefresh', { data: data.refresh, ck: rootState.cookie })
        } else if (status >= 400) {
          commit('logout', rootState.cookie)
        }
        return status
      } catch (err) {
        commit('logout', rootState.cookie)
      }
    }
    return 401
  },
  async update_watchlist({ commit, rootState }, watchlist) {
    try {
      await updateUserWatchlist(watchlist, this.$axios)
      commit("setWatchlist", { data: watchlist, ck: rootState.cookie })
    } catch (err: any) {
      return 500
    }
  },
  async getProfilePic(_, name) {
    try {
      const img: Uint8Array = (await getProfileImage(name, this.$axios)).data
      return 'data:image/jpeg;base64,' + btoa(
        new Uint8Array(img)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
    } catch (err: any) {
      return 500
    }
  }

}
