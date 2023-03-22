import { _ } from '@feathersjs/commons'
import type { MaybeRef, UseFindParams } from '../types'
import { getQueryInfo } from '../utils'

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
  const _params: any = unref(params)

  if (_params) {
    if (_params.paginate || _params.paginateOnServer) {
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
      const result = service.findInStore(_params).data
      return result.value
    }
  }
  else {
    return []
  }
}
