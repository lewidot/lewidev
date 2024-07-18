/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["geist", "system-ui"],
        mono: ["geist-mono", "ui-monospace"],
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
        "one-half-light": {
          base: "#383a42",
          white: "#fafafa",
          grey: "#a0a1a7",
          purple: "#a626a4",
          orange: "#e45649",
          blue: "#0184bc",
          yellow: "#c18401",
          green: "#50a14f",
        },
        "one-half-dark": {
          base: "#1f1f1f",
          white: "#dcdfe4",
          grey: "#5c6370",
          purple: "#c678dd",
          orange: "#e06c75",
          blue: "#61afef",
          yellow: "#e5c07b",
          green: "#98c379",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

// grey #6e7781
// red #cf222e
// blue #0550ae
// base #24292f
// brown #953800
// dark blue #0a3069
// purple #8250df
