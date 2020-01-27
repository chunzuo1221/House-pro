<template>
  <div class="land-page">
    <div class="gallery-wrap full agent-full">
      <ul class="gallery-full">
        <li>
          <figure class="text-center" v-if="property" id="property-map" v-google-map="property">
          </figure>
        </li>
      </ul>
    </div>
    <main v-if="!loading && !property">
      <section class="pri-pad-b agent-single">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="mb-50"></div>
              <h4 class="text-center">Property not found.</h4>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- property images carousel -->
    <modal name="imageModal" height="auto">
      <image-carousel :images="propertyImages"></image-carousel>
    </modal>

    <main v-if="property && property._id">
      <section class="pri-pad-b agent-single">
        <div class="container">
          <div class="row">
            <div class="col-md-12 col-sm-12">
              <div class="lst-vw top mb-50 full d-flex">
                <div class="property-image-box">
                  <figure>
                    <img :src="propertyImage" class="property-image" @click="onImageClick">
                    <div class="property-figure--score">Analysis Score:
                      <strong>{{ serviceScore }}</strong>
                    </div>
                  </figure>
                </div>
                <div class="property-heading">
                  <h4 class="pull-left mb-0">
                    {{property.name}}
                    <span><i class="fa fa-map-marker"></i> {{property.formatted_address}} </span>
                  </h4>
                  <span class="pull-right"> {{administrativeAreaLevel2}}</span>
                </div>
              </div>
            </div>
            <!--top-->

            <div class="col-md-12">
              <div class="mb-50">
                <div class="sec-title icon-wrap mb-3">
                  <div class="d-flex justify-space-between mb-4">
                    <h4 class="mb-0">Land and House Analysis</h4>
                    <div class="d-flex">
                      <button
                        class="btn btn-primary btn-rect"
                        v-if="isAdmin"
                        :disabled="loading"
                        @click="fetchSurveyScores(true)"
                      >Update Survey Scores</button>
                      <router-link class="black-link square-link ml-2" :to="{name: 'Property', params: { propertyId }}">
                        &lsaquo;&lsaquo; Back to Property Details </router-link>
                    </div>
                  </div>
                </div>
                <p>
                  The HousePro Property Assessment System uses a number of surveys to determine the scoring accross a number of categories. The analysis is also based on the nature
                  of the land and any existing property. Before you start please answer the following question...
                </p>
              </div>
            </div>
          </div>

          <div class="analysis-type-section mb-3">
            <div class="row fluid">
              <dir class="col-sm-6">
                <div class="px-3">
                  <div class="d-flex align-center mb-2">
                    <label class="control-label">Choose an Analysis Type:</label>
                    <el-select
                      :disabled="committing"
                      placeholder="Select Package"
                      @change="onAnalysisTypeChange"
                      v-model="analysisTypeCache"
                    >
                      <el-option v-for="item in analysisTypes" :key="item.code" :label="item.text" :value="item.code"/>
                    </el-select>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <label class="control-label">Choose a Property Type:</label>
                    <el-select
                      :disabled="committing"
                      placeholder="Select Property"
                      @change="onPropertyTypeChange"
                      v-model="propertyTypeCache"
                    >
                      <el-option v-for="item in propertyTypes" :key="item.code" :label="item.text" :value="item.code"/>
                    </el-select>
                  </div>
                  <div class="d-flex">
                    <div class="checkbox-wrap">
                      <input type="checkbox" @change="openQuestionModal" v-model="propertyWithViewsCache" >
                      <span class="control-label">Has Views</span>
                    </div>
                  </div>
                </div>
              </dir>

              <div class="col-sm-6" v-if="analysisType">
                <div class="py-2">
                  <p>
                    <strong>{{analysisTypeExplain}}</strong>
                  </p>
                  <p class="mb-3">
                    Tell us some of the basics about the House and Land by clicking the button below to complete the 'Get Started Survey'
                  </p>
                  <div class="text-right">
                    <router-link class="blue-link square-link-light" :to="{name: 'Survey', params: {propertyId}, query: { module: 'house,land', summaryQuestion: true, analysisType: this.analysisType, propertyType: this.propertyType, propertyWithViews: this.propertyWithViews }}">Get Started Survey</router-link>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Land Section -->
          <div class="row">
            <div class="col-md-12">
              <div class="mb-50">
                <h4>Let's look at the land</h4>
                <p>
                  The land component of this property can be broken down into 4 distinct sections as shown in the dials below. This gives us balanced assessment across these key areas that contribute to the value of the land.
                </p>
              </div>
            </div>
            <div class="col-md-12 col-sm-12 gages-container">
              <div class="gage-list" v-if="landScores">
                <div class="row d-flex align-center">
                  <div class="col-sm-3 col-md-3">
                    <div class="d-flex justify-center align-center">
                      <div class="level-score text-center">
                        <div class="score">{{landModuleScore}}</div>
                        <div class="text">Land Score</div>
                      </div>
                    </div>
                    <div class="d-flex justify-center align-center mt-3">
                      <button
                        class="btn btn-primary btn-rect"
                        :disabled="loading"
                        @click="() => lunchLandDetailReport()"
                      >Lunch Detailed Report</button>
                    </div>
                  </div>
                  <div class="col-sm-9 col-md-9">
                    <div class="col-md-4 col-sm-4" v-for="(gageItem, index) in landScores" :key="index">
                      <a v-on:click = "goSurveyPage(gageItem.q)" class="link my-3 center-block text-center btn-link primary-color">
                        <div class="gage-wrap" v-gage="gageItem"> </div>
                        <div class="loading-spinner" v-if="gageItem.value === -1">
                          <scale-loader color="#27ae60" />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-12 gages-container" v-if="landBonusScore">
              <div class="gage-list">
                <div class="row">
                  <div class="col-sm-9">
                    <h5 class="mt-3">Bonus Points</h5>
                    <hr class="green-line">
                    <p>There are certain features of the land that set it aside from others, such as Pools,
                      Tennis Courts and Granny Flats. This section takes these into account and adjusts the overall score appropriately.
                    </p>
                  </div>
                  <div class="col-sm-3">
                    <a v-on:click = "goSurveyPage(landBonusScore.q)" class="link my-3 center-block text-center btn-link primary-color">
                      <div class="gage-wrap" v-gage="landBonusScore"></div>
                      <div class="loading-spinner" v-if="landBonusScore.value === -1">
                        <scale-loader color="#27ae60" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <!-- House Section -->
            <div class="col-md-12">
              <div class="mb-50">
                <h4>Now focussing on the house</h4>
                <p>
                  The house itself is also assessed in sections that break down the key characteristics contrinuting to the value of the property. Each is scored individualled based on a series of targetted survey questions.
                </p>
              </div>
            </div>
            <div class="col-md-12 col-sm-12 gages-container">
              <div class="gage-list" v-if="houseScores">
                <div class="row d-flex align-center">
                  <div class="col-sm-3 col-md-3">
                    <div class="d-flex justify-center align-center">
                      <div class="level-score text-center">
                        <div class="score">{{houseModuleScore}}</div>
                        <div class="text">House Score</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-9 col-md-9">
                    <div class="col-sm-4 col-md-4" v-for="(gageItem, index) in houseScores" :key="index">
                      <a v-on:click = "goSurveyPage(gageItem.q)" class="link my-3 center-block text-center btn-link primary-color">
                        <div class="gage-wrap" v-gage="gageItem"> </div>
                        <div class="loading-spinner" v-if="gageItem.value === -1">
                          <scale-loader color="#27ae60" />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-12 gages-container" v-if="houseBonusScore">
              <div class="gage-list">
                <div class="row">
                  <div class="col-sm-9">
                    <h5 class="mt-3">Bonus Points</h5>
                    <hr class="green-line">
                    <p>As with the land there are features of a house that contrinute significant value and are awarded additional bonus points, such as home automation systems and large balconies.
                    </p>
                  </div>
                  <div class="col-sm-3">
                    <a v-on:click = "goSurveyPage(houseBonusScore.q)" class="link my-3 center-block text-center btn-link primary-color">
                      <div class="gage-wrap" v-gage="houseBonusScore"></div>
                      <div class="loading-spinner" v-if="houseBonusScore.value === -1">
                        <scale-loader color="#27ae60" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr/>
        <!-- Debug Information -->
        <div class="px-4" v-if="isAdmin">
          <div class="mb-4">
            <div class="sec-title icon-wrap">
              <h4>Debug Information</h4>
            </div>
          </div>
          <div class="mb-4">
            <div class="d-flex justify-start align-center mb-1">
              <h5 class="debug-table-title">Land Scoring</h5>
              <button class="btn btn-default" @click="landVisibility=!landVisibility">{{landVisibility ? 'Hide Table' : 'View Table'}}</button>
            </div>
            <table v-show="landVisibility">
              <thead>
                <th>Question</th>
                <th>Question Code</th>
                <th>Section</th>
                <th>Response</th>
                <th>Bonus</th>
                <th>Score</th>
                <th>Max</th>
                <th>Response Code</th>
                <th>Commentary</th>
              </thead>
              <tbody>
                <tr v-for="(row, i) in landResponses" :key="i">
                  <td>{{ row.question ? row.question.text : '' }}</td>
                  <td>{{ row.question ? row.question.questionCode : '' }}</td>
                  <td>{{ row.question ? row.question.questionSection : '' }}</td>
                  <td>{{ row.response ? row.response.responseText : '' }}</td>
                  <td>{{ row.question ? row.question.adjustmentQuestion : '' }}</td>
                  <td>{{ row.response ? row.response.responseScore : '' }}</td>
                  <td>{{ row.response ? row.response.responseMax : '' }}</td>
                  <td>{{ row.response ? row.response.responseCode : '' }}</td>
                  <td>{{ row.response ? row.response.responseCommentary : '' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mb-4">
            <div class="d-flex justify-start align-center mb-1">
              <h5 class="debug-table-title">House Scoring</h5>
              <button class="btn btn-default" @click="houseVisibility=!houseVisibility">{{houseVisibility ? 'Hide Table' : 'View Table'}}</button>
            </div>
            <table v-show="houseVisibility">
              <thead>
                <th>Question</th>
                <th>Question Code</th>
                <th>Section</th>
                <th>Response</th>
                <th>Bonus</th>
                <th>Score</th>
                <th>Max</th>
                <th>Response Code</th>
                <th>Commentary</th>
              </thead>
              <tbody>
                <tr v-for="(row, i) in houseResponses" :key="i">
                  <td>{{ row.question ? row.question.text : '' }}</td>
                  <td>{{ row.question ? row.question.questionCode : '' }}</td>
                  <td>{{ row.question ? row.question.questionSection : '' }}</td>
                  <td>{{ row.response ? row.response.responseText : '' }}</td>
                  <td>{{ row.question ? row.question.adjustmentQuestion : '' }}</td>
                  <td>{{ row.response ? row.response.responseScore : '' }}</td>
                  <td>{{ row.response ? row.response.responseMax : '' }}</td>
                  <td>{{ row.response ? row.response.responseCode : '' }}</td>
                  <td>{{ row.response ? row.response.responseCommentary : '' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
    <!-- Confirmation modal -->
    <modal name="questionModal" height="auto">
      <div class="information-modal">
        <h5>Information</h5>
        <p>You are about to change how we will assess this land and property, are you sure?</p>
        <div class="mt-2 text-right">
          <button class="btn btn-default ml-2" @click="closeQuestionModal(true)">Yes</button>
          <button class="btn btn-default ml-2" @click="closeQuestionModal(false)">No</button>
        </div>
      </div>
    </modal>
    <modal name="informationModal" height="auto">
      <div class="information-modal">
        <h5>Information</h5>
        <p>You need to complete the 'Get Started Survey' before proceeding with further questions.</p>
        <div class="mt-2 text-right">
          <router-link class="btn btn-primary" :to="summarySurveyRoute">Get Started Survey</router-link>
          <router-link class="btn btn-primary" :to="sectionSurveyRoute">Override</router-link>
          <button class="btn btn-default ml-2" @click="closeInformationModal">Close</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { Promise } from 'bluebird'
import { mapState, mapGetters, mapActions } from 'vuex'
import ScaleLoader from 'vue-spinner/src/ScaleLoader'
import gageDirective from '@/directives/gage'
import googleMapDirective from '@/directives/google-map'
import { getPropertyAddressComponentValue } from '@/utils'
import {
  FETCH_USER_PROPERTY,
  SEARCH_QUESTIONS,
  FETCH_SURVEY_ANSWER,
  FETCH_ANALYSIS_TYPES,
  FETCH_PROPERTY_TYPES,
  SUBMIT_SURVEY_ANSWER,
  FETCH_REMAINED_QUESTIONS,
  FETCH_LAND_HOUSE_ASSESSMENT
} from '@/store/action-types'
import ImageCarousel from '@/components/core/ImageCarousel'

export default {
  name: 'LandHouse',
  components: {
    ScaleLoader,
    ImageCarousel
  },
  directives: {
    gage: gageDirective,
    googleMap: googleMapDirective
  },
  data () {
    return {
      propertyId: this.$route.params.propertyId,
      analysisType: null,
      analysisTypeCache: null,
      propertyType: null,
      propertyTypeCache: null,
      propertyWithViews: false,
      propertyWithViewsCache: false,
      loading: false,
      landVisibility: false,
      houseVisibility: false,
      sectionSurveyRoute: '',
      committing: false
    }
  },
  computed: {
    ...mapState({
      property: state => state.main.property,
      surveyanswer: state => state.main.surveyanswer,
      questions: state => state.main.questions,
      analysisTypes: state => {
        if (state.reference.analysisTypes) {
          return state.reference.analysisTypes.types
        }
        return []
      },
      propertyTypes: state => {
        if (state.reference.propertyTypes) {
          return state.reference.propertyTypes.types
        }
        return []
      },
      remainedQuestions: state => state.main.remainedQuestions,
      landHouseAssessment: state => state.main.landHouseAssessment
    }),
    ...mapGetters([
      'isAdmin'
    ]),
    administrativeAreaLevel2 () {
      return getPropertyAddressComponentValue(this.property, 'administrative_area_level_2', false)
    },
    analysisTypeExplain () {
      if (this.analysisTypes && this.analysisType) {
        const analysisType = this.analysisTypes.find(o => o.code === this.analysisType)
        if (analysisType) {
          return analysisType.explain
        }
      }
      return ''
    },
    landScores () {
      return [
        { title: 'Topography', name: 'topography' },
        { title: 'Planning', name: 'planning' },
        { title: 'Performance', name: 'performance' },
        { title: 'Improvements', name: 'improvements' }
      ].map(section => {
        const assessment = this.getAssessmentSummary('land', section.name)
        return {
          title: section.title,
          value: this.loading ? -1 : assessment.value || 0,
          max: this.loading ? 10 : assessment.max || 10,
          textRenderer: this.textRenderer,
          q: {
            module: 'land',
            section: section.name,
            adjustmentQuestion: false,
            summaryQuestion: false,
            analysisType: this.analysisType,
            propertyType: this.propertyType,
            propertyWithViews: this.propertyWithViews
          }
        }
      })
    },
    landBonusScore () {
      const landBonusScore = this.getAssessmentSummary('land', null, true)
      return {
        title: '',
        value: this.loading ? -1 : landBonusScore.value || 0,
        max: this.loading ? 10 : landBonusScore.max || 10,
        textRenderer: this.bonusTextRenderer,
        q: { module: 'land', adjustmentQuestion: true, summaryQuestion: false, analysisType: this.analysisType }
      }
    },
    houseScores () {
      return [
        { title: 'Design & Liveability', name: 'design-liveability' },
        { title: 'Structure', name: 'structure' },
        { title: 'Quality & Condition', name: 'quality-condition' },
        { title: 'Inclusions', name: 'inclusions' },
        { title: 'External Features', name: 'external' }
      ].map(section => {
        const assessment = this.getAssessmentSummary('house', section.name)
        return {
          title: section.title,
          value: this.loading ? -1 : assessment.value || 0,
          max: this.loading ? 10 : assessment.max || 10,
          textRenderer: this.textRenderer,
          q: {
            module: 'house',
            section: section.name,
            adjustmentQuestion: false,
            summaryQuestion: false,
            analysisType: this.analysisType,
            propertyType: this.propertyType,
            propertyWithViews: this.propertyWithViews
          }
        }
      })
    },
    houseBonusScore () {
      const houseBonusScore = this.getAssessmentSummary('house', null, true)
      return {
        title: '',
        value: this.loading ? -1 : houseBonusScore.value || 0,
        max: this.loading ? 10 : houseBonusScore.max || 10,
        textRenderer: this.bonusTextRenderer,
        q: { module: 'house', adjustmentQuestion: true, summaryQuestion: false, analysisType: this.analysisType }
      }
    },
    landResponses () {
      const filteredQuestions = this.questions.filter(q => q.questionModule === 'land')
      const answers = []
      if (this.surveyanswer && this.surveyanswer.responses) {
        this.surveyanswer.responses.forEach(answer => {
          const question = filteredQuestions.find(q => q._id === answer.questionId)
          if (question) {
            const response = question.responses.find(r => r._id === answer.responseId)
            if (response) {
              answers.push({
                question,
                response: {
                  ...response,
                  responseScore: answer.responseScore,
                  responseMax: answer.responseMax
                }
              })
            }
          }
        })
      }
      return answers
    },
    houseResponses () {
      const filteredQuestions = this.questions.filter(q => q.questionModule === 'house')
      const answers = []
      if (this.surveyanswer && this.surveyanswer.responses) {
        this.surveyanswer.responses.forEach(answer => {
          const question = filteredQuestions.find(q => q._id === answer.questionId)
          if (question) {
            const response = question.responses.find(r => r._id === answer.responseId)
            if (response) {
              answers.push({
                question,
                response: {
                  ...response,
                  responseScore: answer.responseScore,
                  responseMax: answer.responseMax
                }
              })
            }
          }
        })
      }
      return answers
    },
    surveyAssessmentRequest () {
      return {
        analysisType: this.analysisType,
        propertyType: this.propertyType,
        propertyWithViews: this.propertyWithViews,
        modules: [
          {
            module: 'land',
            sections: [
              { section: 'topography' },
              { section: 'planning' },
              { section: 'performance' },
              { section: 'improvements' }
            ]
          }, {
            module: 'house',
            sections: [
              { section: 'design-liveability' },
              { section: 'structure' },
              { section: 'quality-condition' },
              { section: 'inclusions' },
              { section: 'external' }
            ]
          }
        ]
      }
    },
    questionFilters () {
      const filters = { module: 'land,house' }
      if (this.analysisType && this.analysisType.length) {
        filters.analysisType = this.analysisType
      }
      if (this.propertyType && this.propertyType.length) {
        filters.propertyType = this.propertyType
      }
      filters.propertyWithViews = this.propertyWithViews
      return filters
    },
    summarySurveyRoute () {
      return {
        name: 'Survey',
        params: { propertyId: this.propertyId },
        query: {
          module: 'house,land',
          summaryQuestion: true,
          analysisType: this.analysisType,
          propertyType: this.propertyType,
          propertyWithViews: this.propertyWithViews
        }
      }
    },
    propertyImage () {
      if (this.property && this.property.propertyImages && this.property.propertyImages.length) {
        if (this.property.propertyImages[0].url) {
          return this.property.propertyImages[0].url
        }
      }
      return '/static/images/agent1.jpg'
    },
    propertyImages () {
      if (this.property && this.property.propertyImages) {
        return this.property.propertyImages
      }
      return []
    },
    landModuleScore () {
      return this.formatScore(this.getAssessmentSummary('land').value)
    },
    houseModuleScore () {
      return this.formatScore(this.getAssessmentSummary('house').value)
    },
    serviceScore () {
      return this.formatScore(this.getAssessmentSummary().value)
    }
  },
  async mounted () {
    this.loading = true
    Promise.all([
      this.fetchAnalysisTypes(),
      this.fetchPropertyTypes(),
      this.fetchUserProperty({propertyId: this.propertyId}),
      this.fetchQuestions(this.questionFilters),
      this.fetchSurveyAnswer({propertyId: this.propertyId, query: {modules: 'land,house'}}),
      this.fetchSurveyScores()
    ])
      .then(() => {
        if (this.surveyanswer) {
          this.analysisType = this.surveyanswer.analysisType
          this.analysisTypeCache = this.analysisType
          this.propertyType = this.surveyanswer.propertyType
          this.propertyTypeCache = this.propertyType
          this.propertyWithViews = this.surveyanswer.propertyWithViews
          this.propertyWithViewsCache = this.propertyWithViews
        }
        this.loading = false
      })
      .catch(err => {
        console.log(err)
        this.loading = false
      })
  },
  methods: {
    ...mapActions({
      fetchAnalysisTypes: FETCH_ANALYSIS_TYPES,
      fetchPropertyTypes: FETCH_PROPERTY_TYPES,
      fetchUserProperty: FETCH_USER_PROPERTY,
      fetchQuestions: SEARCH_QUESTIONS,
      fetchSurveyAnswer: FETCH_SURVEY_ANSWER,
      fetchLandHouseAssessment: FETCH_LAND_HOUSE_ASSESSMENT,
      fetchRemainedQuestions: FETCH_REMAINED_QUESTIONS,
      submitSurveyAnswer: SUBMIT_SURVEY_ANSWER
    }),
    fetchSurveyScores (renew = false) {
      this.loading = true
      return Promise.all([
        this.fetchRemainedQuestions({
          propertyId: this.propertyId,
          query: {
            modules: 'land,house',
            summaryQuestion: true
          }
        }),
        this.fetchLandHouseAssessment({
          propertyId: this.propertyId,
          query: this.surveyAssessmentRequest,
          renew
        })
      ])
        .then(() => {
          this.loading = false
        })
    },
    getAssessmentSummary (_module = null, _section = null, isBonus = false) {
      let summary = {}
      if (this.landHouseAssessment) {
        if (_module) {
          if (this.landHouseAssessment.modules) {
            const moduleLevel = this.landHouseAssessment.modules.find(m => m.module === _module)
            if (moduleLevel) {
              if (_section) {
                if (moduleLevel.sections) {
                  const sectionLevel = moduleLevel.sections.find(s => s.section === _section)
                  if (sectionLevel) {
                    summary = sectionLevel.score
                  }
                }
              } else {
                if (moduleLevel.score) {
                  if (isBonus) {
                    summary = moduleLevel.score.bonus
                  } else {
                    summary = moduleLevel.score
                  }
                }
              }
            }
          }
        } else {
          summary = this.landHouseAssessment.score
        }
      }
      return summary
    },
    formatScore (val, tenMax = true) {
      let value = val || 0
      return tenMax ? Number.parseFloat(value).toFixed(1) : Number.parseFloat(value).toFixed(0)
    },
    isAnsweredAllSummaryQuestions (query) {
      const hasMatchedQuestions = this.questions.some(q => {
        if (q.questionModule === query.module) {
          if (q.analysisTypes.includes(this.analysisType)) {
            if (q.summaryQuestion && !q.adjustmentQuestion) {
              return true
            }
          }
        }
        return false
      })
      if (!hasMatchedQuestions) {
        return true
      }
      return this.remainedQuestions.some(o => o.module === query.module && o.remainedCount === 0)
    },
    textRenderer (val) {
      if (val === 0) {
        return '?'
      } else if (val === -1) {
        return ''
      }
      return val
    },
    bonusTextRenderer (val) {
      if (val === 0) {
        return '0'
      } else if (val === -1) {
        return ''
      }
      return val
    },
    goSurveyPage (query) {
      if (this.isAnsweredAllSummaryQuestions(query)) {
        this.$router.push({name: 'Survey', params: this.propertyId, query})
      } else {
        this.sectionSurveyRoute = {
          name: 'Survey',
          params: { propertyId: this.propertyId },
          query: {
            module: query.module,
            section: query.section,
            adjustmentQuestion: query.adjustmentQuestion,
            summaryQuestion: query.summaryQuestion,
            analysisType: this.analysisType,
            propertyType: this.propertyType,
            propertyWithViews: this.propertyWithViews
          }
        }
        this.openInformationModal()
      }
    },
    openInformationModal () {
      this.$modal.show('informationModal')
    },
    closeInformationModal () {
      this.$modal.hide('informationModal')
    },
    async onAnalysisTypeChange () {
      if (this.analysisType) {
        this.$modal.show('questionModal')
      } else {
        this.commitChanges()
      }
    },
    async onPropertyTypeChange () {
      if (this.propertyType) {
        this.$modal.show('questionModal')
      } else {
        this.commitChanges()
      }
    },
    openQuestionModal () {
      this.$modal.show('questionModal')
    },
    async closeQuestionModal (value) {
      if (value) {
        this.commitChanges()
      } else {
        this.analysisTypeCache = this.analysisType
        this.propertyTypeCache = this.propertyType
        this.propertyWithViewsCache = this.propertyWithViews
      }
      this.$modal.hide('questionModal')
    },
    async commitChanges () {
      this.committing = true
      try {
        this.analysisType = this.analysisTypeCache
        this.propertyType = this.propertyTypeCache
        this.propertyWithViews = this.propertyWithViewsCache
        await this.submitSurveyAnswer({
          ...this.surveyanswer,
          analysisType: this.analysisType,
          propertyType: this.propertyType,
          propertyWithViews: this.propertyWithViews,
          propertyId: this.propertyId
        })
        this.committing = false
        this.fetchSurveyScores()
      } catch (error) {
        this.committing = false
      }
    },
    onImageClick () {
      if (this.propertyImages.length) {
        this.$modal.show('imageModal')
      }
    },
    lunchLandDetailReport () {
      this.$router.push({name: 'LandDetail'})
    }
  }
}
</script>

<style scoped>
.title-analysis-type {
  display: flex;
  align-items: center;
}
.gage-list {
  padding-left: 20px;
  padding-right: 20px;
  margin-left: 0px;
  margin-right: 0px;
  background: #fcfcfc;
  border-radius: 2px;
  border: 1px solid #ccc;
}
.gages-container {
  margin-bottom: 50px;
}
.static-gage {
  display: flex;
  justify-content: center;
  align-items: center;
}
.static-gage > div {
  height: 100px;
  width: 100px;
  line-height: 100px;
  font-size: 2.3em;
  margin-bottom: 0.25em;
  margin-top: 0.3em;
  color: rgba(170, 41, 35, 0.85);
  border: 4px solid rgba(170, 41, 35, 0.85);
  border-radius: 8px;
}
.static-gage-title {
  color: #999999;
  font-size: 15px;
  font-family: sans-serif;
  font-weight: bold;
  text-align: center;
  display: inline-block;
}
.static-gage-link:hover {
  text-decoration: none;
}
.static-gage-link:hover .static-gage-title {
  color: #2dc31d;
}
.loading-spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 60px;
}
.analysis-type-section {
  border: 1px solid #cccccc;
  border-radius: 2px;
  display: flex;
  padding-top: 16px;
  padding-bottom: 16px;
}
h5.debug-table-title {
  margin-bottom: 0;
  min-width: 200px;
}
.div-house-header {
  z-index: 10000;
}
.div-house-body {
  position: relative;
}
.ppt-list {
  border: 2px solid rgba(0, 0, 0, 0.4);;
  background-color: #FFF;
  width: 100%;
  float: left;
}
.figure-title {
  text-align: center;
  padding-left: 3px;
  padding-right: 3px;
  height: 60px;
  margin-top: 15px;
}
.figure-title a {
  color: #528EC1;
  font-size: 25px;
  line-height: 60px;
}
.figure-content {
  padding-left: 15px;
  padding-right: 15px;
}
.figure-content p {
  line-height: 18px;
}
.image-effect.overlay {
  padding: 10px
}
.image-effect.overlay img {
  width: 100%;
  height: 100%;
}
.ppt-list .overlay:before {
background-color: transparent;
}
.map-hold.overlay:before, .overlay:before {
  background-color: rgba(0, 0, 0, 0.1)
}
.ppt-score {
  border: solid #528EC1 1px;
  position: absolute;
  z-index: 1000;
  margin-left: auto;
  margin-right: auto;
  left: 30px;
  right: 30px;
  bottom: 35px;
}
.ppt-score div {
  background-color: #FFF;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #528EC1;
}
.information-modal {
  padding: 20px;
}
.information-modal button:hover {
  border-color: #528EC1 !important;
  color: #fff !important;
  background-color: #528EC1 !important;
}
.information-modal button:focus {
  outline: thin dotted;
  outline-offset: -4px;
}
.level-score .score {
  line-height: 1.4;
}
.level-score .text {
  font-size: 1.5em;
  line-height: 1.6;
}
.land-page >>> .control-label {
  min-width: 220px;
}
.land-page >>> .checkbox-wrap {
  margin-left: 220px;
}
.land-page >>> .checkbox-wrap input,
.land-page >>> .checkbox-wrap input+span:before {
  top: 4px;
}
</style>
