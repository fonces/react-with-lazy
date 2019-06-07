import withLazy, { LazyComponentProps as _LazyComponentProps } from './src/with-lazy'
import createUseLazy, { UseLazy as _UseLazy, CreateUseLazyOptions as _CreateUseLazyOptions } from './src/create-use-lazy'

export {
  withLazy as default,
  createUseLazy
}

export type UseLazy = _UseLazy
export type LazyComponentProps = _LazyComponentProps
export type CreateUseLazyOptions = _CreateUseLazyOptions
