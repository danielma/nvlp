import ApiBase from "./base"

class EnvelopeApi extends ApiBase {
  index(data = {}) {
    return this.get("envelopes", data)
  }
}

export default new EnvelopeApi()
