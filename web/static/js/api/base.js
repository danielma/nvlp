export default class ApiBase {
  query(method, ...args) {
    return () => this[method](...args)
  }

  request(url, data = {}, options = {}) {
    return fetch(`/api/${url}`, { ...options, body: data })
  }
}
