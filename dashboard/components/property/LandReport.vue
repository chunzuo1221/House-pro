<template>
  <section class="land-report">
    <div class="mt-3"><h1>LAND REPORT</h1></div>
    <gauge-progress
      id="gauge_component"
      :value="landScores.value"
      :maxValue="landScores.max"
      :height="150"
      class="mt-3"
    >
      <image slot="icon" :href="landScores.image" x="10" y="7" height="16px" width="16px"/>
    </gauge-progress>
    <div class="primary--text">HousePro has analysed the land at <strong>{{currentProperty.name}}</strong></div>
    <div class="my-1">In our opinion the land at this property is</div>
    <h1 class="text-uppercase primary--text">{{landScores.level}}</h1>
    <v-divider class="mt-4"></v-divider>
    <p class="my-3" v-html="introduction"></p>
    <rich-text-edit-modal
      v-if="isAdmin"
      title="Land Report Introduction"
      :default-text="introduction"
      @save="onIntroductionSave"
    />
    <v-divider class="mt-3 mb-5"></v-divider>
    <h2 class="text-uppercase">LAND DETAILS</h2>
    <v-layout row wrap d-flex justify-space-around>
      <v-flex xs4 px-3 pt-4 v-for="(item, index) in landScores.sections" :key="index">
        <div class="section-title-box">
          <h3 class="primary--text">{{item.title}}</h3>
        </div>
        <gauge-progress
          :id="item.code"
          :value="item.value"
          :maxValue="item.max"
        >
          <image slot="icon" :href="item.image" x="12" y="10" height="14px" width="14px"/>
        </gauge-progress>
      </v-flex>
    </v-layout>

    <div v-if="overviewComments.length">
      <h2 class="mt-5 mb-3">OVERVIEW</h2>
      <div
        v-for="(comment, index) in overviewComments"
        :key="index"
        class="bullet text-xs-left"
      >
        <v-icon class="pl-3 pr-1" color="primary">mdi-circle-medium</v-icon>
        <span>{{comment}}</span>
      </div>
    </div>

    <div class="my-5">
      <h2 class="mb-3">KEY LAND FEATURES</h2>
      <v-layout row mt-4>
        <v-flex sm6>
          <div class="primary--text text-xs-left">Entertainment and Liveability</div>
          <table class="simple-table" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th v-for="item in entertainment" :key="item.code">
                  {{ item.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="item in entertainment" :key="item.code">
                  <v-icon v-if="item.isInclude === true" color="#528EC1">check_circle</v-icon>
                  <v-icon v-else color="gray">cancel</v-icon>
                </td>
              </tr>
            </tbody>
          </table>
        </v-flex>
      </v-layout>
      <v-layout row mt-4>
        <v-flex>
          <div class="primary--text text-xs-left">External Structures</div>
          <table class="simple-table" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Bathroom</th>
                <th>Kitchenette</th>
                <th>Separate Room</th>
                <th>Built-in Cupboards</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cell, index) in externalStructures" :key="index">
                <td align="left" valign="center">
                  <v-icon v-if="cell.value" color="primary">mdi-check-circle</v-icon>
                  <v-icon v-else color="gray">mdi-close-circle</v-icon>
                  <span :class="cell.value ? 'primary--text' : 'gray--text'" class="pl-2">{{cell.name}}</span>
                </td>
                <td>
                  <v-icon v-if="cell.bathroom === true" color="primary">mdi-check</v-icon>
                  <v-icon v-else-if="cell.bathroom === false" color="primary">mdi-window-close</v-icon>
                  <v-icon v-else color="gray">mdi-minus</v-icon>
                </td>
                <td>
                  <v-icon v-if="cell.kitchenette === true" color="primary">mdi-check</v-icon>
                  <v-icon v-else-if="cell.kitchenette === false" color="primary">mdi-window-close</v-icon>
                  <v-icon v-else color="gray">mdi-minus</v-icon>
                </td>
                <td>
                  <v-icon v-if="cell.separateRoom === true" color="primary">mdi-check</v-icon>
                  <v-icon v-else-if="cell.separateRoom === false" color="primary">mdi-window-close</v-icon>
                  <v-icon v-else color="gray">mdi-minus</v-icon>
                </td>
                <td>
                  <v-icon v-if="cell.cupboard === true" color="primary">mdi-check</v-icon>
                  <v-icon v-else-if="cell.cupboard === false" color="primary">mdi-window-close</v-icon>
                  <v-icon v-else color="gray">mdi-minus</v-icon>
                </td>
              </tr>
            </tbody>
          </table>
        </v-flex>
      </v-layout>
    </div>

    <div class="my-5" v-if="landMapUrl">
      <h2 class="my-4 text-uppercase">Land Map</h2>
      <v-card>
        <v-layout row wrap>
          <v-flex xs4>
            <v-img
              :src="landMapUrl"
              aspect-ratio="1"
              max-width="280px"
              max-height="280px"
            ></v-img>
          </v-flex>
          <v-flex xs8>
            <gmap-map
              ref="mapRef"
              :center="propertyLocation"
              :zoom="18"
              map-type-id="roadmap"
              style="width: 100%; height: 280px"
              :options="{
                zoomControl: false,
                scaleControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false
              }"
            >
              <gmap-marker
                :position="propertyLocation"
                :clickable="true"
              />
            </gmap-map>
          </v-flex>
        </v-layout>
      </v-card>
    </div>

    <div class="my-5" v-if="councilData">
      <h2 class="my-5">Planning Information</h2>
      <h4 class="text-xs-left primary--text">Ku-Ring-Gai Council Data</h4>
      <v-layout row wrap my-3>
        <v-flex
          v-for="(record, index) in councilData"
          :key="index"
          pr-4
          py-3
          sm6 xs12
          d-flex
          justify-start
        >
          <div class="text-xs-left">
            <strong>{{record.name}}</strong>:
            <span>{{record.value}}</span>
            <span v-if="record.name === 'Land Size' && measureUnit">{{measureUnit}}<sup>2</sup></span>
          </div>
        </v-flex>
      </v-layout>

      <h4 class="text-xs-left primary--text mt-5">HousePro Data</h4>
      <div
        v-for="(comment, commentIndex) in planningInfo"
        :key="commentIndex"
        class="bullet text-xs-left"
      >
        <v-icon class="pl-3 pr-1" color="primary">mdi-circle-medium</v-icon>
        <span>{{comment}}</span>
      </div>
    </div>

    <div class="my-5" v-if="accessShapeSections.length">
      <h2 class="my-5 text-uppercase">Access and shape of land</h2>
      <div v-for="(section, sectionIndex) in accessShapeSections" :key="sectionIndex" class="mt-5 mb-3">
        <h4 class="text-xs-left primary--text">{{section.name}}</h4>
        <div
          v-for="(comment, commentIndex) in section.comments"
          :key="`${sectionIndex}-${commentIndex}`"
          class="bullet text-xs-left"
        >
          <v-icon class="pl-3 pr-1" color="primary">mdi-circle-medium</v-icon>
          <span>{{comment}}</span>
        </div>
      </div>
    </div>

    <div class="my-5" v-if="privacyLiveabilitySections.length">
      <h2 class="my-5 text-uppercase">Privacy and liveability</h2>
      <div v-for="(section, sectionIndex) in privacyLiveabilitySections" :key="sectionIndex" class="mt-5 mb-3">
        <h4 class="text-xs-left primary--text">{{section.name}}</h4>
        <div
          v-for="(comment, commentIndex) in section.comments"
          :key="`${sectionIndex}-${commentIndex}`"
          class="bullet text-xs-left"
        >
          <v-icon class="pl-3 pr-1" color="primary">mdi-circle-medium</v-icon>
          <span>{{comment}}</span>
        </div>
      </div>
    </div>

    <div class="my-5" v-if="treesGardensSections.length">
      <h2 class="my-5 text-uppercase">Trees and gardens</h2>
      <div v-for="(section, sectionIndex) in treesGardensSections" :key="sectionIndex" class="mt-5 mb-3">
        <h4 class="text-xs-left primary--text">{{section.name}}</h4>
        <div
          v-for="(comment, commentIndex) in section.comments"
          :key="`${sectionIndex}-${commentIndex}`"
          class="bullet text-xs-left"
        >
          <v-icon class="pl-3 pr-1" color="primary">mdi-circle-medium</v-icon>
          <span>{{comment}}</span>
        </div>
      </div>
    </div>

    <div class="my-5" v-if="improvementsSections.length">
      <h2 class="my-5 text-uppercase">Improvements</h2>
      <div v-for="(section, sectionIndex) in improvementsSections" :key="sectionIndex" class="mt-5 mb-3">
        <h4 class="text-xs-left primary--text">{{section.name}}</h4>
        <div
          v-for="(comment, commentIndex) in section.comments"
          :key="`${sectionIndex}-${commentIndex}`"
          class="bullet text-xs-left"
        >
          <v-icon class="pl-3 pr-1" color="primary">mdi-circle-medium</v-icon>
          <span>{{comment}}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import lget from 'lodash.get'
