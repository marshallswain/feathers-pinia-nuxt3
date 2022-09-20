/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const nuxt = useNuxtApp()

  console.log('in session middleware')

  // if (to.params.id === '1')
  //   return abortNavigation()

  // return navigateTo(to)
})
