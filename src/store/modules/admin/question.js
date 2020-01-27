import {
  SET_QUESTION_QUERY,
  SET_QUESTIONS,
  SET_CURRENT_QUESTION,
  SET_ORIGINAL_QUESTION
} from '../../mutation-types'
import {
  UPSERT_QUESTION,
  DEACTIVATE_QUESTION,
  FETCH_QUESTIONS,
  INIT_CURRENT_QUESTION,
  FETCH_CURRENT_QUESTION,
  UPDATE_CURRENT_QUESTION,
  SAVE_QUESTION_RESPONSE,
  DELETE_QUESTION_RESPONSE
} from '../../action-types'
import { isEqual, getHash } from '../../../utils'
import QuestionApi from '@/api/questions'
import { cloneDeep } from 'lodash'

const initQuestion = () => ({
  _id: null,
  text: '',
  questionCode: '',
  questionModule: '',
  questionSection: '',
  questionCategory: '',
  analysisTypes: [],
  bestSource: [],
  questionPageOrder: 0,
  reportOrder: 0,
  detailedSurveyQuestion: false,
  adjustmentQuestion: false,
  dependentMode: '',
  dependentQuestionId: '',
  dependentResponseId: '',
  applicableSuburbs: [],
  propertyWithViews: false,
  displayInReport: false,
  propertyTypes: [],
  responses: []
})

/**
 * States for Question research management (for Admin)
 */
export default {
  state: {
    questions: [],
    query: {
      module: '',
      section: '',
      category: '',
      summaryQuestion: false,
      keyFeature: false,
      adjustmentQuestion: false,
      pageNumber: 1,
      pageSize: 10,
      sort: 'questionPageOrder',
      isDeactivated: false
    },
    total: 0,
    currentQuestion: initQuestion(),
    originalQuestion: initQuestion(),
    hasPendingChanges: false
  },
  mutations: {
    [SET_QUESTION_QUERY]: (state, payload) => {
      state.query = {
        module: payload.module,
        section: payload.section,
        category: payload.category,
        summaryQuestion: payload.summaryQuestion,
        adjustmentQuestion: payload.adjustmentQuestion,
        sort: payload.sort,
        pageNumber: payload.pageNumber,
        pageSize: payload.pageSize,
        isDeactivated: payload.isDeactivated
      }
    },
    [SET_QUESTIONS]: (state, payload) => {
      state.questions = payload.questions
      state.total = payload.total
    },
    [SET_CURRENT_QUESTION]: (state, payload) => {
      state.currentQuestion = {
        ...state.currentQuestion,
        ...payload.question
      }
      const current = cloneDeep(state.currentQuestion)
      const original = cloneDeep(state.originalQuestion)
      state.hasPendingChanges = !isEqual(current, original)
    },
    [SET_ORIGINAL_QUESTION]: (state, payload) => {
      state.originalQuestion = cloneDeep({...state.originalQuestion, ...payload.question})
    }
  },
  actions: {
    [FETCH_QUESTIONS]: async ({commit, state}) => {
      // We don't have idea to enable the remote mode for sort/pagination
      // so just applying the following filters
      const availableFilters = {
        module: state.query.module,
        section: state.query.section,
        category: state.query.category,
        summaryQuestion: state.query.summaryQuestion,
        adjustmentQuestion: state.query.adjustmentQuestion,
        isDeactivated: state.query.isDeactivated
      }
      const results = await QuestionApi.get(availableFilters)
      commit(SET_QUESTIONS, {
        questions: results.rows,
        total: results.total
      })
    },
    [UPSERT_QUESTION]: async ({commit, state}, payload) => {
      let questions = state.questions
      let total = state.total
      if (payload.question.responses) {
        payload.question.responses.forEach(r => {
          if (r._id.startsWith('NEWRESPONSE')) {
            delete r._id
          }
        })
      }
      if (payload.question._id) {
        const updatedOne = await QuestionApi.put(payload.question._id, payload.question)
        questions = state.questions.map(o => o._id === updatedOne._id ? updatedOne : o)
      } else {
        await QuestionApi.post(payload.question)
        const results = await QuestionApi.get(state.query)
        questions = results.rows
        total = results.total
      }
      commit(SET_ORIGINAL_QUESTION, {question: payload.question})
      commit(SET_CURRENT_QUESTION, {question: payload.question})
      commit(SET_QUESTIONS, {
        questions,
        total
      })
    },
    [DEACTIVATE_QUESTION]: async ({commit, state}, payload) => {
      await QuestionApi.put(payload.question._id, payload.question)
      const results = await QuestionApi.get(state.query)
      commit(SET_QUESTIONS, {
        questions: results.rows,
        total: results.total
      })
    },
    [FETCH_CURRENT_QUESTION]: async ({commit, state}, payload) => {
      let question = state.questions.find(o => o._id === payload._id)
      if (!question) {
        question = await QuestionApi.getOne(payload._id)
      }
      commit(SET_ORIGINAL_QUESTION, {question})
      commit(SET_CURRENT_QUESTION, {question})
    },
    [UPDATE_CURRENT_QUESTION]: async ({commit}, payload) => {
      commit(SET_CURRENT_QUESTION, {question: payload.question})
    },
    [INIT_CURRENT_QUESTION]: async ({commit}) => {
      commit(SET_ORIGINAL_QUESTION, {question: initQuestion()})
      commit(SET_CURRENT_QUESTION, {question: initQuestion()})
    },
    [SAVE_QUESTION_RESPONSE]: ({commit, state}, payload) => {
      const response = {...payload.response}
      const responses = state.currentQuestion.responses || []
      let index = -1
      if (!response._id) {
        response._id = `NEWRESPONSE${getHash(response)}`
      }
      index = responses.findIndex(o => o._id === response._id)
      if (index < 0) {
        responses.push(response)
      } else {
        responses.splice(index, 1, response)
      }
      commit(SET_CURRENT_QUESTION, {
        question: {
          ...state.currentQuestion,
          responses: [...responses]
        }
      })
    },
    [DELETE_QUESTION_RESPONSE]: ({commit, state}, payload) => {
      const responses = state.currentQuestion.responses
      const index = responses.findIndex(o => o._id === payload.responseId)
      responses.splice(index, 1)
      commit(SET_CURRENT_QUESTION, {
        question: {
          ...state.currentQuestion,
          responses
        }
      })
    }
  }
}
