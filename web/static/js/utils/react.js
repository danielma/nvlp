import { parseJSON } from "utils"
import React from "react"
import R from "ramda"

export function observe(observes) {
  const getObserves = (typeof observes === "function") ? observes : () => (observes)

  return function wrapWithConnect(WrappedComponent) {
    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"

    return class extends React.Component {
      static displayName = `Observe(${name})`;

      static initialState = {
        queries: {},
        pendingQueryCount: 0,
      };

      componentWillMount() {
        const componentObserves = getObserves(this.props, this.state)

        this.setState({
          queries: R.map(R.always([]), componentObserves),
          pendingQueryCount: R.length(R.keys(componentObserves)),
        })

        R.keys(componentObserves).forEach((key) => {
          componentObserves[key]().then(parseJSON).then((data) => {
            this.setState({
              queries: { ...this.state.queries, [key]: data.data },
              pendingQueryCount: this.state.pendingQueryCount - 1,
            })
          })
        })
      }

      render() {
        const props = {
          loaded: this.state.pendingQueryCount === 0,
          ...this.state.queries,
          ...this.props,
        }

        return <WrappedComponent {...props} />
      }
    }
  }
}

export default exports
