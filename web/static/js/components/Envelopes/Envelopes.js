import React, { PropTypes } from 'react'
import Parse from 'parse'
import R from 'ramda'
import Modal from 'react-modal'
import { EnvelopeSidebar, DesignationList, InboxList, NewEnvelope } from 'components'
import { parameterize } from 'utils/string'
import { observe } from 'utils/react'
import styles from './Envelopes.sass'

class Envelopes extends React.Component {
  static propTypes = {
    selected: PropTypes.object,
    params: PropTypes.shape({
      name: PropTypes.string,
    }),
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,

    // connect
    // TODO: real prop type here
    envelopes: PropTypes.arrayOf(PropTypes.object).isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static defaultProps = {
    onSelect: () => {},
    params: {},
  };

  constructor(props) {
    super(props)

    this.state = { selectedEnvelope: null }
  }

  get selectedEnvelope() {
    const { paramEnvelope, envelopesWithInbox } = this

    return R.find((envelope) => parameterize(envelope.name) === paramEnvelope, envelopesWithInbox)
  }

  get paramEnvelope() {
    return parameterize(this.props.params.name)
  }

  get inboxAmountCents() {
    return R.reduce((acc, transaction) => acc + transaction.amountCents, 0, this.props.transactions)
  }

  get envelopesWithInbox() {
    return [{ name: 'Inbox', amountCents: this.inboxAmountCents }].concat(this.props.envelopes)
  }

  renderList() {
    const selectedEnvelope = this.selectedEnvelope

    switch (true) {
      case (selectedEnvelope && selectedEnvelope.name === 'Inbox'):
        return <InboxList transactions={this.props.transactions} />
      case !!selectedEnvelope:
        return <DesignationList envelope={selectedEnvelope} />
      default:
        return <div className={styles.blankSlate} />
    }
  }

  render() {
    const newEnvelope = this.paramEnvelope === 'new'

    return (
      <div className={styles.wrapper}>
        <EnvelopeSidebar envelopes={this.envelopesWithInbox} selected={this.selectedEnvelope} />
        <div className={styles.designationList}>
          {this.renderList()}
        </div>
        <Modal isOpen={newEnvelope} onRequestClose={() => this.props.history.goBack()}>
          <NewEnvelope />
        </Modal>
      </div>
    )
  }
}

export default observe({
  envelopes: new Parse.Query('Envelope'),
  transactions: new Parse.Query('Transaction').notEqualTo('designated', true),
})(Envelopes)
