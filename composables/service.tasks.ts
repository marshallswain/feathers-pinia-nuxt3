import { Task } from '~/models/task'

export const useTasks = () => {
  const { $api, $defineStore, $pinia } = useNuxtApp()

  const servicePath = 'tasks'
  const useTasks = $defineStore({ servicePath, Model: Task })
  const taskStore = useTasks($pinia)

  $api.service(servicePath).hooks({})

  return {
    taskStore,
    Task: Task as typeof taskStore.Model,
  }
}
