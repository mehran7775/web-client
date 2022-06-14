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
    colors: {
      transparent: 'transparent',
      'white': '#ffffff',
      'gray' : '#828282',
      'black' : '#000000',
      'green' : '#4CAF50',
      'orange' : '#FFA500',
      'sky-blue' : '#89ABCD',
      'blue' : '#2547FF',
      'red' : '#FF3B30',
    }
  },
  plugins: [],
  prefix: "tw-",
  safelist: [
    {
      pattern: /^tw-text-\w+|^tw-m[-xytblr]-?[\d\w]+|^tw-[\w\d]+--active$/,
    },
  ],
};
