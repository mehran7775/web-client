import fa from 'vuetify/es5/locale/fa'
import en from 'vuetify/es5/locale/en'
import '@mdi/font/css/materialdesignicons.min.css'
//import '@/assets/icons/ada/style.css'
import '@/assets/icons/icosax/style.css'
import '@/assets/icons/lotfisax/style.css'
import { useAsrTrader } from '~~/composables'

export default function ({  }) {
  const ltheme = {
    default: "#828282",
    secondary: '#EF394E',
    primary: '#3554D1',
    accent: '#82B1FF',
    error: '#FF3B30',
    info: '#009CF2',
    success: '#00BD79',
    warning: '#FFBB46',
    gray4: "#BDBDBD",
    "defualt-bg": "#F9FAFE"
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
  //const app = useAsrTrader($pinia)

  return {
    rtl: true,
    lang: {
      current: 'fa',
      locales: { en, fa },
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
