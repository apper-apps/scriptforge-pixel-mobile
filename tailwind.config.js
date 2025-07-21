/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Bebas Neue', 'cursive'],
        'mono': ['Courier Prime', 'monospace'],
      },
      colors: {
        primary: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1a1a1a',
        },
        secondary: {
          50: '#fefcf9',
          100: '#fcf6ed',
          200: '#f9ead4',
          300: '#f5deb3',
          400: '#f0d084',
          500: '#f5e6d3',
          600: '#d4c3a8',
          700: '#b3a186',
          800: '#927f64',
          900: '#6d5f4b',
        },
        accent: {
          50: '#fff4f0',
          100: '#ffe5da',
          200: '#ffcab0',
          300: '#ffa67b',
          400: '#ff7a44',
          500: '#ff6b35',
          600: '#e8501a',
          700: '#c23c12',
          800: '#9b3315',
          900: '#7c2e15',
        },
        surface: '#2d2d2d',
        background: '#0f0f0f',
        paper: '#f5e6d3',
      },
      boxShadow: {
        'elevation': '0 4px 8px rgba(0, 0, 0, 0.3)',
        'elevation-hover': '0 6px 16px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}