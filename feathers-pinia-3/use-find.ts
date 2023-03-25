/* eslint-disable @typescript-eslint/no-use-before-define */
import { computed, ref, unref } from 'vue-demi'
import type { Ref } from 'vue-demi'
import { _ } from '@feathersjs/commons'
import stringify from 'fast-json-stable-stringify'
import type { Paginated, Params, Query, QueryInfo, UseFindGetDeps, UseFindPage, UseFindParams } from './types'
import type { AnyData } from './use-service'
import { getQueryInfo } from './utils'
import { itemsFromPagination } from './utils/use-find-get'
import { convertData } from './utils/convert-data'
import { usePageData } from './utils-pagination'

export const useFind = (params: ComputedRef<UseFindParams>, deps: UseFindGetDeps, page?: UseFindPage) => {
  const { store, service } = deps

  /** PARAMS **/
  const { debounce = 100, immediate = true, watch: _watch = false } = params.value
  const qid = computed(() => params.value.qid || 'default')
  const limit = (page?.limit || ref(params.value.query?.$limit || 10))
  const skip = (page?.skip || ref(params.value.query?.$skip || 0))

  const paramsWithPagination = computed(() => {
    const query = params.value.query || {}
    return {
      ...params.value,
      query: {
        ...query,
        $limit: limit.value,
        $skip: skip.value,
      },
    }
  })
  const paramsWithoutPagination = computed(() => {
    const queryShallowCopy = { ...(params.value.query || {}) }
    const query = _.omit(queryShallowCopy, '$limit', '$skip')
    return { ...params.value, query }
  })
  const paginateOnServer = !!params.value.paginateOnServer

  /** REQUEST STATE **/
  const isPending = ref(false)
  const haveBeenRequested = ref(false)
  const haveLoaded = ref(false)
  const error = ref<any>(null)
  const clearError = () => (error.value = null)

  /** Cached Params **/
  const cachedParams = ref(params.value)
  function updateCachedParams() {
    if (stringify(cachedParams.value) !== stringify(paramsWithPagination.value))
      cachedParams.value = paramsWithPagination.value
  }

  /** STORE ITEMS **/
  const data = computed(() => {
    if (paginateOnServer) {
      const values = itemsFromPagination(store, service, cachedParams.value)
      return values
    }
    else {
      const result = service.findInStore(params.value).data.value
      return result.filter((i: any) => i)
    }
  })
  const allData = computed(() => {
    if (currentQuery.value == null)
      return []

    // Pull server results for each page of data
    const pageKeys = Object.keys(_.omit(currentQuery.value?.queryState, 'total', 'queryParams'))
    const pages = Object.values(_.pick(currentQuery.value?.queryState, ...pageKeys))
    // remove possible duplicates (page data can be different as you browse between pages and new items are added)
    const ids = pages.reduce((allIds, page) => {
      page.ids.forEach((id: number | string) => {
        if (!allIds.includes(id))
          allIds.push(id)
      })
      return allIds
    }, [])
    const matchingItemsById = _.pick(store.itemsById, ...ids)
    const result = Object.values(matchingItemsById)
    const converted = convertData(service, result)
    return converted
  })

  /** QUERY WHEN **/
  let queryWhenFn = () => true
  const queryWhen = (_queryWhenFn: () => boolean) => {
    queryWhenFn = _queryWhenFn
  }
  // returns cached query data from the store BEFORE the request is sent.
  const currentQuery = computed(() => {
    const qidState: any = store.pagination[qid.value]
    if (!qidState)
      return null
    const queryInfo = getQueryInfo(params.value)

    const queryState = qidState[queryInfo.queryId]
    if (!queryState)
      return null

    const { total } = queryState
    const pageState = queryState[queryInfo.pageId as string]
    if (!pageState)
      return null

    const { ids, queriedAt } = pageState
    const result = Object.values(_.pick(store.itemsById, ...ids))
    const items = convertData(service, result)
    const info = { ...queryInfo, ids, items, total, queriedAt, queryState }
    return info || null
  })

  /** QUERIES **/
  const queries: Ref<QueryInfo[]> = ref([]) // query info after the response returns
  const latestQuery = computed(() => {
    if (paginateOnServer)
      return store.pagination[qid.value]?.mostRecent || null

    return queries.value[queries.value.length - 1] || null
  })
  const previousQuery = computed(() => {
    return queries.value[queries.value.length - 2] || null
  })

  /** SERVER FETCHING **/
  const requestCount = ref(0)
  const request = ref<Promise<Paginated<AnyData>> | null>(null)

  async function find(__params?: Params<Query>) {
    // When `paginateOnServer` is enabled, the computed params will always be used, __params ignored.
    const ___params = unref(paginateOnServer ? paramsWithPagination : __params)

    // if queryWhen is falsey, return early with dummy data
    if (!queryWhenFn())
      return Promise.resolve({ data: [] as AnyData[] } as Paginated<AnyData>)

    try {
      const response = await service.find(___params as any)

      // Keep the two most-recent queries
      if (response.total) {
        const queryInfo = getQueryInfo(paramsWithPagination.value)
        queries.value.push(queryInfo)
        if (queries.value.length > 2)
          queries.value.shift()
      }
      haveLoaded.value = true

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
  const findDebounced = useDebounceFn<any>(find, debounce)

  /** Query Gatekeeping **/
  const makeRequest = async (_params?: Params<Query>) => {
    // If params are null, do nothing
    if (_params === null)
      return

    if (!paginateOnServer)
      return

    if (currentQuery.value)
      updateCachedParams()

    // if the query passes queryWhen, setup the state before the debounce timer starts.
    if (queryWhenFn()) {
      requestCount.value++
      haveBeenRequested.value = true // never resets
      isPending.value = true
      haveLoaded.value = false
      error.value = null
    }

    request.value = findDebounced()
    await request.value

    // cache the params to update the computed `data``
    updateCachedParams()
  }

  /** Pagination Data **/
  const total = computed(() => {
    if (paginateOnServer) {
      return latestQuery.value?.total || 0
    }
    else {
      const count = service.countInStore(paramsWithoutPagination.value)
      return count.value
    }
  })
  const pageData = usePageData({ limit, skip, total, request })
  const { pageCount, currentPage, canPrev, canNext, toStart, toEnd, toPage, next, prev } = pageData

  /** Query Watching **/
  if (paginateOnServer) {
    watch(paramsWithPagination, (val: UseFindParams) => {
      makeRequest(val)
    }, { immediate: false })

    if (immediate)
      makeRequest(paramsWithPagination.value)

    // watch realtime events and re-query
    // TODO: only re-query when relevant
    service.on('created', () => {
      makeRequest()
    })
    service.on('patched', () => {
      makeRequest()
    })

    // if the current list had an item removed, re-query.
    service.on('removed', () => {
      // const id = item[service.store.idField]
      // const currentIds = data.value.map((i: any) => i[service.store.idField])
      // if (currentIds.includes(id))
      makeRequest()
    })
  }

  return {
    params, // Ref<FindClassParams>
    paginateOnServer, // boolean
    isSsr: computed(() => {
      return store.isSsr
    }), // ComputedRef<boolean>
    qid, // WritableComputedRef<string>

    // Data
    data, // ComputedRef<M[]>
    allData, // ComputedRef<M[]>
    total, // ComputedRef<number>
    limit, // Ref<number>
    skip, // Ref<number>

    // Queries
    currentQuery, // ComputedRef<CurrentQuery<M> | null>
    latestQuery, // ComputedRef<QueryInfo | null>
    previousQuery, // ComputedRef<QueryInfo | null>

    // Requests & Watching
    find, // FindFn<M>
    request, // Ref<Promise<Paginated<M>>>
    requestCount, // Ref<number>
    queryWhen, // (queryWhenFn: () => boolean) => void

    // Request State
    isPending: computed(() => isPending.value), // ComputedRef<boolean>
    haveBeenRequested: computed(() => haveBeenRequested.value), // ComputedRef<boolean>
    haveLoaded: computed(() => haveLoaded.value), // ComputedRef<boolean>
    error: computed(() => error.value), // ComputedRef<any>
    clearError, // () => void

    // Pagination Utils
    pageCount, // Ref<number>
    currentPage, // Ref<number>
    canPrev, // ComputedRef<boolean>
    canNext, // ComputedRef<boolean>
    next, // () => Promise<void>
    prev, // () => Promise<void>
    toStart, // () => Promise<void>
    toEnd, // () => Promise<void>
    toPage, // (page: number) => Promise<void>
  }
}
