import { Plugin } from "@nuxt/types"
import { AxiosRequestConfig } from "axios"

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

  $axios.onError(async (error) => {
    let code = (error.response && error.response.status) || 500
    if (code === 401) {
      code = await store.dispatch('sso/user/refreshToken')
      if (code >= 400) {
        redirect('/login')
      }
    } else if (code === 403) {
      store.commit('snacks/showMessage', {
        content: 'error.403',
        color: 'error'
      })
    } else if (code >= 400 && code < 500 && ![401, 403].includes(code)) {
      store.commit('snacks/showMessage', {
        content: 'error.400',
        color: 'error'
      })
    } else {
      store.commit('snacks/showMessage', {
        content: 'error.500',
        color: 'error'
      })
    }
  })
  // store.dispatch('user/init')
}

export default accessor;
