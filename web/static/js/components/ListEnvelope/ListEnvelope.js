import React from 'react'
import { money, string } from 'utils'
import { Link } from 'react-router'
import styles from './ListEnvelope.sass'
import classNames from 'classnames'

export default function ListEnvelope({ envelope, selected, ...props }) {
  const { amountCents } = envelope
  const isPositive = amountCents >= 0
  return (
    <Link
      to={`/envelopes/${string.parameterize(envelope.name)}`}
      className={classNames(styles.listEnvelope, { [styles.selected]: selected })}
      {...props}>
      <div className={styles.name}>{envelope.name}</div>
      <div className={`${styles.amount} ${isPositive ? styles.positive : styles.negative}`}>
        {money.centsToString(envelope.amountCents)}
      </div>
    </Link>
  )
}
