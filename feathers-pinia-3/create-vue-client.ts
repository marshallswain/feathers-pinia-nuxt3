import type { Application, FeathersService } from '@feathersjs/feathers'
import { feathers } from '@feathersjs/feathers'
import { defineStore } from 'pinia'
import { VueService } from './create-vue-service'
import type { HandleEvents } from './use-service'
import { useService } from './use-service'
import { feathersPiniaHooks } from './hooks'
import type { AnyData } from './types'

interface ServiceOptions {
  idField?: string
  whitelist?: string[]
  paramsForServer?: string[]
  skipRequestIfExists?: boolean
  handleEvents?: HandleEvents<AnyData>
  debounceEventsTime?: number
  debounceEventsGuarantee?: boolean
  setup?: <D extends AnyData>(data: D) => D
}

interface CreateVueClientOptions extends ServiceOptions {
  idField: string
  pinia: any
  ssr?: boolean
  services?: Record<string, ServiceOptions>
}

type CreateVueServiceTypes<T extends { [key: string]: FeathersService }> = {
  [Key in keyof T]: VueService<T[Key]>
}

export function createVueClient<Client extends Application>(client: Client, options: CreateVueClientOptions): Application<CreateVueServiceTypes<Client['services']>> {
  const vueApp = feathers()
  vueApp.defaultService = function (location: string) {
    const { idField, whitelist = [], paramsForServer = [], ssr, handleEvents, debounceEventsTime, debounceEventsGuarantee } = options
    const serviceOptions = options.services?.[location]

    // create pinia store
    const storeName = `service:${location}`
    const useStore = defineStore(storeName, () => {
      const utils = useService({
        idField: serviceOptions?.idField || idField,
        whitelist: (serviceOptions?.whitelist || []).concat(whitelist),
        paramsForServer: (serviceOptions?.paramsForServer || []).concat(paramsForServer),
        handleEvents: serviceOptions?.handleEvents || handleEvents,
        debounceEventsTime: serviceOptions?.debounceEventsTime || debounceEventsTime,
        debounceEventsGuarantee: serviceOptions?.debounceEventsGuarantee || debounceEventsGuarantee,
        ssr,
      })
      return utils
    })

    const vueService = new VueService(client.service(location), {
      store: useStore(options.pinia),
      setupFn: serviceOptions?.setup,
      servicePath: location,
    })
    return vueService
  }

  // register hooks on every service
  vueApp.mixins.push((service: any) => {
    service.hooks({
      around: feathersPiniaHooks(),
    })
  })

  Object.defineProperties(vueApp, {
    authentication: { get() { return client.authentication } },
    authenticate: { get() { return client.authenticate } },
    reAuthenticate: { get() { return client.reAuthenticate } },
    logout: { get() { return client.logout } },
  })

  return vueApp
}
