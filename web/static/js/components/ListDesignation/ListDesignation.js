import React, { PropTypes } from 'react'
import R from 'ramda'
import styles from '../ListDesignation/ListDesignation.sass'
import { money } from 'utils'
import { TransactionEditor } from 'components'

const payee = (designationOrTransaction) => (
  R.path(['transaction', 'payee'], designationOrTransaction) || designationOrTransaction.payee
)

const transactionId = (designationOrTransaction) => (
  R.path(['transaction', 'objectId'], designationOrTransaction) || designationOrTransaction.objectId
)

export default class ListDesignation extends React.Component {
  static propTypes = {
    designation: PropTypes.shape({
      amountCents: PropTypes.number.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props)

    this.state = {
      isEditing: false
    }
  }

  handleClick = () => {
    this.setState({ isEditing: !this.state.isEditing })
  };

  render() {
    const { designation } = this.props

    return (
      <div className={`${styles.designation} ${this.state.isEditing && styles.editing}`}>
        <div onClick={this.handleClick} className={styles.row}>
          <span className={styles.name}>{payee(designation)}</span>
          <span className={`${styles.amount} ${designation.amountCents >= 0 ? styles.positive : styles.negative}`}>
            {money.centsToString(designation.amountCents)}
          </span>
        </div>
        {this.state.isEditing &&
          <div className={styles.edit}>
            <TransactionEditor id={transactionId(designation)} commit={(transaction) => console.log(transaction)} />
          </div>
        }
      </div>
    )
  }
}
