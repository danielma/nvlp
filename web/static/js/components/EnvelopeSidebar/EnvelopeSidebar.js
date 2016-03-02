import React, { PropTypes } from 'react'
import { ListEnvelope, Button } from 'components'
import styles from './EnvelopeSidebar.sass'

const Envelope = PropTypes.object // TODO: better prop type here

export default React.createClass({
  displayName: 'EnvelopeSidebar',

  propTypes: {
    envelopes: PropTypes.arrayOf(Envelope).isRequired,
    selected: Envelope,
  },

  getInitialState() {
    return {
      modalOpen: false,
    }
  },

  render() {
    const { envelopes, selected } = this.props

    return (
      <div className={styles.sidebar}>
        <div className={styles.envelopes}>
          {envelopes.map((envelope) => (
            <ListEnvelope
              key={envelope.objectId}
              envelope={envelope}
              selected={envelope === selected} />
          ))}
        </div>
        <div className={styles.footer}>
          <Button to="/envelopes/new" className="sm">+</Button>
          <Button to="/fund" className="sm">Fund</Button>
        </div>
      </div>
    )
  },
})
