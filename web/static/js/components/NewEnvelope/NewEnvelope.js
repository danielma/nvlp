import React, { PropTypes } from "react"
import { Button } from "components"
import { string } from "utils"
import EnvelopeApi from "api/envelope"

export default React.createClass({
  displayName: "NewEnvelope",

  contextTypes: {
    history: PropTypes.object,
  },

  handleSubmit(e) {
    e.preventDefault()

    const name = this.refs.name.value
    const slug = string.parameterize(name)

    EnvelopeApi.create({ name }).
      then(() => this.context.history.pushState({}, `/envelopes/${slug}`))
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
