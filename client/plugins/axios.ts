import { Plugin } from "@nuxt/types"
import { Snack } from "~/store/snacks"
import { AxiosError } from 'axios'
import { ErrorExtractor } from "~/utils/error"
import { useUser } from "~/composables"

const accessor: Plugin = ({ $axios, redirect, store }) => {
  const userManager = useUser(store)
  $axios.onRequest((config) => {
    Object.assign(config, {
      withCredentials: true,
      baseURL: process.env.VUE_APP_Host,
      headers: {
        ...config.headers,
        ...{
          authorization: userManager.getToken.value
        }
      }
    })
  })

  $axios.onError(async (err) => {
    let error = ErrorExtractor(err)
    if (error.code === 401) {
      try {
        await userManager.refreshToken()
        return $axios.request(err.config)
      }
      catch (err) {
        error = ErrorExtractor(err as AxiosError)
        store.commit('snacks/showMessage', new Snack('error.' + error.code, 'error'))
        redirect('/login')
        return Promise.reject(error)
      }
    } else {
      store.commit('snacks/showMessage', new Snack('error.' + error.code, 'error'))
      return Promise.reject(error)
    }
  })
}

export default accessor;
