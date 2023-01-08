# Nuxt 3 App with Feathers-Pinia

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

In order to use this repo, you need a working FeathersJS server.  You can find one at the [feathers-pinia-api](https:github.com/marshallswain/feathers-pinia-api) repo.


# Configuration

- [Feathers-Pinia](https://v1.feathers-pinia.pages.dev) with two example services.
- [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- [UnoCSS](https://github.com/unocss/unocss)
- [Iconify with UnoCSS](https://github.com/unocss/unocss/tree/main/packages/preset-icons/)

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install [feathers-pinia-api](https://github.com/marshallswain/feathers-pinia-api)
3. Install your dependencies

    ```
    cd path/to/feathers-pinia-nuxt3
    npm install
    ```
    
    If you get a <i>404 'feathers-pinia-api-0.0.0.tgz' is not in this registry</i> error, run <i>npm run bundle:client</i> in your feathers-pinia-api install and make sure it's running when you do this install.
    
    If you get a <i>integrity checksum failed</i> error, try deleting your package-lock.json file.
    
4. Run the app

    ```
    npm run dev
    ```
    
5. Visit the web site

    ```
    http://localhost:3000

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.
