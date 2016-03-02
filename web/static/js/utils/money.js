export function centsToString(cents) {
  if (isNaN(cents)) { return '$0.00' }

  const absCents = Math.abs(cents)
  const isPositive = cents >= 0
  const prefix = `$${isPositive ? '' : '-'}`

  if (absCents < 10) { return `${prefix}0.0${absCents}` }
  if (absCents < 100) { return `${prefix}0.${absCents}` }

  const str = cents.toString()
  const lastTwoDigits = str.substring(str.length - 2, str.length)
  const otherDigits = str.substring(0, str.length - 2)

  return `$${otherDigits}.${lastTwoDigits}`
}

export function parseString(string) {
  return parseInt(string.replace(/\W/g, '').replace(/^0+/, ''), 10) || 0
}

export function parseSignedString(string) {
  const match = string.match(/^\D+/)
  const sign = match && (match[0].replace(/[^\-]/g, '') === '-') ? -1 : 1

  return parseString(string) * sign
}

export default exports
