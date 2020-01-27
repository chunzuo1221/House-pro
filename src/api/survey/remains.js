import client from '../client'

const get = async (propertyId, query) => {
  const response = await client({
    method: 'GET',
    url: `/api/properties/${propertyId}/survey/remains`,
    params: query ? {
      modules: query.modules,
      summaryQuestion: query.summaryQuestion
    } : null
  })
  return response.data
}

export default { get }
