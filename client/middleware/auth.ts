import { Middleware } from '@nuxt/types'

export const publicPages = [/\/login\/?/, /\/docs.*/, /$\/?^/]

const auth: Middleware = async ({ store, route, redirect }) => {

  if (needLogin(route.fullPath)) {
    let isLogin = store.getters['sso/user/isLogin']
    if (!isLogin) {
      return redirect('/login')
    } else if (route.fullPath === '/login' && !!isLogin) {
      return redirect('/')
    }
  }

}

export function needLogin(path: string): boolean {
  return publicPages.findIndex(item => { return item.test(path) }) == -1
}

export default auth