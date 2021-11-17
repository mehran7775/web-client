import { RefreshKey, tokenKey, userKey } from "@/store/sso/user"

export default async function ({ store, req, res }) {
  //TODO Replace storage by cookie

  const ck = process.client ? import("cookie-universal") : require("cookie-universal")(req, res)
  store.commit("setCookieProvider", ck)

  const refresh = ck.get(RefreshKey) || store.state.sso.user.refresh
  if (refresh) {
    store.commit('sso/user/setRefresh', { data: refresh, ck })
    const jwt = ck.get(tokenKey) || store.state.sso.user.token
    if (jwt) {
      store.commit('sso/user/setToken', { data: jwt, ck })
      const user = ck.get(userKey) || store.state.sso.user.user
      if (user) {
        store.commit('sso/user/setUser', { data: user, ck })
      } else {
        await store.dispatch('sso/user/getUser', state.userName)
      }
    } else {
      await store.dispatch('sso/user/refreshToken')
      await store.dispatch('sso/user/getUser', state.userName)
    }
  } else {
    store.commit('sso/user/logout', ck)
  }
}