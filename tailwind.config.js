const { addDynamicIconSelectors } = require('@iconify/tailwind')
const FormKitVariants = require('@formkit/themes/tailwindcss')

export default {
  darkMode: 'class',
  plugins: [
    require('daisyui'),
    addDynamicIconSelectors(),
    FormKitVariants,
  ],
  content: [
    './src/**/*.{html,js,vue}',
    'node_modules/daisy-ui-kit/**/*.{vue,js}',
    './node_modules/@formkit/themes/dist/tailwindcss/genesis/index.cjs',
    './formkit.daisyui.ts',
  ],
  theme: {
    extend: {
      colors: {
      },
    },
  },
}
