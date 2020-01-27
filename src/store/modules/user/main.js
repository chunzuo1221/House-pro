import { Promise } from 'bluebird'
import {
  SET_SURVEY_ANSWER,
  SET_USER_PROPERTY,
  SET_PROPERTY_SUBURB,
  SET_PROPERTY_SURVEYS,
  SET_PROPERTY_QUESTIONS,
  SET_OVERALL_ASSESSMENT,
  SET_LAND_HOUSE_ASSESSMENT,
  SET_LOCATION_ASSESSMENT,
  SET_PROPERTY_CONTENT_FRAGMENTS,
  SET_SURVEY_QUESTIONS,
  SET_PROXIMITY_ASSESSMENT,
  SET_COMPARATIVE_RANKING,
  SET_REMAINED_QUESTIONS
} from '../../mutation-types'
import {
  FETCH_USER_PROPERTY,
  SEARCH_QUESTIONS,
  FETCH_SURVEY_ANSWER,
  FETCH_PROPERTY_SUBURB,
  SUBMIT_SURVEY_ANSWER,
  FETCH_PROPERTY_SUMMARY,
  FETCH_LOCATION_SUMMARY,
  FETCH_PROXIMITY_ASSESSMENT,
  FETCH_LAND_HOUSE_ASSESSMENT,
  FETCH_REMAINED_QUESTIONS
} from '../../action-types'
import Cognito from '@/api/cognito'
import SuburbApi from '@/api/suburbs'
import QuestionApi from '@/api/questions'
import PropertyApi from '@/api/properties'
import AnswerApi from '@/api/survey/answer'
import RankingApi from '@/api/survey/ranking'
import RemainedQuestions from '@/api/survey/remains'
import ContentFragmentApi from '@/api/content-fragments'

