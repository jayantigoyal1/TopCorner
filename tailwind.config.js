/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1A1A2E', // A dark background color
        'dark-card': '#2C2C4A', // A slightly lighter dark for cards
        'primary-blue': '#007BFF', // A vibrant blue for CTAs
        'accent-orange': '#FF7F50', // An accent color
        'text-light': '#E0E0E0', // Light text
        'text-gray': '#A0A0A0', // Lighter gray text
      }
    },
  },
  plugins: [],
}