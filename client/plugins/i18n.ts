import { Plugin } from "@nuxt/types";
import Vue from "vue";
import VueI18n from "vue-i18n";
import { useAsrTrader } from "~~/composables";
import { computed } from "#app";

Vue.use(VueI18n);

export default <Plugin>function ({ app, $pinia }) {
  const appManager = useAsrTrader($pinia);
  app.i18n = new VueI18n({
    locale: appManager.locale,
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
    messages: {
      en: require("~/locales/en-US.json"),
      fa: require("~/locales/fa-IR.json"),
    },
  });
};
