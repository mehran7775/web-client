import { WealthSearchModel } from "@/types"
import { refreshKey, tokenKey, userKey } from "@/store/sso/user"
import { parse } from "cookie"
import { needLogin } from "@/middleware/auth"
import { useUser, useWealth } from "~/composables"

export default async function ({ store, req, redirect, route }) {
  //TODO Replace storage by cookie

  const userManager = useUser(store)
  const wealthManager = useWealth(store)

  let ck = null;
  if (process.client) {
    ck = parse(document.cookie ?? "null")
  }
  else {
    ck = parse(req.headers["cookie"] ?? "null")
  }
  if (ck) {
    const refresh = ck[refreshKey]
    const jwt = ck[tokenKey]
    const user = ck[userKey]
    console.log('refresh', refresh)
    console.log('jwt', jwt)
    console.log('user', user)
    if (refresh && jwt && user) {
      userManager.setRefresh(refresh)
      userManager.setToken(jwt)
      let u = store.state.sso.user.user
      if (u.userName == "anonymous") {
        if (process.client) {
          let uobj = localStorage.getItem(userKey)
          if (uobj) {
            userManager.setUser(JSON.parse(uobj))
          }
        }
        u = await userManager.getUser(user)
        wealthManager.getWealth(new WealthSearchModel());
      }
      console.log('user: ', u.userName)
      console.log('path: ', route.fullPath)
      if (route.fullPath == "/login")
        return redirect(userManager.me.value.settings.home)
    } else if (needLogin(route.fullPath)) {
      userManager.logout()
      if (needLogin(route.fullPath)) {
        return redirect('/login')
      }
    }
  } else {
    return redirect('/login')
  }
}