import { Plugin } from "@nuxt/types"
import { Snack } from "~/store/snacks"
import { AxiosError } from 'axios'
import { ErrorExtractor } from "~/utils/error"

const accessor: Plugin = ({ $axios, redirect, store }) => {
  $axios.onRequest((config) => {
    Object.assign(config, {
      withCredentials: true,
      baseURL: process.env.VUE_APP_Host,
      headers: {
        ...config.headers,
        ...{
          authorization: store.getters['sso/user/getToken']
        }
      }
    })
  })

  $axios.onError(async (err) => {
    let error = ErrorExtractor(err)
    if (error.code === 401) {
      try {
        await store.dispatch('sso/user/refreshToken')
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
