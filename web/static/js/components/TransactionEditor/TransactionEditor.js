import React, { PropTypes } from 'react'
import Parse from 'parse'
import Immutable from 'immutable'
import { Button, MoneyInput, ButtonGroup } from 'components'
import { money } from 'utils'
import { observe } from 'utils/react'

const emptyDesignation = Immutable.fromJS({
  amountCents: 0,
  envelope: { __type: 'Pointer', className: '_Envelope', objectId: null },
})

@observe((props) => {
  const designationQuery = new Parse.Query('Designation')
  const transactionQuery = new Parse.Query('Transaction').equalTo('objectId', props.id).limit(1)

  return {
    envelopes: new Parse.Query('Envelope'),
    transactions: transactionQuery,
    initialDesignations: designationQuery.matchesQuery('transaction', transactionQuery),
  }
})
export default class TransactionEditor extends React.Component {
  static propTypes = {
    commit: PropTypes.func.isRequired,
    id: PropTypes.number,

    // observe
    loaded: PropTypes.bool,
    envelopes: PropTypes.arrayOf(PropTypes.object),
    transactions: PropTypes.arrayOf(PropTypes.object),
    initialDesignations: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props)

    this.state = {
      transactionAmountCents: 0,
      designations: Immutable.List([emptyDesignation]),
      isIncome: false,
      payee: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!(nextProps.loaded && !this.props.loaded)) { return }

    this.setState({
      designations: Immutable.fromJS(nextProps.initialDesignations),
      payee: nextProps.transactions[0].payee,
      transactionAmountCents: nextProps.transactions[0].amountCents,
    })
  }

  get transaction() {
    return this.props.transactions.first
  }

  stringToCents(string) {
    return Math.abs(parseFloat(string)) * 100 * this.getSignMultiplier()
  }

  updateTransactionAmount(transactionAmountCents) {
    let { designations } = this.state
    if (designations.size === 1) {
      designations = designations.setIn([0, 'amountCents'], transactionAmountCents)
    }
    const nextState = { designations }

    if (!this.props.id) {
      nextState.transactionAmountCents = transactionAmountCents
    }
    this.setState(nextState)
  }

  updateDesignationAmount(index, amountCents) {
    const designations = this.state.designations.
      update(index, (designation) => designation.set('amountCents', amountCents))

    this.setState({ designations })
  }

  updateDesignationEnvelope(index, envelopeId) {
    const designations = this.state.designations.
      update(index, (designation) => designation.setIn(['envelope', 'objectId'], envelopeId))

    this.setState({ designations })
  }

  commit = () => {
    this.props.commit({
      amountCents: this.state.transactionAmountCents,
      payee: this.state.payee,
      designations: this.state.designations.toJS(),
    })
  };

  addDesignation = () => {
    this.setState({ designations: this.state.designations.push(emptyDesignation) })
  };

  removeDesignation(index) {
    this.setState({ designations: this.state.designations.delete(index) })
  }

  isValidAmount() {
    return this.getTransactionDesignationAmountDifference() === 0
  }

  isValid() {
    return [
      this.state.payee && (this.state.payee.trim() !== ''),
      this.isValidAmount(),
      this.state.designations.every((designation) => designation.getIn(['envelope', 'objectId'])),
    ].every((bool) => bool === true)
  }

  setIsIncome(isIncome = this.state.isIncome) {
    if (this.props.id) { return }
    if (isIncome === this.state.isIncome) { return }

    // reverse signs
    const transactionAmountCents = this.state.transactionAmountCents * -1
    const designations = this.state.designations.
      map((designation) => designation.update('amountCents', (amount) => amount * -1))

    this.setState({ isIncome, transactionAmountCents, designations })
  }

  getTransactionDesignationAmountDifference() {
    return (
      (this.state.transactionAmountCents || 0) - this.getDesignationTotal()
    ) * this.getSignMultiplier()
  }

  getDesignationTotal() {
    return this.state.designations.
      reduce((acc, designation) => acc + designation.get('amountCents'), 0)
  }

  getSignMultiplier() {
    return this.state.isIncome ? 1 : -1
  }

  render() {
    const styles = require('./TransactionEditor.sass')

    return (
      <div className={styles.addTransaction}>
        <h4>Add a Transaction</h4>
        <ButtonGroup>
          <Button
            active={this.state.isIncome}
            onClick={() => this.setIsIncome(true)}>Income
          </Button>
          <Button
            active={!this.state.isIncome}
            onClick={() => this.setIsIncome(false)}>Expense</Button>
        </ButtonGroup>
        <input
          type="text"
          ref="payee"
          value={this.state.payee}
          onChange={(e) => this.setState({ payee: e.target.value })}
          placeholder="File a new expense" />
        <MoneyInput
          type="text"
          onChange={(value) => this.updateTransactionAmount(value)}
          reverseDisplay={!this.state.isIncome}
          value={this.state.designations.getIn([0, 'amountCents'])} />
        {this.state.designations.map((designation, index) => (
          <div key={index}>
            {this.state.designations.size > 1 && <MoneyInput
              onChange={(value) => this.updateDesignationAmount(index, value)}
              reverseDisplay={!this.state.isIncome}
              value={designation.get('amountCents')} />
            }
            <select
              value={designation.getIn(['envelope', 'objectId'])}
              onChange={(e) => this.updateDesignationEnvelope(index, e.target.value)}>
              {[{}].concat(this.props.envelopes).map((envelope) => (
                <option key={envelope.objectId} value={envelope.objectId}>{envelope.name}</option>
              ))}
            </select>
            {index > 0 && <Button onClick={() => this.removeDesignation(index)}>-</Button>}
            <Button onClick={this.addDesignation}>+</Button>
          </div>
        ))}
        {this.isValidAmount() || <p>
          Off by {money.centsToString(this.getTransactionDesignationAmountDifference())}!
        </p>}
        <Button onClick={this.commit} disabled={!this.isValid()}>
          Add expense +
        </Button>
      </div>
    )
  }
}
