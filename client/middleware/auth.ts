import { Middleware } from '@nuxt/types'

const auth: Middleware = async ({ store, route, redirect }) => {
  let isLogin = store.getters['sso/user/isLogin']
  if (!isLogin) {
    await store.dispatch('sso/user/init')
    isLogin = store.getters['sso/user/isLogin']
  }
  if (!isLogin && route.fullPath != '/login') {
    return redirect('/login')
  } else if (route.fullPath === '/login' && !!isLogin) {
    return redirect('/')
  }
}

export default auth