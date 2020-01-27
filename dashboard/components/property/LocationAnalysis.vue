<template>
  <section class="location-analysis">
    <!-- Overall Section -->
    <v-layout row wrap class="location-layout overall-section">
      <v-flex sm12>
        <v-layout align-center justify-center row>
          <v-flex sm4>
            <div class="location-analysis-section-title text-xs-center">LOCATION ANALYSIS</div>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row>
          <v-flex sm4>
            <div class="text-xs-center">
              <gauge-progress
                id="overall-score"
                :value="overallScore.value"
                :maxValue="overallScore.max"
              >
                <image slot="icon" :href="overallScore.image" x="12" y="10" height="14px" width="14px"/>
              </gauge-progress>
              <pulse-loader :loading="overallScore.max === 0" color="#528EC1" size="10px"></pulse-loader>
              <div class="primary-color">HousePro has analysed this street position within<b> {{ propertyName }}</b></div>
              <div class="mt-1">In our opinion we think this location is</div>
              <div class="level-text primary-color mt-2">{{ overallScore.level }}</div>
            </div>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row mt-2>
          <v-flex sm3 mr-3>
            <line-progress :value="accessToServiceScore.value" :maxValue="accessToServiceScore.max" title="ACCESS TO SERVICES"></line-progress>
          </v-flex>
          <v-flex sm3 ml-3>
            <line-progress :value="positionScore.value" :maxValue="positionScore.max" title="POSITION"></line-progress>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row class="introduction">
          <v-flex v-for="(item, index) in overallScore.introductions" :key="index" sm3 class="item">
            <div class="text-xs-center mt-2">
              <div>
                <img :src="item.image" alt="">
              </div>
              <div class="title primary-color">
                {{ item.title }}
              </div>
              <div class="text" v-html="item.comment"></div>
            </div>
            <div class="mask-panel">
              <div class="video-play-panel">
                <div class="img">
                  <img :src="videoPlayButton" alt="" width="50px" @click="openVideoModal(item.video)">
                </div>
                <div class="primary-color question"><a href="javascript:;" @click="openVideoModal(item.video)">{{ item.title }}</a></div>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Access To Services Section -->
    <v-layout row wrap class="location-layout access-to-service-section center">
      <v-flex sm12>
        <v-layout align-center justify-center row>
          <v-flex sm4>
            <line-progress :value="accessToServiceScore.value" :maxValue="accessToServiceScore.max" title="ACCESS TO SERVICES" :isTopMarker="true"></line-progress>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row>
          <v-flex sm12>
            <div class="location-analysis-section-title text-xs-center">ACCESS TO SERVICES</div>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row>
          <v-flex sm6>
            <div class="section-text text-xs-center">The proximity of services is a key contributor to the convenience of everyday living. We have assessed this location based on a number of services in the suburb.</div>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row v-for="i in 2" :key="i" mt-3>
          <v-flex v-for="(item, index) in filterArray(accessToServiceScore.services, i - 1, 3)" :key="index" sm3 class="item text-xs-center">
            <div class="title primary-color">
              {{ item.text }}
            </div>
            <div class="text-center mt-1">
              <gauge-progress
                :id="item.code"
                :value="item.value"
                :maxValue="item.max"
                :hideMax="item.hideMax"
              >
                <image slot="icon" :href="item.image" x="11" y="10" height="14px" width="14px"/>
              </gauge-progress>
            </div>
            <div v-show="item.max > 0">
              <div class="text" v-bind:style="{color: item.tagColor}"><b v-html="item.tag"></b></div>
              <!--<div class="text mt-1" v-html="item.paragraph"></div>-->
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Position Section -->
    <v-layout row wrap class="location-layout position-section">
      <v-flex sm12>
        <v-layout align-center justify-center row>
          <v-flex sm4>
            <line-progress :value="positionScore.value" :maxValue="positionScore.max" title="ACCESS TO SERVICES" :isTopMarker="true"></line-progress>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row>
          <v-flex sm12>
            <div class="location-analysis-section-title text-xs-center">POSITION</div>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row>
          <v-flex sm6>
            <div class="section-text text-xs-center">The aesthetics of the street, surrounding real estate and traffic/parking constraints have a significant impact on the desirability of the nearby properties</div>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row mt-3>
          <v-flex v-for="(item, index) in filterArray(positionScore.sections, 0, 3)" :key="index" sm3 mt-3 class="item text-xs-center">
            <div class="title primary-color">
              {{ item.text }}
            </div>
            <div class="text-center mt-1">
              <gauge-progress
                :id="item.code"
                :value="item.value"
                :maxValue="item.max"
              >
                <image slot="icon" :href="item.image" x="12" y="10" height="14px" width="14px"/>
              </gauge-progress>
            </div>
            <div v-show="item.max > 0">
              <div class="text" v-bind:style="{color: item.tagColor}"><b v-html="item.tag"></b></div>
              <!--<div class="text mt-1" v-html="item.paragraph"></div>-->
            </div>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row v-show="positionScore.max === 0">
          <v-flex sm4 class="text-xs-center">
            Apologies, we haven't surveyed this property yet,<br/>check back soon.
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row class="introduction">
          <v-flex v-for="(item, index) in positionScore.introductions" :key="index" sm4 class="item">
            <div class="text-xs-center mt-2">
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
                <div class="img">
                  <img :src="videoPlayButton" alt="" width="50px" @click="openVideoModal(item.video)">
                </div>
                <div class="primary-color question"><a href="javascript:;" @click="openVideoModal(item.video)"> {{ item.title }}</a></div>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Train Stations Proximity Section -->
    <v-layout row wrap class="location-layout train-proximity-section">
      <v-flex sm12>
        <v-layout align-center justify-center row>
          <v-flex sm6 class="text-xs-center">
            <div class="location-analysis-section-title text-xs-center">TRAIN STATION PROXIMITY</div>
            <div class="mt-3 section-text">The proximity of the nearest train station is an important consideration to many buyers. Here we are assessed how you are ost likely ot access your local trains station and the distance involved.</div>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row>
          <v-flex sm4 class="text-xs-center">
            <div><img :src="trainProximityScore.image" alt=""></div>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row>
          <v-flex sm8>
            <line-progress
              :value="trainProximityScore.value"
              :maxValue="trainProximityScore.max"
              :title="trainProximityScore.serviceName"
              :height="60"
              unit="km"
              lineType="square">
            </line-progress>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- City Index Section -->
    <v-layout row wrap class="location-layout city-index-section">
      <v-flex sm12>
        <v-layout align-center justify-center row>
          <v-flex sm6 class="text-xs-center">
            <div class="location-analysis-section-title text-center">HOUSEPRO CITY INDEX</div>
            <div class="mt-3 section-text">In this section we have assess the proximity of 3 key lifestyle features that may lie both inside and outside the suburb. This provides and indication of how convenient it will be to access the nearest City, Beach and mainline Train Station on working days between 7am and 9pm</div>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row>
          <v-flex sm6 class="text-xs-center">
            <img :src="cityIndex.image" alt="">
            <div class="score">YOUR SCORE : {{cityIndex.score}}</div>
            <div>Here's how some other suburbs scored so you can compare :</div>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row mt-3 mb-2>
          <v-flex v-for="(item, index) in cityIndex.comparison" :key="index" sm3 class="text-xs-center item">
            <div class="content">{{item.name}} : {{item.score}}</div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Beach Proximity Section -->
    <v-layout row wrap class="location-layout beach-proximity-section">
      <v-flex sm12>
        <v-layout align-center justify-center row>
          <v-flex sm6 class="text-xs-center">
            <div class="location-analysis-section-title text-center">BEACH PROXIMITY</div>
            <div class="mt-3 section-text">In this section we have assess the proximity of 3 key lifestyle features that may lie both inside and outside the suburb. This provides and indication of how convenient it will be to access the nearest City, Beach and mainline Train Station on working days between 7am and 9am.</div>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row mt-3>
          <v-flex sm4 class="text-xs-center">
            <img :src="beachProximityScore.image" alt="">
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row>
          <v-flex sm8>
            <line-progress
              :value="beachProximityScore.value"
              :maxValue="beachProximityScore.max"
              :title="beachProximityScore.serviceName"
              :height="60"
              unit="hrs"
              lineType="square">
            </line-progress>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  <!-- Video Modal -->
    <v-dialog v-model="dialog" class="video-play-modal" width="600">
      <div class="play-video-embed" id="video_player_contrainer" v-html="videoContent"></div>
    </v-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import GaugeProgress from '@/components/core/GaugeProgress'
