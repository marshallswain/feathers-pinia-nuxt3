/* eslint-disable no-console */
import type { HookContext, NextFunction } from '@feathersjs/feathers'
import type { AnyData } from '../types'

export const makeModelInstances = () => {
  return async (context: HookContext, next: NextFunction) => {
    const ModelFn = context.service.ModelFn

    if (next)
      await next()

    if (ModelFn) {
      console.log('found model', context.path, context.method)
      if (Array.isArray(context.result?.data))
        context.result.data = context.result.data.map((i: AnyData) => ModelFn(i))

      else if (Array.isArray(context.result))
        context.result = context.result.map((i: AnyData) => ModelFn(i))

      else
        context.result = ModelFn(context.result)
    }
    else {
      console.log('no model', context.path, context.method)
    }
  }
}
