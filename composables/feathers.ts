/**
 * Provides access to Feathers Clients throughout the app
 */
export const useFeathers = () => {
  const { $api } = useNuxtApp()
  return { api: $api }
}
