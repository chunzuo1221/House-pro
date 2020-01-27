import hash from 'hash-sum'
import uuidv4 from 'uuid/v4'

const HOUSEPRO_SESSION = 'HOUSEPRO_SESSION'
const HOUSEPRO_INTERESTED_PROPERTY = 'HOUSEPRO_INTERESTED_PROPERTY'

const getPropertyAddressComponentValue = (property, type, isShort = true) => {
  if (property && property.address_components && property.address_components.length && type) {
    const component = property.address_components.find(o => o.types.includes(type))
    if (component) {
      return isShort ? component.short_name : component.long_name
    }
  }
  return ''
}

const isEqual = (a, b) => {
  return hash(a) === hash(b)
}

const uniqueArray = (items, key) => {
  if (items && key) {
    return items.filter((o, i, arr) => arr.findIndex(el => el[key] === o[key]) === i)
  }
  return items
}

const getHash = o => hash(o)

const generateUUID = () => uuidv4()

const getSectionGrade = (score) => {
  if (score >= 8) {
    return 'an excellent'
  }
  if (score >= 5) {
    return 'a good'
  }
  return 'a poor'
}

const saveAuthToStorage = (session) => {
  const encoded = encodeURIComponent(Buffer.from(JSON.stringify(session)).toString('base64'))
  localStorage.setItem(HOUSEPRO_SESSION, encoded)
}

const getAuthFromStorage = () => {
  const encoded = localStorage.getItem(HOUSEPRO_SESSION)
  if (encoded) {
    const decoded = JSON.parse(Buffer.from(decodeURIComponent(encoded), 'base64'))
    return decoded
  }
}

const saveInterestedPropertyToStorage = (property) => {
  localStorage.setItem(HOUSEPRO_INTERESTED_PROPERTY, property)
}

export {
  getPropertyAddressComponentValue,
  getHash,
  isEqual,
  uniqueArray,
  generateUUID,
  getSectionGrade,
  saveAuthToStorage,
  getAuthFromStorage,
  saveInterestedPropertyToStorage
}
