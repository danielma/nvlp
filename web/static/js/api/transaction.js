import ApiBase from "./base"

class TransactionApi extends ApiBase {
  index(data = {}) {
    return this.get("transactions", data)
  }
}

export default new TransactionApi()
