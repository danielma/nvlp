import React, { PropTypes } from 'react'
import { Link, History } from 'react-router'
import { User } from 'parse'
import styles from './Navigation.sass'
import classNames from 'classnames'

export default function Navigation() {
  return (
    <div className={styles.navigation}>
      <ul>
        <NavigationLink to="/envelopes">Envelopes</NavigationLink>
        <NavigationLink to="/add">Add Transaction</NavigationLink>
        <NavigationLink to="/import">Import Transactions</NavigationLink>
      </ul>
      <a className={styles.logout} onClick={User.logOut}>
        <svg viewBox="0 0 60 60">
          <path d="M0,0 L30,0 L30,10 L10,10 L10,50 L30,50 L30,60 L0,60 Z"></path>
          <path d="M20,23 L40,23 L40,10 L60,30 L40,50 L40,37 L20,37 Z"></path>
        </svg>
      </a>
    </div>
  )
}

const NavigationLink = React.createClass({
  propTypes: {
    children: PropTypes.node.isRequired,
  },

  mixins: [History],

  render() {
    const { children, ...props } = this.props
    const isActive = this.history.isActive(props.to, props.query)
    const className = classNames({ [styles.activeItem]: isActive })

    return (
      <li className={className}><Link {...props}>{children}</Link></li>
    )
  },
})
