// tailwind.config.js
import { DEFAULT_THEME } from "@mantine/core";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./button-colors.txt",
    "./card-classes.txt",
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "../templates/**/*.html",
  ],
safelist: [
  {
    pattern: /(bg|text|border)-(red|blue|yellow|green|lime|emerald|cyan|purple|pink|orange|amber|gray)-(100|200|300|400|500|600|700|800|900)/,
  },
],
  theme: {
    extend: {
      colors: {
        ...DEFAULT_THEME.colors, // Mantine palettes, keyed by name
        primary: DEFAULT_THEME.colors[DEFAULT_THEME.primaryColor]
      },
    },
  },
  plugins: [],
};
