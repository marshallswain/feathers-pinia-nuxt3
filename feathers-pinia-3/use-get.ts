import type { Id, Query } from '@feathersjs/feathers'
import { computed, isReadonly, isRef, ref, unref, watch } from 'vue-demi'
import type { Ref } from 'vue-demi'
import type { MaybeRef, Params } from './types'

export interface UseGetParams extends Params<Query> {
  query?: Query
  onServer?: boolean
  immediate?: boolean
  watch?: boolean
  store: any
}

export const useGet = (_id: Ref<Id | null>, _params: Ref<UseGetParams>) => {
  const store = unref(_params).store
  const id = (isRef(_id) ? (isReadonly(_id) ? ref(_id.value) : _id) : ref(_id)) as Ref<Id>
  const params = isRef(_params) ? (isReadonly(_params) ? ref(_params.value) : _params) : ref(_params)

  // Remove the store from the provided params
  delete (params.value as any).store

  /** ID & PARAMS **/
  const { immediate = true, watch: _watch = true, onServer = false } = params.value as any
  const isSsr = computed(() => store.isSsr)

  /** REQUEST STATE **/
  const _isPending = ref(false)
  const _hasBeenRequested = ref(false)
  const _hasLoaded = ref(false)
  const _error = ref<any>(null)
  const isPending = computed(() => _isPending.value)
  const hasBeenRequested = computed(() => _hasBeenRequested.value)
  const hasLoaded = computed(() => _hasLoaded.value)
  const error = computed(() => _error.value)
  const clearError = () => (_error.value = null)

  /** STORE ITEMS **/
  const ids = ref<Id[]>([])
  const mostRecentId = computed(() => {
    return ids.value.length && ids.value[ids.value.length - 1]
  })
  const data = computed(() => {
    if (isPending.value && mostRecentId.value != null)
      return store.getFromStore(mostRecentId.value, params as any) || null

    return store.getFromStore(id.value, params as any) || null
  })
  const getFromStore = store.getFromStore

  /** QUERY WHEN **/
  let queryWhenFn = () => true
  const queryWhen = (_queryWhenFn: () => boolean) => {
    queryWhenFn = _queryWhenFn
  }

  /** SERVER FETCHING **/
  const requestCount = ref(0)
  const request = ref(null) as any
  const get = async (__id?: MaybeRef<Id>, params?: MaybeRef<Params<Query>>) => {
    const _id = unref(__id || id)
    const _params = unref(params)

    if (!queryWhenFn())
      return

    if (_id == null)
      throw new Error('id is required for feathers-pinia get requests')

    requestCount.value++
    _hasBeenRequested.value = true // never resets
    _isPending.value = true
    _hasLoaded.value = false
    _error.value = null

    try {
      const response = await store.get(_id as Id, _params as any)

      // Keep a list of retrieved ids
      if (response && _id)
        ids.value.push(_id)

      _hasLoaded.value = true

      return response
    }
    catch (err: any) {
      _error.value = err
      throw err
    }
    finally {
      _isPending.value = false
    }
  }

  const makeRequest = async (id: Id, params: MaybeRef<Params<Query>>) => {
    if (!id)
      return
    request.value = get(id, params)
    await request.value
  }

  // Watch the id
  if (onServer && _watch) {
    watch(
      id,
      async () => {
        await makeRequest(id as any, params)
      },
      { immediate },
    )
  }

  return {
    id, // Ref<Id | null>
    params, // Ref<GetClassParams>
    isSsr, // ComputedRef<boolean>

    // Data
    data, // ComputedRef<M | null>
    ids, // Ref<Id[]>
    getFromStore, // (id: Id | null, params: Params<Query>) => M | undefined

    // Requests & Watching
    get, // GetFn<M>
    request, // Ref<Promise<M | undefined>>
    requestCount, // Ref<number>
    queryWhen, // (queryWhenFn: () => boolean) => void

    // Request State
    isPending, // Ref<boolean>
    hasBeenRequested, // Ref<boolean>
    hasLoaded, // Ref<boolean>
    error, // ComputedRef<any>
    clearError, // () => void
  }
}
