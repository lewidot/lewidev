/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["geist", "system-ui"],
        mono: ["monospace"],
      },
      colors: {
        grey: {
          50: "#f7f6f6",
          100: "#e6e2e1",
          200: "#cdc5c2",
          300: "#aca19c",
          400: "#8a7d77",
          500: "#70615c",
          600: "#584e49",
          700: "#48423d",
          800: "#3c3633",
          900: "#342f2d",
          950: "#1c1917",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
