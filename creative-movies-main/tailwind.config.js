/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#1D3557',
        'primary-light': '#457B9D',
        'primary-white': '#F1FAEE',
        'accent-red': '#E63946',
        'accent-green': '#2A9D8F',
      },
      fontFamily: {
        'primary': ['Roboto', 'sans-serif'],
        'secondary': ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
