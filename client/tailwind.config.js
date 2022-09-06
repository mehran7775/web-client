/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
  ],
  theme: {
    borderRadius: {
      none: "0",
      xs: ".25",
      sm: ".3334rem",
      DEFAULT: ".5rem",
      lg: ".75rem",
      xl: "1rem",
      full: "9999px",
    },
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: "rgb(53, 84, 209)",
        secondary: "rgb(239, 57, 78)",
        info: "rgb(0, 156, 242)",
        success: "rgb(0, 189, 121)",
        warning: "rgb(255, 187, 70)",
        error: "rgb(255, 59, 48)",
        default: "rgb(224, 224, 224)",
        gray4: "rgb(189, 189, 189)",
        gray6: "rgb(229, 233, 250)",
        gray3: "rgb(130, 130, 130)",
        white: "rgb(255,255,255)",
        black: "rgb(0,0,0)",
        tooltip: "rgba(0, 0, 0, 0.85)"
      },
    },
  },
  important: true,
  plugins: [],
  prefix: "tw-",
  safelist: [
    {
      pattern:
        /^tw-(text-\w|.*-?opacity-\d+|m[-xytblr]-?[\d\w]+|[\w\d]+--active|underline)$/,
    },
  ],
};
