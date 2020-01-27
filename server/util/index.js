function getAddressComponentValue (components, type, isShort = true) {
  if (components && components.length && type) {
    const component = components.find(o => o.types.includes(type))
    if (component) {
      return isShort ? component.short_name : component.long_name
    }
  }
  return ''
}

const scoringWeightings = {
  locationModule: {
    module: 'location',
    sections: [
      { section: 'street-aesthetics', percent: 1 },
      { section: 'street-surrounding-real-estate', percent: 2 },
      { section: 'street-traffic-parking', percent: 1.4 }
    ]
  }
  ,
  assessServices: [
    {
      percent: 1,
      section: 'park'
    }, {
      percent: 1,
      section: 'school'
    }, {
      percent: 1,
      section: 'shopping'
    }, {
      percent: 1.7,
      section: 'public-transport'
    }, {
      percent: 1,
      section: 'medical'
    }, {
      section: 'walkability'
    }, {
      section: 'city-index'
    }, {
      section: 'beach-index'
    }, {
      section: 'train-index'
    }
  ],
  landModule: {
    module: 'land',
    sections: [
      { section: 'topography', percent: 1 },
      { section: 'planning', percent: 1 },
      { section: 'performance', percent: 1 },
      { section: 'improvements', percent: 1 }
    ]
  }
}

/**
 * calculate the property position score on the basis of survey answers
 */
function calculatePositionScore (surveyAnswer) {
  let totalPositionScore = 0
  let totalPositionMax = 0
  const positionScore = {
    score: {value: 0, max: 10},
    sections: []
  }

  if (surveyAnswer.responses) {
    const answers = surveyAnswer.responses
      .filter(response => response.questionId)
      .filter(response => response.questionId.questionModule === scoringWeightings.locationModule.module)
    const answersForModule = answers.filter(answer => answer.questionId.questionModule === 'location')
    positionScore.sections = scoringWeightings.locationModule.sections.map(section => {
      const answersForSection = answersForModule.filter(answer => answer.questionId.questionSection === section.section)
      const levelScore = calculateLevelScore(answersForSection, false)
      if (section.percent > 0) {
        totalPositionScore += levelScore.value * section.percent
        totalPositionMax += levelScore.max * section.percent
      }
      return {
        section: section.section,
        score: levelScore
      }
    })
    let value = Math.round((totalPositionScore / totalPositionMax) * 100) / 10
    positionScore.score = {
      value: Number.isNaN(value) ? 0 : value,
      totalPositionScore,
      totalPositionMax,
      max: 10
    }
  }
  return positionScore
}

function calculateLandScore (surveyAnswer) {
  let totalPositionScore = 0
  let totalPositionMax = 0
  const landScore = {
    score: {value: 0, max: 10},
    sections: []
  }

  if (surveyAnswer.responses) {
    const answers = surveyAnswer.responses
      .filter(response => response.questionId)
      .filter(response => response.questionId.questionModule === scoringWeightings.landModule.module)
    const answersForModule = answers.filter(answer => answer.questionId.questionModule === 'land')
    landScore.sections = scoringWeightings.landModule.sections.map(section => {
      const answersForSection = answersForModule.filter(answer => answer.questionId.questionSection === section.section)
      const levelScore = calculateLevelScore(answersForSection, false)
      if (section.percent > 0) {
        totalPositionScore += levelScore.value * section.percent
        totalPositionMax += levelScore.max * section.percent
      }
      return {
        section: section.section,
        score: levelScore
      }
    })
  }
  landScore.score = {
    value: Math.round((totalPositionScore / totalPositionMax) * 100) / 10,
    totalPositionScore,
    totalPositionMax,
    max: 10
  }
  return landScore
}

function calculateLevelScore (answers, shouldOutputBonus) {
  let totalScore = 0
  let totalMax = 0
  let totalBonusScore = 0
  let totalMaxBonusScore = 0
  answers.forEach(a => {
    if (a.questionId.adjustmentQuestion) {
      totalBonusScore += Number.parseFloat(a.responseScore)
      totalMaxBonusScore += Number.parseFloat(a.responseMax)
    } else {
      totalScore += Number.parseFloat(a.responseScore)
      totalMax += Number.parseFloat(a.responseMax)
    }
  })
  totalScore += totalBonusScore
  let value = (totalMax && answers.length) ? +((totalScore / totalMax) * 10).toFixed(1) : totalScore
  let max = (!totalMax || !answers.length) ? 0 : 10
  const results = { value, max }
  if (shouldOutputBonus) {
    results.bonus = {
      value: totalBonusScore,
      max: totalMaxBonusScore
    }
  }
  return results
}

