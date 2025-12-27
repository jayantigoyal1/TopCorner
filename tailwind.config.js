/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        'creme': '#f6f1eb',

        'dark-bg': '#1A1A2E',
        'dark-card': '#2C2C4A',
        'primary-blue': '#007BFF',
        'accent-orange': '#FF7F50',
        'text-light': '#E0E0E0',
        'text-gray': '#A0A0A0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}