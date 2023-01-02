import { type ModelInstance } from 'feathers-pinia'
import type { Tasks, TasksData, TasksQuery } from 'feathers-pinia-api'

export const useTasksConfig = () => {
  const { $pinia, idField, whitelist } = useFeathersPiniaConfig()
  const servicePath = 'tasks'
  const service = useFeathersService<Tasks, TasksQuery>(servicePath)
  const name = 'Task'

  return { $pinia, idField, whitelist, servicePath, service, name }
}

export const useTaskModel = () => {
  const { name, idField, service } = useTasksConfig()

  const Model = useModel(name, () => {
    const modelFn = (data: ModelInstance<Tasks>) => {
      const defaults = {
        description: '',
        isComplete: false,
      }
      const withDefaults = useInstanceDefaults(defaults, data)

      // add user to each task
      const User = useUserModel() as any
      const withUser = associateGet(withDefaults, 'user', {
        Model: User,
        getId: (data: ModelInstance<Tasks>) => data.userId as string,
      })
      return withUser
    }
    return useFeathersModel<Tasks, TasksData, TasksQuery, typeof modelFn>(
      { name, idField, service },
      modelFn,
    )
  })

  onModelReady(name, () => {
    service.hooks({ around: { all: [...feathersPiniaHooks(Model)] } })
  })
  connectModel(name, () => Model, useTaskStore)

  return Model
}
