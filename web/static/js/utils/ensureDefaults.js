import R from "ramda"
import EnvelopeApi from "api/envelope"

const emptyOrCreate = R.curry((name, results) => {
  if (!R.isEmpty(results)) { return null }

  return EnvelopeApi.create({ name })
})

export default function defaults() {
  R.forEach((name) => {
    EnvelopeApi.index({ name: name }).then(emptyOrCreate(name))
  }, ["Income Pool"])
}
