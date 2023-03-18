import defaultTheme from 'tailwindcss/defaultTheme'
const { addDynamicIconSelectors } = require('@iconify/tailwind')

export default {
  darkMode: 'class',
  plugins: [
    require('daisyui'),
    addDynamicIconSelectors(),
  ],
  content: ['node_modules/daisy-ui-kit/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: defaultTheme.colors.green,
      },
    },
  },
}
