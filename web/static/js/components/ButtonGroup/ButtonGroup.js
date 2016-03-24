import React from 'react'
import styles from './ButtonGroup.sass'

export default function ButtonGroup({ children }) {
  return (
    <div className={styles.buttonGroup}>
      {children}
    </div>
  )
}
