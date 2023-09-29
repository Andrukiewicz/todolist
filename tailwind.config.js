/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      dropShadow: {
        bold: "1px 1px 1px #000",
      },
      boxShadow: {
        highlight:
          "inset 0 1px 0 0 hsl(0deg 0% 100% / 10%), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
    },
  },
  variants: {
    extend: {
      width: ["group-hover"],
      height: ["group-hover"],
    },
  },
  plugins: [],
}