export default {
  state: {
    property: null,
    questions: [],
    suburb: null,
    surveys: [],
    surveyanswer: null,
    clonedFrom: null,
    surveyQuestions: [],
    contentFragments: [],
    overallAssessment: null,
    landHouseAssessment: null,
    locationAssessment: null,
    proximityAssessment: null,
    comparativeRanking: null,
    remainedQuestions: []
  },
  getters: {},
  mutations: {
    [SET_USER_PROPERTY] (state, payload) {
      state.property = payload
    },
    [SET_PROPERTY_SUBURB] (state, payload) {
      state.suburb = payload
    },
    [SET_PROPERTY_QUESTIONS] (state, payload) {
      state.questions = payload
    },
    [SET_PROPERTY_SURVEYS] (state, payload) {
      state.surveys = payload
    },
    [SET_SURVEY_ANSWER] (state, payload) {
      state.surveyanswer = payload
    },
    [SET_OVERALL_ASSESSMENT] (state, payload) {
      state.overallAssessment = payload
    },
    [SET_LAND_HOUSE_ASSESSMENT] (state, payload) {
      state.landHouseAssessment = payload
    },
    [SET_LOCATION_ASSESSMENT] (state, payload) {
      state.locationAssessment = payload
    },
    [SET_PROPERTY_CONTENT_FRAGMENTS] (state, payload) {
      state.contentFragments = payload
    },
    [SET_SURVEY_QUESTIONS] (state, payload) {
      state.surveyQuestions = payload
    },
    [SET_PROXIMITY_ASSESSMENT] (state, payload) {
      state.proximityAssessment = payload
    },
    [SET_COMPARATIVE_RANKING] (state, payload) {
      state.comparativeRanking = payload
    },
    [SET_REMAINED_QUESTIONS] (state, payload) {
      state.remainedQuestions = payload
    }
  },
  actions: {
    [FETCH_USER_PROPERTY]: async ({ commit, state }, payload) => {
      const { propertyId } = payload
      if (propertyId && (!state.property || propertyId !== state.property._id)) {
        try {
          const property = await PropertyApi.getById(propertyId)
          commit(SET_USER_PROPERTY, property)
        } catch (error) {
          commit(SET_USER_PROPERTY, null)
          if (error.response && error.response.status === 401) {
            Cognito.login()
          }
        }
      }
    },
    [SEARCH_QUESTIONS]: ({commit}, payload) => {
      const { query } = payload
      return QuestionApi.get(query)
        .then(json => {
          let questions = []
          if (json && json.rows) {
            questions = json.rows.map(o => {
              o.responses.sort((a, b) => a.responseOrder - b.responseOrder)
              return o
            })
          }
          commit(SET_PROPERTY_QUESTIONS, questions)
        })
        .catch(error => {
          console.log(error)
          commit(SET_PROPERTY_QUESTIONS, [])
        })
    },
    [FETCH_SURVEY_ANSWER]: async ({commit}, payload) => {
      try {
        const { propertyId, query } = payload
        commit(SET_SURVEY_ANSWER, await AnswerApi.get(propertyId, query))
      } catch (error) {
        commit(SET_SURVEY_ANSWER, null)
      }
    },
    [SUBMIT_SURVEY_ANSWER]: async ({commit}, payload) => {
      commit(SET_SURVEY_ANSWER, await AnswerApi.post(payload))
    },
    [FETCH_PROPERTY_SUBURB]: async ({dispatch, commit, state}, payload) => {
      const { propertyId } = payload
      if (!state.property || propertyId !== state.property._id) {
        await dispatch(FETCH_USER_PROPERTY, {propertyId})
      }
      const code = state.property.address_components.find(c => c.types.includes('postal_code'))
      if (code) {
        const query = { postCode: code.short_name }
        const suburbs = await SuburbApi.get(query)
        if (suburbs && suburbs[0]) {
          commit(SET_PROPERTY_SUBURB, suburbs[0])
        }
      }
    },
    [FETCH_PROPERTY_SUMMARY]: ({commit}, payload) => {
      const { propertyId } = payload

      commit(SET_USER_PROPERTY, null)
      commit(SET_PROPERTY_SURVEYS, [])
      commit(SET_OVERALL_ASSESSMENT, null)
      commit(SET_LAND_HOUSE_ASSESSMENT, null)

      if (propertyId) {
        return Promise.all(
          [
            Promise.resolve().then(() => {
              return PropertyApi
                .getById(propertyId)
                .then(property => {
                  commit(SET_USER_PROPERTY, property)
                  return property
                })
                .then((property) => {
                  const postCode = property.address_components.find(c => c.types.includes('postal_code')).short_name
                  return SuburbApi.get({ postCode })
                })
                .then(suburbs => suburbs[0])
                .then(suburb => {
                  commit(SET_PROPERTY_SUBURB, suburb)
                })
                .catch(err => {
                  console.log(err)
                  return null
                })
            }),
            Promise.resolve().then(() => {
              return AnswerApi
                .getAnswers(propertyId)
                .catch(err => {
                  console.log(err)
                  return null
                })
                .then(surveys => {
                  commit(SET_PROPERTY_SURVEYS, surveys)
                  return surveys
                })
            }),
            Promise.resolve().then(() => {
              return PropertyApi
                .getSurveyScore(propertyId, {
                  modules: [
                    { module: 'location' },
                    { module: 'land' },
                    { module: 'house' }
                  ]
                })
                .catch(err => {
                  console.log(err)
                  return null
                })
                .then(overallAssessment => {
                  commit(SET_OVERALL_ASSESSMENT, overallAssessment)
                  return overallAssessment
                })
            }),
            Promise.resolve().then(() => {
              return PropertyApi
                .getSurveyScore(propertyId, {
                  modules: [
                    { module: 'land' },
                    { module: 'house' }
                  ]
                })
                .catch(err => {
                  console.log(err)
                  return null
                })
                .then(landHouseAssessment => {
                  commit(SET_LAND_HOUSE_ASSESSMENT, landHouseAssessment)
                  return landHouseAssessment
                })
            })
          ])
      }
    },
    [FETCH_LAND_HOUSE_ASSESSMENT]: ({commit}, payload) => {
      const {propertyId, query, renew} = payload
      const func = renew ? PropertyApi.updateSurveyScore : PropertyApi.getSurveyScore
      commit(SET_LAND_HOUSE_ASSESSMENT, null)
      return func(propertyId, query)
        .then(results => {
          commit(SET_LAND_HOUSE_ASSESSMENT, results)
          return results
        })
        .catch(err => {
          console.log(err)
          return null
        })
    },
    [FETCH_REMAINED_QUESTIONS]: ({commit}, payload) => {
      const {propertyId, query} = payload
      return RemainedQuestions
        .get(propertyId, query)
        .then(results => {
          commit(SET_REMAINED_QUESTIONS, results)
        })
        .catch(err => {
          console.log(err)
          commit(SET_REMAINED_QUESTIONS, [])
        })
    },
    [FETCH_LOCATION_SUMMARY]: ({commit, state}, payload) => {
      const { propertyId } = payload
      if (propertyId) {
        return Promise.all(
          [
            Promise.resolve()
              .then(() => {
                if (state.property && state.property._id === propertyId) {
                  return state.property
                }
                return PropertyApi
                  .getById(propertyId)
                  .then(property => {
                    commit(SET_USER_PROPERTY, property)
                    return property
                  })
                  .catch(err => {
                    console.log(err)
                    commit(SET_USER_PROPERTY, null)
                  })
              })
              .then(property => {
                if (property) {
                  const postCode = property.address_components.find(c => c.types.includes('postal_code')).short_name
                  if (state.suburb && state.suburb.postCode === postCode) {
                    return state.suburb
                  }
                  return SuburbApi
                    .get({ postCode })
                    .then(suburbs => suburbs[0])
                }
                return null
              })
              .then(suburb => {
                commit(SET_PROPERTY_SUBURB, suburb)
                return suburb
              })
              .catch(err => {
                console.log(err)
                commit(SET_PROPERTY_SUBURB, null)
                return null
              }),
            Promise.resolve().then(() => {
              return ContentFragmentApi
                .get({moduleCode: 'location'})
                .then(contentFragments => {
                  commit(SET_PROPERTY_CONTENT_FRAGMENTS, contentFragments)
                  return contentFragments
                })
                .catch(err => {
                  console.log(err)
                  commit(SET_PROPERTY_CONTENT_FRAGMENTS, [])
                  return null
                })
            }),
            Promise.resolve().then(() => {
              const surveyAssessmentRequest = {
                modules: [
                  {
                    module: 'location',
                    sections: [
                      { section: 'street-aesthetics' },
                      { section: 'street-surrounding-real-estate' },
                      { section: 'street-traffic-parking' }
                    ]
                  }
                ]
              }
              return PropertyApi
                .getSurveyScore(propertyId, surveyAssessmentRequest)
                .then(locationAssessment => {
                  commit(SET_LOCATION_ASSESSMENT, locationAssessment)
                  return locationAssessment
                })
                .catch(err => {
                  console.log(err)
                  commit(SET_LOCATION_ASSESSMENT, null)
                  return null
                })
            }),
            Promise.resolve().then(() => {
              return QuestionApi
                .get({ module: 'location' })
                .then(data => {
                  const surveyQuestions = data.rows || []
                  commit(SET_SURVEY_QUESTIONS, surveyQuestions)
                  return surveyQuestions
                })
                .catch(err => {
                  console.log(err)
                  commit(SET_SURVEY_QUESTIONS, [])
                  return null
                })
            }),
            Promise.resolve().then(() => {
              return AnswerApi.get(propertyId, {modules: 'location'})
                .then(surveyanswer => {
                  commit(SET_SURVEY_ANSWER, surveyanswer)
                  return surveyanswer
                })
                .catch(err => {
                  console.log(err)
                  commit(SET_SURVEY_ANSWER, null)
                  return null
                })
            }),
            Promise.resolve().then(() => {
              return RankingApi.get(propertyId)
                .then(comparativeRanking => {
                  commit(SET_COMPARATIVE_RANKING, comparativeRanking)
                  return comparativeRanking
                })
                .catch(err => {
                  console.log(err)
                  commit(SET_COMPARATIVE_RANKING, null)
                  return null
                })
            })
          ]
        )
      }
    },
    [FETCH_PROXIMITY_ASSESSMENT]: ({commit}, payload) => {
      const { propertyId, force } = payload
      commit(SET_PROXIMITY_ASSESSMENT, null)
      return PropertyApi.getAssessmentForSuburbService(propertyId, {force})
        .then(proximityAssessment => {
          commit(SET_PROXIMITY_ASSESSMENT, proximityAssessment)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
