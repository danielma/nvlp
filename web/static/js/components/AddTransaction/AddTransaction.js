import React from 'react'
import Parse from 'parse'
import Immutable from 'immutable'
import ParseReact from 'parse-react'
import { Button, MoneyInput, ButtonGroup } from 'components'
import { money } from 'utils'

const emptyDesignation = Immutable.Map({
  amountCents: 0,
  envelopeId: null,
})

export default React.createClass({
  displayName: 'AddTransaction',

  mixins: [ParseReact.Mixin],

  observe() {
    return { envelopes: new Parse.Query('Envelope') }
  },

  getInitialState() {
    return {
      transactionAmountCents: 0,
      designations: Immutable.List([emptyDesignation]),
      isIncome: false,
    }
  },

  stringToCents(string) {
    return Math.abs(parseFloat(string)) * 100 * this.getSignMultiplier()
  },

  updateTransactionAmount(transactionAmountCents) {
    let { designations } = this.state
    if (designations.size === 1) {
      designations = designations.setIn([0, 'amountCents'], transactionAmountCents)
    }
    this.setState({ transactionAmountCents, designations })
  },

  updateDesignationAmount(index, amountCents) {
    const designations = this.state.designations.
      update(index, (designation) => designation.set('amountCents', amountCents))

    this.setState({ designations })
  },

  updateDesignationEnvelope(index, envelopeId) {
    const designations = this.state.designations.
      update(index, (designation) => designation.set('envelopeId', envelopeId))

    this.setState({ designations })
  },

  addTransaction() {
    Parse.Cloud.run('createTransaction', {
      amountCents: this.state.transactionAmountCents,
      payee: this.state.payee,
      designations: this.state.designations.toJS(),
    })
  },

  addDesignation() {
    this.setState({ designations: this.state.designations.push(emptyDesignation) })
  },

  removeDesignation(index) {
    this.setState({ designations: this.state.designations.delete(index) })
  },

  isValidAmount() {
    return this.getTransactionDesignationAmountDifference() === 0
  },

  isValid() {
    return [
      this.state.payee && (this.state.payee.trim() !== ''),
      this.isValidAmount(),
      this.state.designations.every((designation) => designation.get('envelopeId')),
    ].every((bool) => bool === true)
  },

  setIsIncome(isIncome = this.state.isIncome) {
    if (isIncome === this.state.isIncome) { return }

    // reverse signs
    const transactionAmountCents = this.state.transactionAmountCents * -1
    const designations = this.state.designations.
      map((designation) => designation.update('amountCents', (amount) => amount * -1))

    this.setState({ isIncome, transactionAmountCents, designations })
  },

  getTransactionDesignationAmountDifference() {
    return (
      (this.state.transactionAmountCents || 0) - this.getDesignationTotal()
    ) * this.getSignMultiplier()
  },

  getDesignationTotal() {
    return this.state.designations.
      reduce((acc, designation) => acc + designation.get('amountCents'), 0)
  },

  getSignMultiplier() {
    return this.state.isIncome ? 1 : -1
  },

  render() {
    const styles = require('./AddTransaction.sass')

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
          value={this.state.transactionAmountCents} />
        {this.state.designations.map((designation, index) => (
          <div key={index}>
            {this.state.designations.size > 1 && <MoneyInput
              onChange={(value) => this.updateDesignationAmount(index, value)}
              reverseDisplay={!this.state.isIncome}
              value={designation.get('amountCents')} />
            }
            <select
              value={designation.get('envelopeId')}
              onChange={(e) => this.updateDesignationEnvelope(index, e.target.value)}>
              {[{}].concat(this.data.envelopes).map((envelope) => (
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
        <Button onClick={this.addTransaction} disabled={!this.isValid()}>
          Add expense +
        </Button>
      </div>
    )
  },
})
