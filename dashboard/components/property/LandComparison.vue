<template>
  <div class="land-comparison">
    <v-layout row wrap>
      <v-flex xs4 v-for="(n, i) in 3" :key="i" px-3>
        <div class="text-xs-center black--text" v-if="getColumnDetail(i).property">
          <div class="title mt-4 mb-2">
            {{propertyAddress(getColumnDetail(i).property)}}
          </div>
          <div class="underline-decoration"></div>
        </div>
      </v-flex>
    </v-layout>

    <h3 class="section-title-bar">Property Rankings</h3>
    <v-layout row wrap>
      <v-flex xs4 v-for="(n, i) in 3" :key="'ranking-' + i" d-flex>
        <div v-if="getColumnDetail(i).comparativeRankings" class="text-xs-center">
          <div class="px-5 py-3 subheading">
            Based on a land evaluation, this property has ranked:
          </div>
          <div class="ranking-block">
            <span class="ranking-seat">
              {{getSeat(i).value}}<sup>{{getSeat(i).suffix}}</sup>
            </span><span class="ranking-total">/ {{getTotal(i)}}</span>
          </div>
          <div class="mb-5">properties in {{getPropertyPostCode(i)}}</div>
        </div>
        <div v-else class="text-xs-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <v-divider vertical light v-if="i < 2"></v-divider>
      </v-flex>
    </v-layout>

    <h3 class="section-title-bar">Analysis Scores</h3>
    <v-layout row wrap>
      <v-flex xs4 v-for="(n, i) in 3" :key="'analysisScores-' + i" d-flex>
        <div class="text-xs-center" v-if="getColumnDetail(i).property">
          <div class="px-5 py-2" v-for="(service, j) in analysisScores" :key="j">
            <div class="d-flex justify-space-between">
              <span class="text-xs-left">{{service.title}}</span>
              <v-spacer></v-spacer>
              <span class="text-xs-right">{{getAnalysisScore(getColumnDetail(i).property, service.category).text}}</span>
            </div>
            <v-progress-linear
              :value="getAnalysisScore(getColumnDetail(i).property, service.category).value"
              class="mt-1"
            ></v-progress-linear>
          </div>
        </div>
        <v-divider vertical light v-if="i < 2"></v-divider>
      </v-flex>
    </v-layout>

    <h3 class="section-title-bar">Overview</h3>
    <v-layout row wrap>
      <v-flex xs4 v-for="(n, i) in 3" :key="'overview-' + i" d-flex>
        <div class="text-xs-center">
          <div class="bullet text-xs-left" v-for="(comment, j) in overviewComments(i)" :key="j">
            <v-icon class="pl-3 pr-1" color="primary">mdi-circle-medium</v-icon>
            <span>{{comment}}</span>
          </div>
        </div>
        <v-divider vertical light v-if="i < 2"></v-divider>
      </v-flex>
    </v-layout>

    <h3 class="section-title-bar">Key Land Features</h3>
    <v-layout row wrap>
      <v-flex xs4 v-for="(n, i) in 3" :key="'overview-' + i" d-flex px-3>
        <div class="fixed-table-container">
          <table class="simple-table" cellspacing="0">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Included</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(feature, j) in getKeyFeatures(i)" :key="j">
                <td
                  :align="feature.name.includes('- ') ? 'left' : 'center'"
                  :class="feature.name.includes('- ') ? 'pl-5' : ''"
                  v-html="feature.name"
                ></td>
                <td align="center">
                  <v-icon v-if="feature.value" color="#528EC1">check_circle</v-icon>
                  <v-icon v-else color="gray">cancel</v-icon>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import lget from 'lodash.get'
