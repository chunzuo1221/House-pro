import axios from 'axios'
import store from '@/store'
import Cognito from './cognito'

const protocol = process.env.ssl ? 'https' : 'http'
const host = process.env.api.host
const port = process.env.api.port === 80 ? '' : `:${process.env.api.port}`
axios.defaults.baseURL = `${protocol}://${host}${port}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

const authHeader = () => ({
  Authorization: `${store.state.auth.session.tokenType} ${store.state.auth.session.accessToken}:${store.state.auth.session.idToken}`
})

const client = async (params) => {
  const authRequired = typeof params.authRequired === 'undefined' || params.authRequired
  let isValidToken = true
  if (authRequired) {
    isValidToken = await Cognito.isHealthyToken()
  }
  if (isValidToken) {
    return axios({
      method: params.method,
      url: params.url,
      headers: authRequired ? authHeader() : {},
      data: typeof params.data !== 'undefined' ? params.data : {},
      params: typeof params.params !== 'undefined' ? params.params : {}
    })
  }
  return {}
}

export default client
