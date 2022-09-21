import { Task } from '~/models/task'

export const useTasks = () => {
  const { $api, $defineStore, $pinia } = useNuxtApp()

  const servicePath = 'tasks'
  const useStore = $defineStore({
    servicePath,
    Model: Task,
    state() {
      return {}
    },
    getters: {} as any,
    actions: {} as any,
  })
  const store = useStore($pinia)

  $api.service(servicePath).hooks({})

  return {
    taskStore: store,
    Task: Task as typeof store.Model,
  }
}
