import type { Params as FeathersParams, FeathersService, Id } from '@feathersjs/feathers'
import type { AnyData, MaybeRef, Params, Query } from './types'
import { getParams } from './utils'
import type { UseFindParams } from './use-find'
import { useFind } from './use-find'
import type { UseGetParams } from './use-get'
import { useGet } from './use-get'

interface VueServiceOptions {
  store: any
}

export class VueService<Svc extends FeathersService> {
  store

  constructor(public service: Svc, public options: VueServiceOptions) {
    this.store = options.store
  }

  /* service methods clone params */

  async find(_params?: MaybeRef<Params<Query>>) {
    const params = getParams(_params)
    const result = this.service.find(params as FeathersParams)
    return result
  }

  async findOne(_params?: MaybeRef<Params<Query>>) {
    const params = getParams(_params)
    const result = await this.service.find(params as FeathersParams)
    const item = (result.data || result)[0] || null
    return item
  }

  async count(_params?: MaybeRef<Params<Query>>) {
    const params = getParams(_params)
    const result = await this.service.find(params as FeathersParams)
    return result
  }

  async get(id: Id, _params?: MaybeRef<Params<Query>>) {
    const params = getParams(_params)
    const result = await this.service.get(id, params)
    return result
  }

  async create(data: AnyData) {
    const result = await this.service.create(data)
    return result
  }

  async patch(id: Id, data: AnyData, _params?: MaybeRef<Params<Query>>) {
    const params = getParams(_params)
    const result = await this.service.patch(id, data, params)
    return result
  }

  async remove(id: Id, _params?: MaybeRef<Params<Query>>) {
    const params = getParams(_params)
    const result = await this.service.remove(id, params)
    return result
  }

  /* store methods accept refs and don't copy params */

  findInStore(params?: MaybeRef<Params<Query>>) {
    const result = this.store.findInStore(params)
    return result
  }

  findOneInStore(params?: MaybeRef<Params<Query>>) {
    const result = this.store.findInStore(params)
    const item = result.data[0] || null
    return item
  }

  countInStore(params?: MaybeRef<Params<Query>>) {
    const result = this.store.countInStore(params)
    return result
  }

  getFromStore(id: Id, params?: MaybeRef<Params<Query>>) {
    const result = this.store.getFromStore(id, params)
    return result
  }

  createInStore(data: AnyData) {
    const stored = this.store.addToStore(data)
    return stored
  }

  patchInStore(id: Id, data: AnyData, _params?: MaybeRef<Params<Query>>) {
    const item = id != null ? this.getFromStore(id) : null
    const stored = this.store.addOrUpdate({ ...item, ...data })
    return stored
  }

  removeFromStore(id?: Id, params?: MaybeRef<Params<Query>>) {
    const item = id != null ? this.getFromStore(id) : null
    if (item)
      return this.store.removeFromStore(item)

    else if (id == null && unref(params)?.query)
      return this.store.removeByQuery(params)
  }

  /* hybrid methods */

  useFind(params: MaybeRef<UseFindParams>) {
    const _params = ref(params)
    Object.assign(_params.value, { store: this.store, service: this })
    return useFind(_params)
  }

  useGet(id: MaybeRef<Id | null>, params: MaybeRef<UseGetParams>) {
    const _id = ref(id)
    const _params = ref(params)
    Object.assign(_params.value, { store: this.store, service: this })
    return useGet(_id, _params)
  }

  useGetOnce(_id: MaybeRef<Id | null>, params: MaybeRef<UseGetParams>) {
    const _params: any = params
    Object.assign(_params.value || params, { store: this, immediate: false, onServer: true })
    const results = this.useGet(_id, _params as MaybeRef<any>)
    results.queryWhen(() => !results.data.value)
    results.get()
    return results
  }
}
