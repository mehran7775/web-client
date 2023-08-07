import { defineNuxtPlugin } from "#app";
import { createI18n } from "vue-i18n";
import { useAsrTrader } from "@/composables";

import fa from "@/locales/fa-IR.json";
import en from "@/locales/en-US.json";

export default defineNuxtPlugin(({ $pinia, vueApp }) => {
  const app = useAsrTrader($pinia);
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: app.locale,
    allowComposition: true, // you need to specify that!
    messages: {
      "fa-IR": fa,
      "en-US": en,
    },
  });
  vueApp.use(i18n);
});
