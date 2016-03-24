import ApiBase from "./base"

class EnvelopeApi extends ApiBase {
  index(data = {}) {
    return this.get("envelopes", data)
  }

  show(id) {
    return this.get(`envelopes/${id}`)
  }

  create(envelope) {
    const promise = this.post("envelopes", { envelope }, { method: "POST" })
    promise.then(this.markQueriesAsNeedingUpdate)
    return promise
  }
}

export default new EnvelopeApi()
