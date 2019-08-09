import deepEqual from 'deep-equal'

type PromiseType<T> = Promise<T> | (() => Promise<T>)
type PromiseCache<T, I> = {
  serial: string
  inits?: I
  promise?: Promise<void | T>
  error?: any
  response?: T
}

export type UseLazy = <T = any, I = any>(promise: PromiseType<T>, inits?: I) => T
export type Purge = () => void
export type CreateUseLazyOptions = {
  perpetual: boolean
}

export const defaultOptions: CreateUseLazyOptions = {
  perpetual: false
}

const wrapPromise = <T>(promise: PromiseType<T>): () => Promise<T> => {
  if (promise instanceof Promise) {
    return () => promise
  }
  return promise
}

export default (() => {

  const globalCacheMap = new Map<symbol, PromiseCache<any, any>[]>()

  return (options: Partial<CreateUseLazyOptions> = defaultOptions) => {

    const symbol: unique symbol = Symbol()
    globalCacheMap.set(symbol, [])
    options = { ...defaultOptions, ...options }

    const useLazy = <T = any, I = any>(promise: PromiseType<T>, inits?: I): T => {

      promise = wrapPromise(promise)
      const serial = promise.toString()
      const caches = globalCacheMap.get(symbol)!

      for (const cache of caches) {
        if (
          serial === cache.serial &&
          deepEqual(inits, cache.inits)
        ) {
          if (Object.prototype.hasOwnProperty.call(cache, 'response')) {
            return cache.response
          }
          if (Object.prototype.hasOwnProperty.call(cache, 'error')) {
            throw cache.error
          }
          throw cache.promise
        }
      }

      const createCache: PromiseCache<T, I> = {
        serial,
        inits,
        promise: promise()
          .then((response: T): void => {
            createCache.response = response
          })
          .catch((error: Error): void => {
            createCache.error = error
          })
      }

      const cacheIndex = caches.findIndex(findCache => {
        if (findCache.serial !== serial) {
          return false
        }
        if (options!.perpetual) {
          if (!deepEqual(inits, findCache.inits)) {
            return false
          }
        }
        return true
      })

      if (-1 < cacheIndex) {
        caches[cacheIndex] = createCache
      } else {
        caches.push(createCache)
      }
      globalCacheMap.set(symbol, caches)

      throw createCache.promise
    }

    const purge = () => {
      globalCacheMap.set(symbol, [])
    }

    return {
      useLazy,
      purge,
    }
  }
})()