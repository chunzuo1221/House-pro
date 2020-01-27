<template>
  <div class="explorer-page">
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
            <div id="introduction_section" class="col-md-12 col-sm-12">
              <div class="lst-vw top mb-50 full d-flex">
                <div class="property-image-box" v-if="propertyImage">
                  <figure>
                    <img :src="propertyImage" class="property-image" @click="onImageClick">
                  </figure>
                </div>
                <div class="property-heading">
                  <h4 class="pull-left mb-0">
                    {{property.name}}
                    <toggle-button class="ml-3"
                      v-model="isLockedProperty"
                      :sync="true"
                      @change="onToggleHandler"
                      :color="toggleColor"/>
                    <span><i class="fa fa-map-marker"></i> {{property.formatted_address}} </span>
                  </h4>
                  <span class="pull-right"> {{administrativeAreaLevel2}}</span>
                </div>
              </div>
            </div>
            <!--top-->
            <div class="col-md-12">
              <div class="mb-50">
                <div class="sec-title icon-wrap">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="d-flex justify-space-between mb-4">
                        <h4 class="mb-0">Location Analysis Report</h4>
                        <div class="d-flex">
                          <button class="btn btn-primary btn-rect" v-if="isAdmin" @click="onToggleInactiveServicesClick" :disabled="isLockedProperty">
                            {{hiddenInactiveServices ? 'Show Inactive Suburb Services' : 'Hide Inactive Suburb Services'}}
                          </button>
                          <button class="btn btn-primary btn-rect ml-2" v-if="isAdmin" @click="calculateProximityScores(true)" :disabled="isLockedProperty">Recalc Active Services</button>
                          <router-link class="black-link square-link ml-2" :to="{name: 'Property', params: { propertyId }}">
                            &lsaquo;&lsaquo; Back to Property Details </router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- <div v-if="suburb" v-html="suburb.overviewDescription"></div> -->
              </div>
            </div>
            <div class="col-md-12 col-sm-12">
              <div class="col-md-2 col-sm-2 quick-menu">
                <div class="menu-title">QUICK MENU</div>
                <table>
                  <tr><td><div id="introduction" @click="scrollToElement">INTRODUCTION</div></td></tr>
                  <tr><td><div id="overall_score" @click="scrollToElement">OVERALL lOCATION SCORE</div></td></tr>
                  <tr><td><div id="street_aesthetics" @click="scrollToElement">STREET AESTHETICS</div></td></tr>
                  <tr><td><div id="surrounding_real_estate" @click="scrollToElement">SURROUNDING REAL ESTATE</div></td></tr>
                  <tr><td><div id="traffic_parking" @click="scrollToElement">TRAFFIC AND PARKING</div></td></tr>
                  <tr><td><div id="access_to_service" @click="scrollToElement">ACCESS TO SERVICES</div></td></tr>
                  <tr><td><div id="city_beach_train" @click="scrollToElement">CITY/BEACH/TRAIN INDEXES</div></td></tr>
                  <tr><td><div id="properties_like" @click="scrollToElement">PROPERTIES LIKE THIS</div></td></tr>
                </table>
              </div>
              <div class="col-md-10 col-sm-10">
                <div id="overall_score_section" class="col-md-12" v-if="locationScore > 0 && overallDynamicParagraph.length">
                  <div class="highlight-section px-4 py-4">
                    <div class="row">
                      <div class="col-sm-3 d-flex justify-start">
                        <div class="level-score">
                          <div class="score">{{overallLocationScore}}</div>
                          <div class="text">Overall Location<br/>Score</div>
                        </div>
                      </div>
                      <div class="col-sm-9">
                        <div class="report-content">
                          <div class="mb-2" v-html="overallDynamicParagraph"></div>
                          <ul class="my-0">
                            <template v-for="(highlight, i) in highlightBulletPoints">
                              <li :key="`highlight-${i}`" v-html="highlight"></li>
                            </template>
                          </ul>
                        </div>
                      </div>
                      <div class="col-sm-12 mt-3">
                        <div class="report-content" v-html="rankingParagraph"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div :id="gageItem.sectionId" class="col-md-12 col-sm-3 gages-container mb-3" v-if="property" v-for="gageItem in surveyScores" :key="gageItem.q.section">
                  <!--<div class="section-title highlight-text">{{gageItem.sectionTitle}}</div>-->
                  <div class="col-md-12 col-sm-12 mt-3">
                    <div class="sec-title icon-wrap">
                      <div class="row">
                        <div class="col-md-6">
                          <h4>{{gageItem.sectionTitle}}</h4>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-12 mt-3 highlight-text">
                      <div class="report-content" v-html="gageItem.standardParagraph"></div>
                    </div>
                  </div>
                  <div class="gage-list highlight-text">
                    <div class="row">
                      <div class="col-md-4 col-sm-4">
                        <router-link v-if="!isLockedProperty" :to="{name: 'Survey', params: {propertyId}, query: gageItem.q}" class="link mb-3 center-block text-center btn-link primary-color">
                          <div class="gage-wrap" v-gage="gageItem"></div>
                          <div class="loading-spinner" v-if="gageItem.value === -1">
                            <scale-loader color="#27ae60" />
                          </div>
                        </router-link>
                        <router-link v-else to="#" class="link mb-3 center-block text-center btn-link primary-color">
                          <div class="gage-wrap" v-gage="gageItem"></div>
                          <div class="loading-spinner" v-if="gageItem.value === -1">
                            <scale-loader color="#27ae60" />
                          </div>
                        </router-link>
                      </div>
                      <div v-if="getSectionResponses(gageItem).length > 0" class="col-md-8 col-sm-8">
                        <div class="my-3 mr-3" v-html="getSectionDynamicParagraph(gageItem)"></div>
                        <ul class="response-comments my-3 ml-0 mr-3">
                          <li
                            v-for="response in getSectionResponses(gageItem)"
                            :key="response._id"
                            :class="getResponseLevel(response)"
                            class="my-3"
                          >
                            <div class="pl-5">{{response.responseCommentary}}</div>
                          </li>
                        </ul>
                      </div>
                      <div v-else class="col-md-7 col-sm-7 no-survey-data">
                        We don't have any survey data for this property yet - please try later!
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="surveyanswer">
                  <div v-if="surveyanswer.clonedFrom" class="text-right">Scores derived from analysis of : <b>{{ surveyanswer.clonedFrom }}</b></div>
                  <div v-else class="text-right"></div>
                </div>

                <div id="access_to_service_section" class="col-md-12 col-sm-12 my-3">
                  <div class="sec-title icon-wrap">
                    <div class="row">
                      <div class="col-md-6">
                        <h4>Access to Services</h4>
                      </div>
                    </div>
                  </div>
                  <p>
                    HousePro have developed custom built proximity scoring algorithms to determine how well situated a property is to services in comparison to the rest of the suburb. Throughout different times of the day and through different modes of transportation, the property owner's ability to reach these different services was tested, rated and is shown in the dials below.
                  </p>
                  <p>
                    The proximity to services is paramount in the final score for the location module. The closer the property is to the stated services, the easier and more efficient living becomes.
                  </p>
                </div>

                <div class="col-md-12 gages-container">
                  <div class="gage-list" v-if="property">
                    <div v-if="hasNoSuburb" class="sad-dial row">
                      <div class="col-md-3 col-sm-3 sad-dial-img">
                        <img class="" src="/static/images/sad-face-emoticon.jpg">
                      </div>
                      <div class="col-md-9 col-sm-9 sad-dial-text">
                        <div>
                          <div class="title">We're Sorry!</div>
                          <div class="content">We don't current have research data for this suburb. Service Proximity Analysis will become available in the near future.</div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="row">
                      <div class="col-md-4 col-sm-6" v-for="i in 3" :key="i">
                          <router-link
                            to="#"
                            class="link my-3 center-block text-center btn-link primary-color"
                          >
                            <div class="gage-wrap" v-gage="suburbServices[i - 1]"></div>
                            <div class="loading-spinner" v-if="suburbServices[i - 1].value === -1">
                              <scale-loader color="#27ae60" />
                            </div>
                          </router-link>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-12 gages-container">
                  <div class="gage-list" v-if="property">
                    <div class="row">
                      <div class="col-md-3 col-sm-6 col-sm-offset-2" v-for="i in 2" :key="i">
                        <router-link
                          to="#"
                          class="link my-3 center-block text-center btn-link primary-color"
                        >
                          <div class="gage-wrap" v-gage="suburbServices[i + 2]"></div>
                          <div class="loading-spinner" v-if="suburbServices[i + 2].value === -1">
                            <scale-loader color="#27ae60" />
                          </div>
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="accessServiceComment.service_count > 0" class="col-md-12 col-sm-12 mb-3 pb-3 service-comment">
                  <p>
                    Our Service Proximity algorithm has compiled the assesment scores above for <b>{{accessServiceComment.street}}</b>
                    by analysing a wide range of services in and around <b>{{accessServiceComment.suburb}}</b>, including
                    <span v-if="accessServiceComment.school_count > 0"><b>{{accessServiceComment.school_count}}</b> schools</span>
                    <span v-if="accessServiceComment.park_count > 0"><b> {{accessServiceComment.park_count}}</b> parks</span>
                    <span v-if="accessServiceComment.shopping_count > 0"><b> {{accessServiceComment.shopping_count}}</b> shopping centers</span>
                    <span v-if="accessServiceComment.hospital_count > 0"><b> {{accessServiceComment.hospital_count}}</b> medical facilities</span>.
                  </p>
                  <p>
                    Below are some of the specific features of this property that were found:
                  </p>
                  <ul class="mt-1">
                    <li class="mt-1 ml-3" v-for="(service, index) in accessServiceComment.services" :key="index" v-if="service.comment" v-html="service.comment">{{ service.comment }}</li>
                  </ul>
                </div>
                <div class="col-md-12 col-sm-12" id="city_beach_train_section">
                  <div class="my-3">
                    <div class="sec-title icon-wrap">
                      <div class="row">
                        <div class="col-md-6">
                          <h4>City/Beach/Train Index</h4>
                        </div>
                      </div>
                    </div>
                    <p>
                      These Indexes are the result of a comparative, cross-suburb analysis that measures the proximity of the property to the city, beaches and nearest train station.
                    </p>
                  </div>

                  <div class="gages-container">
                    <div class="gage-list" v-if="property">
                      <div class="row">
                        <div class="col-md-4 col-sm-6" v-for="i in 3" :key="i">
                          <router-link
                            to="#"
                            class="link my-3 center-block text-center btn-link primary-color"
                          >
                            <div class="gage-wrap" v-gage="suburbServices[i + 4]"></div>
                            <div class="loading-spinner" v-if="suburbServices[i + 4].value === -1">
                              <scale-loader color="#27ae60" />
                            </div>
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div class="mb-50">
                      <div class="service-comment">
                        <p>
                          In review these score indicate that :
                        </p>
                        <ul class="mt-3">
                          <li v-for="i in 3" :key="i" v-if="suburbServices[i + 4].comment != ''" v-html="suburbServices[i + 4].comment" class="mt-2 ml-3"></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr/>
        <div id="properties_like_section" class="px-4" v-if="isAdmin">
          <div class="mb-10">
            <div class="sec-title icon-wrap">
              <h4>Debug Information</h4>
            </div>
          </div>
          <div class="my-4">
            <div class="d-flex justify-start align-center mb-1">
              <h5 class="debug-table-title">Position Scoring</h5>
              <button class="btn btn-default" @click="visiblePositionScores=!visiblePositionScores">{{visiblePositionScores ? 'Hide Table' : 'View Table'}}</button>
            </div>
            <table v-show="visiblePositionScores">
              <thead>
                <th>Question</th>
                <th>Question Code</th>
                <th>Section</th>
                <th>Response</th>
                <th>Score</th>
                <th>Max</th>
                <th>Response Code</th>
                <th>Commentary</th>
              </thead>
              <tbody>
                <tr v-for="(row, i) in surveyResponses" :key="i">
                  <td>{{ row.question ? row.question.text : '' }}</td>
                  <td>{{ row.question ? row.question.questionCode : '' }}</td>
                  <td>{{ row.question ? row.question.questionSection : '' }}</td>
                  <td>{{ row.response ? row.response.responseText : '' }}</td>
                  <td>{{ row.response ? row.response.responseScore : '' }}</td>
                  <td>{{ row.response ? row.response.responseMax : '' }}</td>
                  <td>{{ row.response ? row.response.responseCode : '' }}</td>
                  <td>{{ row.response ? row.response.responseCommentary : '' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="my-4">
            <div class="d-flex justify-start align-center mb-1">
              <h5 class="debug-table-title">Access To Services Scoring</h5>
              <button class="btn btn-default ml-3" @click="visibleProximityScores=!visibleProximityScores">{{visibleProximityScores ? 'Hide Table' : 'View Table'}}</button>
            </div>
            <table v-show="visibleProximityScores">
              <thead>
                <th>Service Name</th>
                <th>Service Category</th>
                <th>Type</th>
                <th>Sub Type</th>
                <th>Keywords</th>
                <th>RuleID</th>
                <th>PlaceID</th>
                <th>Penalty</th>
                <th>
                  <tr>
                    <th>Matched Travel Mode</th>
                    <th>Distance(m)</th>
                    <th>Time(s)</th>
                    <th>Score</th>
                    <th>Max Score</th>
                  </tr>
                </th>
              </thead>
              <tbody>
                <tr v-for="(row, i) in services" :key="i">
                  <td>{{ row.name }}</td>
                  <td>{{ row.serviceCategory }}</td>
                  <td>{{ row.serviceType }}</td>
                  <td>{{ row.serviceSubType }}</td>
                  <td>{{ row.keywords }}</td>
                  <td>{{ row.proximityRuleCode }}</td>
                  <td>{{ row.googlePlaceId }}</td>
                  <td>{{ row.servicePenalty }}</td>
                  <td>
                    <tr v-for="(travel, j) in row.travels" :key="j" class="embed-in-table">
                      <td>{{ row.travels[j].matchedTravelMode }}</td>
                      <td>{{ row.travels[j].travelDistance }}</td>
                      <td>{{ row.travels[j].travelTime }}</td>
                      <td>{{ row.travels[j].score }}</td>
                      <td>{{ row.travels[j].maxScore }}</td>
                    </tr>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-row">
            <div class="d-flex justify-start align-center mb-1">
              <h5>Scoring Rules</h5>
              <button class="btn btn-default ml-3" @click="visibleScoringRules=!visibleScoringRules">{{visibleScoringRules ? 'Hide Table' : 'View Table'}}</button>
            </div>
            <table v-show="visibleScoringRules">
              <thead>
                <th>Category</th>
                <th>Type</th>
                <th>SubType</th>
                <th>Calculation Method</th>
                <th>Debug</th>
              </thead>
              <tbody>
                <tr v-for="(row, i) in scoringRules" :key="i">
                  <td>{{ row.categoryName }}</td>
                  <td>{{ row.typeName }}</td>
                  <td>{{ row.subTypeName }}</td>
                  <td>{{ row.calculationMethodName }}</td>
                  <td>{{ getScoringDebugById(row.uuid) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
import lget from 'lodash.get'
import { Promise } from 'bluebird'
import { mapState, mapGetters } from 'vuex'
import ScaleLoader from 'vue-spinner/src/ScaleLoader'
import gageDirective from '@/directives/gage'
import googleMapDirective from '@/directives/google-map'
import {
  SAVE_SCORING_RULE,
  FETCH_LOCATION_SUMMARY,
  FETCH_PROXIMITY_ASSESSMENT
} from '@/store/action-types'
import { SET_PROXIMITY_ASSESSMENT } from '@/store/mutation-types'
import PropertiesApi from '@/api/properties'
import ScoringRulesApi from '@/api/scoring-rules'
import ImageCarousel from '@/components/core/ImageCarousel'
import { getPropertyAddressComponentValue, getSectionGrade } from '@/utils'
import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)

export default {
  name: 'Explorer',
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
      locationScore: 0,
      surveyScores: [
        {
          sectionTitle: 'Street Aesthetics',
          sectionId: 'street_aesthetics_section',
          value: -1,
          max: 10,
          textRenderer: this.textRenderer,
          q: { module: 'location', section: 'street-aesthetics' },
          standardParagraph: `HousePro considers Street Aesthetics as an observation of the existing street trees 
            in terms of height and species, alongside neighbouring gardens and facets of the street itself.`
        }, {
          sectionTitle: 'Surrounding Real Estate',
          sectionId: 'surrounding_real_estate_section',
          value: -1,
          max: 10,
          textRenderer: this.textRenderer,
          q: { module: 'location', section: 'street-surrounding-real-estate' },
          standardParagraph: `HousePro considers the Surrounding Real Estate as an observation of the neighbouring properties, looking at the quality of landscaping and general age of houses.`
        }, {
          sectionTitle: 'Traffic & Parking',
          sectionId: 'traffic_parking_section',
          value: -1,
          max: 10,
          textRenderer: this.textRenderer,
          q: { module: 'location', section: 'street-traffic-parking' },
          standardParagraph: `HousePro considers Traffic & Parking as an observation of the road conditions, analysing traffic density, parking availability and road controls.`
        }
      ],
      suburbServices: [
        {
          title: 'Parks & Leisure',
          value: -1,
          max: 10,
          textRenderer: this.textRenderer,
          q: { section: 'park' }
        }, {
          title: 'Schools',
          value: -1,
          max: 10,
          textRenderer: this.textRenderer,
          q: { section: 'school' }
        }, {
          title: 'Shopping',
          value: -1,
          max: 10,
          textRenderer: this.textRenderer,
          q: { section: 'shopping' }
        }, {
          title: 'Public Transport',
          value: -1,
          max: 10,
          textRenderer: this.textRenderer,
          q: { section: 'public-transport' }
        }, {
          title: 'Medical Facilities',
          value: -1,
          max: 10,
          textRenderer: this.textRenderer,
          q: { section: 'medical' }
        }, {
          title: 'City Index',
          value: -1,
          max: 10,
          textRenderer: this.textRenderer,
          q: { section: 'city-index' },
          condition: function (element) {
            return element.moduleCode === 'location' && element.reportContentType === 'city-index'
          },
          comment: ''
        }, {
          title: 'Beach Index',
          value: -1,
          max: 10,
          textRenderer: this.textRenderer,
          q: { section: 'beach-index' },
          condition: function (element) {
            return element.moduleCode === 'location' && element.reportContentType === 'beach-index'
          },
          comment: ''
        }, {
          title: 'Train Index',
          value: -1,
          max: 10,
          textRenderer: this.textRenderer,
          q: { section: 'train-index' },
          condition: function (element) {
            return element.moduleCode === 'location' && element.reportContentType === 'train-index'
          },
          comment: ''
        }
      ],
      loading: false,
      surveyResponses: [],
      scoringDebugBySubType: {},
      visiblePositionScores: false,
      visibleProximityScores: false,
      visibleScoringRules: false,
      hasNoSuburb: false,
      accessServiceComment: {
        street: '',
        suburb: '',
        service_count: 0,
        school_count: 0,
        park_count: 0,
        hospital_count: 0,
        shopping_count: 0,
        services: [
          {
            type: 'school',
            condition: function (element) { return element.matchedTravelMode === 'walking' },
            max_count: 0,
            count: 0,
            nearest: '',
            distance: 0,
            travel_time: 0,
            travel: '',
            comment: ''
          },
          {
            type: 'park',
            condition: function (element) { return element.matchedTravelMode === 'walking' },
            max_count: 0,
            count: 0,
            nearest: '',
            distance: 0,
            travel_time: 0,
            travel: '',
            comment: ''
          },
          {
            type: 'shopping',
            condition: function (element) { return element.matchedTravelMode === 'walking' },
            max_count: 0,
            count: 0,
            nearest: '',
            distance: 0,
            travel_time: 0,
            travel: '',
            comment: ''
          },
          {
            type: 'medical',
            condition: function (element) { return element.matchedTravelMode === 'walking' && element.score > 4 },
            max_count: 0,
            count: 0,
            nearest: '',
            distance: 0,
            travel_time: 0,
            travel: '',
            comment: ''
          }
        ]
      },
      hiddenInactiveServices: false,
      toggleColor: {checked: 'red', unchecked: '#25EF02'},
      isLockedProperty: false
    }
  },
  computed: {
    ...mapState({
      property: state => state.main.property,
      suburb: state => state.main.suburb,
      surveyanswer: state => state.main.surveyanswer,
      surveyQuestions: state => state.main.surveyQuestions,
      contentFragments: state => state.main.contentFragments,
      comparativeRanking: state => state.main.comparativeRanking,
      locationAssessment: state => state.main.locationAssessment,
      proximityAssessment: state => state.main.proximityAssessment,
      scoringRules: state => state.scoringRule.scoringRules
    }),
    ...mapGetters([
      'isAdmin'
    ]),
    administrativeAreaLevel2 () {
      return getPropertyAddressComponentValue(this.property, 'administrative_area_level_2', false)
    },
    overallLocationScore () {
      return lget(this.property, 'scores.overall.value')
    },
    surveyAssessmentRequest () {
      return {
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
    },
    propertyImage () {
      if (this.property && this.property.propertyImages && this.property.propertyImages.length) {
        if (this.property.propertyImages[0].url) {
          return this.property.propertyImages[0].url
        }
      }
      return null
    },
    propertyImages () {
      if (this.property && this.property.propertyImages) {
        return this.property.propertyImages
      }
      return []
    },
    overallReportFragments () {
      if (this.contentFragments.length) {
        return this.contentFragments
          .filter(o => o.reportContentType === 'overall')
          .sort((a, b) => b.upperBound - a.upperBound)
      }
      return []
    },
    overallDynamicParagraph () {
      if (this.locationScore > 0 && this.overallReportFragments.length) {
        let matched = null
        for (let i = 0; i < this.overallReportFragments.length; i++) {
          const o = this.overallReportFragments[i]
          if (o.upperBound <= this.locationScore) {
            if (i === 0 || o.upperBound === this.locationScore) {
              matched = this.overallReportFragments[i]
            } else {
              matched = this.overallReportFragments[i - 1]
            }
            break
          } else if (i === this.overallReportFragments.length - 1) {
            matched = this.overallReportFragments[i]
            break
          }
        }
        if (matched) {
          return matched.contentFragment
            .replace('{property-name}', `<span class="highlight">${this.property.name}</span>`)
            .replace('{location-score}', `<span class="highlight">${this.overallLocationScore}</span>`)
        }
      }
      return ''
    },
    highlightBulletPoints () {
      let surveyScores = this.surveyScores.filter(o => o.value > 0)
      if (surveyScores.length) {
        surveyScores = surveyScores
          .sort((a, b) => b.value - a.value)
          .slice(0, 2)
          .map(o => {
            const level = getSectionGrade(o.value)
            return `<span class="highlight">${o.title || o.sectionTitle}</span> with <span class="highlight">${level}</span> score of <span class="highlight">${o.value}</span>`
          })
      }
      let suburbServices = this.suburbServices.filter(service => {
        if (['-', 'city-index', 'beach-index', 'train-index'].includes(service.q.section) === false) {
          return service.value > 0
        }
        return false
      })
      if (suburbServices.length) {
        suburbServices = suburbServices
          .sort((a, b) => b.value - a.value)
          .slice(0, 2)
          .map(o => {
            const level = getSectionGrade(o.value)
            return `Proximity to <span class="highlight">${o.title}</span> with <span class="highlight">${level}</span> score of <span class="highlight">${o.value}</span>`
          })
      }
      return surveyScores.concat(suburbServices)
    },
    rankingParagraph () {
      if (this.suburb && this.comparativeRanking) {
        return this.comparativeRanking.template
          .replace('{percentile}', this.comparativeRanking.percentile)
          .replace('{total}', this.comparativeRanking.total)
          .replace('{name}', this.suburb.name)
      }
      return ''
    },
    services () {
      if (this.proximityAssessment && this.proximityAssessment.services) {
        if (!this.hiddenInactiveServices) {
          return this.proximityAssessment.services || []
        }
        if (this.suburb && this.suburb.services) {
          return this.proximityAssessment.services.filter(assessment => {
            const service = this.suburb.services.find(s => s._id === assessment.suburbServiceId)
            if (service && service.isActive) {
              return true
            }
          })
        }
      }
      return []
    }
  },
  async mounted () {
    this.loading = true
    await this.$store.dispatch(FETCH_LOCATION_SUMMARY, { propertyId: this.propertyId })
    this.isLockedProperty = this.property.locked ? this.property.locked : false
    this.setSurveyScores()
    this.extractSurveyAnswers()
    await this.calculateProximityScores()
    this.loading = false
  },
  methods: {
    setSurveyScores () {
      this.surveyScores.forEach(section => {
        const sectionScore = this.getAssessmentSummary('location', section.q.section)
        section.value = sectionScore.value || 0
        section.max = sectionScore.max || 10
      })
      this.locationScore = this.getAssessmentSummary('location').value || 0
    },
    resetProxmityScores () {
      this.suburbServices.forEach(service => {
        service.value = -1
      })
    },
    fetchProximityAssessment (force = false) {
      return this.$store.dispatch(FETCH_PROXIMITY_ASSESSMENT, { propertyId: this.propertyId, force })
    },
    fetchScoringRules () {
      return Promise.resolve().then(() => {
        if (this.suburb) {
          const postCode = this.suburb.postCode
          return ScoringRulesApi.get(postCode)
            .then(scoringRules => {
              this.hasNoSuburb = false
              return this.$store.dispatch(SAVE_SCORING_RULE, { scoringRules })
            })
            .catch(err => {
              console.log(err)
              this.hasNoSuburb = true
            })
        }
        this.hasNoSuburb = true
      })
    },
    updateProximityScoresStates () {
      let streetname = ''
      let componentObj = this.property.address_components.find(o => o.types.includes('street_number'))
      if (componentObj) {
        streetname = componentObj.short_name
      }
      componentObj = this.property.address_components.find(o => o.types.includes('route'))
      if (componentObj) {
        streetname += ' ' + componentObj.short_name
      }
      const accessServiceComment = {...this.accessServiceComment}
      accessServiceComment.street = streetname
      accessServiceComment.service_count = this.services.length
      accessServiceComment.suburb = this.suburb.name
      accessServiceComment.services.forEach((service) => {
        let relevantServices = this.services.filter(svc => svc.serviceCategory === service.type)
        service.max_count = relevantServices.length
        let walkingServices = relevantServices.filter((svc) => {
          let travel = svc.travels.find(service.condition)
          if (travel) {
            return svc
          }
        })
        service.count = walkingServices.length
        if (walkingServices.length === 0) {
          walkingServices = relevantServices
        }
        walkingServices.forEach((svc) => {
          svc.travels.forEach((travel) => {
            if (service.distance === 0) {
              service.distance = isNaN(travel.travelDistance / 1000) ? 0 : parseFloat(travel.travelDistance / 1000).toFixed(1)
              service.travel_time = isNaN(travel.travelTime / 1000) ? 0 : parseInt(travel.travelTime / 60)
              service.nearest = svc.name
            } else {
              if (service.distance > travel.travelDistance) {
                service.distance = isNaN(travel.travelDistance / 1000) ? 0 : parseFloat(travel.travelDistance / 1000).toFixed(1)
                service.travel_time = isNaN(travel.travelTime / 1000) ? 0 : parseInt(travel.travelTime / 60)
                service.nearest = svc.name
              }
            }
          })
        })
      })
      let self = this
      accessServiceComment.services.forEach((service) => {
        let fragment = null
        switch (service.type) {
          case 'school':
            self.accessServiceComment.school_count = service.max_count
            if (service.count > 1) {
              fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'schools-walking')
              if (fragment) {
                service.comment = self.formatString(fragment.contentFragment, [service.count, service.nearest])
              }
            } else if (service.count === 1) {
              fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'single-school-walking')
              if (fragment) {
                service.comment = self.formatString(fragment.contentFragment, [service.nearest])
              }
            }
            break
          case 'park':
            self.accessServiceComment.park_count = service.max_count
            if (service.count > 1) {
              fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'parks-walking')
              if (fragment) {
                service.comment = self.formatString(fragment.contentFragment, [service.nearest, service.count])
              }
            } else if (service.count === 1) {
              fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'single-park-walking')
              if (fragment) {
                service.comment = self.formatString(fragment.contentFragment, [service.nearest])
              }
            }
            break
          case 'medical':
            self.accessServiceComment.hospital_count = service.max_count
            if (service.count > 1) {
              fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'hospitals-walking')
              if (fragment) {
                service.comment = self.formatString(fragment.contentFragment, [service.nearest, service.count])
              }
            } else if (service.count === 1) {
              fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'single-hospital-walking')
              if (fragment) {
                service.comment = self.formatString(fragment.contentFragment, [service.nearest])
              }
            } else {
              fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'no-hospital-near')
              if (fragment && service.distance > 0) {
                service.comment = self.formatString(fragment.contentFragment, [service.distance, service.travel_time])
              }
            }
            break
          case 'shopping':
            self.accessServiceComment.shopping_count = service.max_count
            if (service.count > 1) {
              fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'shopping-walking')
              if (fragment) {
                service.comment = self.formatString(fragment.contentFragment, [service.nearest, service.count])
              }
            } else if (service.count === 1) {
              fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'single-shopping-walking')
              if (fragment) {
                service.comment = self.formatString(fragment.contentFragment, [service.nearest])
              }
            }
            break
        }
      })
      this.suburbServices = this.suburbServices.map(category => {
        let totalScore = 0
        let totalMaxScore = 0
        const cat = category.q.section
        const catScoringRules = this.scoringRules.filter(rule => rule.categoryCode === cat)
        if (catScoringRules.length === 0) {
          let relevantServices = this.services.filter(svc => svc.serviceCategory === cat)
          let scoringRule = {
            calculationMethodCode: 'average-0'
          }
          let scoreForCategory = this.getScoreSubType(relevantServices, scoringRule)
          totalScore += scoreForCategory.totalScore
          totalMaxScore += scoreForCategory.totalMaxScore
        } else {
          catScoringRules.forEach(scoringRule => {
            let relevantServices = this.services.filter(svc => {
              if ((svc.serviceCategory === scoringRule.categoryCode) &&
                (svc.serviceType === scoringRule.typeCode) &&
                (svc.serviceSubType === scoringRule.subTypeCode)) {
                return svc
              }
            })
            if (relevantServices.length !== 0) {
              let scoreForSubType = {}
              scoreForSubType = this.getScoreSubType(relevantServices, scoringRule)
              totalScore += scoreForSubType.totalScore
              totalMaxScore += scoreForSubType.totalMaxScore
            }
          })
        }
        totalScore = totalScore || 0
        totalMaxScore = totalMaxScore || 10
        if (totalScore === 0) {
          totalMaxScore = 0
          let relevantServices = this.services.filter(svc => svc.serviceCategory === cat)
          let scoringRule = {
            calculationMethodCode: 'average-0'
          }
          let scoreForCategory = this.getScoreSubType(relevantServices, scoringRule)
          totalScore += scoreForCategory.totalScore
          totalMaxScore += scoreForCategory.totalMaxScore
        }
        totalScore = totalScore || 0
        totalMaxScore = totalMaxScore || 10
        category.value = ((totalScore / totalMaxScore) * 10).toFixed(1)
        category.max = 10
        if (category.condition) {
          let fragments = this.contentFragments.filter(category.condition)
          if (fragments.length > 0) {
            let fragment = null
            fragments.forEach((frg) => {
              if (!fragment) {
                fragment = frg
              } else {
                if (category.value > 0) {
                  if (Math.abs(fragment.upperBound - category.value) > Math.abs(frg.upperBound - category.value)) {
                    fragment = frg
                  }
                } else {
                  if (frg.upperBound < fragment.upperBound) {
                    fragment = frg
                  }
                }
              }
            })
            if (fragment) {
              if (fragment.upperBound < category.value) {
                fragments.sort((a, b) => { return parseFloat(a.upperBound) - parseFloat(b.upperBound) })
                fragment = fragments.find(cmt => cmt.upperBound > fragment.upperBound)
              }
            }
            category.comment = this.formatString(fragment.contentFragment, [category.value])
          }
        }
        return category
      })
      this.accessServiceComment = accessServiceComment
    },
    async calculateProximityScores (force = false) {
      try {
        this.resetProxmityScores()
        await Promise.all([
          this.fetchProximityAssessment(force),
          this.fetchScoringRules()
        ])
        this.updateProximityScoresStates()
      } catch (error) {
        this.hasNoSuburb = true
        if (error.response && error.response.data) {
          this.suburbServices = this.suburbServices.map(service => {
            return {
              ...service,
              value: 0,
              max: 10
            }
          })
          if (error.response.data.message) {
            this.$snack.danger({text: String(error.response.data.message)})
          }
        }
      }
    },
    async resetSuburbScores () {
      try {
        this.resetProxmityScores()
        const proximityAssessment = await PropertiesApi.resetProximityAssessment(this.propertyId)
        this.$store.commit(SET_PROXIMITY_ASSESSMENT, proximityAssessment)
        this.$nextTick()
        this.updateProximityScoresStates()
      } catch (error) {
        this.hasNoSuburb = true
        if (error.response && error.response.data) {
          this.suburbServices = this.suburbServices.map(service => {
            return {
              ...service,
              value: 0,
              max: 10
            }
          })
          if (error.response.data.message) {
            this.$snack.danger({text: String(error.response.data.message)})
          }
        }
      }
    },
    extractSurveyAnswers () {
      if (this.surveyanswer && this.surveyanswer.responses) {
        const answers = []
        this.surveyanswer.responses.forEach(a => {
          const question = this.surveyQuestions.find(q => q._id === a.questionId)
          if (question) {
            const response = question.responses.find(r => r._id === a.responseId)
            answers.push({
              question,
              response: {
                ...response,
                responseScore: a.responseScore,
                responseMax: a.responseMax
              }})
          }
        })
        this.surveyResponses = answers
      }
    },
    getSectionReportFragments (gage) {
      if (this.contentFragments.length) {
        return this.contentFragments
          .filter(o => o.reportContentType === gage.q.section)
          .sort((a, b) => b.upperBound - a.upperBound)
      }
      return []
    },
    getSectionDynamicParagraph (gage) {
      const fragments = this.getSectionReportFragments(gage)
      if (gage.value > -1 && fragments.length) {
        let matched = null
        for (let i = 0; i < fragments.length; i++) {
          const o = fragments[i]
          if (o.upperBound <= gage.value) {
            if (i === 0 || o.upperBound === gage.value) {
              matched = fragments[i]
            } else {
              matched = fragments[i - 1]
            }
            break
          } else if (i === fragments.length - 1) {
            matched = fragments[i]
            break
          }
        }
        if (matched) {
          return matched.contentFragment.replace('{section-score}', `<span class="highlight">${gage.value}</span>`)
        }
      }
      return ''
    },
    getSectionResponses (gage) {
      if (this.surveyResponses.length) {
        return this.surveyResponses
          .filter(o => o.question.questionSection === gage.q.section)
          .filter(o => o.question.displayInReport)
          .map(o => {
            return {
              responseScore: o.response.responseScore,
              responseMax: o.response.responseMax,
              responseCommentary: o.response.responseCommentary
            }
          })
      }
      return []
    },
    getResponseLevel (response) {
      if (!response) {
        return ''
      }
      const rating = +((response.responseScore / response.responseMax) * 10).toFixed(1)
      if (rating >= 7.5) {
        return 'good-response'
      }
      if (rating >= 4.5) {
        return 'average-response'
      }
      return 'bad-response'
    },
    getScoreSubType (relevantServices, scoringRule) {
      let debugServiceUsedCount = parseInt(scoringRule.calculationMethodCode.split('-')[1])
      let numberServicesUsed = parseInt(scoringRule.calculationMethodCode.split('-')[1])
      let scoreType = scoringRule.calculationMethodCode.split('-')[0]
      if (relevantServices.length < numberServicesUsed) {
        numberServicesUsed = relevantServices.length
      }
      let totalScore = 0
      let totalMaxScore = 0
      let scores = []
      relevantServices.forEach(svc => {
        let score = 0
        let maxScore = 0
        if (svc.travels && svc.travels.length) {
          let highest = 0
          svc.travels.forEach(travel => {
            let travelScore = parseFloat((travel.score).toFixed(1))
            if (travelScore > highest) {
              highest = travelScore
              score = travel.score
              maxScore = travel.maxScore
            }
          })
        }
        score = score || 0
        maxScore = maxScore || 10
        let scoreObj = {
          score: score,
          maxScore: maxScore
        }
        scores.push(scoreObj)
      })
      switch (scoreType) {
        case 'best':
          scores = scores.sort((a, b) => b.score - a.score)
          if (numberServicesUsed) {
            let subTypeScore = 0
            let subTypeMaxScore = 0
            let i = 0
            while (numberServicesUsed) {
              subTypeScore += scores[i].score
              subTypeMaxScore += scores[i].maxScore
              numberServicesUsed--
              i++
            }
            if (subTypeMaxScore !== 0) {
              totalScore = subTypeScore
              totalMaxScore = subTypeMaxScore
            }
          }
          break
        case 'average': {
          let subTypeScore = 0
          let subTypeMaxScore = 0
          scores.forEach(score => {
            subTypeScore += score.score
            subTypeMaxScore += score.maxScore
          })
          if (subTypeMaxScore !== 0) {
            totalScore = subTypeScore
            totalMaxScore = subTypeMaxScore
          }
          break
        }
        default: {
          let subTypeScore = 0
          let subTypeMaxScore = 0
          scores.forEach(score => {
            subTypeScore += score.score
            subTypeMaxScore += score.maxScore
          })

          if (subTypeMaxScore !== 0) {
            totalScore = subTypeScore
            totalMaxScore = subTypeMaxScore
          }
          break
        }
      }
      if (debugServiceUsedCount === 0) {
        debugServiceUsedCount = 'all'
      }
      let scoringDebug = {
        bestScoreForEachService: scores,
        scoresUsed: debugServiceUsedCount,
        scoreType: scoringRule.calculationMethodCode,
        finalScoreForSubtype: totalScore,
        maxScoreForSubtype: totalMaxScore
      }
      this.scoringDebugBySubType[scoringRule.uuid] = scoringDebug
      let returnScore = {
        totalScore: totalScore,
        totalMaxScore: totalMaxScore
      }
      return returnScore
    },
    textRenderer (val) {
      if (val === 0) {
        return '?'
      } else if (val === -1) {
        return ''
      }
      return val
    },
    calculateScore (scores) {
      if (scores && scores.maxScore && scores.maxScore !== 0 && typeof scores.surveyScore !== 'undefined') {
        return `${Number.parseFloat(((scores.surveyScore || 0) / scores.maxScore) * 10).toFixed(1)}`
      }
      return '?'
    },
    getScoringDebugById (id) {
      return this.$data.scoringDebugBySubType[id]
    },
    getAssessmentSummary (_module = null, _section = null) {
      let summary = {}
      if (this.locationAssessment) {
        if (_module) {
          if (this.locationAssessment.modules) {
            const moduleLevel = this.locationAssessment.modules.find(m => m.module === _module)
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
                  summary = moduleLevel.score
                }
              }
            }
          }
        } else {
          summary = this.locationAssessment.score
        }
      }
      return summary
    },
    onImageClick () {
      if (this.propertyImages.length) {
        this.$modal.show('imageModal')
      }
    },
    formatString (str, args) {
      let matchs = str.match(/{(.+?)(?=\})}/g)
      for (let k in matchs) {
        str = str.replace(matchs[k], '<b>' + args[k] + '</b>')
      }
      return str
    },
    scrollToElement (event) {
      const element = document.getElementById(event.srcElement.id + '_section')
      if (element) {
        element.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    },
    onToggleHandler () {
      this.property.locked = this.isLockedProperty
      PropertiesApi.put(this.propertyId, this.property).then((response) => {
      })
    },
    onToggleInactiveServicesClick () {
      this.hiddenInactiveServices = !this.hiddenInactiveServices
      this.updateProximityScoresStates()
    }
  }
}
</script>
<style scoped>
.gage-list {
  padding-top: 10px;
  padding-bottom: 10px;

  background: #fcfcfc;
  border-radius: 2px;
  border: 1px solid #ccc;
}
.gages-container {
  margin-bottom: 50px;
}
.gages-container .section-title {
  font-size: 1.2em;
  font-weight: bold;
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
h5.debug-table-title {
  margin-bottom: 0;
  min-width: 200px;
}
.sad-dial {
  padding: 5px;
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.sad-dial .sad-dial-img {
  text-align: center;
}
@media screen and (min-width: 993px) {
  .sad-dial .sad-dial-img img {
    max-width: 200px;
  }
}
.sad-dial .sad-dial-text{
  margin-top: 35px;
  display: flex;
  align-items: center;
}
.sad-dial .sad-dial-text .title {
  color: #528EC1;
}
@media screen and (max-width: 768px) {
  .sad-dial .sad-dial-text .title {
    font-size: 27px;
    font-weight: 500;
  }
  .sad-dial .sad-dial-text .content {
    font-size: 25px;
  }
}
@media screen and (max-width: 992px) and (min-width: 768px) {
  .sad-dial .sad-dial-text .title {
    font-size: 23px;
    font-weight: 400;
  }
  .sad-dial .sad-dial-text .content {
    font-size: 20px;
    line-height: 1.5;
  }
}
@media screen and (min-width: 993px) {
  .sad-dial .sad-dial-text .title {
    font-size: 27px;
    font-weight: 500;
  }
  .sad-dial .sad-dial-text .content {
    font-size: 25px;
  }
}
td {
  word-break: break-word;
}
.highlight-section {
  background: #fcfcfc;
  border-radius: 2px;
  border: 1px solid #ccc;
  margin-bottom: 60px;
  color: #528EC1;
}
.highlight-text {
  color: #528EC1;
}
.report-content {
  font-size: 1.1em;
}
.report-content >>> p {
  margin-bottom: 10px;
}
tr.embed-in-table {
  display: inline-table;
  width:100%
}
ul.response-comments {
  list-style: none;
}
ul.response-comments >>> li {
  position: relative;
}
ul.response-comments >>> li.good-response::before {
  position: absolute;
  content: url('/static/images/good.png');
}
ul.response-comments >>> li.average-response::before {
  position: absolute;
  content: url('/static/images/average.png');
}
ul.response-comments >>> li.bad-response::before {
  position: absolute;
  content: url('/static/images/bad.png');
}
.service-comment {
  color: #528EC1;
}
.no-survey-data {
  color: #000;
  border: solid 1px #aaa;
  padding: 10px;
  text-align: center;
  margin-top: 60px;
}
.quick-menu {
  border: 1px solid #DDD;
  padding: 8px;
  padding-bottom: 80px;
  background-color: #FFF;
  position: -webkit-sticky;
  position: sticky;
  top: 150px;
  max-width: 300px;
}
.quick-menu .menu-title {
  margin-top: 50px;
  margin-bottom: 40px;
  font-size: 25px;
  font-weight: bold;
  color: #528EC1;
  justify-content: center;
  text-align: center;
}
.quick-menu table tr td {
  text-align: center;
}
.quick-menu table tr td div {
  color:#777;
  font-size: 13px;
}
.quick-menu table tr td div:hover {
  cursor: pointer;
}
</style>
