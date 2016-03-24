import ApiBase from "./base"

class TransactionApi extends ApiBase {
  index(data = {}) {
    return this.get("transactions", data)
  }

  show(id) {
    return this.get(`transactions/${id}`)
  }

  create(transaction) {
    const promise = this.post("transactions", { transaction }, { method: "POST" })
    promise.then(this.markQueriesAsNeedingUpdate)
    return promise
  }
}

export default new TransactionApi()
