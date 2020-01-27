<template>
  <section class="location-report">
    <div class="text-xs-center">
      <h1 class="my-4">LOCATION REPORT</h1>
      <gauge-progress
        id="overall-location-score"
        :value="overallLocationScore.value"
        :maxValue="overallLocationScore.maxValue"
        :height="150"
      >
        <image slot="icon" :href="overallLocationScore.icon" x="9" y="7" height="18px" width="18px"/>
      </gauge-progress>
      <div class="primary--text subheading mt-2">The HousePro Research Algorithm has analysed:</div>
      <strong>{{propertyAddress}}</strong>
      <div class="primary--text subheading mt-2">and has assessed that within:</div>
      <strong>{{suburbName}}</strong>
      <div class="primary--text subheading my-3">the property location is:</div>
      <h1 class="text-uppercase font-weight-bold primary--text display-2">{{overallLocationScore.grade}}</h1>
    </div>
    <v-layout row wrap justify-center>
      <v-flex xs4 pa-3>
        <v-progress-linear :value="overallAccessToServices.value" class="my-1"></v-progress-linear>
        <div class="d-flex justify-space-between">
          <div>ACCESS TO SERVICES</div>
          <v-spacer></v-spacer>
          <div class="text-xs-right">{{overallAccessToServices.text}}</div>
        </div>
      </v-flex>
      <v-flex xs4 pa-3>
        <v-progress-linear :value="overallPosition.value" class="my-1"></v-progress-linear>
        <div class="d-flex justify-space-between">
          <div>POSITION</div>
          <v-spacer></v-spacer>
          <div class="text-xs-right">{{overallPosition.text}}</div>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="overallPosition.value > 0">
      <v-flex sm12>
        <div class="overview-title text-xs-center mt-5 mb-3">SUBURB RANKING</div>
        <v-divider></v-divider>
        <div class="mt-3 text-xs-center">
          <p>
            We have assessed and number of houses across this suburb based on position and access to services in order to be able to provide comparative rankings of properties in
            <b v-if="suburb">{{suburb.name}}</b><b v-else>....</b>. Based on our research database this property has the following suburb ranking:
          </p>
          <div class="ranking-block">
            <span class="ranking-seat">
              {{ranking.seat}}<sup>{{ranking.suffix}}</sup>
            </span>
            <span class="ranking-total">/ {{ranking.total}}</span>
          </div>
        </div>
      </v-flex>
      <v-flex sm12 mt-3 v-if="suburb">
        <div class="title primary--text text-xs-center">
          About {{suburb.name}}
        </div>
        <div class="mt-3 text-xs-center" v-html="aboutSubrub"></div>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center>
      <v-flex xs12 my-4>
        <div class="overview-title blue-under-line primary--text">
          Access to Services
        </div>
      </v-flex>
      <v-flex v-for="service in accessToServices" :key="service.section" xs4 pa-3>
        <div class="d-flex justify-space-between primary--text">
          <strong>{{service.title}}</strong>
          <v-spacer></v-spacer>
          <strong class="text-xs-right">{{accessToServiceScore(service.section).text}}</strong>
        </div>
        <v-progress-linear :value="accessToServiceScore(service.section).value" class="mt-1"></v-progress-linear>
      </v-flex>
      <v-flex xs8>
        <v-alert :value="true" color="primary" outline class="text-xs-center pa-2">
          <span class="subheading">
            {{totalServicesAssessed}} local services and features have been researched, analysed and scored
            by our HousePro algorithm for access and proximity to this location.
          </span>
        </v-alert>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex sm12 my-3>
        <div class="blue-under-line">
          <span class="overview-title primary--text">Your local services and features</span>
          <span class="align-right pt-2">PT = Public Transport</span>
        </div>
      </v-flex>
      <template v-for="(service, index) in localServices">
        <v-flex
          :key="service.serviceType"
          sm6
          mt-4 mb-2
        >
          <v-layout row wrap>
            <v-flex sm3 pr-2>
              <b>{{ service.title }}:</b>
            </v-flex>
            <v-flex sm4 pr-2 v-if="getLocalServiceDetail(service.serviceType)">
              <span class="primary--text">{{getLocalServiceDetail(service.serviceType).serviceName}}</span>
            </v-flex>
            <v-flex sm5 v-if="getLocalServiceDetail(service.serviceType)">
              <span class="text-xs-left black--text">
                <span>{{getTravelDetailText(getLocalServiceDetail(service.serviceType))}}</span>
                <v-icon
                  v-if="getLocalServiceDetail(service.serviceType).travelMode === 'walking'"
                  color="primary"
                  size="20"
                >check</v-icon>
              </span>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex sm12 v-if="index % 2 === 1" :key="`underline-${index}`">
          <v-divider></v-divider>
        </v-flex>
      </template>
    </v-layout>
    <v-layout row wrap mt-5>
      <v-flex sm2>
      </v-flex>
      <v-flex sm3 mt-3>
        <div class="primary--text text-xs-center"><b>Catchment Information</b></div>
      </v-flex>
      <v-flex sm3 mt-3>
        <div class="primary--text text-xs-center"><b>Independent Schools</b></div>
      </v-flex>
      <v-flex sm3 mt-3>
        <div class="primary--text text-xs-center"><b>City/Beach Index</b></div>
      </v-flex>
    </v-layout>
    <v-layout row wrap my-4 v-for="(n, i) in 2" :key="`schools-${n}`">
      <v-flex sm2 py-2><strong>{{n === 1 ? 'Primary:' : 'Secondary:'}}</strong></v-flex>
      <v-flex sm3 px-2 py-2 v-for="(service, index) in relevantedServices" :key="index" class="text-xs-center">
        <div class="font-weight-bold" v-if="getRelevantServiceDetail(service, i)">{{ getRelevantServiceDetail(service, i).serviceName || '' }}</div>
        <div>{{ getTravelDetailText(getRelevantServiceDetail(service, i)) }}</div>
      </v-flex>
      <v-flex sm12><v-divider></v-divider></v-flex>
    </v-layout>

    <template v-if="overallPosition.value > 0">
      <div class="overview-title mt-5">
        <div class="primary--text align-left">Position</div>
        <div class="primary--text align-right">
          {{ `${positionScore.value}/${positionScore.max}` }}
        </div>
      </div>
      <v-progress-linear :value="positionScore.value * 10"></v-progress-linear>
      <v-layout row wrap justify-center my-4 class="text-xs-center">
        <v-flex v-for="service in positionServices" :key="service.section" sm3 mt-3>
          <div class="primary--text">{{ service.title }}</div>
          <gauge-progress
            :id="service.section"
            :value="getPositionServiceScore(service).value"
            :maxValue="getPositionServiceScore(service).max"
          >
            <image slot="icon" :href="service.image" x="11" y="10" height="14px" width="14px"/>
          </gauge-progress>
        </v-flex>
        <v-flex xs8 my-3>
          <v-alert :value="true" color="primary" outline class="text-xs-center pa-2">
            <span class="subheading">
              We have surveyed and noted the key features of the street and used the HousePro location
              algorithm to score this position. Some key commentary is listed below.
            </span>
          </v-alert>
        </v-flex>
      </v-layout>

      <h2 class="my-5 text-xs-center">POSITION COMMENTARY</h2>
      <v-layout row wrap my-4 v-for="item in surveySubjects" :key="item.section">
        <v-flex sm12>
          <div class="primary--text" style="display: inline-block">
            <h3 class="dark-blue-color">{{item.sectionTitle}}</h3>
          </div>
        </v-flex>
        <v-flex
          sm12
          v-for="(response, index) in getSurveyAnswerComments(item)"
          :key="index"
          class="bullet text-xs-left"
        >
          <v-icon class="pl-3 pr-1" color="primary">mdi-circle-medium</v-icon>
          <div v-html="response.responseCommentary"></div>
        </v-flex>
      </v-layout>
    </template>
  </section>
