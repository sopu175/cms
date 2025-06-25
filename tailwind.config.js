/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1240px',
      },
    },
  },
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  plugins: [],
}; 