import LineProgress from '@/components/core/LineProgress'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { getPropertyAddressComponentValue } from '@/utils'
import lget from 'lodash.get'

export default {
  name: 'LocationAnalysis',
  components: {
    GaugeProgress,
    LineProgress,
    PulseLoader
  },
  data () {
    return {
      videoContent: '',
      dialog: false,
      tralvelModes: {
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
      currentProperty: state => state.portfolio.currentProperty.property,
      proximityAssessment: state => state.portfolio.currentProperty.proximityAssessment,
      contentFragments: state => state.reference.contentFragments
    }),
    propertyName () {
      let propertyName = ''
      if (this.currentProperty) {
        propertyName = ['route', 'locality', 'administrative_area_level_1', 'postal_code']
          .map(type => getPropertyAddressComponentValue(this.currentProperty, type))
          .join(' ')
      }
      return propertyName
    },
    overallScore () {
      let overallScore = {
        value: +lget(this.currentProperty, 'scores.overall.value', 0),
        max: +lget(this.currentProperty, 'scores.overall.max', 10),
        level: '...CALCULATING, PLEASE WAIT...',
        image: require('@/assets/images/house_icon.png'),
        introductions: [
          {
            title: 'WHY DOES LOCATION MATTER?',
            image: require('@/assets/images/location-map.png'),
            video: 'https://www.youtube.com/embed/bt8Wz39kdd0?autoplay=1',
            condition: element => element.reportContentType === 'why-matter',
            comment: ''
          }, {
            title: 'WHAT IS LOCATION?',
            image: require('@/assets/images/bulls-eye.png'),
            video: 'https://www.youtube.com/embed/PKtDuDSqJNY?autoplay=1',
            condition: element => element.reportContentType === 'what-is-location',
            comment: ''
          }, {
            title: 'HOW WE ANALYSE LOCATION?',
            image: require('@/assets/images/icon-chart.png'),
            video: 'https://www.youtube.com/embed/bJd7wzUMUh4?autoplay=1',
            condition: element => element.reportContentType === 'how-analyse',
            comment: ''
          }
        ]
      }
      if (overallScore.value < 4) {
        overallScore.level = 'POOR'
      } else if (overallScore.value < 7) {
        overallScore.level = 'GOOD'
      } else {
        overallScore.level = 'EXCELLENT'
      }
      return overallScore
    },
    positionScore () {
      let positionScore = {
        value: +lget(this.currentProperty, 'scores.position.score.value', 0),
        max: +lget(this.currentProperty, 'scores.position.score.max', 10),
        sections: [
          {
            code: 'street-aesthetics',
            text: 'Street Aesthetics',
            image: require('@/assets/images/tree_leaf_icon.png'),
            value: 0,
            max: 0,
            tagQ: element => element.reportContentType === 'street-aesthetics-tag',
            tag: '',
            tagColor: '',
            paragraphQ: element => element.reportContentType === 'street-aesthetics-paragraph',
            paragraph: ''
          }, {
            code: 'street-surrounding-real-estate',
            text: 'Surrounding Real Estate',
            image: require('@/assets/images/house_icon.png'),
            value: 0,
            max: 0,
            tagQ: element => element.reportContentType === 'street-surrounding-real-estate-tag',
            tag: '',
            tagColor: '',
            paragraphQ: element => element.reportContentType === 'street-surrounding-real-estate-paragraph',
            paragraph: ''
          }, {
            code: 'street-traffic-parking',
            text: 'Traffic & Parking',
            image: require('@/assets/images/car_icon.png'),
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
            image: require('@/assets/images/surrounding_icon.png'),
            video: 'https://www.youtube.com/embed/lHlVNhVI0aw?autoplay=1',
            condition: element => element.reportContentType === 'why-surrounding-important',
            comment: ''
          },
          {
            title: 'HOW DOES TRAFFIC AND PARKING AFFECT PRICES?',
            image: require('@/assets/images/traffic_parking_icon.png'),
            video: 'https://www.youtube.com/embed/Cgt2hH8BOlY?autoplay=1',
            condition: element => element.reportContentType === 'how-traffic-parking-prices',
            comment: ''
          }
        ]
      }
      if (this.currentProperty) {
        positionScore.sections.forEach(section => {
          let score = this.getPositionScore(section.code)
          section.value = score.value
          section.max = score.max
          if (section.value > 0 && this.contentFragments) {
            let fragments = []
            if (section.tagQ) {
              fragments = this.contentFragments.filter(section.tagQ)
              let frg = this.getTaglinesFromFragments(fragments, section.value)
              section.tag = frg.comment
              section.tagColor = frg.color
            }
            if (section.paragraphQ) {
              fragments = this.contentFragments.filter(section.paragraphQ)
              let frg = this.getTaglinesFromFragments(fragments, section.value)
              section.paragraph = frg.comment
            }
          } else {
            section.tag = 'We will have a score for this service soon.'
            section.tagColor = '#E81819'
          }
        })
      }
      return positionScore
    },
    accessToServiceScore () {
      let value = {
        value: +lget(this.currentProperty, 'scores.accessservice.score.value', 0),
        max: +lget(this.currentProperty, 'scores.accessservice.score.max', 10),
        services: [
          {
            code: 'park',
            text: 'Parks & Leisure',
            image: require('@/assets/images/football_icon.png'),
            value: 0,
            max: 0,
            tagQ: element => element.reportContentType === 'parks-tag',
            tag: '',
            tagColor: '',
            paragraph: ''
          }, {
            code: 'school',
            text: 'Schools',
            image: require('@/assets/images/hat_icon.png'),
            value: 0,
            max: 0,
            tagQ: element => element.reportContentType === 'schools-tag',
            tag: '',
            tagColor: '',
            paragraph: ''
          }, {
            code: 'shopping',
            text: 'Shopping',
            image: require('@/assets/images/shopping_icon.png'),
            value: 0,
            max: 0,
            tagQ: element => element.reportContentType === 'shopping-tag',
            tag: '',
            tagColor: '',
            paragraph: ''
          }, {
            code: 'public-transport',
            text: 'Public Transport',
            image: require('@/assets/images/transport_icon.png'),
            value: 0,
            max: 0,
            tagQ: element => element.reportContentType === 'transport-tag',
            tag: '',
            tagColor: '',
            paragraph: ''
          }, {
            code: 'walkability',
            text: 'Walkable',
            image: require('@/assets/images/foot_icon.png'),
            value: 0,
            max: 0,
            hideMax: true,
            tagQ: element => element.reportContentType === 'walkability-tag',
            tag: '',
            tagColor: '',
            paragraph: ''
          }, {
            code: 'medical',
            text: 'Medical Facilities',
            image: require('@/assets/images/medical_icon.png'),
            value: 0,
            max: 0,
            tagQ: element => element.reportContentType === 'medical-tag',
            tag: '',
            tagColor: '',
            paragraph: ''
          }
        ]
      }
      if (this.currentProperty) {
        let serviceIndex = 0
        value.services.forEach(service => {
          let score = this.getAccessToServiceScore(service.code)
          service.value = score.value
          service.max = score.max
          if (service.value > 0) {
            let fragments = []
            if (service.tagQ) {
              fragments = this.contentFragments.filter(service.tagQ)
              let fragment = this.getTaglinesFromFragments(fragments, service.value)
              service.tag = fragment.comment
              service.tagColor = fragment.color
            }
          } else {
            service.tag = 'We will have a score for this service soon.'
            service.tagColor = '#E81819'
          }
          service.paragraph = this.getServiceParagraph(service.code, serviceIndex)
          serviceIndex++
        })
      }
      return value
    },
    trainProximityScore () {
      let trainProximityScore = {
        value: 0,
        max: 20,
        image: require('@/assets/images/train_icon.png'),
        serviceName: ''
      }
      if (this.proximityAssessment && this.proximityAssessment.services) {
        let trainServices = this.proximityAssessment.services.filter(service => service.serviceCategory === 'train-index' && service.travels && service.travels.length)
        let trainService = null
        trainServices.forEach(service => {
          service.travels.sort((a, b) => (b.score - a.score))
          if (trainService === null) {
            trainService = service
          } else {
            if (trainService.travels[0].score < service.travels[0].score) {
              trainService = service
            }
          }
        })
        if (trainService) {
          const travelDistance = +lget(trainService, 'travels[0].travelDistance', 0)
          trainProximityScore.value = parseFloat((travelDistance / 1000).toFixed(1))
          trainProximityScore.serviceName = trainService.name + ' is ' + (travelDistance / 1000).toFixed(1) + 'km by ' + this.tralvelModes[lget(trainService, 'travels[0].matchedTravelMode', 'walking')]
        }
      }
      return trainProximityScore
    },
    cityIndex () {
      const cityIndex = {
        score: 0,
        image: require('@/assets/images/city_icon.png'),
        comparison: []
      }
      if (this.proximityAssessment && this.proximityAssessment.services) {
        const cityService = this.proximityAssessment.services.find(service => service.serviceCategory === 'city-index' && service.travels && service.travels.length)
        if (cityService) {
          const travel = cityService.travels.find(travel => travel.matchedTravelMode === 'transit')
          if (travel) {
            cityIndex.score = travel.travelTime
          }
        }
        while (cityIndex.comparison.length < 3) {
          let combination = this.combinations[Math.floor(Math.random() * (this.combinations.length + 1))]
          if (combination) {
            if (cityIndex.comparison.length > 0) {
              let oldCombination = cityIndex.comparison.find(element => element.name === combination.name)
              if (!oldCombination) {
                cityIndex.comparison.push(combination)
              }
            } else {
              cityIndex.comparison.push(combination)
            }
          }
        }
      }
      return cityIndex
    },
    beachProximityScore () {
      let beachProximityScore = {
        value: 0,
        max: 3,
        image: require('@/assets/images/beach_icon.png'),
        serviceName: ''
      }
      if (this.proximityAssessment && this.proximityAssessment.services) {
        let beachServices = this.proximityAssessment.services.filter(service => service.serviceCategory === 'beach-index' && service.travels && service.travels.length)
        let beachService = null
        beachServices.forEach(service => {
          if (service.travels) {
            service.travels.sort((a, b) => (b.score - a.score))
            if (beachService === null) {
              beachService = service
            } else {
              if (lget(beachService, 'travels[0].score', 0) < lget(service, 'travels[0].score', 0)) {
                beachService = service
              }
            }
          }
        })
        if (beachService) {
          const travelTime = +lget(beachService, 'travels[0].travelTime', 0)
          beachProximityScore.value = parseFloat((travelTime / 3600).toFixed(2))
          beachProximityScore.serviceName = beachService.name + ' is ' + (travelTime / 60).toFixed(0) + 'mins by ' + this.tralvelModes[lget(beachService, 'travels[0].matchedTravelMode', 'walking')]
        }
      }
      return beachProximityScore
    },
    videoPlayButton () {
      return require('@/assets/images/play_button_icon.png')
    }
  },
  methods: {
    getPositionScore (_section = null) {
      let score = {value: 0, max: 10}
      if (_section) {
        let sectionScore = lget(this.currentProperty, 'scores.position.sections', []).find(m => m.section === _section)
        if (sectionScore) {
          score.value = +lget(sectionScore, 'score.value', 0)
          score.max = +lget(sectionScore, 'score.max', 0)
        }
      }
      return score
    },
    getAccessToServiceScore (service) {
      let score = {value: 0, max: 10}
      if (service) {
        let serviceScore = lget(this.currentProperty, 'scores.accessservice.services', []).find(s => s.serviceType === service)
        if (serviceScore) {
          score = {value: parseFloat(serviceScore.value), max: parseFloat(serviceScore.max)}
        }
      } else {
        score.value = +lget(this.currentProperty, 'scores.accessservice.score.value', 0)
        score.max = +lget(this.currentProperty, 'scores.accessservice.score.max', 10)
      }
      return score
    },
    getTaglinesFromFragments (fragments, score) {
      let result = {}
      if (fragments && fragments.length > 0) {
        fragments.sort((a, b) => { return parseFloat(a.upperBound) - parseFloat(b.upperBound) })
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
    getServiceParagraph (serviceCode, serviceIndex) {
      let service = {}
      if (serviceIndex > 2) {
        service.condition = element => element.matchedTravelMode === 'walking' && element.score > 4
      } else {
        service.condition = element => element.matchedTravelMode === 'walking'
      }
      let relevantServices = this.proximityAssessment.services.filter(svc => svc.serviceCategory === serviceCode)
      service.max_count = relevantServices.length
      let filteredServices = relevantServices.filter((svc) => {
        let travel = svc.travels.find(service.condition)
        if (travel) {
          return svc
        }
      })
      if (filteredServices !== null && filteredServices.length > 0) {
        service.count = filteredServices.length
        let nearestService = this.getNearestService(filteredServices)
        service.distance = nearestService.distance
        service.travel_time = nearestService.travel_time
        service.nearest = nearestService.nearest
      } else {
        let nearestService = this.getNearestService(relevantServices)
        service.distance = nearestService.distance
        service.travel_time = nearestService.travel_time
        service.nearest = nearestService.nearest
      }
      switch (serviceCode) {
        case 'medical':
          if (service.nearest !== '') {
            service.paragraph = this.formatString('<p>The nearest medical is {nearest-medical-station}</p>', [service.nearest])
          }
          break
        case 'public-transport':
          if (service.nearest !== '') {
            service.paragraph = this.formatString('<p>The nearest train station is {nearest-train-station}</p>', [service.nearest])
          }
          break
        case 'walkability':
          let parkCount = 0
          let shoppingCount = 0
          let schoolCount = 0
          let walkableData = this.getWalkableData()
          let relevantServices = walkableData.walkabilities.filter(element => element.serviceType === 'park')
          parkCount = relevantServices.length
          relevantServices = walkableData.walkabilities.filter(element => element.serviceType === 'shopping')
          shoppingCount = relevantServices.length
          relevantServices = walkableData.walkabilities.filter(element => element.serviceType === 'school')
          schoolCount = relevantServices.length
          service.paragraph = this.formatString('<p>This includes {schools-count} schools, {parks-count} parks and {shops-count} shops</p>', [schoolCount, parkCount, shoppingCount])
          break
        default:
          let fragment = null
          let contentType = ''
          if (service.count > 1) {
            contentType = serviceCode + '-walking'
            fragment = this.contentFragments.find(fragment => fragment.reportContentType === contentType)
            if (fragment) {
              service.paragraph = this.formatString(fragment.contentFragment, [service.nearest, service.count])
            }
          } else if (service.count === 1) {
            contentType = 'single-' + serviceCode + '-walking'
            fragment = this.contentFragments.find(fragment => fragment.reportContentType === contentType)
            if (fragment) {
              service.paragraph = this.formatString(fragment.contentFragment, [service.nearest])
            }
          } else {
            contentType = 'no-' + serviceCode + '-near'
            fragment = this.contentFragments.find(fragment => fragment.reportContentType === contentType)
            if (fragment && service.distance > 0 && service.travel_time > 0) {
              service.paragraph = this.formatString(fragment.contentFragment, [service.distance, service.travel_time])
            }
          }
          break
      }
      return service.paragraph
    },
    getNearestService (services) {
      let service = {
        distance: 0,
        travel_time: 0,
        serviceName: ''
      }
      services.forEach((svc) => {
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
      return service
    },
    getWalkableData () {
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
    openVideoModal (url) {
      this.videoContent = `<iframe width="600px" height="483px" src="${url}" allow="autoplay;" frameborder="0" allowfullscreen></iframe>`
      this.dialog = true
    },
    filterArray (array = [], index, step) {
      let subArray = []
      if (array) {
        subArray = array.slice(index * step, index * step + step)
      }
      return subArray
    },
    formatString (str, args) {
      let matchs = str.match(/{(.+?)(?=\})}/g)
      for (let k in matchs) {
        str = str.replace(matchs[k], '<b>' + args[k] + '</b>')
      }
      return str
    }
  },
  watch: {
    dialog: function (newValue, oldValue) {
      if (newValue === false) {
        this.videoContent = ''
      }
    }
  }
}
</script>
<style scoped>
.introduction {
  border-top: solid 1px #EEE;
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 30px;
}
.introduction .item {
  min-height: 230px !important;
  cursor: pointer;
  position: relative;
  margin-top: 30px;
}
.introduction .item img{
  max-height: 150px;
}
.primary-color {
  color: #528EC1;
}
.location-layout {
  justify-content: center;
  padding-top: 35px;
  padding-bottom: 15px;
  padding-left: 8px;
  padding-right: 8px;
}
.location-layout .item .title {
  font-weight: bold;
}
.location-analysis-section-title {
  font-size: 25px;
  font-weight: 900;
  letter-spacing: 2px;
}
.overall-section {
  background-color: #FFF;
}
.v-spinner {
  margin-top: -30px;
}
.level-text {
  font-size: 26px;
  font-weight: 500;
}
.access-to-service-section {
  background-color: #FAFAFA;
}
.position-section {
  background-color: #FFF;
}
.train-proximity-section {
  background-color: #FAFAFA;
}
.city-index-section {
  background-color: #FFF;
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
.beach-proximity-section {
  background-color: #FAFAFA;
}
/* Video Player CSS */
.item .mask-panel{
  visibility: hidden;
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: #FFF;
  transition: visibility 1s linear 800ms, opacity 800ms;
}
.item:hover .mask-panel{
  visibility: visible;
  opacity: 0.8;
  transition: visibility 1s linear 0s, opacity 800ms;
}
.item .mask-panel .video-play-panel {
  border: solid 1px #528ec1;
  margin-left: 30px;
  margin-right: 30px;
  padding: 8px;
  margin-top: 25%;
  display: flex;
  align-items: center;
}
.item .mask-panel .video-play-panel img {
  text-align: right;
  padding-right: 0px;
  padding-left: 0px;
  width: 40px;
}
.item .mask-panel .video-play-panel .question {
  text-align: left;
  margin-left: 0px;
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
</style>
