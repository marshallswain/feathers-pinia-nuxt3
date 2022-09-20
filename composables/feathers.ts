/**
 * Provides access to the Feathers client by calling useFeathers(). For example:
 *
 * ```ts
 * const { $api } = useNuxtApp()
 * ```
 */
export const useFeathers = () => {
  const { $api } = useNuxtApp()
  return { $api }
}
