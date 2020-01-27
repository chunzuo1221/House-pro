import hash from 'hash-sum'
import uuidv4 from 'uuid/v4'
import queryString from 'query-string'
import humanizeDuration from 'humanize-duration'
import ordinal from 'ordinal-js'

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

const getInterestedPropertyFromStorage = () => {
  return localStorage.getItem(HOUSEPRO_INTERESTED_PROPERTY)
}

const getQueryParam = (name) => {
  const parsed = queryString.parse(window.location.search)
  return parsed[name]
}

const formatScore = (val, tenMax = true) => {
  let value = val || 0
  return tenMax ? Number.parseFloat(value).toFixed(1) : Number.parseFloat(value).toFixed(0)
}

const getScoreSubType = (relevantServices, scoringRule) => {
  let debugServiceUsedCount = parseInt(scoringRule.calculationMethodCode.split('-')[1])
  let numberServicesUsed = parseInt(scoringRule.calculationMethodCode.split('-')[1])
  let scoreType = scoringRule.calculationMethodCode.split('-')[0]
  if (relevantServices.length < numberServicesUsed) {
    numberServicesUsed = relevantServices.length
  }
  let totalScore = 0
  let totalMaxScore = 0
  let scores = []
  relevantServices.forEach(svc => {
    let score = 0
    let maxScore = 0
    if (svc.travels && svc.travels.length) {
      let highest = 0
      svc.travels.forEach(travel => {
        let travelScore = parseFloat((travel.score).toFixed(1))
        if (travelScore > highest) {
          highest = travelScore
          score = travel.score
          maxScore = travel.maxScore
        }
      })
    }
    score = score || 0
    maxScore = maxScore || 10
    let scoreObj = {
      score: score,
      maxScore: maxScore
    }
    scores.push(scoreObj)
  })
  switch (scoreType) {
    case 'best':
      scores = scores.sort((a, b) => b.score - a.score)
      if (numberServicesUsed) {
        let subTypeScore = 0
        let subTypeMaxScore = 0
        let i = 0
        while (numberServicesUsed) {
          subTypeScore += scores[i].score
          subTypeMaxScore += scores[i].maxScore
          numberServicesUsed--
          i++
        }
        if (subTypeMaxScore !== 0) {
          totalScore = subTypeScore
          totalMaxScore = subTypeMaxScore
        }
      }
      break
    case 'average': {
      let subTypeScore = 0
      let subTypeMaxScore = 0
      scores.forEach(score => {
        subTypeScore += score.score
        subTypeMaxScore += score.maxScore
      })
      if (subTypeMaxScore !== 0) {
        totalScore = subTypeScore
        totalMaxScore = subTypeMaxScore
      }
      break
    }
    default: {
      let subTypeScore = 0
      let subTypeMaxScore = 0
      scores.forEach(score => {
        subTypeScore += score.score
        subTypeMaxScore += score.maxScore
      })

      if (subTypeMaxScore !== 0) {
        totalScore = subTypeScore
        totalMaxScore = subTypeMaxScore
      }
      break
    }
  }
  if (debugServiceUsedCount === 0) {
    debugServiceUsedCount = 'all'
  }
  return {
    totalScore: totalScore,
    totalMaxScore: totalMaxScore
  }
}

const getPrettyDistance = (metres) => {
  return metres >= 1000 ? `${(metres / 1000).toFixed(1)}km` : `${metres}m`
}

const getPrettyDuration = (seconds) => {
  return humanizeDuration(seconds * 1000, {units: ['h', 'm'], round: true})
}

const getOrdinalSuffix = (number) => {
  return ordinal.ordinalSuffix(+number || 0)
}

const getLandMapImageUrl = (lot) => {
  if (lot) {
    const entities = lot.split(' ').filter(a => a)
    if (entities[0] === 'Lot') {
      const lotNumber = entities[1]
      const planNumber = entities[2]
      if (lotNumber && planNumber) {
        return `https://gis.allhomes.com.au/gis/generate?a=frmlotmapaus&t=${lotNumber}%2F%2F${planNumber}&w=280&h=280`
      }
    }
  }
  return null
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
  getQueryParam,
  formatScore,
  getScoreSubType,
  getPrettyDistance,
  getPrettyDuration,
  getInterestedPropertyFromStorage,
  getOrdinalSuffix,
  getLandMapImageUrl
}
