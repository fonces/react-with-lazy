import withLazy, { LazyComponentProps as LCP } from './src'
import createUseLazy, { UseLazy as UL, CreateUseLazyOptions as CULO } from './src/create-use-lazy'

export {
  withLazy as default,
  createUseLazy
}
export as namespace ReactUseLazy

export type UseLazy = UL
export type LazyComponentProps = LCP
export type CreateUseLazyOptions = CULO
