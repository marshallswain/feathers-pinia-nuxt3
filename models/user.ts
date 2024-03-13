import { type ServiceInstance, useInstanceDefaults } from 'feathers-pinia'
import type { Users } from 'feathers-pinia-api'

export function setupUser(data: ServiceInstance<Users>) {
  const defaults = {
    email: '',
    password: '',
  }
  const withDefaults = useInstanceDefaults(defaults, data)

  return withDefaults
}
