import { GetterTree, ActionTree, MutationTree } from 'vuex'
import umanager from '@/repositories/user_manager'
import jwttoken from '@/repositories/jwt_token'

export type User = {
  userName: string,
  nikname: string,
  profile: object
}

export type UserCredentials = {
  userName: string,
  password: string,
}

const RefreshKey: string = 'jwtRefreshKey';
const tokenKey: string = 'jwtKey';
const userKey: string = 'userCache';
const anonymousUser: User = {
  userName: 'anonymous',
  nikname: 'Anonymous',
  profile: {}
}

export const state = () => ({
  token: null,
  user: null,
  refresh: null,
  userName: null,
  watch_lists: null,
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
    // TODO Uncomment
    return state && state.token
    // return true;
  },
  getWatchList(state){
    return state.watch_lists
  }
}

export const mutations: MutationTree<RootState> = {
  setToken(state, token) {
    if (localStorage && token) {
      localStorage.setItem(tokenKey, token)
      state.token = token
    }
  },
  setRefresh(state, refresh) {
    if (localStorage && refresh) {
      localStorage.setItem(RefreshKey, refresh)
      state.refresh = refresh
    }
  },
  logout(state) {
    if (localStorage) {
      localStorage.clear()
      localStorage.clear()
    }
    state.token = null
    state.user = null
    state.refresh = null
  },
  setUser(state, data) {
    state.userName = data.user_name
    state.user = data

    if (localStorage){
      localStorage.setItem(userKey, JSON.stringify(data))
      localStorage.setItem('userName', data.user_name)
    }
  },
  setWatchList(state,data){
    state.watch_lists = data.settings.watch_lists
  }
}

export const actions: ActionTree<RootState, RootState> = {

  async init({ commit, dispatch }) {
    if (typeof localStorage !== typeof undefined) {
      const refresh = localStorage.getItem(RefreshKey)
      if (refresh) {

        commit('setRefresh', refresh)
        const jwt = localStorage.getItem(tokenKey)
        if (jwt) {

          commit('setToken', jwt)
          const user = localStorage.getItem(userKey)
          if (user) {

            commit('setUser', JSON.parse(user))
          } else {
            await dispatch('getMe',localStorage.getItem('userName'))
          }
        } else {
          await dispatch('refreshToken')
          await dispatch('getMe',localStorage.getItem('userName'))
        }
      } else {
        // commit('logout')
      }
    }
  },
  async getMe({ commit }, userName) {
    try {
      const { data, status } = await umanager.getUser(userName, this.$axios)
      commit('setUser', data)
      commit('setWatchList',data)
      return status
    } catch (err) {
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
      dispatch('getMe', payload.userName)
      return status
    } catch (err) {
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
            // commit('logout')
          }
          return status
        } catch (err) {
          // commit('logout')
        }
      }
      return 401
    }
  }
}
