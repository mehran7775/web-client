import { GetterTree, ActionTree, MutationTree } from 'vuex'
import umanager from '@/repositories/user_manager'
import jwttoken from '@/repositories/jwt_token'
import { User, Setting, UserCredentials } from '@/types/sso'
import user_manager from '@/repositories/user_manager';


const RefreshKey: string = 'jwtRefreshKey';
const tokenKey: string = 'jwtKey';
const userKey: string = 'userCache';
const anonymousUser: User = {
  userName: 'anonymous',
  profile: {
    nickname: 'Anonymous',
    profilePic: null
  },
  settings: {
    lang: 'fa-IR',
    columns: [],
    watch_lists: {}
  }
}

export const state = () => ({
  token: null,
  user: anonymousUser,
  refresh: null,
  userName: null,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  getToken: (state, getters, store) => {
    return state.token
  },
  me: (state) => {
    if (state && state.user) {
      return state.user
    } else {
      return anonymousUser
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

export const mutations: MutationTree<RootState> = {
  setToken(state, token) {
    if (!!token) {
      state.token = token
      state.userName = JSON.parse(atob(decodeURIComponent(token.split('.')[1]))).sub
      if (localStorage) {
        sessionStorage.setItem(tokenKey, token)
      }
    }
  },
  setRefresh(state, refresh) {
    if (localStorage && refresh) {
      localStorage.setItem(RefreshKey, refresh)
    }
    state.refresh = refresh
  },
  logout(state) {
    if (localStorage) {
      sessionStorage.clear()
      localStorage.clear()
    }
    state.token = null
    state.user = anonymousUser
    state.refresh = null
  },
  setUser(state, data) {
    state.user = data
    if (sessionStorage) {
      sessionStorage.setItem(userKey, JSON.stringify(data))
    }
  },
  setWatchlist(state, data) {
    state.user.settings.watch_lists = data
    if (sessionStorage) {
      sessionStorage.setItem(userKey, JSON.stringify(state.user))
    }
  }
}

export const actions: ActionTree<RootState, RootState> = {

  async init({ commit, dispatch, state }) {
    const refresh = (localStorage && localStorage.getItem(RefreshKey)) || state.refresh
    if (refresh) {
      commit('setRefresh', refresh)
      const jwt = (sessionStorage && sessionStorage.getItem(tokenKey)) || state.token
      if (jwt) {
        commit('setToken', jwt)
        const user = JSON.parse(sessionStorage && (sessionStorage.getItem(userKey) || "null")) || state.user
        if (user) {
          commit('setUser', user)
        } else {
          await dispatch('getUser', state.userName)
        }
      } else {
        await dispatch('refreshToken')
        await dispatch('getUser', state.userName)
      }
    } else {
      commit('logout')
    }
  },
  async getUser({ commit }, userName) {
    if (!userName)
      return
    try {
      const { data, status } = await umanager.getUser(userName, this.$axios)
      commit('setUser', data)
      return status
    } catch (err: any) {
      if (err.response) {
        return err.response.status
      }
      return 450
    }
  },
  async login({ commit, dispatch }, payload) {
    try {
      const { data, status } = await jwttoken.login(
        payload.userName,
        payload.password,
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
  logout({ commit }) {
    commit('logout')
  },
  async refreshToken({ commit }) {
    if (typeof localStorage !== typeof undefined) {
      const token = localStorage.getItem(RefreshKey)
      if (token) {
        try {
          const { data, status } = await jwttoken.refreshToken(token)
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
    }
  },
  async update_watchlist({ commit }, watchlist) {
    try {
      await user_manager.updateUserWatchlist(watchlist, this.$axios)
      commit("setWatchlist", watchlist)
    } catch (err: any) {
      return 500
    }
  }

}
