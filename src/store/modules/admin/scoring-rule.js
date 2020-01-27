import {
  SET_SCORING_RULES,
  ADD_SCORING_RULE_TO_STATE,
  SET_CALCULATION_METHODS
} from '../../mutation-types'
import {
  FETCH_CALCULATION_METHODS,
  ADD_SCORING_RULE,
  DELETE_SCORING_RULE,
  INIT_TEMPLATE_SCORING_RULES,
  SAVE_SCORING_RULE,
  UPSERT_SCORING_RULE,
  FETCH_SUBURB_SCORING_RULES
} from '../../action-types'
import ScoringRuleApi from '@/api/scoring-rules'
import ReferenceApi from '@/api/references'
import { generateUUID } from '@/utils'

const initScoringRule = () => ({
  _id: null,
  suburbID: null,
  categoryName: null,
  categoryCode: null,
  typeName: null,
  typeCode: null,
  subTypeName: null,
  subTypeCode: null,
  calculationMethodName: null,
  calculationMethodCode: null,
  postCode: null,
  index: null
})

/**
 * States for scoring rule management (for Admin)
 */
export default {
  state: {
    scoringRules: [],
    calculationMethods: []
  },
  mutations: {
    [SET_SCORING_RULES]: (state, payload) => {
      state.scoringRules = payload.scoringRules
    },
    [SET_CALCULATION_METHODS]: (state, payload) => {
      state.calculationMethods = payload.methods
    },
    [ADD_SCORING_RULE_TO_STATE]: (state, payload) => {
      state.scoringRules = payload.scoringRules
    }
  },
  actions: {
    [FETCH_CALCULATION_METHODS]: async ({commit}) => {
      const calculationMethods = await ReferenceApi.getCalculationMethods()
      const methods = calculationMethods.methods
      commit(SET_CALCULATION_METHODS, {methods})
    },
    [ADD_SCORING_RULE]: async ({commit}, payload) => {
      await ScoringRuleApi.post(payload)
      const scoringRules = await ScoringRuleApi.get()
      commit(SET_SCORING_RULES, {scoringRules})
    },
    [INIT_TEMPLATE_SCORING_RULES]: async ({commit}, payload) => {
      let referenceData = await ReferenceApi.getScoringruleClassification()
      let subTypes = []
      let scoringRules = []
      referenceData.serviceCategories.forEach(serviceCategory => {
        let catObj = {
          name: serviceCategory.text,
          code: serviceCategory.code
        }
        serviceCategory.serviceTypes.forEach(type => {
          let typeObj = {
            name: type.text,
            code: type.code
          }
          type.serviceSubTypes.forEach(subType => {
            let subTypeObj = {
              name: subType.text,
              code: subType.code,
              catObj: catObj,
              typeObj: typeObj
            }
            subTypes.push(subTypeObj)
          })
        })
      })
      subTypes.forEach(subTypeObj => {
        let newScoringRule = initScoringRule()
        newScoringRule.categoryCode = subTypeObj.catObj.code
        newScoringRule.categoryName = subTypeObj.catObj.name
        newScoringRule.typeCode = subTypeObj.typeObj.code
        newScoringRule.typeName = subTypeObj.typeObj.name
        newScoringRule.subTypeCode = subTypeObj.code
        newScoringRule.subTypeName = subTypeObj.name
        newScoringRule.uuid = generateUUID()
        scoringRules.push(newScoringRule)
      })
      commit(ADD_SCORING_RULE_TO_STATE, {scoringRules})
    },
    [SAVE_SCORING_RULE]: async ({commit, state}, payload) => {
      if (!payload.scoringRule) {
        let scoringRules = payload.scoringRules
        commit(SET_SCORING_RULES, {state, scoringRules})
        return
      }
      const updatedScoringRule = payload.scoringRule
      let scoringRules = payload.scoringRules
      scoringRules = scoringRules.map(o => {
        if (o.uuid === updatedScoringRule.uuid) {
          return updatedScoringRule
        }
        return o
      })
      commit(SET_SCORING_RULES, {state, scoringRules})
    },
    [UPSERT_SCORING_RULE]: async ({commit, state}, payload) => {
      let scoringRulesToUpdate = payload.scoringRules
      scoringRulesToUpdate.forEach(async (scoringRule) => {
        if (!scoringRule._id) {
          await ScoringRuleApi.post(scoringRule)
        } else {
          let scoringRuleID = scoringRule._id
          await ScoringRuleApi.update(scoringRuleID, scoringRule)
        }
      })
      let scoringRules = state.scoringRules
      commit(ADD_SCORING_RULE_TO_STATE, scoringRules)
    },
    [FETCH_SUBURB_SCORING_RULES]: async ({commit, state}, payload) => {
      let existingRules = await ScoringRuleApi.get(payload.postCode)
      let referenceData = await ReferenceApi.getScoringruleClassification()
      let subTypes = []
      let scoringRules = []
      referenceData.serviceCategories.forEach(serviceCategory => {
        let catObj = {
          name: serviceCategory.text,
          code: serviceCategory.code
        }
        serviceCategory.serviceTypes.forEach(type => {
          let typeObj = {
            name: type.text,
            code: type.code
          }
          type.serviceSubTypes.forEach(subType => {
            let subTypeObj = {
              name: subType.text,
              code: subType.code,
              catObj: catObj,
              typeObj: typeObj
            }
            subTypes.push(subTypeObj)
          })
        })
      })
      subTypes.forEach(subTypeObj => {
        let newScoringRule = initScoringRule()
        newScoringRule.categoryCode = subTypeObj.catObj.code
        newScoringRule.categoryName = subTypeObj.catObj.name
        newScoringRule.typeCode = subTypeObj.typeObj.code
        newScoringRule.typeName = subTypeObj.typeObj.name
        newScoringRule.subTypeCode = subTypeObj.code
        newScoringRule.subTypeName = subTypeObj.name
        newScoringRule.uuid = generateUUID()
        scoringRules.push(newScoringRule)
      })
      scoringRules = scoringRules.map(scoringRule => {
        let ruleToReturn = scoringRule
        existingRules.forEach(existingRule => {
          if ((existingRule.categoryCode === scoringRule.categoryCode) &&
                    (existingRule.typeCode === scoringRule.typeCode) &&
                    (existingRule.subTypeCode === scoringRule.subTypeCode)) {
            ruleToReturn = existingRule
          }
        })
        return ruleToReturn
      })
      commit(ADD_SCORING_RULE_TO_STATE, {state, scoringRules})
    },
    [DELETE_SCORING_RULE]: async ({commit, state}, payload) => {
      await ScoringRuleApi.deleteOne(payload.ruleId)
      const scoringRules = state.scoringRules.filter(o => o._id !== payload.scoringRuleId)
      commit(SET_SCORING_RULES, {scoringRules})
    }
  }
}
