import deepEqual from 'deep-equal'
import { useEffect } from 'react'

type PromiseType<T> = Promise<T> | (() => Promise<T>)

interface PromiseCache<T, I> {
  serial: string
  inits?: I
  promise?: Promise<void | T>
  error?: any
  response?: T
}

export type UseLazy = <T = any, I = any>(promise: PromiseType<T>, inits?: I) => T

export interface CreateUseLazyOptions {
  perpetual: boolean
}

const resolvePromise = <T>(promise: PromiseType<T>): Promise<T> => {
  if (typeof promise === 'function') {
    return promise()
  }
  return promise
}

const defaultOptions: CreateUseLazyOptions = {
  perpetual: false
}

export default (() => {

  const globalCacheMap = new Map<symbol, PromiseCache<any, any>[]>()

  return (options?: Partial<CreateUseLazyOptions>) => {

    const symbol: unique symbol = Symbol()
    globalCacheMap.set(symbol, [])
    options = Object.assign({}, defaultOptions, options)

    return <T = any, I = any>(promise: PromiseType<T>, inits?: I): T => {

      useEffect(() => () => {
        if (!options!.perpetual) {
          globalCacheMap.set(symbol, [])
        }
      }, [])

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
        promise: resolvePromise<T>(promise)
          .then((response: T): void => {
            createCache.response = response
          })
          .catch((error: Error): void => {
            createCache.error = error
          })
      }

      const cacheIndex = caches.findIndex(findCache => (
        findCache.serial === serial && (
          options!.perpetual && 
          deepEqual(inits, findCache.inits)
        )
      ))
      if (-1 < cacheIndex) {
        caches[cacheIndex] = createCache
      } else {
        caches.push(createCache)
      }
      globalCacheMap.set(symbol, caches)

      throw createCache.promise
    }
  }
})()