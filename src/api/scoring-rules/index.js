import client from '../client'

const get = async (postCode) => {
  const response = await client({
    method: 'GET',
    url: `/api/suburb/scoringrules/${postCode}`,
    authRequired: false
  })
  return response.data
}

const post = async (data) => {
  const response = await client({
    method: 'POST',
    url: '/api/suburb/scoringrules',
    authRequired: true,
    data
  })
  return response.data
}

const update = async (scoringRuleID, data) => {
  const response = await client({
    method: 'PUT',
    url: `/api/suburbs/scoringrules/${scoringRuleID}`,
    authRequired: true,
    data
  })
  return response.data
}

export default {
  get,
  post,
  update
}
