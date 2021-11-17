import { Middleware } from '@nuxt/types'

const auth: Middleware = async ({ store, route, redirect }) => {

  const publicPages = [/\/login\/?/, /\/docs.*/, /$\/?^/]
  if (publicPages.findIndex(item => { return item.test(route.fullPath) }) == -1) {
    let isLogin = store.getters['sso/user/isLogin']
    if (!isLogin) {
      return redirect('/login')
    } else if (route.fullPath === '/login' && !!isLogin) {
      return redirect('/')
    }
  }

}

export default auth