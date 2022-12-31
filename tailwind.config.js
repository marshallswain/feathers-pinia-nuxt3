import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  darkMode: 'class',
  plugins: [require('daisyui')],
  content: ['node_modules/daisy-ui-kit/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: defaultTheme.colors.green,
      },
    },
  },
}
