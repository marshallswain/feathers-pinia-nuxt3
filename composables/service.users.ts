import { User } from '~/models/user'

export const useUsers = () => {
  const { $api, $defineStore, $pinia } = useNuxtApp()

  const servicePath = 'users'
  const useUsers = $defineStore({ servicePath, Model: User })
  const userStore = useUsers($pinia)

  $api.service(servicePath).hooks({})

  return { User, userStore }
}
