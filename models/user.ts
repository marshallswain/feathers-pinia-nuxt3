import { type FeathersInstance, useInstanceDefaults } from '~~/feathers-pinia-3'
import type { Users } from 'feathers-pinia-api'

export const setupUser = (data: FeathersInstance<Users>) => {
  const defaults = {
    email: '',
    password: '',
  }
  const withDefaults = useInstanceDefaults(defaults, data)

  return withDefaults
}
