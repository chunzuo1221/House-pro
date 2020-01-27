import {
  SET_SUBURBS,
  SET_CURRENT_SUBURB,
  SET_ORIGINAL_SUBURB
} from '../../mutation-types'
import {
  UPSERT_SUBURB,
  DELETE_SUBURB,
  FETCH_SUBURBS,
  INIT_CURRENT_SUBURB,
  FETCH_CURRENT_SUBURB,
  SAVE_SUBURB_SERVICE,
  DELETE_SUBURB_SERVICE,
  SAVE_SUBURB_DATA_PROVIDER,
  DELETE_SUBURB_DATA_PROVIDER
} from '../../action-types'
import { isEqual, getHash } from '../../../utils'
import SuburbApi from '@/api/suburbs'
import { cloneDeep } from 'lodash'

/**
 * States for Suburb research management (for Admin)
 */
const initSuburb = () => ({
  _id: '',
  postCode: '',
  name: '',
  services: [],
  dataProviders: [],
  overviewDescription: '',
  mappings: []
})
export default {
  state: {
    suburbs: [],
    currentSuburb: initSuburb(),
    originalSuburb: initSuburb(),
    hasPendingChanges: false
  },
  getters: {
    getSuburbs: state => state.suburbs.map(o => {
      o.servicesTotal = o.services.length
      return o
    })
  },
  mutations: {
    [SET_SUBURBS]: (state, payload) => {
      state.suburbs = payload.suburbs
    },
    [SET_CURRENT_SUBURB]: (state, payload) => {
      state.currentSuburb = {
        ...state.currentSuburb,
        ...payload.suburb
      }
      const current = cloneDeep(state.currentSuburb)
      const original = cloneDeep(state.originalSuburb)
      state.hasPendingChanges = !isEqual(current, original)
    },
    [SET_ORIGINAL_SUBURB]: (state, payload) => {
      state.originalSuburb = cloneDeep({...state.originalSuburb, ...payload.suburb})
    }
  },
  actions: {
    [FETCH_SUBURBS]: async ({commit}) => {
      const suburbs = await SuburbApi.get()
      commit(SET_SUBURBS, {suburbs})
    },
    [UPSERT_SUBURB]: async ({commit, state}, payload) => {
      let suburbs
      if (payload.suburb.services) {
        payload.suburb.services.forEach(s => {
          if (s._id.startsWith('NEWSERVICE')) {
            delete s._id
          }
        })
      }
      if (payload.suburb.dataProviders) {
        payload.suburb.dataProviders.forEach(p => {
          if (p._id.startsWith('NEWPROVIDER')) {
            delete p._id
          }
        })
      }
      if (payload.suburb._id) {
        const updatedOne = await SuburbApi.update(payload.suburb._id, payload.suburb)
        suburbs = state.suburbs.map(o => {
          if (o._id === updatedOne._id) {
            return updatedOne
          }
          return o
        })
      } else {
        await SuburbApi.post(payload.suburb)
        suburbs = await SuburbApi.get()
      }
      commit(SET_ORIGINAL_SUBURB, {suburb: payload.suburb})
      commit(SET_CURRENT_SUBURB, {suburb: payload.suburb})
      commit(SET_SUBURBS, {suburbs})
    },
    [DELETE_SUBURB]: async ({commit}, payload) => {
      await SuburbApi.deleteOne(payload._id)
      const suburbs = await SuburbApi.get()
      commit(SET_SUBURBS, {suburbs})
    },
    [FETCH_CURRENT_SUBURB]: async ({commit, state}, payload) => {
      let suburb = state.suburbs.find(o => o._id === payload._id)
      if (!suburb) {
        suburb = await SuburbApi.getOne(payload._id)
      }
      commit(SET_ORIGINAL_SUBURB, {suburb})
      commit(SET_CURRENT_SUBURB, {suburb})
    },
    [INIT_CURRENT_SUBURB]: async ({commit}) => {
      commit(SET_ORIGINAL_SUBURB, {suburb: initSuburb()})
      commit(SET_CURRENT_SUBURB, {suburb: initSuburb()})
    },
    [SAVE_SUBURB_SERVICE]: ({commit, state}, payload) => {
      const service = {...payload.service}
      const services = state.currentSuburb.services || []
      let index = -1
      if (!service._id) {
        service._id = `NEWSERVICE${getHash(service)}`
      }
      index = services.findIndex(o => o._id === service._id)
      if (index < 0) {
        services.push(service)
      } else {
        services.splice(index, 1, service)
      }
      commit(SET_CURRENT_SUBURB, {
        suburb: {
          ...state.currentSuburb,
          services: [...services]
        }
      })
    },
    [DELETE_SUBURB_SERVICE]: ({commit, state}, payload) => {
      const services = state.currentSuburb.services
      const index = services.findIndex(o => o._id === payload.serviceId)
      services.splice(index, 1)
      commit(SET_CURRENT_SUBURB, {
        suburb: {
          ...state.currentSuburb,
          services
        }
      })
    },
    [SAVE_SUBURB_DATA_PROVIDER]: ({commit, state}, payload) => {
      const provider = {...payload.provider}
      const dataProviders = state.currentSuburb.dataProviders || []
      let index = -1
      if (!provider._id) {
        provider._id = `NEWPROVIDER${getHash(provider)}`
      }
      index = dataProviders.findIndex(o => o._id === provider._id)
      if (index < 0) {
        dataProviders.push(provider)
      } else {
        dataProviders.splice(index, 1, provider)
      }
      commit(SET_CURRENT_SUBURB, {
        suburb: {
          ...state.currentSuburb,
          dataProviders: [...dataProviders]
        }
      })
    },
    [DELETE_SUBURB_DATA_PROVIDER]: ({commit, state}, payload) => {
      const dataProviders = state.currentSuburb.dataProviders
      const index = dataProviders.findIndex(o => o._id === payload.providerId)
      dataProviders.splice(index, 1)
      commit(SET_CURRENT_SUBURB, {
        suburb: {
          ...state.currentSuburb,
          dataProviders
        }
      })
    }
  }
}
