// Provides access to Feathers clients
import type { AnyData } from 'feathers-pinia'
import { type FeathersPiniaService } from 'feathers-pinia'

/**
 * Provides access to Feathers Clients throughout the app
 */
export const useFeathers = () => {
  const { $api } = useNuxtApp()
  return { api: $api }
}

/**
 * Returns a type-casted service to work with Feathers-Pinia. It currently does not type custom methods.
 * @param servicePath the path of the service
 */
export const useFeathersService = <Result extends AnyData, Query extends AnyData>(servicePath: string, clientAlias = 'api') => {
  const clients = useFeathers()
  const client = clients[clientAlias as keyof typeof clients]
  return client.service(servicePath as any) as unknown as FeathersPiniaService<Result, Query>
}

/**
 * Assures that a Model Function is only created once, no matter how many times you call the
 * composable function that contains it.
 * @param name the name of the Model
 * @param modelFn the model function
 */
export const useModel = <B extends () => any>(name: string, modelFn: B): ReturnType<B> => {
  const { $models } = useNuxtApp()
  if (!$models[name])
    $models[name] = modelFn()

  return $models[name]
}
