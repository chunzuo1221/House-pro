import client from '../client'

const get = async (params) => {
  const response = await client({
    method: 'GET',
    url: '/api/questions',
    params
  })
  return response.data
}

const autocomplete = async (params) => {
  const response = await client({
    method: 'GET',
    url: '/api/questions/autocomplete',
    params: { text: params.text }
  })
  return response.data
}

const getOne = async (id) => {
  const response = await client({
    method: 'GET',
    url: `/api/questions/${id}`
  })
  return response.data
}

const post = async (data) => {
  const response = await client({
    method: 'POST',
    url: '/api/questions/',
    data
  })
  return response.data
}

const put = async (id, data) => {
  const response = await client({
    method: 'PUT',
    url: `/api/questions/${id}`,
    data
  })
  return response.data
}

export default {
  get,
  getOne,
  post,
  put,
  autocomplete
}
