<template>
  <div class="location-comparison">
    <v-layout row wrap>
      <v-flex xs4 v-for="(n, i) in 3" :key="i" px-3>
        <div class="text-xs-center black--text" v-if="getColumnDetail(i).property">
          <div class="title mt-4 mb-2">
            {{propertyAddress(getColumnDetail(i).property)}}
          </div>
          <div class="underline-decoration"></div>
        </div>
      </v-flex>
      <v-flex xs12>
        <h3 class="section-title-bar">Property Rankings</h3>
      </v-flex>
      <v-flex xs4 v-for="(n, i) in 3" :key="'ranking-' + i" d-flex>
        <div v-if="getColumnDetail(i).comparativeRankings" class="text-xs-center">
          <div class="px-5 py-3 subheading">
            Based on a location evaluation, this property has ranked:
          </div>
          <div class="ranking-block">
            <span class="ranking-seat">
              {{getSeat(getColumnDetail(i).comparativeRankings).value}}<sup>{{getSeat(getColumnDetail(i).comparativeRankings).suffix}}</sup>
            </span>
            <span class="ranking-total">/ {{getTotal(getColumnDetail(i).comparativeRankings)}}</span>
          </div>
          <div class="mb-5">properties in {{getPropertyPostCode(getColumnDetail(i).property)}}</div>
        </div>
        <div v-else class="text-xs-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <v-divider vertical light v-if="i < 2"></v-divider>
      </v-flex>
      <v-flex xs12>
        <h3 class="section-title-bar">Access to Services</h3>
      </v-flex>
      <v-flex xs4 v-for="(n, i) in 3" :key="'accesstoservices-' + i" d-flex>
        <div class="text-xs-center" v-if="getColumnDetail(i).property">
          <div class="px-5 py-2" v-for="(service, j) in accessToServices" :key="j">
            <div class="d-flex justify-space-between">
              <span class="text-xs-left">{{service.title}}</span>
              <v-spacer></v-spacer>
              <span class="text-xs-right">{{getServiceScore(getColumnDetail(i).property, service.category).text}}</span>
            </div>
            <v-progress-linear
              :value="getServiceScore(getColumnDetail(i).property, service.category).value"
              class="mt-1"
            ></v-progress-linear>
          </div>
        </div>
        <v-divider vertical light v-if="i < 2"></v-divider>
      </v-flex>
      <v-flex xs12>
        <h3 class="section-title-bar">Local Services and Features</h3>
      </v-flex>
      <v-flex xs4 v-for="(n, i) in 3" :key="'localservices-' + i" d-flex>
        <div v-if="getColumnDetail(i).proximityAssessment">
          <div class="px-5 py-2" v-for="(service, j) in localServices" :key="j">
            <v-layout row wrap>
              <v-flex xs3 pr-2>
                <span class="text-xs-left black--text">{{service.title}}</span>
              </v-flex>
              <v-flex xs3 pr-2 v-if="getLocalServiceDetail(getColumnDetail(i).proximityAssessment, service)">
                <span class="text-xs-left">{{getLocalServiceDetail(getColumnDetail(i).proximityAssessment, service).serviceName}}</span>
              </v-flex>
              <v-flex xs6 v-if="getLocalServiceDetail(getColumnDetail(i).proximityAssessment, service)">
                <span class="text-xs-left black--text">
                  <span>{{getTravelDetailText(getColumnDetail(i).proximityAssessment, service)}}</span>
                  <v-icon
                    v-if="getLocalServiceDetail(getColumnDetail(i).proximityAssessment, service).travelMode === 'walking'"
                    color="primary"
                    size="20"
                  >check</v-icon>
                </span>
              </v-flex>
            </v-layout>
          </div>
        </div>
        <v-divider vertical light v-if="i < 2"></v-divider>
      </v-flex>
      <v-flex xs12>
        <h3 class="section-title-bar mb-0">Position</h3>
      </v-flex>
      <template v-for="service in positionServices">
        <v-flex xs12 mt-5 mb-4 :key="`${service.section}-title`">
          <h4 class="text-xs-center">{{service.title}}</h4>
        </v-flex>
        <v-flex xs4 d-flex v-for="(n, i) in 3" :key="`${service.section}-${i}`">
          <div v-if="getColumnDetail(i).property" class="text-xs-center">
            <div>
              <gauge-progress
                :id="service.section"
                :value="getPositionServiceScore(getColumnDetail(i).property, service).value"
                :maxValue="getPositionServiceScore(getColumnDetail(i).property, service).max"
                :image="service.image"
              >
                <image slot="icon" :href="service.image" x="11" y="10" height="14px" width="14px"/>
              </gauge-progress>
            </div>
            <div v-for="(response, j) in getSurveyAnswerComments(getColumnDetail(i).surveyAnswer, service)" :key="j">
              <div class="pl-4 py-3" v-html="response.responseCommentary"></div>
            </div>
          </div>
          <div v-else>
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </v-flex>
      </template>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import lget from 'lodash.get'
