export function parameterize(string = '') {
  return string.trim().toLowerCase().replace(/\W+/g, '-')
}

export default exports
