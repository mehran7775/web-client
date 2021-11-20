import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { login, refreshToken } from '~/repositories/sso/jwt_token'
import * as stores from '@/types/stores'
import { User, Setting, UserCredentials, AnonymousUser } from '@/types'
import { getProfileImage, getUser, getUserList, updateUserWatchlist } from '@/repositories/sso/user_manager';
import { SetClientCookie, DeleteClientCookie } from "@/utils/cookie"


export const refreshKey: string = 'jwtRefreshKey';
export const tokenKey: string = 'jwtKey';
export const userKey: string = 'userCache';

export const state = () => new stores.UserState()

export const getters: GetterTree<stores.UserState, stores.RootState> = {
  getToken: (state, getters, store) => {
    return state.token
  },
  getRefresh: (state) => {
    return state.refresh
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
  setWatchlist(state, data) {
    state.user.settings.watch_lists = data
    if (process.client)
      SetClientCookie(userKey, JSON.stringify(data), {})
  }
}

export const actions: ActionTree<stores.UserState, stores.RootState> = {
  async getUser({ commit, rootState }, userName) {
    if (!userName)
      return
    try {
      const { data, status } = await getUser(userName, this.$axios)
      commit('setUser', data)
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
      commit('setToken', 'Bearer ' + data.token)
      commit('setRefresh', data.refresh)
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
    commit('logout')
  },
  async refreshToken({ commit, state }) {
    const token = state.refresh
    if (token) {
      try {
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
      }
    }
    return 401
  },
  async update_watchlist({ commit, rootState }, watchlist) {
    try {
      await updateUserWatchlist(watchlist, this.$axios)
      commit("setWatchlist", watchlist)
    } catch (err: any) {
      return 500
    }
  },
  async getProfilePic(_, name) {
    try {
      const img: Uint8Array = (await getProfileImage(name, this.$axios))?.data
      return 'data:image/jpeg;base64,' +
        Buffer.from(new Uint8Array(img)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')).toString('base64');
    } catch (err: any) {
      return 500
    }
  }

}
