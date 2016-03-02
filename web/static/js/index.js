import React from 'react';
import Parse from 'parse'
import { render } from 'react-dom';
import { Router } from 'react-router'
import Routes from 'routes'
import createBrowserHistory from 'history/lib/createBrowserHistory'

Parse.initialize(process.env.PARSE_APPLICATION_ID, process.env.PARSE_JAVASCRIPT_KEY)

const history = createBrowserHistory()

render(<Router history={history}>{Routes}</Router>, document.getElementById('root'))
