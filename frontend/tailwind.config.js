/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#229ED9', // Telegram ko'k rangi
          dark: '#1c7fae',
        },
      },
    },
  },
  plugins: [],
};
