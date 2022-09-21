import { User } from '~/models/user'

export const useUsers = () => {
  const { $api, $defineStore, $pinia } = useNuxtApp()

  const servicePath = 'users'
  const useStore = $defineStore({
    servicePath,
    Model: User,
    state() {
      return {}
    },
    getters: {} as any,
    actions: {} as any,
  })
  const store = useStore($pinia)

  $api.service(servicePath).hooks({})

  return {
    userStore: store,
    User: User as typeof store.Model,
  }
}
