import React, { PropTypes } from 'react'
import { Button } from 'components'
import { string } from 'utils'
import Parse from 'parse'
import ParseReact from 'parse-react'

export default React.createClass({
  displayName: 'NewEnvelope',

  contextTypes: {
    history: PropTypes.object,
  },

  handleSubmit(e) {
    e.preventDefault()

    const name = this.refs.name.value
    const slug = string.parameterize(name)
    const acl = new Parse.ACL(Parse.User.current())

    ParseReact.Mutation.Create('Envelope', { name, ACL: acl }).
      dispatch().
      then(() => this.context.history.pushState({}, `/envelopes/${slug}`),
           () => this.setState({ error: true }))
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref="name" placeholder="name" />

        <Button type="submit">Add</Button>
      </form>
    )
  },
})
