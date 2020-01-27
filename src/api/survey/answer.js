import client from '../client'

const get = async (propertyId, params) => {
  const response = await client({
    method: 'GET',
    url: `/api/properties/${propertyId}/survey/answer`,
    authRequired: false,
    params
  })
  return response.data
}

const getAnswers = async (propertyId) => {
  const response = await client({
    method: 'GET',
    url: `/api/properties/${propertyId}/survey/answers`
  })
  return response.data
}

const post = async (data) => {
  const response = await client({
    method: 'POST',
    url: `/api/properties/${data.propertyId}/survey/answer`,
    data
  })
  return response.data
}
const publishAnswer = async (surveyId, data) => {
  const response = await client({
    method: 'POST',
    url: `/api/surveyanswer/${surveyId}/publish`,
    data
  })
  return response.data
}

export default { get, post, publishAnswer, getAnswers }
