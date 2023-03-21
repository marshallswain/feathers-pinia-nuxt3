import { type ModelInstance, useInstanceDefaults } from 'feathers-pinia'
import type { Users } from 'feathers-pinia-api'

export const setupUser = (data: ModelInstance<Users>) => {
  const defaults = {
    email: '',
    password: '',
  }
  const withDefaults = useInstanceDefaults(defaults, data)

  return withDefaults
}
