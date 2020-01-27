import PortfolioApi from '@/api/portfolio'
import {
  SET_CURRENT_PROPERTY,
  SET_PORTFOLIO_PROPERTIES,
  SET_PROPERTY_SUBURB,
  SET_PROXIMITY_ASSESSMENT,
  SET_COMPARATIVE_RANKINGS,
  SET_COMPARED_PROPERTY_IDS,
  SET_SURVEY_ANSWER,
  SET_COMPARED_PROPERTY_DETAILS,
  SET_PROPERTY_DETAIL,
  SET_ON_MARKET_PROPERTIES,
  SET_FIRST_VISIT,
  SET_PROGRESS
} from '../mutation-types'
import {
  FETCH_PORTFOLIO,
  FETCH_PROPERTY_DETAIL,
  ADD_PROPERTY,
  UPDATE_PROPERTY_DETAIL,
  REFRESH_GET_PROPERTY_EXTERNAL_DATA,
  FETCH_PROPERTY_SUBURB,
  FETCH_COMPARATIVE_RANKINGS,
  FETCH_PROXIMITY_ASSESSMENT,
  FETCH_SERVICE_CLASSIFICATION,
  FETCH_SURVEY_ANSWER,
  FETCH_COMPARED_PROPERTY_DETAILS,
  RESET_PROPERTY_DETAIL,
  FETCH_ON_MARKET_PROPERTIES,
  UPDATE_PORTFOLIO_PROPERTIES
} from '../action-types'
import {
  getPropertyAddressComponentValue,
  getInterestedPropertyFromStorage
} from '../../utils'
import PropertyApi from '@/api/properties'
import SuburbApi from '@/api/suburbs'
import AnswerApi from '@/api/survey/answer'
import Promise from 'bluebird'

