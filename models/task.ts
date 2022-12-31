import type { Id } from '@feathersjs/feathers/lib'
import { BaseModel, associateGet } from 'feathers-pinia'
import { User } from './user'

export class Task extends BaseModel {
  _id?: string
  description = ''
  isCompleted = false
  userId = ''

  user?: User

  // Minimum required constructor
  constructor(data: Partial<Task> = {}, options: Record<string, any> = {}) {
    super(data, options)
    this.init(data)
  }

  // optional for setting up data objects and/or associations
  static setupInstance(task: Partial<Task>) {
    associateGet(task as any, 'user', {
      Model: User,
      getId: () => task.userId as Id,
    })
  }
}