import { mapState, mapGetters } from 'vuex'
import { UPDATE_PROPERTY_DETAIL } from '@/store/action-types'
import GaugeProgress from '@/components/core/GaugeProgress'
import RichTextEditModal from '@/components/core/RichTextEditModal'
import { landReportIntroDefault } from '@/data/introductions'
import { getLandMapImageUrl } from '@/utils'

const compareQuestions = (a, b) => ((a.reportOrder || 0) - (b.reportOrder || 0))

export default {
  name: 'LandReport',
  components: {
    GaugeProgress,
    RichTextEditModal
  },
  data () {
    return {
      loading: false,
      introduction: landReportIntroDefault
    }
  },
  computed: {
    ...mapState({
      currentProperty: state => state.portfolio.currentProperty.property,
      surveyAnswer: state => state.portfolio.currentProperty.surveyAnswer
    }),
    ...mapGetters([
      'isAdmin'
    ]),
    landScores () {
      let value = {
        value: 0,
        max: 10,
        level: '',
        image: require('@/assets/images/mountain_icon.png'),
        sections: [
          {
            value: 0,
            max: 10,
            code: 'planning',
            title: 'Planning',
            image: require('@/assets/images/note_icon.png')
          },
          {
            value: 0,
            max: 10,
            code: 'topography',
            title: 'Topography',
            image: require('@/assets/images/topography_icon.png')
          },
          {
            value: 0,
            max: 10,
            code: 'performance',
            title: 'Performance',
            image: require('@/assets/images/line_chart_icon.png')
          },
          {
            value: 0,
            max: 10,
            code: 'improvements',
            title: 'Improvements',
            image: require('@/assets/images/hammer_icon.png')
          }
        ]
      }
      if (this.currentProperty) {
        value.value = parseFloat(this.currentProperty.scores.land.score.value)
        value.max = parseFloat(this.currentProperty.scores.land.score.max)
        value.sections.forEach(section => {
          let score = this.getLandScores(section.code)
          section.value = score.value
          section.max = score.max
        })
        if (value.value < 4) {
          value.level = 'POOR'
        } else if (value.value < 7) {
          value.level = 'GOOD'
        } else {
          value.level = 'EXCELLENT'
        }
      }
      return value
    },
    overviewComments () {
      if (this.surveyAnswer) {
        return lget(this.surveyAnswer, 'responses', [])
          .filter(response => response.questionModule === 'land' && response.keyFeature === true)
          .sort(compareQuestions)
          .map(response => response.responseCommentary)
      }
      return []
    },
    entertainment () {
      let value = [
        {
          code: 'upsq11',
          text: 'Pool',
          isInclude: false
        },
        {
          code: 'upsq38',
          text: 'Spa',
          isInclude: false
        },
        {
          code: 'upsq31',
          text: 'Inclinator',
          isInclude: false
        },
        {
          code: 'upsq12',
          text: 'Tennis Court',
          isInclude: false
        }
      ]
      if (this.surveyAnswer) {
        let responses = lget(this.surveyAnswer, 'responses', []).filter(r => r.questionModule === 'land')
        value.forEach(ent => {
          let matchedResponse = responses.find(response => {
            if (response.questionCode) {
              if (response.questionCode.toLowerCase() === ent.code) {
                return true
              }
            }
          })
          if (matchedResponse) {
            if (matchedResponse.responseCode && matchedResponse.responseCode.toLowerCase() === ent.code + 'r1') {
              ent.isInclude = true
            }
          }
        })
      }
      return value
    },
    externalStructures () {
      const externalStructures = [
        ['UPSQ14', 'UPSQ24', 'UPSQ25', 'UPSQ26', 'UPSQ29', 'Pool House/Cabana'],
        ['UPSQ13', 'UPSQ20', 'UPSQ21', 'UPSQ22', 'UPSQ30', 'Granny Flat']
      ].map(qcodes => {
        const item = {
          name: qcodes[5],
          value: lget(this.getResponseByCode(qcodes[0]), 'responseCode', null) === `${qcodes[0]}R1`
        }
        item.bathroom = item.value ? lget(this.getResponseByCode(qcodes[1]), 'responseCode', null) === `${qcodes[1]}R1` : null
        item.kitchenette = item.value ? lget(this.getResponseByCode(qcodes[2]), 'responseCode', null) === `${qcodes[2]}R1` : null
        item.separateRoom = item.value ? lget(this.getResponseByCode(qcodes[3]), 'responseCode', null) === `${qcodes[3]}R1` : null
        item.cupboard = item.value ? lget(this.getResponseByCode(qcodes[4]), 'responseCode', null) === `${qcodes[4]}R4` : null
        return item
      })
      return externalStructures
    },
    measureUnit () {
      const dataRecords = lget(this.currentProperty, 'externalData[0].dataRecords', null)
      if (dataRecords) {
        return dataRecords.unit
      }
      return null
    },
    councilData () {
      const dataRecords = lget(this.currentProperty, 'externalData[0].dataRecords', null)
      if (dataRecords) {
        return [
          {
            name: 'Lot Number',
            value: dataRecords.lot
          }, {
            name: 'Land Size',
            value: dataRecords.lotSize
          }, {
            name: 'Property Type',
            value: dataRecords.propertyType
          }, {
            name: 'Bush Fire Risk',
            value: dataRecords.bushFireProne === 'True' ? 'Be Bush Fire Prone' : 'Not Bush Fire Prone'
          }, {
            name: 'Waste Service Type',
            value: dataRecords.wasteType
          }, {
            name: 'Waste Collection Day',
            value: dataRecords.wasteCollectionDay
          }, {
            name: 'State Electorate',
            value: dataRecords.stateElectDiv
          }, {
            name: 'Federal Electorate',
            value: dataRecords.cwlthElectDiv
          }, {
            name: 'Ward',
            value: dataRecords.ward
          }, {
            name: 'Heritage Item',
            value: dataRecords.heritageItem || 'No'
          }, {
            name: 'Heritage Conservation Area',
            value: dataRecords.heritageConservationArea || 'No'
          }, {
            name: 'Zoning',
            value: dataRecords.zone
          }
        ]
      }
      return null
    },
    planningInfo () {
      return lget(this.surveyAnswer, 'responses', [])
        .filter(r => r.questionCategory === 'planning-info')
        .sort(compareQuestions)
        .map(r => r.responseCommentary)
    },
    accessShapeSections () {
      return [
        {
          name: 'Land Shape and Terrain', category: 'land-shape'
        }, {
          name: 'Access to Street', category: 'access-to-street'
        }, {
          name: 'Street Features', category: 'street-features'
        }
      ].map(section => {
        const responses = lget(this.surveyAnswer, 'responses', []).filter(r => r.questionCategory === section.category)
        if (responses.length) {
          return {
            name: section.name,
            comments: responses.sort(compareQuestions).map(r => r.responseCommentary)
          }
        }
        return null
      }).filter(o => o)
    },
    privacyLiveabilitySections () {
      return [
        {
          name: 'Background Noise', category: 'background-noise'
        }, {
          name: 'Privacy and Shade', category: 'privacy-shade'
        }, {
          name: 'Fencing and Driveway', category: 'fencing-driveway'
        }
      ].map(section => {
        const responses = lget(this.surveyAnswer, 'responses', []).filter(r => r.questionCategory === section.category)
        if (responses.length) {
          return {
            name: section.name,
            comments: responses.sort(compareQuestions).map(r => r.responseCommentary)
          }
        }
        return null
      }).filter(o => o)
    },
    treesGardensSections () {
      return [
        {
          name: 'Trees', category: 'trees'
        }, {
          name: 'Gardens', category: 'gardens'
        }
      ].map(section => {
        const responses = lget(this.surveyAnswer, 'responses', []).filter(r => r.questionCategory === section.category)
        if (responses.length) {
          return {
            name: section.name,
            comments: responses.sort(compareQuestions).map(r => r.responseCommentary)
          }
        }
        return null
      }).filter(o => o)
    },
    improvementsSections () {
      return [
        {
          name: 'Pool', category: 'pool'
        }, {
          name: 'Poolhouse/Cabana', category: 'pool-house'
        }, {
          name: 'Granny Flat', category: 'granny-flat'
        }, {
          name: 'Tennis Court', category: 'tennis-court'
        }, {
          name: 'Water Features', category: 'water-features'
        }
      ].map(section => {
        const responses = lget(this.surveyAnswer, 'responses', []).filter(r => r.questionCategory === section.category)
        if (responses.length) {
          return {
            name: section.name,
            comments: responses.sort(compareQuestions).map(r => r.responseCommentary)
          }
        }
        return null
      }).filter(o => o)
    },
    landMapUrl () {
      return getLandMapImageUrl(lget(this.currentProperty, 'externalData[0].dataRecords.lot', null))
    },
    propertyLocation () {
      return lget(this.currentProperty, 'geometry.location', null)
    }
  },
  mounted () {
    this.introduction = lget(this.currentProperty, 'landReportIntroduction', landReportIntroDefault)
  },
  methods: {
    getResponseByCode (qcode) {
      return lget(this.surveyAnswer, 'responses', []).find(response => response.questionCode === qcode)
    },
    getLandScores (_section = null) {
      let score = {
        value: 0,
        max: 10
      }
      if (_section) {
        let sectionScore = this.currentProperty.scores.land.sections.find(s => s.section === _section)
        if (sectionScore) {
          score.value = parseFloat(sectionScore.score.value)
          score.max = parseFloat(sectionScore.score.max)
        }
      }
      return score
    },
    onIntroductionSave (text) {
      this.introduction = text
      this.$store.dispatch(UPDATE_PROPERTY_DETAIL, {landReportIntroduction: text})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.land-report {
  text-align: center;
  max-width: 840px;
  margin: 0 auto;
  padding-bottom: 100px;

  .section-title-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
  }

  .text-outline {
    border: 1px solid $housepro-primary-color;
  }

  table.simple-table {
    border-collapse: collapse;
    margin-top: 4px;
    margin-bottom: 16px;

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
