import fs from "node:fs";
import path from "node:path";
import { defineNuxtConfig } from "@nuxt/bridge";
import GlobalsPolyfills from "@esbuild-plugins/node-globals-polyfill";
//import postcss from "./postcss.config.js";

export default defineNuxtConfig({
  ssr: false,
  target: "server",
  bridge: {
    vite: false,
    postcss8: true,
    typescript: true,
    autoImports: true,
    scriptSetup: true,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.VUE_APP_NAME,
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  router: {
    middleware: ["auth"],
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/main.css", "@/assets/main.sass"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    //{ src: '~/plugins/hcaptcha', mode: 'client' },
    { src: "~/plugins/ripple" },
    { src: "~/plugins/dropzone" },
    { src: "~/plugins/clickOutside" },
    { src: "~/plugins/i18n" },
    { src: "~/plugins/store-initiator" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxtjs/vuetify", ["@pinia/nuxt", { disableVuex: true }]],
  scriptSetup: {
    /* options */
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  env: {
    VUE_APP_I18N_LOCALE: process.env.VUE_APP_I18N_LOCALE,
    VUE_APP_I18N_FALLBACK_LOCALE: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
    VUE_APP_BASE_ROUTE: process.env.VUE_APP_BASE_ROUTE,
    VUE_APP_NAME: process.env.VUE_APP_NAME,
    VUE_APP_Host: process.env.VUE_APP_Host,
    VUE_WSS_Host: process.env.VUE_WSS_Host,
    WS_SERVER: process.env.WS_SERVER,
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    liveEdit: false,
    markdown: {
      tocDepth: 4,
    },
  },
  generate: {
    // async routes() {
    //   const { $content } = require('@nuxt/content')
    //   const dynamicRoutes = await $content({ deep: true }).only(['path']).fetch()
    //   return dynamicRoutes.map(myroute => myroute.path === '/index' ? '/blog' : '/blog' + myroute.path)
    // },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    //defaultAssets: false,
    treeShake: true,
    customVariables: ["~/assets/variables.scss"],
    optionsPath: "@/plugins/vuetify.options.js",
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  vite: {
    resolve: {
      alias: {
        /** browserify for @jbrowse/react-linear-genome-view */
        stream: "stream-browserify",
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: "globalThis",
        },
        // Enable esbuild polyfill plugins
        plugins: [
          GlobalsPolyfills({
            process: true,
            buffer: true,
          }),
        ],
      },
    },
  },
  hooks: {
    "build:done": (builder: any) => {
      // const indexFilePath = path.join(
      //   builder.nuxt.options.buildDir + "/dist/server",
      //   "index.mjs"
      // );
      // fs.writeFileSync(indexFilePath, "export './server.mjs';");
      const serverFilePath = path.join(
        builder.nuxt.options.buildDir + "/dist/server",
        "server.mjs"
      );
      fs.writeFileSync(serverFilePath, "export {};");
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      //postcssOptions: {
      plugins: {
        "postcss-import": {},
        "postcss-preset-env": {},
        "tailwindcss/nesting": {},
        tailwindcss: {},
        autoprefixer: {},
        ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
      },
      //},
    },
  },
});