import {
  getPrettyDistance,
  getPrettyDuration,
  getPropertyAddressComponentValue,
  getOrdinalSuffix
} from '@/utils'
import GaugeProgress from '@/components/core/GaugeProgress'

export default {
  name: 'LocationComparison',
  components: {
    GaugeProgress
  },
  data () {
    return {
      accessToServices: [
        {
          title: 'Schools',
          category: 'school'
        },
        {
          title: 'Parks and Leisure',
          category: 'park'
        },
        {
          title: 'Shopping',
          category: 'shopping'
        },
        {
          title: 'Medical Facilities',
          category: 'medical'
        },
        {
          title: 'Walkable Services',
          category: 'walkability'
        },
        {
          title: 'Public Transport',
          category: 'public-transport'
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
      ]
    }
  },
  computed: {
    ...mapState({
      properties: state => state.portfolio.properties,
      comparedPropertyIds: state => state.portfolio.comparedPropertyIds,
      comparedPropertyDetails: state => state.portfolio.comparedPropertyDetails
    })
  },
  methods: {
    getColumnDetail (index) {
      const detail = this.comparedPropertyDetails.find(o => o.property._id === this.comparedPropertyIds[index])
      return {
        property: null,
        proximityAssessment: null,
        comparativeRankings: null,
        surveyAnswer: null,
        ...detail
      }
    },
    propertyAddress (property) {
      if (property && property.name) {
        return property.name
      }
      return ''
    },
    getSeat (comparativeRankings) {
      const value = lget(comparativeRankings, 'location.seat', 0)
      return {
        value,
        suffix: getOrdinalSuffix(value)
      }
    },
    getTotal (comparativeRankings) {
      return lget(comparativeRankings, 'location.total', 0)
    },
    getPropertyPostCode (property) {
      return getPropertyAddressComponentValue(property, 'postal_code')
    },
    getServiceScore (property, category) {
      if (property && property.scores && property.scores.accessservice && property.scores.accessservice.services) {
        const item = property.scores.accessservice.services.find(o => o.serviceType === category)
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
    getWalkableServicesCount (proximityAssessment) {
      if (proximityAssessment && proximityAssessment.services) {
        return proximityAssessment.services.filter(service => {
          return service.travels.filter(o => o.matchedTravelMode === 'walking').length
        }).length
      }
      return 0
    },
    getLocalServiceDetail (proximityAssessment, service) {
      if (proximityAssessment) {
        let localServices = proximityAssessment.services
          .filter(o => o.serviceType === service.serviceType || o.serviceSubType === service.serviceType)
        if (localServices.length) {
          localServices = localServices
            .map(o => {
              const travels = [...o.travels]
              travels.sort((a, b) => (b.score - a.score))
              return {...o, travels}
            })
            .filter(o => o.travels[0])
            .sort((a, b) => (b.travels[0].score - a.travels[0].score))
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
    getTravelDetailText (proximityAssessment, service) {
      const serviceDetails = this.getLocalServiceDetail(proximityAssessment, service)
      let text = ''
      if (serviceDetails) {
        const {travelMode, travelDistance, travelTime} = serviceDetails
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
    getPositionServiceScore (property, service) {
      try {
        const sections = lget(property, 'scores.position.sections', [])
        const {score} = sections.find(o => o.section === service.section)
        return {
          value: +score.value || 0,
          max: +score.max || 10
        }
      } catch (error) {
        return {value: 0, max: 10}
      }
    },
    getSurveyAnswerComments (surveyAnswer, service) {
      try {
        return surveyAnswer.responses
          .filter(answer => answer.displayInReport && answer.questionSection === service.section)
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

.location-comparison {
  color: $housepro-primary-color;

  .underline-decoration {
    display: block;
    width: 200px;
    height: 3px;
    margin: 0 auto;
    background: $housepro-primary-color;
  }
  .section-title-bar {
    background: rgba(82,142,193,.3);
    margin: 40px 0;
    padding: 10px 0;
    text-align: center;
  }
  .ranking-block {
    padding-top: 20px;
    padding-bottom: 20px;

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
}
</style>
