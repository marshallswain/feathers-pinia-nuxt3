// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    // '@nuxt/devtools',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    'daisy-ui-kit/nuxt',
    'nuxt-feathers-pinia',
    '@formkit/nuxt',
  ],
  imports: {
    dirs: [
      'stores',
      'models',
    ],
  },
  colorMode: {
    preference: 'system',
    // fallback: 'light',
    // classPrefix: '',
    dataValue: 'theme',
    classSuffix: '',
  },
  typescript: {
    shim: false,
  },
  experimental: {
    reactivityTransform: true,
  },
})
