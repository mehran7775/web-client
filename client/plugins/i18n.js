import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app }) => {
  app.i18n = new VueI18n({
    locale: 'fa',
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
    messages: {
      en: require('~/locales/en-US.json'),
      fa: require('~/locales/fa-IR.json')
    }
  })

  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }

    return `/${app.i18n.locale}/${link}`
  }
}
