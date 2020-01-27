import {
  SET_PROXIMITY_RULES,
  SET_CURRENT_PROXIMITY_RULE,
  SET_MEASURE,
  SET_HAS_PENDING_CHANGES
} from '../../mutation-types'
import {
  ADD_PROXIMITY_RULE,
  UPDATE_PROXIMITY_RULE,
  UPDATE_CURRENT_PROXIMITY_RULE,
  DELETE_PROXIMITY_RULE,
  FETCH_PROXIMITY_RULES,
  FETCH_CURRENT_PROXIMITY_RULE,
  INIT_CURRENT_PROXIMITY_RULE,
  SAVE_MEASURE,
  DELETE_MEASURE
} from '../../action-types'
import { isEqual } from '../../../utils'
import ProximityRuleApi from '@/api/proximity-rules'

const initProximityRule = () => ({
  _id: null,
  code: null,
  name: null,
  measures: []
})

/**
 * States for proximity rule management (for Admin)
 */
export default {
  state: {
    rules: [],
    currentRule: {
      _id: null,
      name: null,
      code: null,
      measures: []
    },
    hasPendingChanges: false
  },
  getters: {
    getRules: state => state.rules.map(o => {
      o.measuresTotal = o.measures.length
      return o
    })
  },
  mutations: {
    [SET_PROXIMITY_RULES]: (state, payload) => {
      state.rules = payload.rules
    },
    [SET_MEASURE]: (state, payload) => {
      state.hasPendingChanges = !isEqual(state.currentRule.measures, payload.measures)
      state.currentRule.measures = payload.measures
    },
    [SET_CURRENT_PROXIMITY_RULE]: (state, payload) => {
      state.currentRule = payload.rule
      const rule = state.rules.find(o => o._id === payload.rule._id)
      if (rule) {
        state.hasPendingChanges = !isEqual(payload.rule, rule)
      } else {
        state.hasPendingChanges = !isEqual(payload.rule, initProximityRule())
      }
    },
    [SET_HAS_PENDING_CHANGES]: (state, payload) => {
      state.hasPendingChanges = payload.hasPendingChanges
    }
  },
  actions: {
    [FETCH_PROXIMITY_RULES]: async ({commit}) => {
      const rules = await ProximityRuleApi.get()
      commit(SET_PROXIMITY_RULES, {rules})
    },
    [ADD_PROXIMITY_RULE]: async ({commit}, payload) => {
      await ProximityRuleApi.post(payload)
      const rules = await ProximityRuleApi.get()
      commit(SET_PROXIMITY_RULES, {rules})
    },
    [UPDATE_PROXIMITY_RULE]: async ({commit, state}, payload) => {
      let rules = []
      const rule = payload.rule
      if (rule._id) {
        const updatedOne = await ProximityRuleApi.update(rule._id, rule)
        rules = state.rules.map(o => {
          if (o._id === updatedOne._id) {
            return updatedOne
          }
          return o
        })
      } else {
        await ProximityRuleApi.post(rule)
        rules = await ProximityRuleApi.get()
      }
      commit(SET_HAS_PENDING_CHANGES, {hasPendingChanges: false})
      commit(SET_PROXIMITY_RULES, {rules})
    },
    [UPDATE_CURRENT_PROXIMITY_RULE]: async ({commit}, payload) => {
      commit(SET_CURRENT_PROXIMITY_RULE, {rule: payload.rule})
    },
    [INIT_CURRENT_PROXIMITY_RULE]: async ({commit}) => {
      let rule = initProximityRule()
      commit(SET_CURRENT_PROXIMITY_RULE, {rule})
    },
    [DELETE_PROXIMITY_RULE]: async ({commit, state}, payload) => {
      await ProximityRuleApi.deleteOne(payload.ruleId)
      const rules = state.rules.filter(o => o._id !== payload.ruleId)
      commit(SET_PROXIMITY_RULES, {rules})
    },
    [FETCH_CURRENT_PROXIMITY_RULE]: async ({commit, state}, payload) => {
      let rule = state.rules.find(o => o._id === payload.ruleId)
      if (rule) {
        commit(SET_CURRENT_PROXIMITY_RULE, {rule})
      } else {
        rule = await ProximityRuleApi.getOne(payload.ruleId)
        commit(SET_CURRENT_PROXIMITY_RULE, {rule})
      }
    },
    [SAVE_MEASURE]: ({commit, state}, payload) => {
      const measures = Array.from(state.currentRule.measures || [])
      const index = measures.findIndex(o => o._id === payload.measure._id)
      if (index < 0) {
        measures.push(payload.measure)
      } else {
        measures.splice(index, 1, payload.measure)
      }
      commit(SET_MEASURE, {measures})
    },
    [DELETE_MEASURE]: async ({commit, state}, payload) => {
      const measures = state.currentRule.measures.filter(o => o._id !== payload._id)
      commit(SET_MEASURE, {measures})
    }
  }
}
