import { acceptHMRUpdate, defineStore } from 'pinia'
import { useAuth } from '~~/feathers-pinia-3/use-auth'

// stores/auth.ts

export const useAuthStore = defineStore('auth', () => {
  const { api } = useFeathers()

  const auth = useAuth({ api, userServicePath: 'users' })

  return auth
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
