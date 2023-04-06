import { acceptHMRUpdate, defineStore } from 'pinia'
import { useAuth } from 'feathers-pinia'

// stores/auth.ts

export const useAuthStore = defineStore('auth', () => {
  const { api } = useFeathers()

  const auth = useAuth({ api, servicePath: 'users' })

  return auth
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore as any, import.meta.hot))
