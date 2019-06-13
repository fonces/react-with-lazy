import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { ComponentType, PureComponent } from 'react'
import createUseLazy, { CreateUseLazyOptions, UseLazy } from './create-use-lazy'

type PureProps<P extends LazyComponentProps> = Omit<P, keyof LazyComponentProps>

export type LazyComponentProps = {
  useLazy: UseLazy
}

export default function <P extends LazyComponentProps>(Component: ComponentType<P>, options?: CreateUseLazyOptions): ComponentType<PureProps<P>> {
  const displayName = `withLazy(${Component.displayName || Component.name})`

  class UseLazyComponent extends PureComponent<PureProps<P>> {
    private useLazy: UseLazy
    private displayName = displayName
    private WrappedComponent = Component

    constructor (props: PureProps<P>) {
      super(props)
      this.useLazy = createUseLazy(options)
    }

    public render() {
      return <Component useLazy={this.useLazy} {...this.props as P} />
    }
  }

  return hoistNonReactStatics(UseLazyComponent, Component) as ComponentType<PureProps<P>>
}
