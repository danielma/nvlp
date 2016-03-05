import R from "ramda"
import EnvelopeApi from "api/envelope"
import { parseJSON } from "utils"

const emptyOrCreate = R.curry((name, results) => {
  if (!R.isEmpty(results.data)) { return null }

  return EnvelopeApi.create({ name })
})

export default function defaults() {
  R.forEach((name) => {
    EnvelopeApi.index({ name }).then(parseJSON).then(emptyOrCreate(name))
  }, ["Income Pool"])
}
