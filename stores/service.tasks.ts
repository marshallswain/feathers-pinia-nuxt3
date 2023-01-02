import { defineStore } from 'pinia'
import { useService } from 'feathers-pinia'

export const useTaskStore = () => {
  const { $pinia, idField, whitelist, servicePath, service, name } = useTasksConfig()

  const useStore = defineStore(servicePath, () => {
    const utils = useService({ service, idField, whitelist })
    return { ...utils }
  })
  const store = useStore($pinia)

  connectModel(name, useTaskModel, () => store)

  return store
}
