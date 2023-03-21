import type { HookContext, NextFunction } from '@feathersjs/feathers'
import type { AnyData } from '../types'

export const makeModelInstances = () => {
  return async (context: HookContext, next: NextFunction) => {
    const modelFn = context.service.new

    if (next)
      await next()

    if (modelFn) {
      if (Array.isArray(context.result?.data))
        context.result.data = context.result.data.map((i: AnyData) => modelFn(i))

      else if (Array.isArray(context.result))
        context.result = context.result.map((i: AnyData) => modelFn(i))

      else
        context.result = modelFn(context.result)
    }
  }
}
