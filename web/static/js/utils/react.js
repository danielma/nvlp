import React from 'react'
import ParseReact from 'parse-react'

export function observe(observes) {
  const getObserves = (typeof observes === 'function') ? observes : () => (observes)

  return function wrapWithConnect(WrappedComponent) {
    const name = WrappedComponent.displayName || WrappedComponent.name || 'Component'

    return React.createClass({
      displayName: `Observe(${name})`,

      mixins: [ParseReact.Mixin],

      observe(props, state) {
        return getObserves(props, state)
      },

      render() {
        const props = {
          loaded: this.pendingQueries().length === 0,
          ...this.data,
          ...this.props,
        }

        return <WrappedComponent {...props} />
      },
    })
  }
}

export default exports
