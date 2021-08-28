import { Middleware } from '@nuxt/types'

const auth: Middleware = ({ store, route, redirect }) => {
  store.dispatch('user/init');
  const islogin = store.getters['user/isLogin']
  if (!islogin) {
    return redirect('/login')
  } else if (route.fullPath === '/login' && !!islogin) {
    return redirect('/')
  }
}

export default auth