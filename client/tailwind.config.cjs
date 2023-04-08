/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F5385D',
        primary_light: '#eb284f',
      },
      maxHeight: {
        '100': '34rem',
        '128': '54rem',
        'fmax': '300rem',
      },
    },
  },
  plugins: [],
}
