import React from 'react'
import { Link } from 'react-router'
import styles from './Button.sass'

function getClassName({ className, active }) {
  const styleList = ['button'].concat(className)
  if (active === true) { styleList.push('active') }
  if (active === false) { styleList.push('inactive') }

  return styleList.map((prop) => styles[prop]).join(' ')
}

export default function Button({ className = '', active = null, to = null, ...props }) {
  const customClass = getClassName({ className, active })

  if (to) {
    return <Link to={to} className={customClass} {...props} />
  }

  return <button className={customClass} {...props} />
}
