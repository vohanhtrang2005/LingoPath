export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        cream: '#FFFBF7',
        peach: {
          50: '#FFF6EF',
          100: '#FFEEE2',
          200: '#FFE0CB',
          300: '#FFCDAC',
          400: '#FBAF83',
          500: '#F58A5B',
          600: '#E9713F',
        },
        mint: {
          200: '#C8EDDF',
          400: '#7FD1B9',
          500: '#5EC0A4',
        },
        ink: {
          400: '#9A9099',
          500: '#7C7280',
          700: '#585062',
          900: '#3F3A4A',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'cursive'],
        sans: ['Quicksand', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      boxShadow: {
        soft: '0 18px 40px -24px rgba(233, 113, 63, 0.35)',
        card: '0 24px 60px -30px rgba(233, 113, 63, 0.45)',
      },
    },
  },
}
