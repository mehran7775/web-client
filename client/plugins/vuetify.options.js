import fa from 'vuetify/es5/locale/fa'
import en from 'vuetify/es5/locale/en'
import ar from 'vuetify/es5/locale/ar'
import ckb from 'vuetify/es5/locale/ckb'
import az from 'vuetify/es5/locale/az'
import '@mdi/font/css/materialdesignicons.css'

export default function ({ store, app }) {
  const theme = {
    primary: '#3c8dbc',
    secondary: '#41535b',
    accent: '#ffffff',
    error: '#f56954',
    success: '#06a25c',
    darkSuccess: '#057341',
    warning: '#f39c12'
  }
  
  return {
    breakpoint: {
      thresholds: {
        xs: 0,
        sm: 425,
        md: 768 + 16, // 16px for the scrollbar
        lg: 1024 + 16 // 16px for the scrollbar
      }
    },
    rtl: store.getters.rtl,
    lang: {
      current: store.getters.locale,
      locales: { en, fa, az, ar, ckb },
    },
    defaultAssets: {
      font: {
        family: 'B Nazanin'
      }
    },
    icons: {
      iconfont: 'mdi', // default - only for display purposes
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
