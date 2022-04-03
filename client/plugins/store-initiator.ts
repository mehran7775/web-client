import { Plugin } from "@nuxt/types";
import { User, WealthSearchModel } from "@/types";
import { refreshKey, tokenKey, userKey } from "@/types/stores";
import { parse } from "cookie";
import { needLogin } from "@/middleware/auth";
import { useUser, useWealth } from "~/composables";

export default <Plugin>async function ({ $pinia, req, redirect, route }) {
  //TODO Replace storage by cookie

  const userManager = useUser($pinia);
  const wealthManager = useWealth($pinia);

  let ck = null;
  let refresh = null;
  let jwt = null;
  let user = null;
  if (process.client) {
    ck = parse(document.cookie ?? "null");
    refresh = localStorage.getItem(refreshKey);
    jwt = ck[tokenKey];
    user = localStorage.getItem(userKey);
  } else {
    ck = parse(req.headers["cookie"] ?? "null");
    refresh = ck[refreshKey];
    jwt = ck[tokenKey];
    user = ck[userKey];
  }
  if (ck) {
    // console.log('refresh', refresh)
    // console.log('jwt', jwt)
    // console.log('user', user)
    if (refresh && user) {
      userManager.setRefresh(refresh);
      if (!jwt) {
        await userManager.refreshToken();
      }
      userManager.setToken(jwt);
      let u: User | number = userManager.me;
      if (u.userName == "anonymous") {
        // if (process.client) {
        //   let uobj = localStorage.getItem(userKey);
        //   if (uobj) {
        //     userManager.setUser(JSON.parse(uobj));
        //   }
        // }
        u = await userManager.getUser(user);
        wealthManager.getWealth(new WealthSearchModel());
      }
      // console.log('user: ', u.userName)
      // console.log('path: ', route.fullPath)
      if (route.fullPath == "/login")
        return redirect(userManager.me.settings.home);
    } else if (needLogin(route.fullPath)) {
      userManager.logout();
      if (needLogin(route.fullPath)) {
        return redirect("/login");
      }
    }
  } else {
    return redirect("/login");
  }
};
