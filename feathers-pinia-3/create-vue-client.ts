import type { Application, FeathersService } from '@feathersjs/feathers'
import { feathers } from '@feathersjs/feathers'
import { defineStore } from 'pinia'
import { VueService } from './create-vue-service'
import { useService } from './use-service'
import { feathersPiniaHooks } from './hooks'

interface CreateVueClientOptions {
  idField: string
  pinia: any
  ssr?: boolean
  whitelist?: string[]
  paramsForServer?: string[]
}

type CreateVueServiceTypes<T extends { [key: string]: FeathersService }> = {
  [Key in keyof T]: VueService<T[Key]>
}

export function createVueClient<Client extends Application>(client: Client, options: CreateVueClientOptions): Application<CreateVueServiceTypes<Client['services']>> {
  const vueApp = feathers()
  vueApp.defaultService = function (location: string) {
    // create pinia store
    const { idField, whitelist, paramsForServer, ssr } = options
    const storeName = `service:${location}`
    const useStore = defineStore(storeName, () => {
      const utils = useService({ idField, whitelist, paramsForServer, ssr })
      return utils
    })
    const serviceOptions = { ...options, store: useStore(options.pinia) }

    const vueService = new VueService(client.service(location), serviceOptions)
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
