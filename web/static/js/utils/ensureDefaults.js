import Parse from 'parse'
import ParseReact from 'parse-react'
import R from 'ramda'

const Envelope = Parse.Object.extend('Envelope')

const emptyOrCreate = R.curry((name, results) => {
  if (!R.isEmpty(results)) { return null }

  return ParseReact.Mutation.
    Create('Envelope', { name, ACL: new Parse.ACL(Parse.User.current()) }).
    dispatch()
})

export default function defaults() {
  R.forEach((name) => {
    const query = new Parse.Query(Envelope)
    query.equalTo('name', name)
    query.find().then(emptyOrCreate(name))
  }, ['Income Pool'])
}
