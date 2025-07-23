/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["'Pretendard'", 'sans-serif'],
      },
      colors: {
        White: {
          0: '#ffffff',
          1: '#fdfdfd',
        },
        Yellow: {
          0: '#ffcc00',
          1: '#ffbc00',
        },
        Red: {
          0: '#d44d49',
          1: '#ff0000',
        },
        Brown: {
          0: '#ff6b35',
          1: '#d97706',
          2: '#85714d',
          3: '#60584c',
          4: '#545045',
        },
        Green: {
          0: '#69a06f',
          1: '#059669',
        },
        Blue: {
          0: '#0ea5e9',
        },
        Gray: {
          0: '#f5f6f8',
          1: '#e9ecef',
          2: '#d9d9d9',
          3: '#c7c7c7',
          4: '#9d9d9d',
          5: '#8e8e93',
          6: '#8a8d8f',
          7: '#6c757d',
          8: '#666666',
          9: '#f0f2f5',
          10: '#eeeeee',
        },
        Black: {
          0: '#20222b',
          1: '#1a1a1a',
          2: '#000000',
        },
        background: {
          DEFAULT: '#F3F4F7',
        },
      },
    },
  },
  plugins: [],
}
