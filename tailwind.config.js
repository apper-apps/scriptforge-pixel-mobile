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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
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
        surface: '#f8f9fa',
        background: '#ffffff',
        paper: '#2d2d2d',
      },
      boxShadow: {
        'elevation': '0 4px 8px rgba(0, 0, 0, 0.3)',
        'elevation-hover': '0 6px 16px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}