import client from '../client'

const get = async (propertyId, params) => {
  const response = await client({
    method: 'GET',
    url: `/api/properties/${propertyId}/survey/ranking`,
    params
  })
  return response.data
}

export default { get }
