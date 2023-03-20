import { _ } from '@feathersjs/commons'
import stringify from 'fast-json-stable-stringify'
import isEqual from 'fast-deep-equal'
import fastCopy from 'fast-copy'
import { unref } from 'vue-demi'
import type { AnyData, AnyDataOrArray, DiffDefinition, MaybeRef, Paginated, Params, Query, QueryInfo } from './types'
import type { UseFindParams } from './use-find'

export function getQueryInfo(params: AnyData = {}, response: Partial<Paginated<any>> = {}): QueryInfo {
  const { query = {}, qid = 'default' } = params
  const $limit = response.limit !== undefined ? response.limit : query?.$limit
  const $skip = response.skip !== undefined ? response.skip : query?.$skip

  const pageParams = $limit !== undefined ? { $limit, $skip } : undefined
  const pageId = pageParams ? stringify(pageParams) : undefined

  const queryParams = _.omit(query, '$limit', '$skip')
  const queryId = stringify(queryParams)

  return {
    qid,
    query,
    queryId,
    queryParams,
    pageParams,
    pageId,
    response,
    isOutdated: undefined as boolean | undefined,
  }
}

export const hasOwn = (obj: AnyData, prop: string) => Object.prototype.hasOwnProperty.call(obj, prop)

/**
 *
 * @param data item or array of items
 * @returns object with { items[], isArray } where isArray is a boolean of if the data was an array.
 */
export function getArray<T>(data: T | T[]) {
  const isArray = Array.isArray(data)
  return { items: isArray ? data : [data], isArray }
}

export function pickDiff(obj: any, diffDef: DiffDefinition) {
  // If no diff definition was given, return the entire object.
  if (!diffDef)
    return obj

  // Normalize all types into an array and pick the keys
  const keys = typeof diffDef === 'string' ? [diffDef] : Array.isArray(diffDef) ? diffDef : Object.keys(diffDef || obj)
  const topLevelKeys = keys.map(key => key.toString().split('.')[0])
  return _.pick(obj, ...topLevelKeys)
}

export function diff(original: AnyData, clone: AnyData, diffDef: DiffDefinition) {
  const originalVal = pickDiff(original, diffDef)
  const cloneVal = pickDiff(clone, diffDef)

  // If diff was an object, merge the values into the cloneVal
  if (typeof diffDef !== 'string' && !Array.isArray(diffDef))
    Object.assign(cloneVal, diffDef)

  const areEqual = isEqual(originalVal, cloneVal)

  if (areEqual)
    return {}

  // Loop through clone, compare original value to clone value, if different add to diff object.
  const diff = Object.keys(cloneVal).reduce((diff: AnyData, key) => {
    if (!isEqual(original[key], cloneVal[key]))
      diff[key] = cloneVal[key]

    return diff
  }, {})

  return diff
}

/**
 * Defines all provided properties as non-enumerable and configurable
 */
export const defineProperties = <M extends AnyData, D extends AnyData>(data: M, properties: D) => {
  Object.keys(properties).forEach((key) => {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: true,
      value: properties[key],
    })
  })
  return data
}

/**
 * Restores tempIds to the records returned from the server. The tempIds need to be
 * temporarily put back in place in order to migrate the objects from the tempsById
 * into the itemsById. A shallow copy of the object
 *
 * Note when data is an array, it doesn't matter if the server
 * returns the items in the same order. It's only important that all of the correct
 * records are moved from tempsById to itemsById
 *
 * @param data item(s) before being passed to the server
 * @param responseData items(s) returned from the server
 */
export function restoreTempIds(data: AnyDataOrArray<any>, resData: AnyDataOrArray<any>, tempIdField = '__tempId') {
  const { items: sourceItems, isArray } = getArray(data)
  const { items: responseItems } = getArray(resData)

  responseItems.forEach((item: any, index: number) => {
    const tempId = sourceItems[index][tempIdField]
    if (tempId)
      defineProperties(item, { [tempIdField]: tempId })
  })

  return isArray ? responseItems : responseItems[0]
}

function stringifyIfObject(val: any): string | any {
  if (typeof val === 'object' && val != null)
    return val.toString()

  return val
}

/**
 * Get the id from a record in this order:
 *   1. the `idField`
 *   2. id
 *   3. _id
 * @param item
 * @param idField
 */
export function getId(item: any, idField: string) {
  if (!item)
    return
  if (idField && item[idField] !== undefined)
    return stringifyIfObject(item[idField as string])

  if (item.id !== undefined)
    return stringifyIfObject(item.id)

  if (item._id !== undefined)
    return stringifyIfObject(item._id)
}

/**
 * Assures params exist.
 * @param params existing params
 */
export function getParams(params?: MaybeRef<Params<Query>>): Params<Query> {
  if (!params)
    return {}

  return fastCopy(unref(params))
}

export const setOnRef = (obj: any, key: string, val: number) => {
  const _obj = obj.value || obj
  _obj[key] = val
}

export const computedAttr = (obj: any, key: string) =>
  computed({
    set: val => setOnRef(obj, key, val),
    get: () => unref(obj)[key],
  })

export function makeParamsWithoutPage(params: MaybeRef<UseFindParams>) {
  params = unref(params)
  const query = _.omit(params.query, '$limit', '$skip')
  const newParams = _.omit(params, 'query', 'store')
  return { ...newParams, query }
}

// Updates the _params with everything from _newParams except `$limit` and `$skip`
export function updateParamsExcludePage(_params: Ref<UseFindParams>, _newParams: MaybeRef<UseFindParams>) {
  _params.value.query = {
    ...unref(_newParams).query,
    ..._.pick(unref(_params).query, '$limit', '$skip'),
  }
}

export function getItemsFromQueryInfo(pagination: any, queryInfo: any, keyedById: any): any[] {
  const { queryId, pageId } = queryInfo
  const queryLevel = pagination[queryId]
  const pageLevel = queryLevel && queryLevel[pageId]
  const ids = pageLevel && pageLevel.ids

  if (ids && ids.length)
    return Object.values(_.pick(keyedById, ...ids))

  else
    return []
}

/**
 * A wrapper for findInStore that can return server-paginated data
 */
export const makeUseFindItems = (store: any, service: any, params: any) => {
  return computed(() => {
    const _params: any = unref(params)

    if (_params) {
      if (_params.paginate || _params.onServer) {
        const { defaultSkip, defaultLimit } = store.pagination
        const skip = _params.query.$skip || defaultSkip
        const limit = _params.query.$limit || defaultLimit
        const pagination = store.pagination[_params.qid || 'default'] || {}
        const response = (skip != null && limit != null) ? { limit, skip } : {}
        const queryInfo = getQueryInfo(_params, response)
        const items = getItemsFromQueryInfo(pagination, queryInfo, store.itemsById)
        return items
      }
      else {
        return service.findInStore(_params).data
      }
    }
    else {
      return []
    }
  })
}
