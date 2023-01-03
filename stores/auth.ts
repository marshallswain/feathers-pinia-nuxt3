import { defineStore } from 'pinia'
import { useAuth } from 'feathers-pinia'

export const useAuthStore = defineStore('auth', () => {
  const { api } = useFeathers()
  const userStore = useUserStore()

  const utils = useAuth({ api, userStore })

  return { ...utils }
})
