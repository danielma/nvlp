const { apiToken } = window
import { serializeQuery } from "utils"

export default class ApiBase {
  query(method, ...args) {
    return () => this[method](...args)
  }

  get(url, query = {}, options = {}) {
    return fetch(`/api/${url}?${serializeQuery(query)}`, {
      headers: {
        ...options.headers,
        "Authorization": apiToken,
      },
    })
  }

  post(url, data = null, options = {}) {
    return fetch(`/api/${url}`, {
      ...options,
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        "Authorization": apiToken,
      },
    })
  }
}
