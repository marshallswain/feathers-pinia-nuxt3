import { defineStore } from 'pinia'
import { useAuth } from 'feathers-pinia'

export const useAuthStore = defineStore('auth', () => {
  const { api } = useFeathers()
  const User = useUserModel()

  const utils = useAuth({ api, userStore: User.store })

  return { ...utils }
})