export default {
  state: {
    properties: [],
    currentProperty: {
      property: null,
      suburb: null,
      proximityAssessment: null,
      comparativeRankings: null,
      surveyAnswer: null
    },
    comparedPropertyIds: [],
    comparedPropertyDetails: [],
    onMarketProperties: [],
    isFirstVisit: false,
    apiCalls: {
      FETCH_PORTFOLIO: {
        text: `Building Your Portfolio...`,
        pending: false,
        error: null
      },
      FETCH_PROPERTY_DETAIL: {
        text: 'Collecting Property Data from HousePro Database...',
        pending: false,
        error: null
      },
      FETCH_PROXIMITY_ASSESSMENT: {
        text: 'Performing Suburb Assessment...',
        pending: false,
        error: null
      },
      FETCH_SURVEY_ANSWER: {
        text: 'Evaluating Property Survey...',
        pending: false,
        error: null
      },
      FETCH_PROPERTY_SUBURB: {
        text: 'Linking Postcode...',
        pending: false,
        error: null
      },
      FETCH_COMPARATIVE_RANKINGS: {
        text: 'Calculating Rankings...',
        pending: false,
        error: null
      },
      FETCH_ON_MARKET_PROPERTIES: {
        text: 'Finding Similar On-Market Properties...',
        pending: false,
        error: null
      }
    }
  },
  getters: {
    pendingCalls: state => {
      return Object.keys(state.apiCalls)
        .map(call => state.apiCalls[call])
        .filter(call => call.pending)
    }
  },
  mutations: {
    [SET_PORTFOLIO_PROPERTIES]: (state, payload) => {
      state.properties = payload
    },
    [SET_CURRENT_PROPERTY]: (state, payload) => {
      state.currentProperty = {
        ...state.currentProperty,
        property: payload
      }
      const index = state.properties.findIndex(o => o._id === state.currentProperty.property._id)
      if (index > -1) {
        state.properties[index] = {
          ...state.currentProperty.property,
          ...payload
        }
      }
    },
    [SET_PROPERTY_DETAIL]: (state, payload) => {
      state.currentProperty = payload
    },
    [SET_PROPERTY_SUBURB]: (state, payload) => {
      state.currentProperty = {
        ...state.currentProperty,
        suburb: payload
      }
    },
    [SET_PROXIMITY_ASSESSMENT]: (state, payload) => {
      state.currentProperty = {
        ...state.currentProperty,
        proximityAssessment: payload
      }
    },
    [SET_COMPARATIVE_RANKINGS] (state, payload) {
      state.currentProperty = {
        ...state.currentProperty,
        comparativeRankings: payload
      }
    },
    [SET_COMPARED_PROPERTY_IDS] (state, payload) {
      state.comparedPropertyIds = payload
    },
    [SET_SURVEY_ANSWER] (state, payload) {
      state.currentProperty = {
        ...state.currentProperty,
        surveyAnswer: payload
      }
    },
    [SET_COMPARED_PROPERTY_DETAILS] (state, payload) {
      const {propertyId, detail} = payload
      const index = state.comparedPropertyDetails.findIndex(o => o.property._id === propertyId)
      if (index > -1) {
        state.comparedPropertyDetails.splice(index, 1, {
          ...state.comparedPropertyDetails[index],
          ...detail
        })
      } else {
        state.comparedPropertyDetails.push(detail)
      }
    },
    [SET_ON_MARKET_PROPERTIES] (state, payload) {
      if (payload && payload.length) {
        state.onMarketProperties = payload.filter(o => o._id !== state.currentProperty.property._id)
      } else {
        state.onMarketProperties = []
      }
    },
    [SET_FIRST_VISIT] (state, isFirstVisit) {
      state.isFirstVisit = isFirstVisit
    },
    [SET_PROGRESS] (state, payload) {
      const {name, pending, error} = payload
      if (state.apiCalls[name]) {
        state.apiCalls[name].pending = error ? false : pending
        state.apiCalls[name].error = error || null
      }
    }
  },
  actions: {
    [FETCH_PORTFOLIO]: async ({ dispatch, commit }, payload = {}) => {
      try {
        await dispatch(RESET_PROPERTY_DETAIL)
        commit(SET_PORTFOLIO_PROPERTIES, [])
        commit(SET_PROGRESS, {name: FETCH_PORTFOLIO, pending: true})
        const portfolio = await PortfolioApi.get(payload)
        commit(SET_PROGRESS, {name: FETCH_PORTFOLIO, pending: false})
        if (portfolio) {
          commit(SET_PORTFOLIO_PROPERTIES, portfolio.properties)
        } else {
          commit(SET_FIRST_VISIT, true)
          const formattedAddress = getInterestedPropertyFromStorage()
          if (formattedAddress) {
            await dispatch(ADD_PROPERTY, {
              property: {
                formatted_address: formattedAddress
              }
            })
          }
        }
      } catch (error) {
        commit(SET_PROGRESS, {name: FETCH_PORTFOLIO, error})
        console.log(error)
      }
    },
    [UPDATE_PORTFOLIO_PROPERTIES]: async ({ commit }, payload = []) => {
      try {
        commit(SET_PORTFOLIO_PROPERTIES, payload)
      } catch (error) {
        console.log(error)
      }
    },
    [FETCH_PROPERTY_DETAIL]: async ({ dispatch, commit, state }, propertyId) => {
      const property = state.properties.find(o => o._id === propertyId)
      await dispatch(RESET_PROPERTY_DETAIL)
      if (property) {
        commit(SET_COMPARED_PROPERTY_IDS, [])
        Promise.all([
          Promise.resolve().then(() => {
            commit(SET_PROGRESS, {name: FETCH_PROPERTY_DETAIL, pending: true})
            PropertyApi.getById(propertyId)
              .then(property => {
                commit(SET_PROGRESS, {name: FETCH_PROPERTY_DETAIL, pending: false})
                commit(SET_CURRENT_PROPERTY, property)
              })
              .catch(error => {
                commit(SET_PROGRESS, {name: FETCH_PROPERTY_DETAIL, error})
              })
          }),
          dispatch(FETCH_SERVICE_CLASSIFICATION),
          dispatch(FETCH_COMPARATIVE_RANKINGS, {propertyId}),
          dispatch(FETCH_PROXIMITY_ASSESSMENT, {propertyId}),
          dispatch(FETCH_SURVEY_ANSWER, {propertyId}),
          dispatch(FETCH_PROPERTY_SUBURB, {postCode: getPropertyAddressComponentValue(property, 'postal_code')})
        ]).then(() => {
          commit(SET_COMPARED_PROPERTY_IDS, [propertyId])
          dispatch(FETCH_ON_MARKET_PROPERTIES)
        }).catch(error => {
          if (error.response && error.response.status === 401) {
            window.location = '/login'
          }
        })
      }
    },
    [FETCH_SURVEY_ANSWER]: async ({commit}, {propertyId}) => {
      try {
        commit(SET_PROGRESS, {name: FETCH_SURVEY_ANSWER, pending: true})
        const answer = await AnswerApi.get(propertyId, {})
        commit(SET_PROGRESS, {name: FETCH_SURVEY_ANSWER, pending: false})
        commit(SET_SURVEY_ANSWER, answer)
      } catch (error) {
        commit(SET_PROGRESS, {name: FETCH_SURVEY_ANSWER, error})
        commit(SET_SURVEY_ANSWER, null)
        console.log(error)
      }
    },
    [ADD_PROPERTY]: async ({ commit }, { property }) => {
      try {
        const portfolio = await PortfolioApi.postProperty(property)
        commit(SET_PORTFOLIO_PROPERTIES, portfolio.properties)
      } catch (error) {
        console.log(error)
      }
    },
    [UPDATE_PROPERTY_DETAIL]: async ({commit, state}, payload) => {
      try {
        await PropertyApi.put(state.currentProperty.property._id, payload)
        commit(SET_CURRENT_PROPERTY, {
          ...state.currentProperty.property,
          ...payload
        })
      } catch (error) {
        console.log(error)
      }
    },
    [REFRESH_GET_PROPERTY_EXTERNAL_DATA]: async ({commit, state}) => {
      const externalData = await PropertyApi.getRefreshExternalData(state.currentProperty.property._id)
      commit(SET_CURRENT_PROPERTY, {
        ...state.currentProperty.property,
        externalData
      })
    },
    [FETCH_PROPERTY_SUBURB]: async ({commit}, {postCode}) => {
      commit(SET_PROGRESS, {name: FETCH_PROPERTY_SUBURB, pending: true})
      try {
        const suburbs = await SuburbApi.get({postCode})
        commit(SET_PROGRESS, {name: FETCH_PROPERTY_SUBURB, pending: false})
        if (suburbs && suburbs[0]) {
          commit(SET_PROPERTY_SUBURB, suburbs[0])
        }
      } catch (error) {
        commit(SET_PROGRESS, {name: FETCH_PROPERTY_SUBURB, error})
      }
    },
    [FETCH_PROXIMITY_ASSESSMENT]: ({commit}, {propertyId}) => {
      commit(SET_PROGRESS, {name: FETCH_PROXIMITY_ASSESSMENT, pending: true})
      commit(SET_PROXIMITY_ASSESSMENT, null)
      return PropertyApi.getAssessmentForSuburbService(propertyId, {force: false})
        .then(proximityAssessment => {
          commit(SET_PROGRESS, {name: FETCH_PROXIMITY_ASSESSMENT, pending: false})
          commit(SET_PROXIMITY_ASSESSMENT, proximityAssessment)
        })
        .catch(error => {
          commit(SET_PROGRESS, {name: FETCH_PROXIMITY_ASSESSMENT, error})
        })
    },
    [FETCH_COMPARATIVE_RANKINGS]: ({commit}, payload) => {
      const { propertyId } = payload
      if (propertyId) {
        commit(SET_PROGRESS, {name: FETCH_COMPARATIVE_RANKINGS, pending: true})
        PropertyApi.getComparativeRankings(propertyId)
          .then(comparativeRankings => {
            commit(SET_PROGRESS, {name: FETCH_COMPARATIVE_RANKINGS, pending: false})
            commit(SET_COMPARATIVE_RANKINGS, comparativeRankings)
            return comparativeRankings
          })
          .catch(error => {
            commit(SET_PROGRESS, {name: FETCH_COMPARATIVE_RANKINGS, error})
            commit(SET_COMPARATIVE_RANKINGS, null)
            return null
          })
      }
    },
    [FETCH_COMPARED_PROPERTY_DETAILS] ({commit, state}) {
      const {properties, comparedPropertyIds, comparedPropertyDetails} = state
      if (comparedPropertyIds.length) {
        const propertyIds = comparedPropertyIds.filter(id => !comparedPropertyDetails.some(o => o && o.property && o.property._id === id))
        if (propertyIds.length) {
          propertyIds.forEach((propertyId) => {
            commit(SET_COMPARED_PROPERTY_DETAILS, {
              propertyId,
              detail: { property: properties.find(o => o._id === propertyId) }
            })
            return Promise.all([
              PropertyApi.getComparativeRankings(propertyId)
                .then(comparativeRankings => {
                  commit(SET_COMPARED_PROPERTY_DETAILS, {
                    propertyId,
                    detail: { comparativeRankings }
                  })
                }),
              PropertyApi.getAssessmentForSuburbService(propertyId, {force: false})
                .then(proximityAssessment => {
                  commit(SET_COMPARED_PROPERTY_DETAILS, {
                    propertyId,
                    detail: { proximityAssessment }
                  })
                }),
              AnswerApi.get(propertyId)
                .then(surveyAnswer => {
                  commit(SET_COMPARED_PROPERTY_DETAILS, {
                    propertyId,
                    detail: { surveyAnswer }
                  })
                })
            ])
          })
        }
      }
    },
    [RESET_PROPERTY_DETAIL]: ({commit}) => {
      let payload = {
        property: null,
        suburb: null,
        proximityAssessment: null,
        comparativeRankings: null,
        surveyAnswer: null
      }
      commit(SET_PROPERTY_DETAIL, payload)
    },
    [FETCH_ON_MARKET_PROPERTIES]: ({commit, state}) => {
      const {currentProperty} = state
      commit(SET_PROGRESS, {name: FETCH_ON_MARKET_PROPERTIES, pending: true})
      commit(SET_ON_MARKET_PROPERTIES, [])
      let postCode = ''
      if (currentProperty.suburb) {
        postCode = currentProperty.suburb.postCode
      } else if (currentProperty.property) {
        postCode = getPropertyAddressComponentValue(currentProperty.property.address_co, 'postal_code')
      }
      if (postCode) {
        PropertyApi.getOnMarketProperties(postCode)
          .then(response => {
            commit(SET_PROGRESS, {name: FETCH_ON_MARKET_PROPERTIES, pending: false})
            commit(SET_ON_MARKET_PROPERTIES, response)
          })
          .catch(error => {
            commit(SET_PROGRESS, {name: FETCH_ON_MARKET_PROPERTIES, error})
          })
      }
    }
  }
}
