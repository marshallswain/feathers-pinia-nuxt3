import { defineStore } from 'pinia'
import { type ModelInstance, associateFind, feathersPiniaHooks, useFeathersModel, useInstanceDefaults, useService } from 'feathers-pinia'
import type { User, UserData, UserQuery } from 'feathers-pinia-api'

const servicePath = 'users'
const name = 'User'
const idField = '_id'

export const useUserModel = () => {
  const { $pinia } = useNuxtApp()
  const service = useFeathersService<User, UserQuery>(servicePath)

  // Model
  const Model = useModel(name, () => {
    const modelFn = (data: ModelInstance<User>) => {
      const defaults = {
        email: '',
        password: '',
      }
      const withDefaults = useInstanceDefaults(defaults, data)

      // add tasks to each user
      const Task = useTaskModel()
      const withTasks = associateFind(withDefaults, 'tasks', {
        Model: Task,
        makeParams: data => ({ query: { userId: data._id } }),
        handleSetInstance(task) {
          task.userId = data._id
        },
      })
      return withTasks
    }
    const Model = useFeathersModel<User, UserData, UserQuery, typeof modelFn>(
      { name, idField, service },
      modelFn,
    )
    service.hooks({ around: { all: [...feathersPiniaHooks(Model)] } })
    return Model
  })

  // Store
  const useStore = defineStore(servicePath, () => {
    const utils = useService({ service, idField, Model })
    return { ...utils }
  })
  const store = useStore($pinia)
  Model.setStore(store)

  return Model
}
