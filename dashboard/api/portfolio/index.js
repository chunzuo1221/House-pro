import client from '../client'

const get = async (params) => {
  const response = await client({
    method: 'GET',
    url: '/api/portfolio',
    params
  })
  return response.data
}

const postProperty = async (data) => {
  const response = await client({
    method: 'POST',
    url: '/api/portfolio/property',
    data
  })
  return response.data
}

const archiveProperty = async (propertyId, data) => {
  const response = await client({
    method: 'PUT',
    url: `/api/portfolio/${propertyId}/archive`,
    data
  })
  return response.data
}

export default {
  get,
  postProperty,
  archiveProperty
}
