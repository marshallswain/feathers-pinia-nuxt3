import { reactive } from 'vue-demi'
import ObjectID from 'isomorphic-mongo-objectid'
import type { AnyData, CloneOptions } from '../use-service'
import { defineProperties } from '../utils/define-properties'
import type { BaseModelData, BaseModelInstanceProps, ModelInstanceData } from './types'

interface UseModelInstanceOptions {
  servicePath: string
  store: any
}

export const useModelInstance = <M extends AnyData>(data: ModelInstanceData<M>, options: UseModelInstanceOptions) => {
  const { servicePath, store } = options
  const __isClone = data.__isClone || false

  // The `__Model` property was added by the `useModelBase` wrapper in `use-model-base.ts`.
  const _data = data as M

  // instance.__isTemp
  Object.defineProperty(_data, '__isTemp', {
    configurable: true,
    enumerable: false,
    get() {
      return this[this.__idField] == null
    },
  })

  // ad BaseModel properties
  const asBaseModel = defineProperties(_data, {
    __servicePath: servicePath,
    __isClone,
    __idField: store.idField,
    __tempId: (data[store.idField] == null && data.__tempId == null) ? new ObjectID().toString() : (data.__tempId || undefined),
    clone(this: M, data: Partial<M> = {}, options: CloneOptions = {}) {
      return store.clone(this, data, options)
    },
    commit(this: M, data: Partial<M> = {}) {
      return store.commit(this, data, options)
    },
    reset(this: M, data: Partial<M> = {}) {
      return store.reset(this, data, options)
    },
    addToStore(this: M) {
      return store.addToStore(this)
    },
    removeFromStore(this: M) {
      return store.removeFromStore(this)
    },
  }) as M & BaseModelData & BaseModelInstanceProps<M>

  // make the data reactive, but ignore the proxy "Reactive" wrapper type to keep internal types simpler.
  const newData = reactive(asBaseModel) as typeof asBaseModel
  return newData
}
