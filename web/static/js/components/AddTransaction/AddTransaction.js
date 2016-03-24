import React, { PropTypes as pt } from "react"
import { observe } from "utils/react"
import Immutable from "immutable"
import { Button, MoneyInput, ButtonGroup } from "components"
import { money } from "utils"
import EnvelopeApi from "api/envelope"
import TransactionApi from "api/transaction"

const emptyDesignation = new Immutable.Map({
  amount_cents: 0,
  envelope_id: null,
})

class AddTransaction extends React.Component {
  static propTypes = {
    envelopes: pt.arrayOf(pt.object).isRequired,
  };

  constructor(props) {
    super(props)

    this.state = {
      transactionAmountCents: 0,
      designations: new Immutable.List([emptyDesignation]),
      isIncome: false,
    }
  }

  stringToCents(string) {
    return Math.abs(parseFloat(string)) * 100 * this.getSignMultiplier()
  }

  updateTransactionAmount(transactionAmountCents) {
    let { designations } = this.state
    if (designations.size === 1) {
      designations = designations.setIn([0, "amount_cents"], transactionAmountCents)
    }
    this.setState({ transactionAmountCents, designations })
  }

  updateDesignationAmount(index, amount_cents) {
    const designations = this.state.designations.
      update(index, (designation) => designation.set("amount_cents", amount_cents))

    this.setState({ designations })
  }

  updateDesignationEnvelope(index, envelope_id) {
    const designations = this.state.designations.
      update(index, (designation) => designation.set("envelope_id", envelope_id))

    this.setState({ designations })
  }

  addTransaction = () => {
    TransactionApi.create({
      amount_cents: this.state.transactionAmountCents,
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
      this.state.payee && (this.state.payee.trim() !== ""),
      this.isValidAmount(),
      this.state.designations.every((designation) => designation.get("envelope_id")),
    ].every((bool) => bool === true)
  }

  setIsIncome(isIncome = this.state.isIncome) {
    if (isIncome === this.state.isIncome) { return }

    // reverse signs
    const transactionAmountCents = this.state.transactionAmountCents * -1
    const designations = this.state.designations.
      map((designation) => designation.update("amount_cents", (amount) => amount * -1))

    this.setState({ isIncome, transactionAmountCents, designations })
  }

  getTransactionDesignationAmountDifference() {
    return (
      (this.state.transactionAmountCents || 0) - this.getDesignationTotal()
    ) * this.getSignMultiplier()
  }

  getDesignationTotal() {
    return this.state.designations.
      reduce((acc, designation) => acc + designation.get("amount_cents"), 0)
  }

  getSignMultiplier() {
    return this.state.isIncome ? 1 : -1
  }

  render() {
    const styles = require("./AddTransaction.sass")

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
              value={designation.get("amount_cents")} />
            }
            <select
              value={designation.get("envelope_id")}
              onChange={(e) => this.updateDesignationEnvelope(index, e.target.value)}>
              {[{}].concat(this.props.envelopes).map((envelope) => (
                <option key={envelope.id} value={envelope.id}>{envelope.name}</option>
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
  }
}

export default observe({
  envelopes: EnvelopeApi.query("index"),
})(AddTransaction)
