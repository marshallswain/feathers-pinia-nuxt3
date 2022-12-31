/**
 * Make sure reAuthenticate finishes before we begin rendering.
 */
export default defineNuxtPlugin(async (_nuxtApp) => {
  const auth = useAuthStore()
  await auth.reAuthenticate()
})
