import React from 'react'
import { Parse } from 'parse'
import ParseReact from 'parse-react'

export default React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      error: null,
      signup: false,
    }
  },

  observe() {
    return { user: ParseReact.currentUser }
  },

  handleKeyDown(e) {
    e.keyCode === 13 && this.handleSubmit()
  },

  handleSubmit() {
    const username = this.refs.username.value;
    const password = this.refs.password.value;

    if (username.length && password.length) {
      if (this.state.signup) {
        new Parse.User({
          username: username,
          password: password,
        }).
          signUp().
          then(() => this.setState({ error: null }),
               () => this.setState({ error: 'Invalid account information' }))
      } else {
        Parse.User.
          logIn(username, password).
          then(() => this.setState({ error: null }),
               () => this.setState({ error: 'Incorrect username or password' }))
      }
    } else {
      this.setState({ error: 'Please enter all fields' })
    }
  },

  render() {
    return (
      <div>
        <h1>AnyBudget</h1>
        <h2>Powered by Parse + React</h2>
        <div className="loginForm" onKeyDown={this.handleKeyDown}>
          {
            this.state.error ?
              <div className="row centered errors">{this.state.error}</div> :
                null
          }
          <div className="row">
            <label htmlFor="username">Username</label>
            <input ref="username" id="username" type="text" />
          </div>
          <div className="row">
            <label htmlFor="password">Password</label>
            <input ref="password" id="password" type="password" />
          </div>
          <div className="row centered">
            <a className="button" onClick={this.handleSubmit}>
              {this.state.signup ? 'Sign up' : 'Log in'}
            </a>
          </div>
          <div className="row centered">
            or&nbsp;
            <a onClick={() => this.setState({ signup: !this.state.signup })}>
              {this.state.signup ? 'log in' : 'sign up'}
            </a>
          </div>
        </div>
      </div>
    )
  },
})
