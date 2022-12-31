import type { User, UserData, UserQuery } from 'feathers-pinia-api'
import { type ModelInstance, useFeathersModel, useInstanceDefaults } from 'feathers-pinia'
import { api } from '../feathers'

const service = api.service('users')

const ModelFn = (data: ModelInstance<User>) => {
  const withDefaults = useInstanceDefaults(
    { name: '', email: '', password: '' },
    data,
  )
  return withDefaults
}
const Task = useFeathersModel<User, UserData, UserQuery, typeof ModelFn>(
  { name: 'Task', idField: '_id', service },
  ModelFn,
)
export class User extends BaseModel {
  _id?: string
  name = ''
  email = ''
  password = ''

  tasks?: Task[]
  _tasks?: AssociateFindUtils<Task>

  // Minimum required constructor
  constructor(data: Partial<User> = {}, options: Record<string, any> = {}) {
    super(data, options)
    this.init(data)
  }

  // optional for setting up data objects and/or associations
  static setupInstance(user: Partial<User>) {
    associateFind(user as any, 'tasks', {
      Model: Task,
      makeParams: () => ({ query: { userId: user._id } }),
      handleSetInstance(task: typeof Task) {
        (task as any).userId = this._id
      },
    })
  }
}
