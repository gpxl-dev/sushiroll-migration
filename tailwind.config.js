const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        serif: ["BioRhyme", ...defaultTheme.fontFamily.serif],
        mono: ["Space Mono", ...defaultTheme.fontFamily.serif],
      },
      dropShadow: {
        hard: "2px 2px 0px rgba(0, 0, 0, 0.9)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
