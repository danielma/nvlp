import ApiBase from "./base"

class DesignationApi extends ApiBase {
  index(data = {}) {
    return this.get("designations", data)
  }
}

export default new DesignationApi()
