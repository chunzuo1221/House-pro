import {
  SET_TOKENS,
  REMOVE_TOKENS,
  SET_USER_STATUS
} from '../../mutation-types'
import {
  REQUEST_ACCESS_TOKEN,
  REFRESH_SESSION,
  GLOBAL_SIGNOUT,
  UPDATE_PROFILE,
  CHANGE_PASSWORD
} from '../../action-types'
import Cognito from '@/api/cognito'
import jwt from 'jsonwebtoken'

export const UserGroup = {
  admin: 'HouseProAdmin',
  agent: 'HouseProAgent',
  user: 'HouseProUser'
}
/**
 * States for user access and profile set up
 */
export default {
  state: {
    session: {
      idToken: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: 0
    },
    status: {
      type: '',
      text: ''
    }
  },
  getters: {
    isAuthenticated: (state) => (state.session.accessToken),
    decodedToken: state => {
      return {
        access: {
          auth_time: 0,
          client_id: '',
          exp: 0,
          iat: 0,
          iss: '',
          jti: '',
          scope: '',
          sub: '',
          token_use: 'access',
          username: '',
          version: 0,
          ...jwt.decode(state.session.accessToken)
        },
        id: {
          // https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
          'cognito:username': '',
          'cognito:groups': [],
          name: '',
          given_name: '',
          family_name: '',
          middle_name: '',
          profile: '',
          picture: '',
          website: '',
          email: '',
          email_verified: false,
          gender: '',
          birthdate: '',
          zoneinfo: '',
          phone_number: '',
          phone_number_verified: false,
          address: '',
          updated_at: 0,
          at_hash: '',
          aud: '',
          auth_time: 0,
          exp: 0,
          iat: 0,
          iss: '',
          sub: '',
          token_use: 'id',
          ...jwt.decode(state.session.idToken)
        }
      }
    },
    userInfo: (state, getters) => {
      return {
        uuid: getters.decodedToken.id.sub,
        email: getters.decodedToken.id.email,
        givenName: getters.decodedToken.id.given_name,
        familyName: getters.decodedToken.id.family_name,
        gender: getters.decodedToken.id.gender,
        birthdate: getters.decodedToken.id.birthdate,
        groups: getters.decodedToken.id['cognito:groups']
      }
    },
    isAdmin: (state, getters) => {
      return getters.userInfo.groups.includes(UserGroup.admin)
    },
    isAgent: (state, getters) => {
      return getters.userInfo.groups.includes(UserGroup.agent)
    }
  },
  mutations: {
    [SET_USER_STATUS] (state, payload) {
      state.status.type = payload.status.type
      state.status.text = payload.status.text
    },
    [SET_TOKENS] (state, payload) {
      state.session = {
        ...state.session,
        ...payload
      }
    },
    [REMOVE_TOKENS] (state) {
      state.session = {
        idToken: '',
        accessToken: '',
        refreshToken: '',
        tokenType: '',
        expiresIn: 0
      }
    }
  },
  actions: {
    [REQUEST_ACCESS_TOKEN]: async ({commit}, payload) => {
      const response = await Cognito.getTokensByCode(payload.code)
      commit(SET_TOKENS, {
        idToken: response.id_token,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        tokenType: response.token_type,
        expiresIn: response.expires_in
      })
    },
    [REFRESH_SESSION]: async ({dispatch, commit, state}, payload) => {
      const { force } = payload
      const { accessToken, refreshToken } = state.session
      const { exp } = jwt.decode(accessToken)
      if (!force && exp > (Date.now() / 1000) + 300/* token refresh threshold: 5 mins by default */) {
        console.log('session is healthy.')
        return true
      }
      // if access token is expired, then fetch new access token from cognito user pool
      console.log('token expired.')
      if (refreshToken) {
        const session = await Cognito.getUpdatedTokens(refreshToken)
        console.log('session refreshed.')
        commit(SET_TOKENS, {
          idToken: session.id_token,
          accessToken: session.access_token,
          expiresIn: session.expires_in
        })
        return true
      }
      dispatch(GLOBAL_SIGNOUT)
      return false
    },
    [GLOBAL_SIGNOUT]: async ({commit}) => {
      commit(REMOVE_TOKENS)
      await Cognito.globalSignOut()
    },
    [UPDATE_PROFILE]: async ({dispatch}, payload) => {
      await Cognito.updateAttributes(payload)
      await dispatch(REFRESH_SESSION, {force: true})
    },
    [CHANGE_PASSWORD]: async ({commit}, payload) => {
      await Cognito.changePassword(payload)
    }
  }
}
