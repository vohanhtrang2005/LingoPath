export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fffaf4',
          100: '#fff4e9',
          200: '#f9e8d8',
        },
        peach: {
          100: '#ffe6d6',
          200: '#ffd2b8',
          300: '#ffb894',
          400: '#ff9a6b',
          500: '#f97f4b',
          600: '#e46a38',
        },
        mint: {
          100: '#e3f6ec',
          200: '#c7ecd8',
          300: '#9fdcbe',
          400: '#6fc89f',
        },
        sky: {
          100: '#e6f1fb',
          200: '#cbe3f7',
          300: '#a4cdf0',
        },
        ink: {
          DEFAULT: '#4a4054',
          soft: '#857c92',
          faint: '#a9a2b4',
        },
      },
      fontFamily: {
        display: ['Quicksand', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(0,-18px,0) scale(1.04)' },
        },
        driftAlt: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1.02)' },
          '50%': { transform: 'translate3d(14px,12px,0) scale(0.98)' },
        },
      },
      animation: {
        drift: 'drift 11s ease-in-out infinite',
        'drift-alt': 'driftAlt 14s ease-in-out infinite',
      },
    },
  },
}
