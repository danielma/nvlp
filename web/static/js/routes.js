import React from "react"
import { Route, IndexRoute } from "react-router"
import { App } from "containers"
import * as components from "components"

export default (
  <Route path="/" component={App}>
    <IndexRoute components={components.Envelopes} />
    <Route path="envelopes(/:name)" component={components.Envelopes} />
    <Route path="add" component={components.AddTransaction} />
    <Route path="fund" component={components.NewFund} />
    <Route path="import" component={components.Import} />
  </Route>
)
