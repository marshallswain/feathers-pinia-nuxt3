import type { AssociateFindUtils } from 'feathers-pinia'
import { BaseModel, associateFind } from 'feathers-pinia'
import type { Task } from './task'

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
    const { Task } = useTasks()

    associateFind(user as any, 'tasks', {
      Model: Task,
      makeParams: () => ({ query: { userId: user._id } }),
      handleSetInstance(task: typeof Task) {
        (task as any).userId = this._id
      },
    })
  }
}
