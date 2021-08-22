import umanager from '@/repositories/user_manager'
import jwttoken from '@/repositories/jwt_token'

const anonymousUser = {
  userName: 'anonymous',
  nikname: 'Anonymous',
  profile: {}
}

const RefreshKey = 'jwtRefreshKey'
const tokenKey = 'jwtKey'
const userKey = 'userCache'

export const state = () => ({
  token: null,
  user: null,
  refresh: null
})

export const mutations = {
  setToken(state, token) {
    if (sessionStorage && token) {
      sessionStorage.setItem(tokenKey, token)
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
    if (sessionStorage) {
      localStorage.clear()
      sessionStorage.clear()
    }
    state.token = null
    state.user = null
    state.refresh = null
  },
  setUser(state, data) {
    state.user = data
    if (sessionStorage)
      sessionStorage.setItem(userKey, JSON.stringify(data))
  }
}

export const actions = {
  async init(context) {
    if (typeof sessionStorage !== typeof undefined) {
      const refresh = localStorage.getItem(RefreshKey)
      if (refresh) {
        context.commit('setRefresh', refresh)
        const jwt = sessionStorage.getItem(tokenKey)
        if (jwt) {
          context.commit('setToken', jwt)
          const user = sessionStorage.getItem(userKey)
          if (user) {
            context.commit('setUser', JSON.parse(user))
          } else {
            await context.dispatch('getMe')
          }
        } else {
          await context.dispatch('refreshToken')
          await context.dispatch('getMe')
        }
      } else {
        context.commit('logout')
      }
    }
  },
  async getMe(context) {
    try {
      const { data, status } = await umanager.getUser(null, this.$axios)
      context.commit('setUser', data)
      return status
    } catch (err) {
      if (err.response) {
        return err.response.status
      }
      return 450
    }
  },
  async login(context, payload) {
    try {
      const { data, status } = await jwttoken.login(
        payload.userName,
        payload.password,
        this.$axios
      )
      context.commit('setToken', 'bearer ' + data.token)
      context.commit('setRefresh', data.refresh)
      context.dispatch('getMe')
      return status
    } catch (err) {
      if (err.response) {
        return err.response.status
      }
      return 500
    }
  },
  logout(context) {
    context.commit('logout')
  },
  async refreshToken(context) {
    if (typeof localStorage !== typeof undefined) {
      const token = localStorage.getItem(RefreshKey)
      if (token) {
        try {
          const { data, status } = await jwttoken.refreshToken(token)
          if (status >= 200 && status < 300 && !!data.token) {
            context.commit('setToken', 'bearer ' + data.token)
            context.commit('setRefresh', data.refresh)
          } else if (status >= 400) {
            context.commit('logout')
          }
          return status
        } catch (err) {
          context.commit('logout')
        }
      }
      return 401
    }
  }
}

export const getters = {
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
    return state && state.user
    // return true;
  }
}
