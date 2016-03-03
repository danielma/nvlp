import ApiBase from "./base"

class EnvelopeApi extends ApiBase {
  index(data = {}) {
    return this.request("envelopes", data)
  }

  show(id) {
    return this.request("envelopes/id")
  }
}

export default new EnvelopeApi()
