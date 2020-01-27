<template>
  <div class="survey-page">
    <main class="pri-pad page-default">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <h1>
              <span class="text-capitalize">{{questionQuery.questionModule}}</span>
              <span class="text-capitalize">{{questionQuery.questionSection}}</span>
              Proximity Survey
            </h1>
          </div>
          <div class="col-sm-12">
            <div class="row" v-if="loadingQuestions">
              <p class="text-center">Loading questions...</p>
            </div>
            <div class="row" v-else-if="questions.length === 0">
              <p class="text-center">There are no available questions...</p>
            </div>
            <div class="row" v-else-if="loadingAnswer">
              <p class="text-center">Loading answers...</p>
            </div>
            <div class="row" v-else-if="errorLoadingQuestions">
              <p class="text-center text-danger">An error has been occurred while loading questions...</p>
            </div>
            <div class="row" v-else-if="errorSavingAnswer">
              <p class="text-center text-danger">An error has been occurred while saving question...</p>
            </div>
            <div class="row" v-else-if="!hasAvailableQuestions">
              <p class="text-center text-info">No available questions</p>
            </div>
          </div>
          <div class="col-sm-12" v-if="questions.length">
            <div>
              <div class="row question-row" v-for="question in questions" :key="question._id" v-show="visibleQuestions[question._id]">
                <div class="col-sm-6">{{question.text}}</div>
                <div class="col-sm-6">
                  <el-select @change="calcVisibleQuestions" v-model="questionAnswerPairs[question._id]" placeholder="Select">
                    <el-option v-for="item in question.responses" :key="item._id" :label="item.responseText" :value="item._id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-2" v-if="hasAvailableQuestions">
            <button class="btn btn-default save-button" @click="saveAnswers" :disabled="savingAnswer">Save</button>
          </div>
          <div class="col-sm-2">
            <a class="btn btn-default save-button" @click="$router.go(-1)">Cancel</a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AnswerApi from '@/api/survey/answer'
import {
  FETCH_USER_PROPERTY,
  SEARCH_QUESTIONS,
  FETCH_SURVEY_ANSWER
} from '@/store/action-types'

