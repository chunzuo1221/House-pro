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

export default { get }
