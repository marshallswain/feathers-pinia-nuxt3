// Provides access to Feathers clients
export const useFeathers = () => {
  const { $api } = useNuxtApp()
  return { $api }
}
