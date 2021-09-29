import { Middleware } from '@nuxt/types'

const auth: Middleware = async ({ store, route, redirect }) => {
  let isLogin = store.getters['user/isLogin']
  console.log("check login",isLogin)
  if (!isLogin) {
    await store.dispatch('user/init')
    isLogin = store.getters['user/isLogin']
  }
  if (!isLogin && route.fullPath != '/login') {
    return redirect('/login')
  } else if (route.fullPath === '/login' && !!isLogin) {
    return redirect('/')
  }
}

export default auth