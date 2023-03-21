import type { Id, Query } from '@feathersjs/feathers'
import { computed, ref, unref, watch } from 'vue-demi'
import type { Ref } from 'vue-demi'
import type { MaybeRef, Params, UseFindGetDeps, UseGetParams } from './types'
import { convertData } from './utils/convert-data'

export const useGet = (_id: Ref<Id | null>, _params: Ref<UseGetParams>, deps: UseFindGetDeps) => {
  const { store, service } = deps

  // normalize args into refs
  const id = isRef(_id) ? _id : ref(_id)
  const params = isRef(_params) ? _params : ref(_params)

  /** ID & PARAMS **/
  const { immediate = true, watch: _watch = true, onServer = false } = params.value
  const isSsr = computed(() => store.isSsr)

  /** REQUEST STATE **/
  const isPending = ref(false)
  const hasBeenRequested = ref(false)
  const hasLoaded = ref(false)
  const error = ref<any>(null)
  const clearError = () => (error.value = null)

  /** STORE ITEMS **/
  const ids = ref<Id[]>([])
  const mostRecentId = computed(() => {
    return ids.value.length && ids.value[ids.value.length - 1]
  })
  const data = computed(() => {
    if (isPending.value && mostRecentId.value != null) {
      const result = store.getFromStore(mostRecentId.value, params as any) || null
      const converted = convertData(service, result)
      return converted
    }
    const result = store.getFromStore(id.value, params as any) || null
    const converted = convertData(service, result)
    return converted
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
    hasBeenRequested.value = true // never resets
    isPending.value = true
    hasLoaded.value = false
    error.value = null

    try {
      const response = await service.get(_id as Id, _params as any)

      // Keep a list of retrieved ids
      if (response && _id)
        ids.value.push(_id)

      hasLoaded.value = true

      return response
    }
    catch (err: any) {
      error.value = err
      throw err
    }
    finally {
      isPending.value = false
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
    isPending: computed(() => isPending.value), // ComputedRef<boolean>
    hasBeenRequested: computed(() => hasBeenRequested.value), // ComputedRef<boolean>
    hasLoaded: computed(() => hasLoaded.value), // ComputedRef<boolean>
    error: computed(() => error.value), // ComputedRef<any>
    clearError, // () => void
  }
}
