export default function ({ $axios, redirect, store }) {
  $axios.onRequest((config) => {
    checkRefresh()
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
    let code = parseInt(error.response && error.response.status)
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

const checkRefresh = function () {
  if (window && window.appInfo && window.appInfo.refreshing) {
    setTimeout(() => {
      checkRefresh()
    }, 500)
  }
}
