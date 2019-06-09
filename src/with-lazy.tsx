import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { ComponentType, ReactElement } from 'react'
import createUseLazy, { CreateUseLazyOptions, UseLazy } from './create-use-lazy'

type PureProps<P extends LazyComponentProps> = Omit<P, keyof LazyComponentProps>

export type LazyComponentProps = {
  useLazy: UseLazy
}

export default function <P extends LazyComponentProps>(Component: ComponentType<P>, options?: CreateUseLazyOptions) {
  const useLazy = createUseLazy(options)
  const displayName = `withLazy(${Component.displayName || Component.name})`
  const UseLazyComponent = (props: PureProps<P>): ReactElement => <Component useLazy={useLazy} {...props as P} />

  UseLazyComponent.displayName = displayName
  UseLazyComponent.WrappedComponent = Component

  return hoistNonReactStatics(UseLazyComponent, Component)
}
