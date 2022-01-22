import { Middleware } from '@nuxt/types'

export const publicPages = [/^\/login\/?/, /^\/registration/, /^\/reset-password/, /^\/about-us/, /^\/blog.*/, /^\/?([#].*)?$/]

const auth: Middleware = async ({ store, route, redirect }) => {
  if (needLogin(route.fullPath)) {
    let isLogin = store.getters['sso/user/isLogin']
    if (!isLogin) {
      return redirect('/login')
    } else if (route.fullPath === '/login' && !!isLogin) {
      return redirect('/watchlist/wealth')
    }
  }

}

export function needLogin(path: string): boolean {
  //console.log(path + ' needs login? ', publicPages.findIndex(item => { return item.test(path) }) == -1)
  return publicPages.findIndex(item => { return item.test(path) }) == -1
}

export default auth