import type { Tasks } from 'feathers-pinia-api'
import type { FeathersInstance } from '~~/feathers-pinia-3'

export function setupTask(data: FeathersInstance<Tasks>): Record<string, any> {
  const defaults = {
    description: '',
    isComplete: false,
  }
  const withDefaults = useInstanceDefaults(defaults, data)

  // add user to each task
  // const User = useUserModel() as any
  // const withUser = associateGet(withDefaults, 'user', {
  //   Model: User,
  //   getId: (data: FeathersInstance<Tasks>) => data.userId as string,
  // })
  return withDefaults
}
