import createUseLazy, { UseLazy, CreateUseLazyOptions } from './create-use-lazy'
import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { ComponentType, ReactElement } from 'react'

type Omit<T, K extends string | number | symbol> = { [P in Exclude<keyof T, K>]: T[P]; }
type PureProps<P extends LazyComponentProps> = Omit<P, keyof LazyComponentProps>

export type UseLazy = UseLazy
export type CreateUseLazyOptions = CreateUseLazyOptions
export type LazyComponentProps = {
  useLazy: UseLazy
}

function withLazy<P extends LazyComponentProps>(Component: ComponentType<PureProps<P>>, options?: CreateUseLazyOptions) {
  const useLazy = createUseLazy(options)
  const displayName = `withLazy(${Component.displayName || Component.name})`
  const UseLazyComponent = (props: PureProps<P>): ReactElement => (
    <Component {...props} useLazy={useLazy} />
  )

  UseLazyComponent.displayName = displayName
  UseLazyComponent.WrappedComponent = Component

  return hoistNonReactStatics(UseLazyComponent, Component)
}

export {
  withLazy as default,
  createUseLazy
}
