import type { Tasks } from 'feathers-pinia-api'
import type { ServiceInstance } from 'feathers-pinia'

export function setupTask(data: ServiceInstance<Tasks>): Record<string, any> {
  const defaults = {
    description: '',
    isComplete: false,
  }
  const withDefaults = useInstanceDefaults(defaults, data)

  // add user to each task
  // const User = useUserModel() as any
  // const withUser = associateGet(withDefaults, 'user', {
  //   Model: User,
  //   getId: (data: ServiceInstance<Tasks>) => data.userId as string,
  // })
  return withDefaults
}
