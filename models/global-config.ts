/**
 * Returns a global configuration object for Feathers-Pinia
 */
export const useFeathersPiniaConfig = () => {
  const { $pinia } = useNuxtApp()
  return {
    $pinia,
    idField: '_id',
    whitelist: ['$regex'],
  }
}
