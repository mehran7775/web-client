import { Middleware } from '@nuxt/types'
import { useUser } from '~/composables'

export const publicPages = [/^\/login\/?/, /^\/registration/, /^\/reset-password/, /^\/about-us/, /^\/blog.*/, /^\/?([#].*)?$/]

const auth: Middleware = async ({ store, route, redirect }) => {
  const userManager = useUser(store)
  if (needLogin(route.fullPath)) {
    if (!userManager.isLogin.value) {
      return redirect('/login')
    } else if (route.fullPath === '/login' && !!userManager.isLogin.value) {
      return redirect(userManager.me.value.settings.home)
    }
  }

}

export function needLogin(path: string): boolean {
  //console.log(path + ' needs login? ', publicPages.findIndex(item => { return item.test(path) }) == -1)
  return publicPages.findIndex(item => { return item.test(path) }) == -1
}

export default auth