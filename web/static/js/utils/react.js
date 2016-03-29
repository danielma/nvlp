import { parseJSON } from "utils"
import React from "react"
import shallowCompare from "react-addons-shallow-compare"
import R from "ramda"

function observesToHashCodes(observes) {
  return R.sum(
    R.map(
      R.invoker(0, "hashCode"),
      R.values(observes)
    )
  )
}

export function observe(observes) {
  const getObserves = (typeof observes === "function") ? observes : () => (observes)

  return function wrapWithConnect(WrappedComponent) {
    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"

    return class extends React.Component {
      static displayName = `Observe(${name})`;

      constructor(props) {
        super(props)

        this.state = {
          queries: R.map(R.always([]), getObserves(this.props, {})),
          pendingQueryCount: 0,
        }
      }

      componentWillMount() {
        this.runQueries()
      }

      componentWillReceiveProps(nextProps, nextState) {
        if (shallowCompare(this, nextProps, nextState)) {
          if (observesToHashCodes(getObserves(nextProps, nextState)) !== observesToHashCodes(this.componentQueries)) {
            this.runQueries()
          }
        }
      }

      componentWillUnmount() {
        R.keys(this.componentQueries).forEach((key) => {
          this.componentQueries[key].destroy()
        })
      }

      runQueries() {
        this.componentQueries = getObserves(this.props, {})

        this.setState({
          pendingQueryCount: R.length(R.keys(this.componentQueries)),
        })

        R.keys(this.componentQueries).forEach((key) => {
          const query = this.componentQueries[key]

          this.executeQuery(query, key)

          query.on("needsUpdate", () => {
            this.setState({ pendingQueryCount: this.state.pendingQueryCount + 1 })
            this.executeQuery(query, key)
          })
        })
      }

      executeQuery(query, key) {
        query.execute().then(parseJSON).then((data) => {
          this.setState({
            queries: { ...this.state.queries, [key]: data.data },
            pendingQueryCount: this.state.pendingQueryCount - 1,
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
