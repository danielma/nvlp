import ApiBase from "./base"

class EnvelopeApi extends ApiBase {
  index(data = {}) {
    return this.get("envelopes", data)
  }

  show(id) {
    return this.get(`envelopes/${id}`)
  }

  create(envelope) {
    return this.post("envelopes", { envelope }, { method: "POST" })
  }
}

export default new EnvelopeApi()
