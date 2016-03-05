export money from "./money"
export string from "./string"
export react from "./react"
export ofx from "./ofx"
export ensureDefaults from "./ensureDefaults"
export function noop() {}
export function parseJSON(response) {
  return response.json()
}

// thanks http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
export function serializeQuery(obj, prefix) {
  const str = []

  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? `${prefix}[${p}]` : p, v = obj[p]
      str.push(typeof v == "object" ?
        serializeQuery(v, k) :
        `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    }
  }
  return str.join("&")
}

export default exports
