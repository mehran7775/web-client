module.exports = {
  important: true,
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.ts",
  ],
  theme: {
    extend: {
      fontSize: {
        xl: "1.334rem",
      },
    },
  },
  plugins: [],
  prefix: "tw-",
  safelist: [
    {
      pattern: /^tw-text-\w+|^tw-m[-xytblr]-?[\d\w]+|^tw-[\w\d]+--active$/,
    },
  ],
};
