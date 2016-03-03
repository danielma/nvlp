import ApiBase from "./base"

class EnvelopeApi extends ApiBase {
  index(data = {}) {
    return this.request("envelopes", data)
  }
}

export default new EnvelopeApi()
