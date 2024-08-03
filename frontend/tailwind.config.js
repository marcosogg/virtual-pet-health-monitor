/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#63b3ed',
          DEFAULT: '#3182ce',
          dark: '#2c5282',
        },
        secondary: {
          light: '#9ae6b4',
          DEFAULT: '#48bb78',
          dark: '#2f855a',
        },
        accent: {
          light: '#faf089',
          DEFAULT: '#ecc94b',
          dark: '#d69e2e',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
    },
  },
  plugins: [],
}
