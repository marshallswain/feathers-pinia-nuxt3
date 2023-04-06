import { type FeathersInstance, useInstanceDefaults } from 'feathers-pinia'
import type { Users } from 'feathers-pinia-api'

export const setupUser = (data: FeathersInstance<Users>) => {
  const defaults = {
    email: '',
    password: '',
  }
  const withDefaults = useInstanceDefaults(defaults, data)

  return withDefaults
}
