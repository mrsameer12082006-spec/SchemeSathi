/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        paper: "#EDF0F4",
        ink: "#14213D",
        line: "#D5DAE1",
        saffron: "#F2A20C",
        leaf: "#1B7F4B",
        night: "#0F1624",
        nightcard: "#18223A",
        nightline: "#2A3752",
        mist: "#EEF1F6",
      },
      fontFamily: {
        heading: ["'Bricolage Grotesque'", "sans-serif"],
        sans: ["'Noto Sans'", "'Noto Sans Devanagari'", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1rem',
        'xl': '0.75rem',
      }
    },
  },
  plugins: [],
};
