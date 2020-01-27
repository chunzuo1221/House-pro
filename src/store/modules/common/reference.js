import ReferenceApi from '@/api/references'
import {
  SET_SERVICE_CLASSIFICATION,
  SET_QUESTION_CLASSIFICATION,
  SET_REPORT_CONTENT_TYPES,
  SET_ANALYSIS_TYPES,
  SET_PROPERTY_TYPES
} from '../../mutation-types'
import {
  FETCH_SERVICE_CLASSIFICATION,
  FETCH_QUESTION_CLASSIFICATION,
  FETCH_ANALYSIS_TYPES,
  FETCH_REPORT_CONTENT_TYPES,
  FETCH_PROPERTY_TYPES
} from '../../action-types'

/**
 * States to cache reference data fetched (for Admin)
 */
export default {
  state: {
    serviceClassification: null,
    questionClassification: null,
    analysisTypes: null,
    reportContentTypes: null,
    propertyTypes: null
  },
  mutations: {
    [SET_SERVICE_CLASSIFICATION] (state, payload) {
      state.serviceClassification = payload
    },
    [SET_QUESTION_CLASSIFICATION] (state, payload) {
      state.questionClassification = payload
    },
    [SET_ANALYSIS_TYPES] (state, payload) {
      state.analysisTypes = payload
    },
    [SET_REPORT_CONTENT_TYPES] (state, payload) {
      state.reportContentTypes = payload
    },
    [SET_PROPERTY_TYPES] (state, payload) {
      state.propertyTypes = payload
    }
  },
  actions: {
    [FETCH_SERVICE_CLASSIFICATION]: async ({commit, state}) => {
      if (!state.serviceClassification) {
        commit(SET_SERVICE_CLASSIFICATION, await ReferenceApi.getServiceClassification())
      }
    },
    [FETCH_QUESTION_CLASSIFICATION]: async ({commit, state}) => {
      if (!state.questionClassification) {
        commit(SET_QUESTION_CLASSIFICATION, await ReferenceApi.getQuestionClassification())
      }
    },
    [FETCH_ANALYSIS_TYPES]: async ({commit, state}) => {
      if (!state.analysisTypes) {
        commit(SET_ANALYSIS_TYPES, await ReferenceApi.getAnalysisTypes())
      }
    },
    [FETCH_REPORT_CONTENT_TYPES]: async ({commit, state}) => {
      if (!state.reportContentTypes) {
        commit(SET_REPORT_CONTENT_TYPES, await ReferenceApi.getReportContentTypes())
      }
    },
    [FETCH_PROPERTY_TYPES]: async ({commit, state}) => {
      if (!state.propertyTypes) {
        commit(SET_PROPERTY_TYPES, await ReferenceApi.getPropertyTypes())
      }
    }
  }
}
