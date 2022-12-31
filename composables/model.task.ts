import { defineStore } from 'pinia'
import { type ModelInstance, associateGet, feathersPiniaHooks, useFeathersModel, useInstanceDefaults, useService } from 'feathers-pinia'
import type { Tasks, TasksData, TasksQuery } from 'feathers-pinia-api'

const servicePath = 'tasks'
const name = 'Task'
const idField = '_id'

export const useTaskModel = () => {
  const { $pinia } = useNuxtApp()
  const service = useFeathersService<Tasks, TasksQuery>(servicePath)

  const Model = useModel(name, () => {
    const modelFn = (data: ModelInstance<Tasks>) => {
      const defaults = {
        description: '',
        isComplete: false,
      }
      const withDefaults = useInstanceDefaults(defaults, data)

      // add user to each task
      const { User } = useUserModel() as any
      const withUser = associateGet(withDefaults, 'user', {
        Model: User,
        getId: data => data.userId as string,
      })
      return withUser
    }
    const Model = useFeathersModel<Tasks, TasksData, TasksQuery, typeof modelFn>(
      { name, idField, service },
      modelFn,
    )
    service.hooks({ around: { all: [...feathersPiniaHooks(Model)] } })
    return Model
  })

  // set store on Model
  const useStore = defineStore(servicePath, () => {
    const utils = useService({ service, idField })
    return { ...utils }
  })
  const store = useStore($pinia)
  Model.setStore(store)

  return Model
}
