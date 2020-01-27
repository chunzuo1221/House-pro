import client from '../client'

const get = async (params) => {
  const response = await client({
    method: 'GET',
    url: '/api/contentfragments',
    authRequired: false,
    params
  })
  return response.data
}

const update = async (data) => {
  const response = await client({
    method: 'POST',
    url: `/api/contentfragments`,
    data
  })
  return response.data
}

const deleteFragment = async (id) => {
  const response = await client({
    method: 'DELETE',
    url: `/api/contentfragments/${id}`
  })
  return response.data
}

export default {
  get,
  update,
  deleteFragment
}
