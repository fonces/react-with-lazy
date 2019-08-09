import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { ComponentType, PureComponent } from 'react'
import createUseLazy, { defaultOptions, CreateUseLazyOptions, UseLazy, Purge } from './create-use-lazy'

type PureProps<P extends LazyComponentProps> = Omit<P, keyof LazyComponentProps>

export type LazyComponentProps = {
  useLazy: UseLazy
  purge: Purge
}

export default function <P extends LazyComponentProps>(Component: ComponentType<P>, options: CreateUseLazyOptions = defaultOptions): ComponentType<PureProps<P>> {
  const displayName = `withLazy(${Component.displayName || Component.name})`

  class UseLazyComponent extends PureComponent<PureProps<P>> {
    private useLazy: UseLazy
    private purge: () => void
    private displayName = displayName
    private WrappedComponent = Component

    constructor (props: PureProps<P>) {
      super(props)
      const {
        useLazy,
        purge
      } = createUseLazy(options)
      this.useLazy = useLazy
      this.purge = purge
    }

    public componentWillUnmount() {
      if (!options!.perpetual) {
        this.purge()
      }
    }

    public render() {
      return <Component useLazy={this.useLazy} purge={this.purge} {...this.props as P} />
    }
  }

  return hoistNonReactStatics(UseLazyComponent, Component) as ComponentType<PureProps<P>>
}
