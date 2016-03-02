import "phoenix_html"
import React from 'react';
import Parse from 'parse'
import { render } from 'react-dom';
import { Router } from 'react-router'
import Routes from 'routes'
import createBrowserHistory from 'history/lib/createBrowserHistory'

const history = createBrowserHistory()

render(<Router history={history}>{Routes}</Router>, document.getElementById('root'))
