import fa from 'vuetify/es5/locale/fa'
import en from 'vuetify/es5/locale/en'
import ar from 'vuetify/es5/locale/ar'
import ckb from 'vuetify/es5/locale/ckb'
import az from 'vuetify/es5/locale/az'
import '@mdi/font/css/materialdesignicons.min.css'
import '@/assets/icons/style.css'

export default function ({ store, app }) {
  const ltheme = {
    default: "#828282",
    secondary: '#EF394E',
    primary: '#3554D1',
    accent: '#82B1FF',
    error: '#FF3B30',
    info: '#009CF2',
    success: '#00BD79',
    warning: '#FFBB46',
  }
  const dtheme = {
    secondary: '#EF394E',
    primary: '#3554D1',
    accent: '#82B1FF',
    error: '#FF3B30',
    info: '#009CF2',
    success: '#00BD79',
    warning: '#FFBB46',
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
      options: { customProperties: true },
      dark: false,
      themes: {
        light: ltheme,
        dark: dtheme
      }
    }
  }
}
