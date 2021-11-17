import { RefreshKey, tokenKey, userKey } from "@/store/sso/user"
import { parse } from "cookie"
import { needLogin } from "@/middleware/auth"


export default async function ({ store, req, redirect, route }) {
  //TODO Replace storage by cookie


  let ck = null;
  if (process.client) {
    ck = parse(document.cookie)
  }
  else {
    ck = parse(req.headers["cookie"])
  }
  if (ck) {
    const refresh = ck[RefreshKey] || store.state.sso.user.refresh
    const jwt = ck[tokenKey] || store.state.sso.user.token
    const user = ck[userKey] || store.state.sso.user.user

    if (refresh && jwt && user) {
      store.commit('sso/user/setRefresh', refresh)
      store.commit('sso/user/setToken', jwt)
      store.commit('sso/user/setUser', JSON.parse(user))
      console.log(store.state)
      if (route.fullPath == "/login")
        return redirect('/')
    } else {
      store.commit('sso/user/logout')
      if (needLogin(route.fullPath)) {
        return redirect('/login')
      }
    }
  } else {
    return redirect('/login')
  }
}