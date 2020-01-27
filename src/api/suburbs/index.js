import client from '../client'

const get = async (params) => {
  const response = await client({
    method: 'GET',
    url: '/api/suburbs',
    authRequired: false,
    params
  })
  return response.data
}

const getSuburbPostCodes = async () => {
  const response = await client({
    method: 'GET',
    url: '/api/suburb_postcodes',
    authRequired: false
  })
  return response.data
}

const getOne = async (suburbId) => {
  const response = await client({
    method: 'GET',
    url: `/api/suburbs/${suburbId}`
  })
  return response.data
}

const post = async (data) => {
  const response = await client({
    method: 'POST',
    url: '/api/suburbs',
    data
  })
  return response.data
}

const update = async (suburbId, data) => {
  const response = await client({
    method: 'PUT',
    url: `/api/suburbs/${suburbId}`,
    data
  })
  return response.data
}

const deleteOne = async (suburbId) => {
  const response = await client({
    method: 'DELETE',
    url: `/api/suburbs/${suburbId}`
  })
  return response.data
}

export default {
  get,
  getOne,
  post,
  update,
  deleteOne,
  getSuburbPostCodes
}
