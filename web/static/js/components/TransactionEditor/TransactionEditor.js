import React, { PropTypes } from "react"
import Immutable from "immutable"
import { Button, MoneyInput, ButtonGroup } from "components"
import { money } from "utils"
import { observe } from "utils/react"
import DesignationApi from "api/designation"
import EnvelopeApi from "api/envelope"
import TransactionApi from "api/transaction"

const emptyDesignation = new Immutable.Map({
  amount_cents: 0,
  envelope_id: null,
})

@observe((props) => {
  return {
    envelopes: EnvelopeApi.query("index"),
    transaction: TransactionApi.query("show", props.id),
    initialDesignations: DesignationApi.query("index", { transaction_id: props.id }),
  }
})
export default class TransactionEditor extends React.Component {
  static propTypes = {
    commit: PropTypes.func.isRequired,
    id: PropTypes.number,

    // observe
    loaded: PropTypes.bool,
    envelopes: PropTypes.arrayOf(PropTypes.object),
    transaction: PropTypes.arrayOf(PropTypes.object),
    initialDesignations: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props)

    this.state = {
      transactionAmountCents: 0,
      designations: new Immutable.List([emptyDesignation]),
      isIncome: false,
      payee: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!(nextProps.loaded && !this.props.loaded)) { return }

    this.setState({
      designations: Immutable.fromJS(nextProps.initialDesignations),
      payee: nextProps.transaction.payee,
      transactionAmountCents: nextProps.transaction.amount_cents,
    })
  }

  stringToCents(string) {
    return Math.abs(parseFloat(string)) * 100 * this.getSignMultiplier()
  }

  updateTransactionAmount(transactionAmountCents) {
    let { designations } = this.state
    if (designations.size === 1) {
      designations = designations.setIn([0, "amount_cents"], transactionAmountCents)
    }
    const nextState = { designations }

    if (!this.props.id) {
      nextState.transactionAmountCents = transactionAmountCents
    }
    this.setState(nextState)
  }

  updateDesignationAmount(index, amount_cents) {
    const designations = this.state.designations.
      update(index, (designation) => designation.set("amount_cents", amount_cents))

    this.setState({ designations })
  }

  updateDesignationEnvelope(index, envelopeId) {
    const designations = this.state.designations.
      update(index, (designation) => designation.set("envelope_id", envelopeId))

    this.setState({ designations })
  }

  commit = () => {
    this.props.commit({
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
      this.state.designations.every((designation) => designation.getIn(["envelope", "id"])),
    ].every((bool) => bool === true)
  }

  setIsIncome(isIncome = this.state.isIncome) {
    if (this.props.id) { return }
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
    const styles = require("./TransactionEditor.sass")

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
          value={this.state.designations.getIn([0, "amount_cents"])} />
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
        <Button onClick={this.commit} disabled={!this.isValid()}>
          Add expense +
        </Button>
      </div>
    )
  }
}
