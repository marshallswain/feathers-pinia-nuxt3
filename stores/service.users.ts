import { defineStore } from 'pinia'
import { useService } from 'feathers-pinia'

export const useUserStore = () => {
  const { $pinia, idField, whitelist, servicePath, service, name } = useUsersConfig()

  // Store
  const useStore = defineStore(servicePath, () => {
    const utils = useService({ service, idField, whitelist })
    return { ...utils, test: true }
  })
  const store = useStore($pinia)

  connectModel(name, useUserModel, () => store)

  return store
}
