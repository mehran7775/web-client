import { RefreshKey, tokenKey, userKey } from "@/store/sso/user"

export default async function ({ store }) {
  //TODO Replace storage by cookie
  if (process.client) {
    const refresh = (localStorage && localStorage.getItem(RefreshKey)) || store.state.sso.user.refresh
    if (refresh) {
      store.commit('sso/user/setRefresh', refresh)
      const jwt = (sessionStorage && sessionStorage.getItem(tokenKey)) || store.state.sso.user.token
      if (jwt) {
        store.commit('sso/user/setToken', jwt)
        const user = JSON.parse(sessionStorage && (sessionStorage.getItem(userKey) || "null")) || store.state.sso.user.user
        if (user) {
          store.commit('sso/user/setUser', user)
        } else {
          await store.dispatch('sso/user/getUser', state.userName)
        }
      } else {
        await store.dispatch('sso/user/refreshToken')
        await store.dispatch('sso/user/getUser', state.userName)
      }
    } else {
      store.commit('sso/user/logout')
    }
  } else {
    //TODO Read from cookie
  }
}