export default {
  name: 'Survey',
  data () {
    return {
      visibleQuestions: {},
      questionAnswerPairs: {},
      loadingQuestions: false,
      loadingAnswer: false,
      savingAnswer: false,
      errorLoadingQuestions: false,
      errorloadingAnswer: false,
      errorSavingAnswer: false,
      propertyId: this.$route.params.propertyId
    }
  },
  computed: {
    ...mapState({
      property: state => state.main.property,
      questions: state => state.main.questions,
      surveyanswer: state => state.main.surveyanswer
    }),
    questionQuery () {
      const { section, analysisType, propertyType, propertyWithViews, adjustmentQuestion, summaryQuestion } = this.$route.query
      const query = {}
      query.questionModule = this.$route.query.module || 'location'
      if (section) {
        query.questionSection = section
      }
      if (analysisType) {
        query.analysisType = analysisType
      }
      if (propertyType) {
        query.propertyType = propertyType
      }
      if (adjustmentQuestion !== undefined) {
        query.adjustmentQuestion = adjustmentQuestion === true || adjustmentQuestion === 'true'
      }
      if (summaryQuestion !== undefined) {
        query.summaryQuestion = summaryQuestion === true || summaryQuestion === 'true'
      }
      if (propertyWithViews !== undefined) {
        query.propertyWithViews = propertyWithViews === true || propertyWithViews === 'true'
      }
      return query
    },
    answerQuery () {
      const { analysisType, adjustmentQuestion } = this.$route.query
      const query = {}
      query.modules = this.$route.query.module || 'location'
      if (analysisType) {
        query.analysisType = analysisType
      }
      if (adjustmentQuestion !== undefined) {
        query.adjustmentQuestion = adjustmentQuestion === true || adjustmentQuestion === 'true'
      }
      return query
    },
    hasAvailableQuestions () {
      return Object.keys(this.visibleQuestions).some(k => this.visibleQuestions[k] === true)
    }
  },
  async mounted () {
    Promise.all([
      this.$store.dispatch(FETCH_USER_PROPERTY, { propertyId: this.propertyId }),
      Promise.resolve().then(() => {
        this.loadingQuestions = true
        return this.$store.dispatch(SEARCH_QUESTIONS, { query: {sort: 'questionPageOrder'} })
          .then(() => {
            this.loadingQuestions = false
          })
          .catch(() => {
            this.errorLoadingQuestions = true
            this.loadingQuestions = false
          })
      }),
      Promise.resolve().then(() => {
        this.loadingAnswer = true
        return this.$store.dispatch(FETCH_SURVEY_ANSWER, { propertyId: this.propertyId })
          .then(() => {
            this.loadingAnswer = false
          })
          .catch(() => {
            this.errorloadingAnswer = true
            this.loadingAnswer = false
          })
      })
    ]).then(() => {
      this.mapToQuestionAnswerPairs()
      this.calcVisibleQuestions()
    })
  },
  methods: {
    mapToQuestionAnswerPairs () {
      const pairs = {}
      if (this.surveyanswer && this.surveyanswer.responses) {
        this.surveyanswer.responses.forEach(answer => {
          pairs[answer.questionId] = answer.responseId
        })
      }
      this.questionAnswerPairs = pairs
    },
    async saveAnswers () {
      const requestData = {
        propertyId: this.propertyId,
        analysisType: this.questionQuery.analysisType,
        propertyType: this.questionQuery.propertyType,
        propertyWithViews: this.questionQuery.propertyWithViews,
        responses: []
      }
      if (this.surveyanswer && this.surveyanswer._id) {
        requestData._id = this.surveyanswer._id
      }
      Object.keys(this.questionAnswerPairs).forEach((questionId) => {
        const responseId = this.questionAnswerPairs[questionId]
        const question = this.questions.find(q => q._id === questionId)
        if (!question) {
          return
        }
        if (question.responses.length) {
          const response = question.responses.find(r => r._id === responseId)
          let responseMax = question.responses.sort((a, b) => {
            return b.responseScore - a.responseScore
          })[0].responseScore
          const answer = {
            questionId,
            responseId,
            responseScore: response.responseScore,
            responseMax,
            questionModule: question.questionModule,
            questionSection: question.questionSection,
            adjustmentQuestion: question.adjustmentQuestion
          }
          if (this.surveyanswer && this.surveyanswer._id) {
            const existResponse = this.surveyanswer.responses.find((r) => {
              return r.questionId === questionId
            })
            if (existResponse) {
              answer._id = existResponse._id
            }
          }
          requestData.responses.push(answer)
        }
      })
      this.savingAnswer = true
      try {
        await AnswerApi.post(requestData)
        this.savingAnswer = false
        this.$router.go(-1)
      } catch (error) {
        this.savingAnswer = false
        this.errorSavingAnswer = true
      }
    },
    isMatchedQuestion (q) {
      const { questionModule, questionSection, analysisType, propertyType, propertyWithViews, adjustmentQuestion, summaryQuestion } = this.questionQuery
      if (!questionModule || questionModule.includes(q.questionModule)) {
        if (!questionSection || q.questionSection === questionSection) {
          if (!analysisType || !q.analysisTypes || !q.analysisTypes.length || q.analysisTypes.some(t => t === analysisType)) {
            if (!propertyType || !q.propertyTypes || !q.propertyTypes.length || q.propertyTypes.some(t => t === propertyType)) {
              if (typeof adjustmentQuestion === 'undefined' || !!adjustmentQuestion === !!q.adjustmentQuestion) {
                if (typeof summaryQuestion === 'undefined' || !!summaryQuestion === !!q.summaryQuestion) {
                  // if propertyWithViews query is true, then display all questions
                  if (propertyWithViews) {
                    return true
                  }
                  // if propertyWithViews query is false or undefined, then display rest of questions except ones with propertyWithViews set to true
                  if (!propertyWithViews && !q.propertyWithViews) {
                    return true
                  }
                }
              }
            }
          }
        }
      }
      return false
    },
    calcVisibleQuestions () {
      let result = {}
      this.questions && this.questions.forEach((question, index) => {
        const {
          _id,
          applicableSuburbs,
          dependentMode,
          dependentQuestionId,
          dependentResponseId,
          isDeactivated
        } = question

        if (!this.isMatchedQuestion(question)) {
          result[_id] = false
          return
        }
        // if it's a deactivated question, then see if there is a survey answer for it
        if (isDeactivated) {
          result[_id] = false
          if (this.surveyanswer && this.surveyanswer.responses) {
            const answer = this.surveyanswer.responses.find(answer => answer.questionId === _id)
            if (answer) {
              result[_id] = true
            }
          }
        } else {
          result[_id] = true
        }

        if (result[_id]) {
          /**
           * Level 1 - Check for Suburb Applicability
           */
          // if the question has NO applicable suburbs then populate it by default
          if (!applicableSuburbs || !applicableSuburbs.length) {
            result[_id] = true
          } else {
            // check that the question has the post code in its applicable suburbs array
            const component = this.property.address_components.find(o => o.types.includes('postal_code'))
            const postCode = component.short_name
            result[_id] = applicableSuburbs.includes(postCode)
          }

          /**
           * Level 2 - Check for Dependent Questions
           */
          if (result[_id]) {
            if (dependentMode && dependentQuestionId && dependentResponseId) {
              const included = dependentMode === 'include'
              let found = false
              if (this.questions.some(q => q._id === dependentQuestionId)) {
                if (this.questionAnswerPairs[dependentQuestionId] === dependentResponseId) {
                  found = true
                }
              }
              if (included) {
                result[_id] = found
              } else {
                result[_id] = !found
              }
            }
          }
        }
      })
      this.visibleQuestions = result
    }
  }
}
</script>

<style scoped>
.save-button {
  margin-top: 2em;
}
.question-row {
  margin-top: 1.2em;
}
</style>
