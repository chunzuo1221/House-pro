import client from '../client'

const get = async () => {
  const response = await client({
    method: 'GET',
    url: '/api/suburb/rules'
  })
  return response.data
}

const getOne = async (proximityRuleId) => {
  const response = await client({
    method: 'GET',
    url: `/api/suburb/rules/${proximityRuleId}`
  })
  return response.data
}

const post = async (data) => {
  const response = await client({
    method: 'POST',
    url: '/api/suburb/rules',
    data
  })
  return response.data
}

const update = async (proximityRuleId, data) => {
  const response = await client({
    method: 'PUT',
    url: `/api/suburb/rules/${proximityRuleId}`,
    data
  })
  return response.data
}

const deleteOne = async (proximityRuleId) => {
  const response = await client({
    method: 'DELETE',
    url: `/api/suburb/rules/${proximityRuleId}`
  })
  return response.data
}

export default {
  get,
  getOne,
  post,
  update,
  deleteOne
}
