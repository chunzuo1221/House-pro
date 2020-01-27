import GoogleMapsApiLoader from 'google-maps-api-loader'
import { SET_CONFIG_STATE } from '../../mutation-types'
import { LOAD_GOOGLE_MAPS_API } from '../../action-types'

export default {
  state: {
    googleApi: null
  },
  mutations: {
    [SET_CONFIG_STATE] (state, payload) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    }
  },
  actions: {
    [LOAD_GOOGLE_MAPS_API]: async ({commit}) => {
      const googleApi = await GoogleMapsApiLoader({
        apiKey: process.env.google.GOOGLE_API_KEY,
        libraries: ['places'],
        language: 'en'
      })
      commit(SET_CONFIG_STATE, {googleApi})
    }
  }
}
