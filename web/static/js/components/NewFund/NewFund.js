import React, { PropTypes } from 'react'
import Parse from 'parse'
import R from 'ramda'
import { money } from 'utils'
import Immutable from 'immutable'
import { Button, MoneyInput } from 'components'
import { observe } from 'utils/react'

const separateEnvelopes = R.groupBy((envelope) => {
  if (envelope.name === 'Income Cash Pool') {
    return 'income'
  }

  return 'normal'
})

function round(num, dec = 2) {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

// TODO: put this iside the envelopes page intelligently
class NewFund extends React.Component {
  static propTypes = {
    envelopes: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  constructor(props) {
    super(props)

    this.state = { fundings: Immutable.Map({}) }
  }

  handleSubmit = (e) => {
    e.preventDefault()

    Parse.Cloud.run('createTransfer', {
      fromEnvelopeId: separateEnvelopes(this.props.envelopes).income[0].objectId,
      amountCents: this.totalCents,
      payee: 'Funding',
      designations: this.state.fundings.
        map((funding, envelopeId) => ({
          envelopeId,
          amountCents: funding.get('amountCents'),
        })).
        toArray(),
    })
  };

  handleFundingPercentageChange = ({ objectId }, e) => {
    e.preventDefault()

    const percent = parseFloat(e.target.value) || 0
    const fundings = this.state.fundings.mergeIn([objectId], {
      percent,
      percentString: e.target.value,
      amountCents: Math.round(percent * 0.01 * this.incomeCents),
    })

    this.setState({ fundings })
  };

  setEnvelopeFunding({ objectId }, amountCents) {
    const percent = round((amountCents / this.incomeCents) * 100, 2)
    const fundings = this.state.fundings.mergeIn([objectId], {
      amountCents,
      percent,
      percentString: percent.toString(),
    })

    this.setState({ fundings })
  }

  get available() {
    return this.incomeCents - this.totalCents
  }

  get incomeCents() {
    const { income } = separateEnvelopes(this.props.envelopes)

    return income && income[0] && income[0].amountCents || 0
  }

  get totalCents() {
    return this.state.fundings.reduce((acc, funding) => acc + funding.get('amountCents'), 0)
  }

  get totalPercent() {
    return round(this.state.fundings.reduce((acc, funding) => acc + funding.get('percent'), 0), 2)
  }

  render() {
    const styles = require('./NewFund.sass')
    const { normal, income } = separateEnvelopes(this.props.envelopes)

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Envelope</th>
                <th>Amount</th>
                <th>Percentage</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {normal && normal.map((envelope) => (
                <tr key={envelope.objectId}>
                  <td>{envelope.name}</td>
                  <td>
                    <MoneyInput
                      value={this.state.fundings.getIn([envelope.objectId, 'amountCents'])}
                      onChange={(value) => this.setEnvelopeFunding(envelope, value)} />
                  </td>
                  <td>
                    <input type="text"
                      value={this.state.fundings.getIn([envelope.objectId, 'percentString'])}
                      onChange={(e) => this.handleFundingPercentageChange(envelope, e)} />
                    %
                  </td>
                  <td>{money.centsToString(envelope.amountCents)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Income</td>
                <td colSpan={3}>+ {money.centsToString(this.incomeCents)}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>- {money.centsToString(this.totalCents)}</td>
                <td colSpan={2}>{this.totalPercent}%</td>
              </tr>
              <tr>
                <td>Available</td>
                <td>= {income && money.centsToString(this.available)}</td>
                <td colSpan={2}>{round((100 - this.totalPercent), 2)}%</td>
              </tr>
            </tfoot>
          </table>
          <Button type="submit" disabled={this.available < 0}>Fund!</Button>
        </form>
      </div>
    )
  }
}

export default observe({ envelopes: new Parse.Query('Envelope') })(NewFund)
