const { apiToken } = window
import { serializeQuery } from "utils"
import Immutable, { Map, Set } from "immutable"

class EventEmitter {
  constructor() {
    this.listeners = {}
  }

  on(event, callback) {
    this.ensureListeners(event)
    this.listeners[event] = this.listeners[event].add(callback)
  }

  off(event, callback) {
    this.listeners[event] = this.listeners[event].delete(callback)
  }

  emit(event) {
    const callbacks = this.listeners[event]

    if (!callbacks) { return }

    callbacks.map((callback) => callback())
  }

  ensureListeners(event) {
    if (this.listeners[event]) { return this.listeners }

    this.listeners[event] = new Set()
    return this.listeners
  }
}

class ApiQuery extends EventEmitter {
  constructor(apiInstance, method, ...args) {
    super()

    this.apiInstance = apiInstance
    this.method = method
    this.args = args
  }

  hashCode() {
    return Immutable.fromJS({
      api: this.apiInstance.constructor.name,
      method: this.method,
      args: this.args,
    }).hashCode()
  }

  execute() {
    return this.apiInstance[this.method](...this.args)
  }

  destroy() {
    this.apiInstance.off(this.method, ...this.args)
  }
}

export default class ApiBase {
  constructor() {
    this.queries = new Map({})
  }

  query(method, ...args) {
    const query = new ApiQuery(this, method, ...args)
    this.queries = this.queries.set(this.queryArgsToKey(method, ...args), query)
    return query
  }

  off(method, ...args) {
    this.queries = this.queries.delete(this.queryArgsToKey(method, ...args))
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

  markQueriesAsNeedingUpdate = () => {
    this.queries.map((query) => query.emit("needsUpdate"))
  };

  queryArgsToKey(method, ...args) {
    return JSON.stringify([method, ...args])
  }
}
