/**
 * Provides access to Feathers Clients throughout the app
 */
export function useFeathers() {
  const { $api } = useNuxtApp()
  return { api: $api }
}
