import client from '../client'

const get = async (params) => {
  const response = await client({
    method: 'GET',
    url: '/api/properties',
    authRequired: false,
    params: params
  })
  return response.data
}

const getPropertiesBySuburb = async (params) => {
  const response = await client({
    method: 'GET',
    url: '/api/suburb/properties',
    params
  })
  return response.data
}

const getById = async (id) => {
  const response = await client({
    method: 'GET',
    url: `/api/properties/${id}`,
    authRequired: false
  })
  return response.data
}

const getSurveyScore = async (propertyId, data) => {
  const response = await client({
    method: 'POST',
    url: `/api/properties/${propertyId}/survey/score`,
    authRequired: false,
    data
  })
  return response.data
}

const updateSurveyScore = async (propertyId, data) => {
  const response = await client({
    method: 'POST',
    url: `/api/properties/${propertyId}/survey/score?renew`,
    data
  })
  return response.data
}

const getAverageScores = async (params) => {
  const response = await client({
    method: 'GET',
    url: `/api/properties/survey/averagescores`,
    params
  })
  return response.data
}

const getRefreshExternalData = async (propertyId) => {
  const response = await client({
    method: 'GET',
    url: `/api/properties/${propertyId}/provider/refresh`
  })
  return response.data
}

const getAssessmentForSuburbService = async (propertyId, params) => {
  const response = await client({
    method: 'GET',
    url: `/api/properties/${propertyId}/suburb/assessment`,
    authRequired: false,
    params
  })
  return response.data
}

const post = async (data) => {
  const response = await client({
    method: 'POST',
    url: '/api/properties',
    authRequired: false,
    data
  })
  return response.data
}

const resetProximityAssessment = async (propertyId) => {
  const response = await client({
    method: 'DELETE',
    url: `/api/properties/${propertyId}/suburb/reset`
  })
  return response.data
}

const put = async (id, data) => {
  const response = await client({
    method: 'PUT',
    url: `/api/properties/${id}`,
    authRequired: false,
    data
  })
  return response.data
}

const getLocationScore = async (propertyId, postCode) => {
  const response = await client({
    method: 'GET',
    url: `/api/properties/${propertyId}/${postCode}/location_score`,
    authRequired: false
  })
  return response.data
}

const getComparativeRankings = async (propertyId) => {
  const response = await client({
    method: 'GET',
    url: `/api/properties/${propertyId}/comparative_rankings`
  })
  return response.data
}

const getOnMarketProperties = async (postCode) => {
  const response = await client({
    method: 'GET',
    url: `/api/properties/on_market_properties/${postCode}`
  })
  return response.data
}

export default {
  get,
  put,
  post,
  getById,
  getSurveyScore,
  updateSurveyScore,
  getAverageScores,
  getRefreshExternalData,
  getAssessmentForSuburbService,
  resetProximityAssessment,
  getPropertiesBySuburb,
  getLocationScore,
  getComparativeRankings,
  getOnMarketProperties
}
