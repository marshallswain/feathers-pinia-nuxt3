/* eslint-disable @typescript-eslint/no-use-before-define */
import { computed, isReadonly, ref, unref, watch } from 'vue-demi'
import type { Ref } from 'vue-demi'
import { _ } from '@feathersjs/commons'
import isEqual from 'fast-deep-equal'
import type { MaybeRef, Paginated, Params, Query, QueryInfo, UseFindGetDeps, UseFindParams } from './types'
import type { AnyData } from './use-service'
import { usePageData } from './utils-pagination'
import { getQueryInfo, hasOwn } from './utils'
import { computedAttr, makeParamsWithoutPage, makeUseFindItems, updateParamsExcludePage } from './utils/use-find-get'
import { convertData } from './utils/convert-data'

export const useFind = (_params: Ref<UseFindParams>, deps: UseFindGetDeps) => {
  const { store, service } = deps

  // If the _params are a computed, store them so we can watch them later.
  let _computedParams: any
  if (isReadonly(_params))
    _computedParams = _params

  // turn computed params into writable ref
  const params = isRef(_params) ? _params : ref(_params)

  /** PARAMS **/
  const qid = computedAttr(params.value, 'qid')
  if (!qid.value) // Set qid to default if it was not passed in the params.
    qid.value = 'default'
  const { immediate = true, watch: _watch = false } = params.value
  const query = computedAttr(params, 'query')
  const limit = computedAttr(query, '$limit')
  const skip = computedAttr(query, '$skip')
  const paramsWithPagination = computed(() => {
    return {
      ...params.value,
      $limit: limit.value,
      $skip: skip.value,
    }
  })
  const paramsWithoutPagination = computed(() => {
    const queryShallowCopy = { ...(params.value.query || {}) }
    const query = _.omit(queryShallowCopy, '$limit', '$skip')
    return { ...params.value, query }
  })
  const onServer = !!params.value.onServer

  /** REQUEST STATE **/
  const isPending = ref(false)
  const haveBeenRequested = ref(false)
  const haveLoaded = ref(false)
  const error = ref<any>(null)
  const clearError = () => (error.value = null)

  /** STORE ITEMS **/
  const data = computed(() => {
    if (isPending.value && latestQuery.value && onServer) {
      const { pageParams, queryParams } = latestQuery.value as any
      const params = { query: { ...pageParams, ...queryParams }, onServer: true }
      return makeUseFindItems(store, service, params).value
    }
    return makeUseFindItems(store, service, paramsWithPagination).value
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
    delete queryInfo.response
    delete queryInfo.isOutdated

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
    return queries.value[queries.value.length - 1] || null
  })
  const previousQuery = computed(() => {
    return queries.value[queries.value.length - 2] || null
  })

  /** PAGINATION DATA **/
  const storeCount = computed(() => service.countInStore(paramsWithoutPagination.value as any))
  const total = computed(() => {
    if (onServer)
      return (latestQuery.value as any)?.response.total
    else return storeCount.value
  })
  const pageData = usePageData(limit, skip, total)
  const { pageCount, currentPage, canPrev, canNext } = pageData

  /** PAGINATION UTILS **/
  const awaitRequest = async () => {
    if (request.value)
      await request.value
  }
  const toStart = () => awaitRequest()
    .then(() => pageData.toStart())
    .then(() => makeRequest())
  const toEnd = () => awaitRequest()
    .then(() => pageData.toEnd())
    .then(() => makeRequest())
  const toPage = (page: number) => awaitRequest()
    .then(() => pageData.toPage(page))
    .then(() => makeRequest())
  const next = () => awaitRequest()
    .then(() => pageData.next())
    .then(() => makeRequest())
  const prev = () => awaitRequest()
    .then(() => pageData.prev())
    .then(() => makeRequest())

  /** SERVER FETCHING **/
  const requestCount = ref(0)
  const request = ref<Promise<Paginated<AnyData>> | null>(null)
  const find = async (params: MaybeRef<Params<Query>> = paramsWithPagination.value) => {
    const _params = unref(params)
    // if queryWhen is falsey, return early with dummy data
    if (!queryWhenFn())
      return Promise.resolve({ data: [] as AnyData[] } as Paginated<AnyData>)

    requestCount.value++
    haveBeenRequested.value = true // never resets
    isPending.value = true
    haveLoaded.value = false
    error.value = null

    try {
      const response = await service.find(_params as any)

      // Set limit and skip if missing
      if ((hasOwn(response, 'limit') && limit.value == null) || skip.value == null) {
        const res = response
        if (limit.value === undefined)
          limit.value = res.limit
        if (skip.value === undefined)
          skip.value = res.skip
      }
      // Keep the two most-recent queries
      if (response.total) {
        const res = response
        const queryInfo = getQueryInfo(paramsWithPagination, res)
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

  /** QUERY WATCHING **/
  // Keep track if no $limit or $skip was passed so we don't fetch twice when they are set from the response
  let initWithLimitOrSkip = false
  // provide access to the request from inside the watcher
  if (limit.value || skip.value)
    initWithLimitOrSkip = true

  const makeRequest = async (_params?: Params<Query>) => {
    if (!onServer)
      return

    // Don't make a second request if no limit or skip were provided
    if (requestCount.value === 1 && !initWithLimitOrSkip && !_computedParams) {
      initWithLimitOrSkip = true
      return
    }
    request.value = find((_params || params) as any) as any
    await request.value
  }

  if (onServer) {
    // When a read-only computed was provided, watch the params
    if (_computedParams) {
      let _cachedWatchedParams: UseFindParams
      // Run `find` whenever they change.
      const updateParams = (_params: UseFindParams) => {
        // If params are null, do nothing
        if (_params == null)
          return

        // If params don't match the cached ones, update internal params and send request.
        const newParams = makeParamsWithoutPage(_params)
        if (!isEqual(_.omit(newParams, 'store'), _.omit(_cachedWatchedParams, 'store'))) {
          _cachedWatchedParams = newParams
          updateParamsExcludePage(params as any, newParams)
          makeRequest()
        }
      }
      watch(_computedParams, updateParams, { immediate })
    }
    // Watch the reactive params
    else if (_watch && !_computedParams) {
      watch(paramsWithoutPagination, () => makeRequest(), { immediate })
    }
    // If immediate is provided without limit or skip, manually run immediately
    else if ((!_watch && immediate) || (immediate && (limit.value == null || limit.value == null))) {
      makeRequest()
    }
  }

  return {
    params, // Ref<FindClassParams>
    onServer, // boolean
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
