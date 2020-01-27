import client from '../client'

const getServiceClassification = async () => {
  const response = await client({
    method: 'GET',
    url: `/api/referencedata/services`
  })
  return response.data
}

const getQuestionClassification = async () => {
  const response = await client({
    method: 'GET',
    url: `/api/referencedata/question`
  })
  return response.data
}

const getScoringruleClassification = async () => {
  const response = await client({
    method: 'GET',
    url: `/api/referencedata/scoring_rules`
  })
  return response.data
}

const getAnalysisTypes = async () => {
  const response = await client({
    method: 'GET',
    url: `/api/referencedata/analysis_types`
  })
  return response.data
}

const getCalculationMethods = async () => {
  const response = await client({
    method: 'GET',
    url: `/api/referencedata/calculation_methods`
  })
  return response.data
}

const getReportContentTypes = async () => {
  const response = await client({
    method: 'GET',
    url: `/api/referencedata/report_content_types`
  })
  return response.data
}

const getPropertyTypes = async () => {
  const response = await client({
    method: 'GET',
    url: `/api/referencedata/property_types`
  })
  return response.data
}

export default {
  getServiceClassification,
  getQuestionClassification,
  getAnalysisTypes,
  getScoringruleClassification,
  getCalculationMethods,
  getReportContentTypes,
  getPropertyTypes
}
