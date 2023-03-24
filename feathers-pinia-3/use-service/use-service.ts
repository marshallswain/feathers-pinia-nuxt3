import type { Query } from '@feathersjs/feathers'

import { computed, unref } from 'vue-demi'
import type { MaybeRef } from '../types'
import type { AnyData, HandleEvents } from './types'
import { useServiceLocal } from './use-service-local-queries'

import { useServicePagination } from './use-service-pagination'
import { useServicePending } from './use-service-pending'
import { useServiceEventLocks } from './use-service-event-locks'
import { useAllStorageTypes } from './use-all-storage-types'

export interface UseServiceOptions<M extends AnyData> {
  idField: string
  whitelist?: string[]
  paramsForServer?: string[]
  skipRequestIfExists?: boolean
  ssr?: MaybeRef<boolean>
  handleEvents?: HandleEvents<M>
  debounceEventsTime?: number
  debounceEventsGuarantee?: boolean
}

const makeDefaultOptions = () => ({
  skipRequestIfExists: false,
})

export const useService = < M extends AnyData, Q extends Query >(_options: UseServiceOptions<M>) => {
  const options = Object.assign({}, makeDefaultOptions(), _options)
  const { idField, whitelist, paramsForServer } = options

  // pending state
  const pendingState = useServicePending()

  // storage
  const { itemStorage, tempStorage, cloneStorage, clone, commit, reset, removeFromStore, addToStore, clearAll }
    = useAllStorageTypes<M>({
      getIdField: (val: AnyData) => val[idField],
      afterClear: () => {
        pendingState.clearAllPending()
      },
    })

  const isSsr = computed(() => {
    const ssr = unref(options.ssr)
    return !!ssr
  })

  // pagination
  const { pagination, updatePaginationForQuery, unflagSsr } = useServicePagination({
    idField,
    isSsr,
  })

  // local data filtering
  const { findInStore, countInStore, getFromStore, removeByQuery } = useServiceLocal<M, Q>({
    idField,
    itemStorage,
    tempStorage,
    cloneStorage,
    removeFromStore,
    whitelist,
    paramsForServer,
  })

  // event locks
  const eventLocks = useServiceEventLocks()

  const store = {
    idField,
    whitelist,
    paramsForServer,
    isSsr,

    // items
    itemsById: itemStorage.byId,
    items: itemStorage.list,
    itemIds: itemStorage.ids,

    // temps
    tempsById: tempStorage.byId,
    temps: tempStorage.list,
    tempIds: tempStorage.ids,

    // clones
    clonesById: cloneStorage.byId,
    clones: cloneStorage.list,
    cloneIds: cloneStorage.ids,
    clone,
    commit,
    reset,

    // options
    pagination,
    updatePaginationForQuery,
    unflagSsr,

    // local queries
    findInStore,
    countInStore,
    getFromStore,
    removeFromStore,
    removeByQuery,
    addToStore,
    clearAll,

    ...pendingState,
    ...eventLocks,
  }

  return store
}
