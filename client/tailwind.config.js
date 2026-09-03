/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#f7f5fd',
          100: '#efeafc',
          200: '#dcd2f7',
          300: '#c2b0f0',
          400: '#a688e6',
          500: '#8c62db',
          600: '#7647c4',
          700: '#6238a3',
          800: '#513085',
          900: '#432a6c',
        },
        skyblue: {
          50: '#f2f9ff',
          100: '#e3f2ff',
          200: '#c2e3ff',
          300: '#93cdff',
          400: '#5cb0ff',
          500: '#308fff',
          600: '#1c70e6',
          700: '#1a58b4',
          800: '#1c4a8f',
          900: '#1c3f73',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(120, 90, 200, 0.25)',
      },
    },
  },
  plugins: [],
};
