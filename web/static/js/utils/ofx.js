import OFX from 'banking/lib/ofx'
import R from 'ramda'
import moment from 'moment'
import money from './money'

function findTransactions(ofx) {
  return R.path(['body', 'OFX', 'BANKMSGSRSV1', 0, 'STMTTRNRS', 0, 'STMTRS', 0,
                 'BANKTRANLIST', 0, 'STMTTRN'], ofx) || []
}

function getProperty(ofx, prop) {
  return R.path([prop, 0], ofx) || null
}

function getPayee(ofxTransaction) {
  const prop = R.partial(getProperty, [ofxTransaction])

  const name = prop('NAME')
  const memo = prop('MEMO')
  const checkNum = prop('CHECKNUM')

  if (name) { return name }
  if (memo) { return memo }
  if (checkNum) { return `Check #${checkNum}` }
}

function toTransaction(ofxTransaction) {
  const prop = R.partial(getProperty, [ofxTransaction])
  const date = moment(prop('DTPOSTED'), 'YYYYMMDDHHmmss')

  return {
    postedAt: date.isValid() && date.toDate(),
    institutionId: prop('FITID'),
    memo: prop('MEMO'),
    payee: getPayee(ofxTransaction),
    designated: false,
    amountCents: money.parseSignedString(prop('TRNAMT')),
    type: prop('TRNTYPE'),
  }
}

export function parse(ofxStr) {
  return new Promise((resolve) => OFX.parse(ofxStr, resolve))
}

export function importOFX(ofxStr) {
  parse(ofxStr).then((ofx) => {
    Parse.Object.saveAll(findTransactions(ofx).map(toTransaction))
  })
}

export default exports
