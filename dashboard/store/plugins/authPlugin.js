import { SET_TOKENS, REMOVE_TOKENS } from '../mutation-types'
import { saveAuthToStorage } from '@/utils'

// Mirrors cognito user tokens to local storage
const authPlugin = store => {
  store.subscribe(mutation => {
    if (mutation.type === SET_TOKENS || mutation.type === REMOVE_TOKENS) {
      let session = {
        idToken: '',
        accessToken: '',
        refreshToken: '',
        tokenType: '',
        expiresIn: 0
      }
      if (mutation.type === SET_TOKENS) {
        session = {
          ...store.state.auth.session,
          ...mutation.payload
        }
      }
      saveAuthToStorage(session)
    }
  })
}

export default authPlugin
