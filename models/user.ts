import { type ModelInstance, feathersPiniaHooks, useFeathersModel, useInstanceDefaults } from 'feathers-pinia'
import type { Users, UsersData, UsersQuery } from 'feathers-pinia-api'

export const useUsersConfig = () => {
  const { pinia, idField, whitelist } = useFeathersPiniaConfig()
  const servicePath = 'users'
  const service = useFeathersService<Users, UsersQuery>(servicePath)
  const name = 'Users'

  return { pinia, idField, whitelist, servicePath, service, name }
}

export const useUserModel = () => {
  const { idField, service, name } = useUsersConfig()

  const Model = useModel(name, () => {
    const modelFn = (data: ModelInstance<Users>) => {
      const defaults = {
        email: '',
        password: '',
      }
      const withDefaults = useInstanceDefaults(defaults, data)

      // add tasks to each user
      // const Task = useTaskModel()
      // const withTasks = associateFind(withDefaults, 'tasks', {
      //   Model: Task,
      //   makeParams: data => ({ query: { userId: data._id } }),
      //   handleSetInstance(task) {
      //     task.userId = data._id
      //   },
      // })
      return withDefaults
    }
    return useFeathersModel<Users, UsersData, UsersQuery, typeof modelFn>(
      { name, idField, service },
      modelFn,
    )
  })

  onModelReady(name, () => {
    service.hooks({ around: { all: [...feathersPiniaHooks(Model)] } })
  })
  connectModel(name, () => Model, useUserStore)

  return Model
}
