<template>
  <div class="land-page">
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
    <main v-if="property && property._id">
      <section class="pri-pad-b agent-single">
        <div class="loading-progress-bar"><vue-progress-bar/></div>
        <!-- OverView Section -->
        <div id="overview_section">
          <div class="container">
            <div class="row overview-overall text-center mt-2">
              <div class="section-title">LOCATION ANALYSIS</div>
            </div>
            <div class="row overview-score text-center">
              <div class="text-center">
                <GaugeProgress id="overall_score" :value="locationScores.overallScore.value" :maxValue="locationScores.overallScore.max" image="/static/images/house_icon.png"></GaugeProgress>
                <pulse-loader :loading="locationScores.overallScore.max === 0" color="#528EC1" size="10px"></pulse-loader>
              </div>
              <div class="text-center primary-color">HousePro has analysed this street position within<b> {{ propertyName }}</b></div>
              <div>In our opinion we think this location is</div>
              <div class="level-text primary-color">{{ locationScores.overallScore.level }}</div>
              <div class="row text-center">
                <div class="col-md-4 col-sm-4 col-sm-offset-2 col-md-offset-2">
                  <LineProgress :value="locationScores.accessScore.value" :maxValue="locationScores.accessScore.max" title="ACCESS TO SERVICES"></LineProgress>
                </div>
                <div class="col-md-4 col-sm-4">
                  <LineProgress :value="locationScores.positionScore.value" :maxValue="locationScores.positionScore.max" title="POSITION"></LineProgress>
                </div>
              </div>
            </div>
            <div class="row overview-analysis text-center mt-2">
              <div v-for="(item, index) in locationScores.overallScore.introductions" :key="index" v-show="item.isInclude" class="col-sm-4 mt-1 col-md-4 item">
                <div>
                  <div>
                    <img :src="item.image" alt="" class="logo2">
                  </div>
                  <div class="title primary-color">
                    {{ item.title }}
                  </div>
                  <div class="text" v-html="item.comment"></div>
                </div>
                <div class="mask-panel">
                  <div class="video-play-panel row">
                    <div class="col-xs-2 img">
                      <img src="/static/images/play_button_icon.png" alt="" width="50px" @click="openVideoMoreModal(item.video)">
                    </div>
                    <div class="col-xs-10 primary-color question"><a href="javascript:;" @click="openVideoMoreModal(item.video)"> {{ item.title }}</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Access To Service Section -->
        <div id="access_to_service_section">
          <div class="container">
            <div class="row text-center access-to-service-overall">
              <div class="col-md-4 col-md-offset-4 mt-2">
                  <LineProgress :value="locationScores.accessScore.value" :maxValue="locationScores.accessScore.max" title="ACCESS TO SERVICES" :isTopMarker="true"></LineProgress>
              </div>
              <div class="col-md-6 col-md-offset-3">
                <div class="section-title">ACCESS TO SERVICES</div>
                <div class="section-text">The proximity of services is a key contributor to the convenience of everyday living. We have assessed this location based on a number of services in the suburb.</div>
              </div>
            </div>
            <div class="row text-center access-to-service-score">
              <div v-if="locationScores.accessScore.rowCount > 0" class="row" v-for="i in locationScores.accessScore.rowCount" :key="i">
                <div v-for="(item, index) in filterArray(locationScores.accessScore.reports, i - 1, 3)" :key="index" class="col-sm-4 col-md-4 mt-3 item">
                  <div class="title primary-color">
                    {{ item.title }}
                  </div>
                  <div class="text-center mt-1">
                    <GaugeProgress
                      :id="item.id"
                      :value="item.value"
                      :maxValue="item.max"
                      :image="item.image"
                      :hideMax="item.hideMax">
                    </GaugeProgress>
                  </div>
                  <div v-show="item.max > 0">
                    <div class="text" v-bind:style="{color: item.tagColor}"><b v-html="item.tag"></b></div>
                    <!--div class="text mt-1" v-html="item.paragraph"></div>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Position Section -->
        <div id="position_analysis_section">
          <div class="container">
            <div class="row text-center position-overall">
              <div class="col-md-4 col-md-offset-4 mt-2">
                <LineProgress :value="locationScores.positionScore.value" :maxValue="locationScores.positionScore.max" title="POSITION" :isTopMarker="true"></LineProgress>
              </div>
              <div class="col-md-6 col-md-offset-3">
                <div class="section-title">POSITION</div>
                <div class="section-text">The aesthetics of the street, surrounding real estate and traffic/parking constraints have a significant impact on the desirability of the nearby properties</div>
              </div>
            </div>
            <div class="row text-center position-score">
              <div v-for="(item, index) in locationScores.positionScore.reports" :key="index" class="col-sm-4 col-md-4 mt-2 item">
                <div class="title primary-color">
                  {{ item.title }}
                </div>
                <div class="text-center mt-1">
                  <GaugeProgress :id="item.id" :value="item.value" :maxValue="item.max" :image="item.image"></GaugeProgress>
                </div>
                <div v-show="item.max > 0">
                  <div class="text" v-bind:style="{color: item.tagColor}"><b v-html="item.tag"></b></div>
                  <!--<div class="text mt-1" v-html="item.paragraph"></div>-->
                  <div class="mt-1" v-if="!loading"><a href="javascript:;" @click="openSingUpModal">FIND OUT MORE ></a></div>
                </div>
              </div>
            </div>
            <div v-show="locationScores.positionScore.max === 0" class="row">
              <div class="col-sm-8 col-sm-offset-2 text-center no-survey primary-color">
                Apologies, we haven't surveyed this property yet,<br/>check back soon.
              </div>
            </div>
            <div class="row position-analysis text-center">
              <div v-for="(item, index) in locationScores.positionScore.introductions" :key="index" v-show="item.isInclude" class="col-sm-4 col-md-4 mt-2 item" v-bind:class="{'col-sm-offset-2': index === 0, 'col-md-offset-2': index === 0}">
                <div>
                  <div>
                    <img :src="item.image" alt="" class="">
                  </div>
                  <div class="title primary-color mt-1">
                    {{ item.title }}
                  </div>
                  <div class="text" v-html="item.comment"></div>
                </div>
                <div class="mask-panel">
                  <div class="video-play-panel row">
                    <div class="col-xs-2 img">
                      <img src="/static/images/play_button_icon.png" alt="" width="50px" @click="openVideoMoreModal(item.video)">
                    </div>
                    <div class="col-xs-10 primary-color question"><a href="javascript:;" @click="openVideoMoreModal(item.video)"> {{ item.title }}</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- City/Beach/Train Section -->
        <div id="city_beach_train_section">
          <div class="train-proximity-section">
            <div class="container">
              <div class="row">
                <div class="col-md-8 col-md-offset-2 mt-2">
                  <div class="section-title text-center">TRAIN STATION PROXIMITY</div>
                  <div class="mt-3 section-text">The proximity of the nearest train station is an important consideration to many buyers. Here we are assessed how you are ost likely ot access your local trains station and the distance involved.</div>
                </div>
              </div>
              <div class="row text-center mt-3">
                <img src="/static/images/train_icon.png" alt="">
              </div>
              <div class="row text-center train-proximity-overview">
                <div class="col-md-8 col-md-offset-2">
                  <LineProgress
                    :value="locationScores.trainProximityScore.value"
                    :maxValue="locationScores.trainProximityScore.max"
                    :title="locationScores.trainProximityScore.serviceName"
                    :height="60"
                    unit="km"
                    lineType="square">
                  </LineProgress>
                </div>
              </div>
            </div>
          </div>
          <div class="city-index-section">
            <div class="container">
              <div class="row  mt-2">
                <div class="col-md-8 col-md-offset-2">
                  <div class="section-title text-center">HOUSEPRO CITY INDEX</div>
                  <div class="mt-3 section-text">In this section we have assess the proximity of 3 key lifestyle features that may lie both inside and outside the suburb. This provides and indication of how convenient it will be to access the nearest City, Beach and mainline Train Station on working days between 7am and 9pm</div>
                </div>
              </div>
              <div class="row text-center mt-3">
                <img src="/static/images/city_icon.png" alt="">
                <div class="row mt-2">
                  <div class="text-center col-md-4 col-sm-4 col-md-offset-4 col-sm-offset-4">
                    <div class="score">YOUR SCORE : {{locationScores.cityIndex.score}}</div>
                  </div>
                </div>
                <div class="row mt-2">
                  <div>Here's how some other suburbs scored so you can compare :</div>
                </div>
              </div>
              <div class="row text-center">
                <div class="col-sm-4 col-md-4 text-center mt-2 item" v-for="(item, index) in locationScores.cityIndex.comparison" :key="index">
                  <div class="content">{{item.name}} : {{item.score}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="beach-proximity-section">
            <div class="container">
              <div class="row  mt-2">
                <div class="col-md-8 col-md-offset-2">
                  <div class="section-title text-center">BEACH PROXIMITY</div>
                  <div class="mt-3 section-text">In this section we have assess the proximity of 3 key lifestyle features that may lie both inside and outside the suburb. This provides and indication of how convenient it will be to access the nearest City, Beach and mainline Train Station on working days between 7am and 9am.</div>
                </div>
              </div>
              <div class="row text-center mt-3">
                <img src="/static/images/beach_icon.png" alt="">
              </div>
              <div class="row text-center train-proximity-overview">
                <div class="col-md-8 col-md-offset-2">
                  <LineProgress
                    :value="locationScores.beachProximityScore.value"
                    :maxValue="locationScores.beachProximityScore.max"
                    :title="locationScores.beachProximityScore.serviceName"
                    :height="60"
                    unit="hrs"
                    lineType="square">
                  </LineProgress>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <!-- SignUp Modal -->
    <modals-container/>
    <!-- Video Modal -->
    <modal name="videoModal" class="video-play-modal" height="480px">
      <div class="play-video-embed" id="player">
        <iframe width="600px" height="483px" :src="videoURL" allow="autoplay;" frameborder="0" allowfullscreen></iframe>
      </div>
    </modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Promise from 'bluebird'
import {
  FETCH_USER_PROPERTY,
  FETCH_PROXIMITY_ASSESSMENT
} from '@/store/action-types'
import GaugeProgress from '@/components/core/GaugeProgress'
import LineProgress from '@/components/core/LineProgress'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import PropertiesApi from '@/api/properties'
import ContentFragmentApi from '@/api/content-fragments'
import SignUp from './SignUp'

export default {
  name: 'LocationAnalysisReport',
  components: {
    GaugeProgress,
    LineProgress,
    SignUp,
    PulseLoader
  },
  data () {
    return {
      propertyId: this.$route.params.propertyId,
      loading: false,
      videoURL: '',
      assessmentResults: null,
      contentFragments: [],
      locationScores: {
        overallScore: {
          value: 0,
          max: 0,
          level: '...CALCULATING, PLEASE WAIT...',
          introductions: [
            {
              title: 'WHY DOES LOCATION MATTER?',
              image: '/static/images/location-map.png',
              video: 'https://www.youtube.com/embed/bt8Wz39kdd0?autoplay=1',
              isInclude: true,
              condition: element => element.reportContentType === 'why-matter',
              comment: ''
            }, {
              title: 'WHAT IS LOCATION?',
              image: '/static/images/bulls-eye.png',
              video: 'https://www.youtube.com/embed/PKtDuDSqJNY?autoplay=1',
              isInclude: true,
              condition: element => element.reportContentType === 'what-is-location',
              comment: ''
            }, {
              title: 'HOW WE ANALYSE LOCATION?',
              image: '/static/images/icon-chart.png',
              video: 'https://www.youtube.com/embed/bJd7wzUMUh4?autoplay=1',
              isInclude: true,
              condition: element => element.reportContentType === 'how-analyse',
              comment: ''
            }
          ]
        },
        positionScore: {
          value: 0,
          max: 0,
          reports: [
            {
              id: 'aesthetics_score',
              q: 'street-aesthetics',
              title: 'Street Aesthetics',
              image: '/static/images/tree_leaf_icon.png',
              value: 0,
              max: 0,
              tagQ: element => element.reportContentType === 'street-aesthetics-tag',
              tag: '',
              tagColor: '',
              paragraphQ: element => element.reportContentType === 'street-aesthetics-paragraph',
              paragraph: ''
            }, {
              id: 'surrounding_score',
              q: 'street-surrounding-real-estate',
              title: 'Surrounding Real Estate',
              image: '/static/images/house_icon.png',
              value: 0,
              max: 0,
              tagQ: element => element.reportContentType === 'street-surrounding-real-estate-tag',
              tag: '',
              tagColor: '',
              paragraphQ: element => element.reportContentType === 'street-surrounding-real-estate-paragraph',
              paragraph: ''
            }, {
              id: 'traffic_score',
              q: 'street-traffic-parking',
              title: 'Traffic & Parking',
              image: '/static/images/car_icon.png',
              value: 0,
              max: 0,
              tagQ: element => element.reportContentType === 'street-traffic-parking-tag',
              tag: '',
              tagColor: '',
              paragraphQ: element => element.reportContentType === 'street-traffic-parking-paragraph',
              paragraph: ''
            }
          ],
          introductions: [
            {
              title: 'WHY IS SURROUNDING REAL ESTATE IMPORTANT?',
              image: '/static/images/surrounding_icon.png',
              video: 'https://www.youtube.com/embed/lHlVNhVI0aw?autoplay=1',
              isInclude: true,
              condition: element => element.reportContentType === 'why-surrounding-important',
              comment: ''
            },
            {
              title: 'HOW DOES TRAFFIC AND PARKING AFFECT PRICES?',
              image: '/static/images/traffic_parking_icon.png',
              video: 'https://www.youtube.com/embed/Cgt2hH8BOlY?autoplay=1',
              isInclude: true,
              condition: element => element.reportContentType === 'how-traffic-parking-prices',
              comment: ''
            }
          ]
        },
        accessScore: {
          value: 0,
          max: 10,
          reports: [
            {
              id: 'park_score',
              q: 'park',
              title: 'Parks & Leisure',
              image: '/static/images/football_icon.png',
              value: 0,
              max: 0,
              tagQ: element => element.reportContentType === 'parks-tag',
              tag: '',
              tagColor: '',
              paragraph: ''
            }, {
              id: 'school_score',
              q: 'school',
              title: 'Schools',
              image: '/static/images/hat_icon.png',
              value: 0,
              max: 0,
              tagQ: element => element.reportContentType === 'schools-tag',
              tag: '',
              tagColor: '',
              paragraph: ''
            }, {
              id: 'shopping_score',
              q: 'shopping',
              title: 'Shopping',
              image: '/static/images/shopping_icon.png',
              value: 0,
              max: 0,
              tagQ: element => element.reportContentType === 'shopping-tag',
              tag: '',
              tagColor: '',
              paragraph: ''
            }, {
              id: 'transport_score',
              q: 'public-transport',
              title: 'Public Transport',
              image: '/static/images/transport_icon.png',
              value: 0,
              max: 0,
              tagQ: element => element.reportContentType === 'transport-tag',
              tag: '',
              tagColor: '',
              paragraph: ''
            }, {
              id: 'walkability_score',
              q: 'walkability',
              hideMax: true,
              title: 'Walkable',
              image: '/static/images/foot_icon.png',
              value: 0,
              max: 0,
              tagQ: element => element.reportContentType === 'walkability-tag',
              tag: '',
              tagColor: '',
              paragraph: ''
            }, {
              id: 'medical_score',
              q: 'medical',
              title: 'Medical Facilities',
              image: '/static/images/medical_icon.png',
              value: 0,
              max: 0,
              tagQ: element => element.reportContentType === 'medical-tag',
              tag: '',
              tagColor: '',
              paragraph: ''
            }
          ],
          rowCount: 2
        },
        trainProximityScore: {
          max: 20,
          value: 0,
          serviceName: ''
        },
        cityIndex: {
          score: 0,
          comparison: []
        },
        beachProximityScore: {
          max: 3,
          value: 0,
          serviceName: ''
        }
      },
      tralvelMods: {
        walking: 'Walking',
        transit: 'Transit',
        driving: 'Car'
      },
      combinations: [
        {
          name: 'Chatswood',
          score: 12050
        },
        {
          name: 'Strathfield',
          score: 15300
        },
        {
          name: 'Bondi Beach',
          score: 16365
        },
        {
          name: 'Manly',
          score: 16854
        },
        {
          name: 'Brighton-Le-Sands ',
          score: 17430
        },
        {
          name: 'Parramatta',
          score: 20340
        },
        {
          name: 'Parramatta',
          score: 20340
        },
        {
          name: 'Cronulla',
          score: 24849
        },
        {
          name: 'Penrith',
          score: 33970
        },
        {
          name: 'Brooklyn',
          score: 38763
        },
        {
          name: 'Picton',
          score: 45651
        }
      ]
    }
  },
  computed: {
    ...mapState({
      property: state => state.main.property,
      proximityAssessment: state => state.main.proximityAssessment
    }),
    propertyName () {
      let value = ''
      let component = this.property.address_components.find(component => component.types.some(type => type === 'route'))
      if (component) {
        value += component.short_name
      }
      component = this.property.address_components.find(component => component.types.some(type => type === 'locality'))
      if (component) {
        value += ' ' + component.short_name
      }
      component = this.property.address_components.find(component => component.types.some(type => type === 'administrative_area_level_1'))
      if (component) {
        value += ' ' + component.short_name
      }
      component = this.property.address_components.find(component => component.types.some(type => type === 'postal_code'))
      if (component) {
        value += ' ' + component.short_name
      }
      return value
    }
  },
  async mounted () {
    this.loading = true
    this.$Progress.start()
    while (this.locationScores.cityIndex.comparison.length < 3) {
      let combination = this.combinations[Math.floor(Math.random() * (11 + 1))]
      if (combination) {
        if (this.locationScores.cityIndex.comparison.length > 0) {
          let oldCombination = this.locationScores.cityIndex.comparison.find(element => element.name === combination.name)
          if (!oldCombination) {
            this.locationScores.cityIndex.comparison.push(combination)
          }
        } else {
          this.locationScores.cityIndex.comparison.push(combination)
        }
      }
    }
    try {
      await Promise.all([
        this.$store.dispatch(FETCH_USER_PROPERTY, { propertyId: this.propertyId }),
        this.$store.dispatch(FETCH_PROXIMITY_ASSESSMENT, { propertyId: this.propertyId, force: false })
      ])
      const code = this.property.address_components.find(c => c.types.includes('postal_code'))
      Promise.props({
        contentFragments: ContentFragmentApi.get({ moduleCode: 'location' }),
        assessmentResults: PropertiesApi.getLocationScore(this.propertyId, code.short_name)
      }).then(({contentFragments, assessmentResults}) => {
        this.contentFragments = contentFragments
        this.assessmentResults = assessmentResults
        this.calculateSurveyScores()
      })
    } finally {
      this.loading = false
      this.$Progress.finish()
    }
  },
  methods: {
    calculateSurveyScores (renew = false) {
      this.loading = true
      this.$Progress.start()
      try {
        const self = this
        /*
        * Position
        */
        this.locationScores.positionScore.reports.forEach(report => {
          let score = self.getPositionScore(report.q)
          report.value = parseFloat(score.value)
          report.max = parseFloat(score.max)
          if (report.value > 0) {
            let fragments = []
            if (report.tagQ) {
              fragments = this.contentFragments.filter(report.tagQ)
              let frg = this.getTaglinesFromFragments(fragments, report.value)
              report.tag = frg.comment
              report.tagColor = frg.color
            }
            if (report.paragraphQ) {
              fragments = this.contentFragments.filter(report.paragraphQ)
              let frg = this.getTaglinesFromFragments(fragments, report.value)
              report.paragraph = frg.comment
            }
          } else {
            report.tag = 'We will have a score for this service soon.'
            report.tagColor = '#E81819'
          }
        })
        let score = this.assessmentResults.position.score
        this.locationScores.positionScore.value = parseFloat(score.value)
        this.locationScores.positionScore.max = parseFloat(score.max)
        this.locationScores.positionScore.introductions.forEach(introduction => {
          let fragment = self.contentFragments.find(introduction.condition)
          if (fragment) {
            introduction.comment = fragment.contentFragment
          }
        })
        /*
        * Access To Services
        */
        this.locationScores.accessScore.reports.forEach(report => {
          let score = self.getAccessScore(report.q)
          report.value = parseFloat(score.value)
          report.max = parseFloat(score.max)
          if (report.value > 0) {
            let fragments = []
            if (report.tagQ) {
              fragments = this.contentFragments.filter(report.tagQ)
              let fragment = this.getTaglinesFromFragments(fragments, report.value)
              report.tag = fragment.comment
              report.tagColor = fragment.color
            }
          } else {
            report.tag = 'We will have a score for this service soon.'
            report.tagColor = '#E81819'
          }
        })
        score = this.getAccessScore()
        this.locationScores.accessScore.value = parseFloat(score.value)
        this.locationScores.accessScore.max = parseFloat(score.max)
        this.locationScores.accessScore.rowCount = this.locationScores.accessScore.reports.length % 3 === 0 ? this.locationScores.accessScore.reports.length / 3 : this.locationScores.accessScore.reports.length / 3 + 1
        let services = this.proximityAssessment.services
        if (services.length > 0) {
          let walkability = this.getWalkabilityData()
          let accessServices = [
            {
              type: 'school',
              condition: element => element.matchedTravelMode === 'walking',
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
              condition: element => element.matchedTravelMode === 'walking',
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
              condition: element => element.matchedTravelMode === 'walking',
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
              condition: element => element.matchedTravelMode === 'walking' && element.score > 4,
              max_count: 0,
              count: 0,
              nearest: '',
              distance: 0,
              travel_time: 0,
              travel: '',
              comment: ''
            },
            {
              type: 'public-transport',
              condition: element => element.matchedTravelMode === 'walking' && element.score > 4,
              max_count: 0,
              count: 0,
              nearest: '',
              distance: 0,
              travel_time: 0,
              travel: '',
              comment: ''
            },
            {
              type: 'walkability',
              condition: element => element.matchedTravelMode === 'walking' && element.score > 4,
              max_count: 0,
              count: 0,
              nearest: '',
              distance: 0,
              travel_time: 0,
              travel: '',
              comment: ''
            }
          ]
          accessServices.forEach((service) => {
            let relevantServices = services.filter(svc => svc.serviceCategory === service.type)
            service.max_count = relevantServices.length
            let filteredServices = relevantServices.filter((svc) => {
              let travel = svc.travels.find(service.condition)
              if (travel) {
                return svc
              }
            })
            if (filteredServices !== null && filteredServices.length > 0) {
              service.count = filteredServices.length
              filteredServices.forEach((svc) => {
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
            } else {
              relevantServices.forEach((svc) => {
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
            }
          })
          accessServices.forEach((service) => {
            let fragment = null
            let report = self.locationScores.accessScore.reports.find(svc => svc.q === service.type)
            switch (service.type) {
              case 'school':
                if (service.count > 1) {
                  fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'schools-walking')
                  if (fragment) {
                    report.paragraph = self.formatString(fragment.contentFragment, [service.nearest, service.count])
                  }
                } else if (service.count === 1) {
                  fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'single-school-walking')
                  if (fragment) {
                    report.paragraph = self.formatString(fragment.contentFragment, [service.nearest])
                  }
                } else {
                  fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'no-school-near')
                  if (fragment && service.distance > 0 && service.travel_time > 0) {
                    report.paragraph = self.formatString(fragment.contentFragment, [service.distance, service.travel_time])
                  }
                }
                break
              case 'park':
                if (service.count > 1) {
                  fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'parks-walking')
                  if (fragment) {
                    report.paragraph = self.formatString(fragment.contentFragment, [service.nearest, service.count])
                  }
                } else if (service.count === 1) {
                  fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'single-park-walking')
                  if (fragment) {
                    report.paragraph = self.formatString(fragment.contentFragment, [service.nearest])
                  }
                } else {
                  fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'no-park-near')
                  if (fragment && service.distance > 0 && service.travel_time > 0) {
                    report.paragraph = self.formatString(fragment.contentFragment, [service.distance, service.travel_time])
                  }
                }
                break
              case 'shopping':
                if (service.count > 1) {
                  fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'shopping-walking')
                  if (fragment) {
                    report.paragraph = self.formatString(fragment.contentFragment, [service.nearest, service.count])
                  }
                } else if (service.count === 1) {
                  fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'single-shopping-walking')
                  if (fragment) {
                    report.paragraph = self.formatString(fragment.contentFragment, [service.nearest])
                  }
                } else {
                  fragment = self.contentFragments.find(fragment => fragment.reportContentType === 'no-shopping-near')
                  if (fragment && service.distance > 0 && service.travel_time > 0) {
                    report.paragraph = self.formatString(fragment.contentFragment, [service.distance, service.travel_time])
                  }
                }
                break
              case 'medical':
                if (service.nearest !== '') {
                  report.paragraph = self.formatString('<p>The nearest medical is {nearest-medical-station}</p>', [service.nearest])
                }
                break
              case 'walkability':
                let relevantServices = walkability.walkabilities.filter(element => element.serviceType === 'park')
                let parkCount = relevantServices.length
                relevantServices = walkability.walkabilities.filter(element => element.serviceType === 'shopping')
                let shoppingCount = relevantServices.length
                relevantServices = walkability.walkabilities.filter(element => element.serviceType === 'school')
                let schoolCount = relevantServices.length
                let fragments = self.contentFragments.filter(report.tagQ)
                let frg = self.getTaglinesFromFragments(fragments, report.value)
                report.tag = frg.comment
                report.tagColor = frg.color
                report.paragraph = self.formatString('<p>This includes {schools-count} schools, {parks-count} parks and {shops-count} shops</p>', [schoolCount, parkCount, shoppingCount])
                break
              case 'public-transport':
                if (service.nearest !== '') {
                  report.paragraph = self.formatString('<p>The nearest train station is {nearest-train-station}</p>', [service.nearest])
                }
                break
            }
          })
        }
        /*
        * Overall
        */
        if (this.assessmentResults) {
          this.locationScores.overallScore.value = parseFloat(this.assessmentResults.overall.value)
          this.locationScores.overallScore.max = parseFloat(this.assessmentResults.overall.max)
          if (this.locationScores.overallScore.value < 4) {
            this.locationScores.overallScore.level = 'POOR'
          } else if (this.locationScores.overallScore.value < 7) {
            this.locationScores.overallScore.level = 'GOOD'
          } else {
            this.locationScores.overallScore.level = 'EXCELLENT'
          }
        }
        this.locationScores.overallScore.introductions.forEach(introduction => {
          let fragment = self.contentFragments.find(introduction.condition)
          if (fragment) {
            introduction.comment = fragment.contentFragment
          }
        })
        /*
        * Train Station Proximity
        */
        let trainServices = this.proximityAssessment.services.filter(proximity => proximity.serviceCategory === 'train-index')
        let trainService = null
        trainServices.forEach(element => {
          element.travels.sort((a, b) => {
            if (a.score < b.score) {
              return 1
            } else if (a.score > b.score) {
              return -1
            }
            return 0
          })
          if (trainService === null) {
            trainService = element
          } else {
            if (trainService.travels[0].score < element.travels[0].score) {
              trainService = element
            }
          }
        })
        if (trainService) {
          this.locationScores.trainProximityScore.value = parseFloat((trainService.travels[0].travelDistance / 1000).toFixed(1))
          this.locationScores.trainProximityScore.serviceName = trainService.name + ' is ' + (trainService.travels[0].travelDistance / 1000).toFixed(1) + 'km by ' + this.tralvelMods[trainService.travels[0].matchedTravelMode]
        }
        /*
        * Beach Proximity
        */
        let beachServices = this.proximityAssessment.services.filter(proximity => proximity.serviceCategory === 'beach-index')
        let beachService = null
        beachServices.forEach(element => {
          element.travels.sort((a, b) => {
            if (a.score < b.score) {
              return 1
            } else if (a.score > b.score) {
              return -1
            }
            return 0
          })
          if (beachService === null) {
            beachService = element
          } else {
            if (beachService.travels[0].score < element.travels[0].score) {
              beachService = element
            }
          }
        })
        if (beachService) {
          this.locationScores.beachProximityScore.value = parseFloat((beachService.travels[0].travelTime / 3600).toFixed(2))
          this.locationScores.beachProximityScore.serviceName = beachService.name + ' is ' + (beachService.travels[0].travelTime / 60).toFixed(0) + 'mins by ' + this.tralvelMods[beachService.travels[0].matchedTravelMode]
        }
        /*
        * City Index
        */
        let cityService = this.proximityAssessment.services.find(proximity => proximity.serviceCategory === 'city-index')
        if (cityService) {
          let travel = cityService.travels.find(travel => travel.matchedTravelMode === 'transit')
          if (travel) {
            this.locationScores.cityIndex.score = travel.travelTime
          }
        }
        this.loading = false
        this.$Progress.finish()
        this.$forceUpdate()
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status === 404) {
          this.landModuleScore = '0.0'
        }
        this.$forceUpdate()
        this.loading = false
        this.$Progress.finish()
      }
    },
    getWalkabilityData () {
      let data = {
        score: 0,
        totalScore: 0,
        walkabilities: []
      }
      this.proximityAssessment.services.forEach((service) => {
        let walkability = null
        service.travels.forEach((travel) => {
          if (travel.matchedTravelMode === 'walking') {
            walkability = {}
            data.score += travel.score
            data.totalScore += travel.maxScore
            walkability.serviceName = service.name
            walkability.serviceType = service.serviceCategory
          }
        })
        if (walkability) {
          data.walkabilities.push(walkability)
        }
      })
      return data
    },
    getPositionScore (_section = null) {
      let score = {value: 0, max: 0}
      if (this.assessmentResults) {
        if (_section) {
          const sectionScore = this.assessmentResults.position.sections.find(s => s.section === _section)
          if (sectionScore) {
            score = sectionScore.score
          }
        } else {
          score = this.assessmentResults.position.score
        }
      }
      return score
    },
    getAccessScore (serviceType = null) {
      let score = {value: 0, max: 0}
      if (serviceType) {
        let service = this.assessmentResults.accessservice.services.find(svc => svc.serviceType === serviceType)
        if (service) {
          score = {value: service.value, max: service.max}
        }
      } else {
        score = this.assessmentResults.accessservice.score
      }
      return score
    },
    getTaglinesFromFragments (fragments, score) {
      fragments.sort((a, b) => { return parseFloat(a.upperBound) - parseFloat(b.upperBound) })
      let result = null
      if (fragments.length > 0) {
        let fragment = null
        fragments.forEach((frg) => {
          if (!fragment) {
            fragment = frg
          } else {
            if (score > 0) {
              if (Math.abs(fragment.upperBound - score) > Math.abs(frg.upperBound - score)) {
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
          if (fragment.upperBound < score) {
            let frg = fragments.find(cmt => cmt.upperBound > fragment.upperBound)
            if (frg) {
              fragment = frg
            }
          }
        }
        let index = fragments.findIndex(frg => frg.upperBound > fragment.upperBound)
        let color = 'red'
        if (index === 0 || index === 1) {
          color = '#E81819'
        } else if (index === fragments.length / 2) {
          color = '#D2412A'
        } else if (index === -1 || index === fragments.length - 1) {
          color = '#01B72C'
        } else {
          color = '#469C4D'
        }
        result = {
          color,
          comment: fragment.contentFragment
        }
      }
      return result
    },
    formatString (str, args) {
      let matchs = str.match(/{(.+?)(?=\})}/g)
      for (let k in matchs) {
        str = str.replace(matchs[k], '<b>' + args[k] + '</b>')
      }
      return str
    },
    openVideoMoreModal (url) {
      this.videoURL = url
      this.$modal.show('videoModal')
    },
    openSingUpModal (response = {}) {
      this.$modal.show(SignUp, {
        response
      }, {
        width: 900,
        height: 'auto',
        clickToClose: false
      })
    },
    closeModal () {
      this.$modal.close()
    },
    filterArray (array = [], index, step) {
      let subArray = []
      if (array) {
        subArray = array.slice(index * step, index * step + step)
      }
      return subArray
    }
  }
}
</script>

<style scoped>
.row {
  margin-right: 0px;
  margin-left: 0px;
}
h1{
  margin: 0;
}
/* Common CSS */
.dark-red-color {
  color: #dc002a;
}
@media screen and (min-width: 768px) {
  .left-vertical-line {
    border-left: solid 1px #DDD;
  }
  .right-vertical-line {
    border-right: solid 1px #DDD;
  }
}
.section-title {
  font-size: 35px;
  font-weight: 900;
  letter-spacing: 2px
}
.section-text {
  line-height: 20px;
  word-spacing: 3px;
}
.item .title {
  font-size: 25px;
  font-weight: 600;
  line-height: 30px;
}
.item .text {
  line-height: 1.3;
}
/* Nav bar CSS */
#header-bar{
  overflow: hidden;
  background-color: #333;
  position: fixed;
  top: 0;
  width: 100%;
}
.loading-progress-bar {
  position: fixed;
  width: 100%;
  top: 150px;
}
/* Video Player CSS */
.item .mask-panel{
  visibility: hidden;
  opacity: 0;
  transition: visibility 1s linear 800ms, opacity 800ms;
}
.item:hover .mask-panel{
  visibility: visible;
  opacity: 1;
  transition: visibility 1s linear 0s, opacity 800ms;
}
.item .mask-panel .video-play-panel {
  border: solid 1px #528ec1;
  margin-left: 30px;
  margin-right: 30px;
  padding: 10px;
  margin-top: 30%;
  display: flex;
  align-items: center;
}
.item .mask-panel .video-play-panel .img {
  text-align: right;
  padding-right: 0px;
  padding-left: 0px;
  width: 40px;
}
.item .mask-panel .video-play-panel .question {
  text-align: left;
  margin-left: 0px;
  margin-top: 7px;
  font-weight: 700;
  line-height: 19px;
  padding-right: 0px;
  padding-left: 15px;
}
.item .mask-panel .video-play-panel .question a {
  color: #528EC1;
}
.item .mask-panel .video-play-panel .question a:hover {
    text-decoration: underline;
}
/* Overview CSS */
#overview_section {
  background-color: #FFF;
}
.level-text {
  font-size: 26px;
  font-weight: 500;
}
.overview-analysis {
  border-top: solid 1px #EEE;
}
.overview-analysis .item {
  min-height: 300px !important;
  cursor: pointer;
}
.overview-analysis .item img{
  max-height: 150px;
}
.overview-analysis .item .title {
  font-size: 22px;
  font-weight: 600;
  margin-top: 15px;
}
.overview-analysis .item .text {
  margin-top: 20px;
}
.item .mask-panel {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 95%;
  height: 100%;
  background-color: rgb(255,255,255,0.9);
  vertical-align: middle;
  margin-left: 5px;
  margin-right: 5px;
}
/* Position CSS */
#position_analysis_section {
  margin-top: 50px;
  background-color: #FFF;
}
.position-analysis .item{
  margin-top: 15px;
  min-height: 270px !important;
  margin-bottom: 15px;
  cursor: pointer;
}
.position-analysis .item .title {
  font-size: 25px;
  font-weight: 600;
  line-height: 30px;
}
.position-analysis .item img {
  max-height: 130px;
}
.no-survey {
  font-size: 30px;
  font-weight: 600;
  line-height: 40px;
}
/* City/Beach/Train CSS */
.city-index-section {
  margin-top: 50px;
  padding-bottom: 50px;
  background-color: #FFF;
}
.city-index-section .row {
  margin-right: 0px;
  margin-left: 0px;
}
.city-index-section .score {
  border: solid 3px #528EC1;
  background-color: #9bbedc;
  color: #FFF;
  font-size: 23px;
  font-weight: 600;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
}
.city-index-section .item {
  padding-right: 8px;
  padding-left: 8px;
}
.city-index-section .item .content{
  border: solid 3px #528EC1;
  color: #528EC1;
  font-size: 23px;
  font-weight: 600;
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.v-spinner {
  margin-top: -30px;
}
</style>
