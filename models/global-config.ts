/**
 * Returns a global configuration object for Feathers-Pinia
 */
export function useFeathersPiniaConfig() {
  const { $pinia: pinia } = useNuxtApp()
  return {
    pinia,
    idField: '_id',
    whitelist: ['$regex'],
  }
}
