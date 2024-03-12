// eslint.config.js
const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  typescript: {
    tsconfigPath: './tsconfig.json',
    parserOptions: {
      extraFileExtensions: ['.vue'],
    },
  },
  rules: {
    'node/prefer-global/process': 'off',
    'unused-imports/no-unused-vars': 'off',
    'vue/no-unused-refs': 'off',
  },
})
