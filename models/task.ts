import { type ModelInstance } from 'feathers-pinia'
import type { Tasks } from 'feathers-pinia-api'

export const setupTask = (data: ModelInstance<Tasks>) => {
  const defaults = {
    description: '',
    isComplete: false,
  }
  const withDefaults = useInstanceDefaults(defaults, data)

  // add user to each task
  // const User = useUserModel() as any
  // const withUser = associateGet(withDefaults, 'user', {
  //   Model: User,
  //   getId: (data: ModelInstance<Tasks>) => data.userId as string,
  // })
  return withDefaults
}
