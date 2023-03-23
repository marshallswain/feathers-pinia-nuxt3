import type { Ref } from 'vue-demi'
import { computed } from 'vue-demi'

interface Options {
  limit: Ref<number>
  skip: Ref<number>
  total: Ref<number>
  request: any
  makeRequest: any
}

export const usePageData = (options: Options) => {
  const { limit, skip, total, request, makeRequest } = options
  /**
   * The number of pages available based on the results returned in the latestQuery prop.
   */
  const pageCount = computed(() => {
    if (total.value)
      return Math.ceil(total.value / limit.value)
    else return 1
  })

  // Uses Math.floor so we can't land on a non-integer page like 1.4
  const currentPage = computed({
    set(pageNumber: number) {
      if (pageNumber < 1)
        pageNumber = 1
      else if (pageNumber > pageCount.value)
        pageNumber = pageCount.value
      const newSkip = limit.value * Math.floor(pageNumber - 1)
      skip.value = newSkip
    },
    get() {
      return pageCount.value === 0 ? 0 : Math.floor(skip.value || 0 / limit.value + 1)
    },
  })

  const canPrev = computed(() => {
    return currentPage.value - 1 > 0
  })
  const canNext = computed(() => {
    return currentPage.value < pageCount.value
  })

  const awaitRequest = async () => {
    if (request.value)
      await request.value
  }
  const toStart = () => awaitRequest()
    .then(() => Promise.resolve((currentPage.value = 1)))
    .then(() => makeRequest())
  const toEnd = () => awaitRequest()
    .then(() => Promise.resolve((currentPage.value = pageCount.value)))
    .then(() => makeRequest())
  const toPage = (page: number) => awaitRequest()
    .then(() => Promise.resolve((currentPage.value = page)))
    .then(() => makeRequest())
  const next = () => awaitRequest()
    .then(() => Promise.resolve(currentPage.value++))
    .then(() => makeRequest())
  const prev = () => awaitRequest()
    .then(() => Promise.resolve(currentPage.value--))
    .then(() => makeRequest())

  return { pageCount, currentPage, canPrev, canNext, toStart, toEnd, toPage, next, prev }
}
