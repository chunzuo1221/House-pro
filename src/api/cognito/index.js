import qs from 'qs'
import axios from 'axios'
import store from '@/store'
import { REFRESH_SESSION } from '@/store/action-types'
import {
  CognitoIdentityServiceProvider
} from 'aws-sdk'

let redirectUri = `${window.location.origin}/dashboard/login`
if (process.env.NODE_ENV === 'development') {
  redirectUri = `${window.location.origin}/login`
}
const loginUrl = `${process.env.cognito.APP_DOMAIN_NAME}/login?response_type=code&client_id=${process.env.cognito.APP_CLIENT_ID}&redirect_uri=${redirectUri}`
const signUpUrl = `${process.env.cognito.APP_DOMAIN_NAME}/signup?response_type=code&client_id=${process.env.cognito.APP_CLIENT_ID}&redirect_uri=${redirectUri}`
const tokenUrl = `${process.env.cognito.APP_DOMAIN_NAME}/oauth2/token`
const basicToken = () => {
  const clientId = process.env.cognito.APP_CLIENT_ID
  const clientSecret = process.env.cognito.APP_CLIENT_SECRET
  return 'Basic ' + window.btoa(`${clientId}:${clientSecret}`)
}
const oauth2Config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': basicToken()
  }
}
const providerOptions = {
  region: process.env.cognito.REGION
}

const login = () => {
  window.location = loginUrl
}

const signUp = () => {
  window.location = signUpUrl
}

const getTokensByCode = async (authorizationCode) => {
  const requestBody = qs.stringify({
    grant_type: 'authorization_code',
    client_id: process.env.cognito.APP_CLIENT_ID,
    code: authorizationCode,
    redirect_uri: redirectUri
  })
  const response = await axios.post(tokenUrl, requestBody, oauth2Config)
  return response.data
}

const getUpdatedTokens = async (refreshToken) => {
  const requestBody = qs.stringify({
    grant_type: 'refresh_token',
    client_id: process.env.cognito.APP_CLIENT_ID,
    refresh_token: refreshToken
  })
  const response = await axios.post(tokenUrl, requestBody, oauth2Config)
  return response.data
}

const isHealthyToken = async () => {
  try {
    return await store.dispatch(REFRESH_SESSION, {force: false})
  } catch (error) {
    return false
  }
}

const updateAttributes = (profile) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isHealthy = await isHealthyToken()
      if (isHealthy) {
        const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider(providerOptions)
        const params = {
          AccessToken: store.state.auth.session.accessToken,
          UserAttributes: [
            {
              Name: 'given_name',
              Value: profile.givenName
            }, {
              Name: 'family_name',
              Value: profile.familyName
            }, {
              Name: 'gender',
              Value: profile.gender
            }, {
              Name: 'birthdate',
              Value: profile.birthdate
            }
          ]
        }
        cognitoIdentityServiceProvider.updateUserAttributes(params, async (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      } else {
        reject(new Error('Refresh Token has been expired or something else is wrong'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

const changePassword = (creds) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isHealthy = await isHealthyToken()
      if (isHealthy) {
        const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider(providerOptions)
        const params = {
          AccessToken: store.state.auth.session.accessToken,
          PreviousPassword: creds.oldPassword,
          ProposedPassword: creds.newPassword
        }
        cognitoIdentityServiceProvider.changePassword(params, async (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      } else {
        reject(new Error('Refresh Token has been expired or something else is wrong'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

const globalSignOut = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const isHealthy = await isHealthyToken()
      if (isHealthy) {
        const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider(providerOptions)
        const params = {
          AccessToken: store.state.auth.session.accessToken
        }
        cognitoIdentityServiceProvider.globalSignOut(params, async (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      } else {
        reject(new Error('Refresh Token has been expired or something else is wrong'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

export default {
  login,
  signUp,
  getTokensByCode,
  getUpdatedTokens,
  isHealthyToken,
  updateAttributes,
  changePassword,
  globalSignOut
}