</template>

<script>
import lget from 'lodash.get'
import { mapState } from 'vuex'
import GaugeProgress from '@/components/core/GaugeProgress'
import {
  getPrettyDistance,
  getPrettyDuration,
  getOrdinalSuffix
} from '@/utils'

const grade = (score) => (
  +score < 5 ? 'Below Average'
    : +score < 6 ? 'Satisfactory'
      : +score < 7 ? 'Good'
        : +score < 8 ? 'Very Good'
          : 'Exceptional'
)

export default {
  name: 'LocationReport',
  components: {
    GaugeProgress
  },
  data () {
    return {
      loading: false,
      accessToServices: [
        {
          title: 'Schools',
          section: 'school'
        },
        {
          title: 'Parks and Leisure',
          section: 'park'
        },
        {
          title: 'Shopping',
          section: 'shopping'
        },
        {
          title: 'Medical Facilities',
          section: 'medical'
        },
        {
          title: 'Walkable Services',
          section: 'walkability'
        },
        {
          title: 'Public Transport',
          section: 'public-transport'
        }
      ],
      localServices: [
        {
          title: 'Train Station',
          serviceType: 'train-station'
        },
        {
          title: 'Supermarket',
          serviceType: 'medium'
        },
        {
          title: 'Shopping Center',
          serviceType: 'main'
        },
        {
          title: '7-day medical falcility',
          serviceType: '7-day-medical-centre'
        },
        {
          title: 'Local Shops',
          serviceType: 'local'
        },
        {
          title: 'Sports Field',
          serviceType: 'sporting-field'
        },
        {
          title: 'Walking Tracks',
          serviceType: 'walking-track'
        },
        {
          title: 'Hospital',
          serviceType: 'hospital'
        }
      ],
      relevantedServices: [
        {
          serviceCategories: ['school'],
          serviceSubTypes: ['public']
        },
        {
          serviceCategories: ['school'],
          serviceSubTypes: ['private', 'private-boys', 'private-girls', 'private-coed']
        },
        {
          serviceCategories: ['beach-index', 'city-index'],
          serviceSubTypes: []
        }
      ],
      positionServices: [
        {
          section: 'street-aesthetics',
          title: 'Street Aesthetics',
          image: require('@/assets/images/tree_leaf_icon.png')
        }, {
          section: 'street-surrounding-real-estate',
          title: 'Surround Real Estate',
          image: require('@/assets/images/house_icon.png')
        }, {
          section: 'street-traffic-parking',
          title: 'Traffic and Parking',
          image: require('@/assets/images/car_icon.png')
        }
      ],
      surveySubjects: [
        {
          section: 'street-aesthetics',
          sectionTitle: 'Street Aesthetics'
        }, {
          section: 'street-surrounding-real-estate',
          sectionTitle: 'Surrounding Real Estate'
        }, {
          section: 'street-traffic-parking',
          sectionTitle: 'Traffic & Parking'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      suburb: state => state.portfolio.currentProperty.suburb,
      currentProperty: state => state.portfolio.currentProperty.property,
      comparativeRankings: state => state.portfolio.currentProperty.comparativeRankings,
      proximityAssessment: state => state.portfolio.currentProperty.proximityAssessment,
      surveyAnswer: state => state.portfolio.currentProperty.surveyAnswer
    }),
    overallAccessToServices () {
      const value = lget(this.currentProperty, 'scores.accessservice.score.value', 0)
      const max = lget(this.currentProperty, 'scores.accessservice.score.max', 10)
      return {
        value: value * 10,
        text: `${value}/${max}`
      }
    },
    overallPosition () {
      const value = lget(this.currentProperty, 'scores.position.score.value', 0)
      const max = lget(this.currentProperty, 'scores.position.score.max', 10)
      return {
        value: value * 10,
        text: `${value}/${max}`
      }
    },
    overallLocationScore () {
      let value = +lget(this.currentProperty, 'scores.overall.value', 0)
      let maxValue = +lget(this.currentProperty, 'scores.overall.max', 10)
      return {
        value,
        maxValue,
        grade: grade(value),
        icon: require('@/assets/images/house.svg')
      }
    },
    propertyAddress () {
      return lget(this.currentProperty, 'formatted_address', '')
    },
    suburbName () {
      return lget(this.suburb, 'name', '')
    },
    aboutSubrub () {
      let value = ''
      if (this.suburb) {
        let strArr = this.suburb.overviewDescription.split('</h')
        if (strArr.length > 1) {
          value = strArr[1].substring(2, strArr[1].length)
        } else {
          value = this.suburb.overviewDescription
        }
      }
      return value
    },
    positionScore () {
      let score = null
      if (this.currentProperty && this.currentProperty.scores && this.currentProperty.scores.position) {
        score = this.currentProperty.scores.position.score
      }
      return {
        value: score ? score.value : 0,
        max: score ? score.max : 10
      }
    },
    totalServicesAssessed () {
      return lget(this.proximityAssessment, 'services', []).length
    },
    ranking () {
      const seat = lget(this.comparativeRankings, 'location.seat', 0)
      return {
        seat,
        suffix: getOrdinalSuffix(seat),
        total: lget(this.comparativeRankings, 'location.total', 0)
      }
    }
  },
  methods: {
    accessToServiceScore (serviceType) {
      if (this.currentProperty && this.currentProperty.scores && this.currentProperty.scores.accessservice && this.currentProperty.scores.accessservice.services) {
        const item = this.currentProperty.scores.accessservice.services.find(o => o.serviceType === serviceType)
        if (item) {
          return {
            value: item.value * 10,
            text: `${item.value}/${item.max}`
          }
        }
      }
      return {
        value: 0,
        text: '0/10'
      }
    },
    getLocalServiceDetail (serviceType) {
      if (this.proximityAssessment && this.proximityAssessment.services) {
        let localServices = this.proximityAssessment.services.filter(o => {
          return o.serviceType === serviceType || o.serviceSubType === serviceType
        })
        if (localServices.length) {
          localServices = localServices
            .map(o => {
              const travels = [...o.travels]
              travels.sort((a, b) => (b.score - a.score))
              return {...o, travels}
            })
            .filter(o => o.travels[0])
            .sort((a, b) => (b.travels[0].score - a.travels[0].score)) // travels[0] - best travel
          if (localServices.length) {
            const bestService = localServices[0]
            return {
              serviceName: bestService.name,
              travelMode: bestService.travels[0].matchedTravelMode,
              travelDistance: getPrettyDistance(bestService.travels[0].travelDistance),
              travelTime: getPrettyDuration(bestService.travels[0].travelTime)
            }
          }
        }
      }
      return null
    },
    getTravelDetailText (serviceDetail) {
      let text = ''
      if (serviceDetail) {
        const {travelMode, travelDistance, travelTime} = serviceDetail
        text = travelDistance
        if (travelMode === 'walking') {
          text = `${travelDistance} | Walk`
        } else if (travelMode === 'transit') {
          text = `${travelDistance} | PT - ${travelTime}`
        } else if (travelMode === 'driving') {
          text = `${travelDistance} | Car - ${travelTime}`
        } else {
          text = `${travelDistance} | ${travelMode} - ${travelTime}`
        }
      }
      return text
    },
    getRelevantServiceDetail (service, isPrimary) {
      if (this.proximityAssessment && this.proximityAssessment.services) {
        let relevantServices = this.proximityAssessment.services.filter(o => {
          return (!service.serviceCategories.length || service.serviceCategories.includes(o.serviceCategory)) &&
            (!service.serviceSubTypes.length || service.serviceSubTypes.includes(o.serviceSubType))
        })
        if (relevantServices.length) {
          relevantServices = relevantServices
            .map(o => {
              const travels = [...o.travels]
              travels.sort((a, b) => (b.score - a.score))
              return {...o, travels}
            })
            .filter(o => o.travels[0])
            .sort((a, b) => (b.travels[0].score - a.travels[0].score)) // travels[0] - best travel
          if (relevantServices.length) {
            const bestService = relevantServices[isPrimary]
            if (bestService) {
              if (bestService.serviceCategory === 'city-index') {
                return {
                  serviceName: bestService.name,
                  travelMode: bestService.travels[0].matchedTravelMode,
                  travelDistance: getPrettyDistance((bestService.travels[0].travelDistance / 6).toFixed(0)),
                  travelTime: getPrettyDuration((bestService.travels[0].travelTime / 6).toFixed(0))
                }
              }
              return {
                serviceName: bestService.name,
                travelMode: bestService.travels[0].matchedTravelMode,
                travelDistance: getPrettyDistance(bestService.travels[0].travelDistance),
                travelTime: getPrettyDuration(bestService.travels[0].travelTime)
              }
            }
          }
        }
      }
      return null
    },
    getPositionServiceScore (service) {
      try {
        const {score} = this.currentProperty.scores.position.sections.find(o => o.section === service.section)
        return {
          value: +score.value || 0,
          max: +score.max || 10
        }
      } catch (error) {
        return {value: 0, max: 10}
      }
    },
    getSurveyAnswerComments (feature) {
      try {
        let responses = this.surveyAnswer.responses.filter(r => r.questionModule === 'location')
        return responses.filter(answer => answer.displayInReport && answer.questionSection === feature.section)
          .map(answer => ({
            responseId: answer.responseId,
            responseScore: answer.responseScore,
            responseMax: answer.responseMax,
            responseCommentary: answer.responseCommentary
          }))
      } catch (error) {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.location-report {
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 100px;

  .blue-under-line {
    border-bottom: solid $housepro-primary-color;
    padding-bottom: 3px;
    margin-top: 15px;
  }
  .overview-title {
    font-size: 23px;
    font-weight: 600;
  }
  .overview-text {
    margin-top: 15px;
  }
  .align-right {
    float: right;
  }
  .align-left {
    float: left;
  }
  .ranking-block {
    padding-top: 20px;
    padding-bottom: 20px;
    color: $housepro-primary-color;

    .ranking-seat {
      font-size: 60px;
      font-weight: bold;
      padding-bottom: 20px;

      sup {
        font-size: 24px;
        vertical-align: super;
      }
    }
    .ranking-total {
      font-size: 20px;
      padding-bottom: 10px;
      padding-left: 5px;
    }
  }
  .bullet {
    display: flex;
    align-items: flex-start;
    position: relative;
    padding-top: 16px;
  }
}
</style>
