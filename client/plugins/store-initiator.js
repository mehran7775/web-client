import { refreshKey, tokenKey, userKey } from "@/store/sso/user"
import { parse } from "cookie"
import { needLogin } from "@/middleware/auth"

export default async function ({ store, req, redirect, route }) {
  //TODO Replace storage by cookie


  let ck = null;
  if (process.client) {
    ck = parse(document.cookie ?? "null")
  }
  else {
    ck = parse(req.headers["cookie"] ?? "null")
  }
  if (ck) {
    const refresh = ck[refreshKey] ?? store.state.sso.user.refresh
    const jwt = ck[tokenKey] ?? store.state.sso.user.token
    const user = ck[userKey]
    if (refresh && jwt && user) {
      store.commit('sso/user/setRefresh', refresh)
      store.commit('sso/user/setToken', jwt)
      if (process.client) {
        let uobj = localStorage.getItem(userKey)
        if (uobj) {
          store.commit('sso/user/setUser', JSON.parse(uobj))
        }
      }
      await store.dispatch('sso/user/getUser', user)

      if (route.fullPath == "/login")
        return redirect('/watchList')
    } else if (needLogin(route.fullPath)) {
      store.commit('sso/user/logout')
      if (needLogin(route.fullPath)) {
        return redirect('/login')
      }
    }
  } else {
    return redirect('/login')
  }
}