/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "1": "#7C4DFF",
          "2": "#6B5ACD",
          "3": "#F9F9F9",
        },
      },
    },
  },
  plugins: [],
}
