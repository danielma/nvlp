import React from 'react'
import styles from '../DesignationList/DesignationList.sass'
import { ListDesignation } from 'components'

export default function InboxList({ transactions }) {
  return (
    <div>
      <div className={styles.header}>
        <span>Payee</span>
        <span className={styles.amount}>Amount</span>
      </div>
      {transactions.map((transaction) => (
        <ListDesignation
          designation={transaction}
          key={transaction.objectId} />
      ))}
    </div>
  )
}
