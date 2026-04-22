/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ultraBg: '#0b0a0a',
        ultraGold: "#c9a86b",
        ultraWarm: '#7d5a3a',
        },
      fontFamily: {
        serif: ["Playfair Display", "serif"]
      }
    },
  },
  plugins: [],
}

