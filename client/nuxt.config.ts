export default defineNuxtConfig({
  ssr: false,
  css: [
    "@/assets/css/main.css",
    "@/assets/icons/icosax/style.css",
    "@/assets/icons/lotfisax/style.css",
    "@/assets/icons/ada/style.css",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  modules: ["@nuxt/content"],
  content: {
    // https://content.nuxtjs.org/api/configuration
  },
  components: {
    global: true,
    dirs: ["~/components"],
  },
  runtimeConfig: {
    public: {
      VUE_APP_I18N_LOCALE: process.env.VUE_APP_I18N_LOCALE,
      VUE_APP_I18N_FALLBACK_LOCALE: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
      VUE_APP_BASE_ROUTE: process.env.VUE_APP_BASE_ROUTE,
      VUE_APP_NAME: process.env.VUE_APP_NAME,
      VUE_APP_Host: process.env.VUE_APP_Host,
      VUE_WSS_Host: process.env.VUE_WSS_Host,
    },
  },
  buildModules: ["@pinia/nuxt"],
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          "postcss-import": {},
          "postcss-preset-env": {},
          "tailwindcss/nesting": {},
          tailwindcss: {},
          autoprefixer: {},
          ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
        },
      },
    },
  },
  vite: {
    plugins: [],
  },
});
