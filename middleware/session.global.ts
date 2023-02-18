// middleware/session.global.ts
export default defineNuxtRouteMiddleware(async (to, _from) => {
  const auth = useAuthStore()

  await auth.getPromise()

  // Allow 404 page to show
  const router = useRouter()
  const allRoutes = router.getRoutes()
  if (!allRoutes.map(r => r.path).includes(to.path))
    return

  // if user is not logged in, redirect to '/' when not navigating to a public page.
  const publicRoutes = ['/', '/login']
  if (!auth.user) {
    if (!publicRoutes.includes(to.path))
      return navigateTo('/')
  }
})
