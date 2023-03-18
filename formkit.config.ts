import { en, fr } from '@formkit/i18n'
import type { DefaultConfigOptions } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'
import { genesisIcons } from '@formkit/icons'
import daisy from './formkit.daisyui'
// import genesis from '@formkit/themes/tailwindcss/genesis'

const config: DefaultConfigOptions = {
  // theme: 'genesis',
  locales: { fr, en },
  locale: 'en',
  icons: {
    ...genesisIcons,
  },
  config: {
    classes: generateClasses(daisy),
  },
}

export default config
