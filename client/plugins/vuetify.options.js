import fa from 'vuetify/es5/locale/fa'
import en from 'vuetify/es5/locale/en'
import ar from 'vuetify/es5/locale/ar'
import ckb from 'vuetify/es5/locale/ckb'
import az from 'vuetify/es5/locale/az'
import '@mdi/font/css/materialdesignicons.min.css'
import '@/assets/icons/style.css'

export default function ({ store, app }) {
  const theme = {
    primary: '#005cb5',
    secondary: '#41535b',
    accent: '#ffffff',
    error: '#e5466c',
    success: '#369c66',
    darkSuccess: '#057341',
    warning: '#f39c12'
  }

  return {
    rtl: store.getters.rtl,
    lang: {
      current: store.getters.locale,
      locales: { en, fa, az, ar, ckb },
    },
    icons: {
      iconfont: 'mdi',// default - only for display purposes
      values: {}
    },
    theme: {
      dark: false,
      themes: {
        light: theme,
        dark: theme
      }
    }
  }
}