import { mapState } from 'vuex'
import {
  getPropertyAddressComponentValue,
  getOrdinalSuffix
} from '@/utils'
const compareQuestions = (a, b) => ((a.reportOrder || 0) - (b.reportOrder || 0))
export default {
  name: 'LandComparison',
  data () {
    return {
      analysisScores: [
        {
          title: 'Planning',
          category: 'planning'
        },
        {
          title: 'Topography',
          category: 'topography'
        },
        {
          title: 'Performance',
          category: 'performance'
        },
        {
          title: 'Improvements',
          category: 'improvements'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      comparedPropertyIds: state => state.portfolio.comparedPropertyIds,
      comparedPropertyDetails: state => state.portfolio.comparedPropertyDetails
    })
  },
  methods: {
    getColumnDetail (index) {
      const detail = this.comparedPropertyDetails.find(
        o => o.property._id === this.comparedPropertyIds[index]
      )
      return {
        property: null,
        proximityAssessment: null,
        comparativeRankings: null,
        surveyAnswer: null,
        ...detail
      }
    },
    propertyAddress (property) {
      return lget(property, 'name', null)
    },
    getSeat (index) {
      const value = lget(this.getColumnDetail(index).comparativeRankings, 'land.seat', 0)
      return {
        value,
        suffix: getOrdinalSuffix(value)
      }
    },
    getTotal (index) {
      return lget(this.getColumnDetail(index).comparativeRankings, 'land.total', 0)
    },
    getPropertyPostCode (index) {
      return getPropertyAddressComponentValue(this.getColumnDetail(index).property, 'postal_code')
    },
    getAnalysisScore (property, category) {
      const landModule = lget(property, 'surveyScores.modules', []).find(m => m.code === 'land')
      const item = lget(landModule, 'sections', []).find(s => s.code === category)
      return {
        value: lget(item, 'score.value', 0) * 10,
        text: `${lget(item, 'score.value', 0)}/${lget(item, 'score.max', 10)}`
      }
    },
    overviewComments (index) {
      const surveyAnswer = this.getColumnDetail(index).surveyAnswer
      if (surveyAnswer) {
        return lget(surveyAnswer, 'responses', [])
          .filter(response => response.questionModule === 'land' && response.keyFeature === true)
          .sort(compareQuestions)
          .map(response => response.responseCommentary)
      }
      return []
    },
    getResponseByCode (index, qcode) {
      const surveyAnswer = this.getColumnDetail(index).surveyAnswer
      return lget(surveyAnswer, 'responses', []).find(response => response.questionCode === qcode)
    },
    getKeyFeatures (index) {
      const poolHouseCabana = lget(this.getResponseByCode(index, 'UPSQ14'), 'responseCode') === 'UPSQ14R1'
      const cupboards = lget(this.getResponseByCode(index, 'UPSQ13'), 'responseCode') === 'UPSQ13R1'
      return [
        {
          name: 'Pool',
          value: lget(this.getResponseByCode(index, 'UPSQ11'), 'responseCode') === 'UPSQ11R1'
        }, {
          name: 'Spa',
          value: lget(this.getResponseByCode(index, 'UPSQ38'), 'responseCode') === 'UPSQ38R1'
        }, {
          name: 'Inclinator',
          value: lget(this.getResponseByCode(index, 'UPSQ31'), 'responseCode') === 'UPSQ31R1'
        }, {
          name: 'Tennis Court',
          value: lget(this.getResponseByCode(index, 'UPSQ12'), 'responseCode') === 'UPSQ12R1'
        }, {
          name: '<strong>Pool House / Cabana</strong>',
          value: poolHouseCabana
        }, {
          name: '- with Bathroom',
          value: poolHouseCabana && lget(this.getResponseByCode(index, 'UPSQ24'), 'responseCode') === 'UPSQ24R1'
        }, {
          name: '- with Kitchenette',
          value: poolHouseCabana && lget(this.getResponseByCode(index, 'UPSQ25'), 'responseCode') === 'UPSQ25R1'
        }, {
          name: '- with Separate Room',
          value: poolHouseCabana && lget(this.getResponseByCode(index, 'UPSQ26'), 'responseCode') === 'UPSQ26R1'
        }, {
          name: '- with Built-in Cupboards',
          value: poolHouseCabana && lget(this.getResponseByCode(index, 'UPSQ29'), 'responseCode') === 'UPSQ29R4'
        }, {
          name: '<strong>Granny Flat</strong>',
          value: cupboards
        }, {
          name: '- with Bathroom',
          value: cupboards && lget(this.getResponseByCode(index, 'UPSQ20'), 'responseCode') === 'UPSQ20R1'
        }, {
          name: '- with Kitchenette',
          value: cupboards && lget(this.getResponseByCode(index, 'UPSQ21'), 'responseCode') === 'UPSQ21R1'
        }, {
          name: '- with Separate Room',
          value: cupboards && lget(this.getResponseByCode(index, 'UPSQ22'), 'responseCode') === 'UPSQ22R1'
        }, {
          name: '- with Built-in Cupboards',
          value: cupboards && lget(this.getResponseByCode(index, 'UPSQ30'), 'responseCode') === 'UPSQ30R4'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.land-comparison {
  color: $housepro-primary-color;
  padding-bottom: 64px;

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

  .fixed-table-container {
    width: 300px;
  }

  table.simple-table {
    border-collapse: collapse;
    margin-top: 4px;
    margin-bottom: 16px;
    color: #000;

    thead {
      background-color: #DDD;
      border-bottom: 2.5px solid $housepro-primary-color;
    }
    tr:nth-child(even) {
      background-color: #F2F2F2;
    }
    tr:hover {
      background-color: #DDD;
    }
    th, td {
      border: 1px solid #BBB;
      font-size: 15px;
      padding: 10px;

      span {
        vertical-align: text-bottom;
      }
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