function calculateAccessServiceScore (proximityAccessment, scoringRule) {
  const services = proximityAccessment.services
  const serviceScores = {
    services: [],
    score: {
      value: 0,
      max: 10
    }
  }
  let walkableServices = []
  let accessServiceScore = 0
  let accessServiceMax = 0
  scoringWeightings.assessServices.forEach(fact => {
    let serviceScore = 0
    let serviceMax = 0
    if (fact.section === 'walkability') {
      walkableServices = services.filter(service => {
        return service.travels.some(travel => travel.matchedTravelMode === 'walking') &&
          ['park', 'shopping', 'school'].some(s => s === service.serviceCategory)
      })
      serviceScores.services.push({
        serviceType: fact.section,
        percent: fact.percent,
        value: Math.min(walkableServices.length || 0, 30),
        max: Math.min(services.length, 30)
      })
    } else {
      if (scoringRule) {
        const catScoringRules = scoringRule.filter(rule => rule.categoryCode === fact.section)
        if (catScoringRules.length > 0) {
          catScoringRules.forEach(scoringRule => {
            const relevantServices = services.filter(service => {
              return (service.serviceCategory === scoringRule.categoryCode) &&
                (service.serviceType === scoringRule.typeCode) &&
                (service.serviceSubType === scoringRule.subTypeCode)
            })
            if (relevantServices.length !== 0) {
              const {totalScore, totalMaxScore} = getScoreForSubType(relevantServices, scoringRule)
              serviceScore += parseFloat(totalScore)
              serviceMax += parseFloat(totalMaxScore)
            }
          })
        }
      }
      serviceScore = serviceScore || 0
      serviceMax = serviceMax || 10
      if (serviceScore === 0) {
        serviceMax = 0
        const relevantServices = services.filter(service => service.serviceCategory === fact.section)
        const {totalScore, totalMaxScore} = getScoreForSubType(relevantServices, {calculationMethodCode: 'average-0'})
        serviceScore += parseFloat(totalScore)
        serviceMax += parseFloat(totalMaxScore)
      }
      serviceScore = serviceScore || 0
      serviceMax = serviceMax || 10
      let score = Math.round((serviceScore / serviceMax) * 100) / 10
      if (fact.percent) {
        accessServiceScore += score * fact.percent
        accessServiceMax += 10 * fact.percent
      }
      serviceScores.services.push({
        serviceType: fact.section,
        percent: fact.percent,
        value: score,
        max: 10
      })
    }
  })
  let value = (accessServiceScore / accessServiceMax) * 100
  // https://housepro.atlassian.net/browse/HOUS-577
  // Give additional points to the Access-To-Services score based on the total number of walkable services
  const bonus = walkableServices.length < 12 ? 0 :
          walkableServices.length < 15 ? 2 :
          walkableServices.length < 18 ? 5 :
          walkableServices.length < 21 ? 7 : 10
  value = Math.round(value + bonus) / 10
  serviceScores.score = {
    value,
    accessServiceScore,
    accessServiceMax,
    max: 10,
    bonus
  }
  return serviceScores
}

const getScoreForSubType = (relevantServices, scoringRule) => {
  const scoreType = scoringRule.calculationMethodCode.split('-')[0]
  let numberServicesUsed = parseInt(scoringRule.calculationMethodCode.split('-')[1])
  if (relevantServices.length < numberServicesUsed) {
    numberServicesUsed = relevantServices.length
  }
  let totalScore = 0
  let totalMaxScore = 0
  const scores = []
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
    scores.push({score, maxScore: maxScore || 10})
  })
  switch (scoreType) {
    case 'best':
      scores.sort((a, b) => b.score - a.score)
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
  return {
    totalScore: totalScore,
    totalMaxScore: totalMaxScore
  }
}

module.exports = {
  getAddressComponentValue,
  calculateLevelScore,
  calculatePositionScore,
  calculateLandScore,
  calculateAccessServiceScore
}
