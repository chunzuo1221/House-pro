<template>
  <section class="house-report">
    <h1 class="my-4">HOUSE ANALYSIS</h1>
    <gauge-progress
      id="overall-house-score"
      :value="overallHouseScore.value"
      :maxValue="overallHouseScore.maxValue"
      :height="150"
    >
      <image slot="icon" :href="overallHouseScore.icon" x="9" y="7" height="18px" width="18px"/>
    </gauge-progress>
    <div class="primary--text">HousePro has analysed the house at <strong>{{currentProperty.name}}</strong></div>
    <div class="my-1">In our opinion the house at this property is</div>
    <h1 class="text-uppercase primary--text">{{overallHouseScore.grade}}</h1>
    <v-divider class="mt-4"></v-divider>
    <p class="my-3" v-html="introduction"></p>
    <rich-text-edit-modal
      v-if="isAdmin"
      title="House Report Introduction"
      :default-text="introduction"
      @save="onIntroductionSave"
    />
    <v-divider class="mt-3 mb-5"></v-divider>
    <h2 class="text-uppercase">The house at {{currentProperty.name}}</h2>
    <v-layout row wrap d-flex justify-space-around>
      <v-flex xs4 px-5 pt-4 v-for="section in houseSections" :key="section.code">
        <div class="section-title-box">
          <h3 class="primary--text">{{section.text}}</h3>
          <v-tooltip bottom class="ml-1">
            <v-icon
              slot="activator"
              :size="20"
            >help_outline</v-icon>
            <span>{{section.text}}</span>
          </v-tooltip>
        </div>
        <gauge-progress
          :id="`house-${section.code}-score`"
          :value="section.value"
          :maxValue="section.maxValue"
        >
          <image slot="icon" :href="section.icon" x="10" y="10" height="16px" width="16px"/>
        </gauge-progress>
      </v-flex>
    </v-layout>

    <div v-if="surveyComments.length">
      <h2 class="mt-5 mb-3">OVERVIEW</h2>
      <div
        v-for="(comment, index) in surveyComments"
        :key="index"
        class="bullet text-xs-left"
      >
        <v-icon class="pl-3 pr-1" color="primary">mdi-circle-medium</v-icon>
        <span>{{comment}}</span>
      </div>
    </div>
    <div v-if="floorplans.length">
      <h2 class="mt-5 mb-3">FLOOR PLAN</h2>
      <v-img
        v-for="(floorplan, index) in floorplans"
        :key="index"
        :src="floorplan"
        class="my-5"
      ></v-img>
    </div>
    <div class="my-5">
      <h2 class="my-4">FLOOR PLAN BREAKDOWN</h2>
      <div class="text-xs-center" v-if="floorArea">
        <span class="text-outline primary--text py-2 px-4">{{floorArea}}</span>
      </div>
      <v-layout row wrap my-5>
        <v-flex xs12 sm6 pr-3 class="inherit-height">
          <h4 class="text-xs-left primary--text">Main Living Spaces</h4>
          <table class="simple-table full-height-table" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>Room</th>
                <th>Included</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in livingSpaces" :key="index">
                <td>{{item.text}}</td>
                <td>
                  <v-icon v-if="item.included === true" color="primary">mdi-check-circle</v-icon>
                  <v-icon v-else-if="item.included === false" color="gray">mdi-close-circle</v-icon>
                  <strong v-else class="primary--text">{{item.included}}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </v-flex>
        <v-flex xs12 sm6 pl-3 fill-height>
          <v-layout row wrap fill-height>
            <v-flex xs12>
              <h4 class="text-xs-left primary--text">Floors</h4>
              <table class="simple-table" width="100%" cellspacing="0">
                <tbody>
                  <tr v-for="(floor, index) in floors" :key="index">
                    <td class="py-1">{{floor}}</td>
                  </tr>
                </tbody>
              </table>
            </v-flex>
            <v-flex xs12>
              <h4 class="text-xs-left primary--text">Kitchen</h4>
              <table class="simple-table" width="100%" cellspacing="0">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(feature, index) in kitchenFeatures" :key="index">
                    <td>{{feature.name}}</td>
                    <td>{{feature.value}}</td>
                  </tr>
                </tbody>
              </table>
            </v-flex>
            <v-flex xs12>
              <h4 class="text-xs-left primary--text">Garage</h4>
              <table class="simple-table" width="100%" cellspacing="0">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody v-if="garage">
                  <tr v-for="(feature, index) in garage" :key="index">
                    <td>{{feature.name}}</td>
                    <td>{{feature.value}}</td>
                  </tr>
                </tbody>
              </table>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
    <div class="my-5">
      <h2 class="my-4">LIVING AREAS</h2>
      <h4 class="text-xs-left primary--text">Bedrooms</h4>
      <table class="simple-table" width="100%" cellspacing="0">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Ensuite</th>
            <th>Walk-In Wardrobe</th>
            <th>Built in Cupboards</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bedroom, index) in bedrooms" :key="index">
            <td align="left" valign="center" class="pl-3">
              <v-icon v-if="bedroom.value" color="primary">mdi-check-circle</v-icon>
              <v-icon v-else color="gray">mdi-close-circle</v-icon>
              <span :class="bedroom.value ? 'primary--text' : 'gray--text'" class="pl-2">{{bedroom.name}}</span>
            </td>
            <td>
              <v-icon v-if="bedroom.ensuite === true" color="primary">mdi-check</v-icon>
              <v-icon v-else-if="bedroom.ensuite === false" color="primary">mdi-window-close</v-icon>
              <v-icon v-else color="gray">mdi-minus</v-icon>
            </td>
            <td>
              <v-icon v-if="bedroom.wardrobe === true" color="primary">mdi-check</v-icon>
              <v-icon v-else-if="bedroom.wardrobe === false" color="primary">mdi-window-close</v-icon>
              <v-icon v-else color="gray">mdi-minus</v-icon>
            </td>
            <td>
              <v-icon v-if="bedroom.cupboard === true" color="primary">mdi-check</v-icon>
              <v-icon v-else-if="bedroom.cupboard === false" color="primary">mdi-window-close</v-icon>
              <v-icon v-else color="gray">mdi-minus</v-icon>
            </td>
          </tr>
        </tbody>
      </table>
      <v-layout row wrap>
        <v-flex xs12 sm6 pr-3 pt-4>
          <h4 class="text-xs-left primary--text">Bathrooms</h4>
          <table class="simple-table" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>Type</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bathroom, index) in bathrooms" :key="index">
                <td>{{bathroom.type}}</td>
                <td>{{bathroom.comment}}</td>
              </tr>
            </tbody>
          </table>
        </v-flex>
        <v-flex xs12 sm6 pl-3 pt-4>
          <h4 class="text-xs-left primary--text">Extra Features</h4>
          <table class="simple-table full-height-table" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>Type</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(feature, index) in extraFeatures" :key="index">
                <td>{{feature.type}}</td>
                <td>
                  <v-icon v-if="feature.comment === true" color="primary">mdi-check-circle</v-icon>
                  <v-icon v-else-if="feature.comment === false" color="gray">mdi-close-circle</v-icon>
                  <span v-else>{{feature.comment}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </v-flex>
      </v-layout>
    </div>
    <div class="my-5">
      <h2 class="my-5">FLOOR SUMMARY</h2>
      <div v-for="(section, sectionIndex) in floorSummarySections" :key="sectionIndex" class="mt-5 mb-3">
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
    <div class="my-5">
      <h2 class="my-5">HOUSE DETAIL</h2>
      <div v-for="(section, sectionIndex) in houseDetailSections" :key="sectionIndex" class="mt-5 mb-3">
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
import { houseReportIntroDefault } from '@/data/introductions'

const grade = (score) => (+score < 4 ? 'Poor' : +score < 7 ? 'Good' : 'Excellent')
const compareQuestions = (a, b) => ((a.reportOrder || 0) - (b.reportOrder || 0))

export default {
  name: 'HouseReport',
  components: {
    GaugeProgress,
    RichTextEditModal
  },
  data () {
    return {
      widgets: [
        {
          code: 'design-liveability',
          text: 'Design and Liveability',
          icon: require('@/assets/images/compass.svg')
        }, {
          code: 'structure',
          text: 'Structure',
          icon: require('@/assets/images/piramid.svg')
        }, {
          code: 'quality-condition',
          text: 'Quality and Condition',
          icon: require('@/assets/images/chart.svg')
        }, {
          code: 'inclusions',
          text: 'Inclusions',
          icon: require('@/assets/images/inclusions.svg')
        }, {
          code: 'external',
          text: 'External Features',
          icon: require('@/assets/images/backets.svg')
        }
      ],
      introduction: houseReportIntroDefault
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
    houseModuleScore () {
      return lget(this.currentProperty, 'surveyScores.modules', []).find(m => m.code === 'house')
    },
    overallHouseScore () {
      let value = +lget(this.houseModuleScore, 'score.value', 0)
      let maxValue = +lget(this.houseModuleScore, 'score.max', 10)
      return {
        value,
        maxValue,
        icon: require('@/assets/images/house.svg'),
        grade: grade(value)
      }
    },
    houseSections () {
      if (this.houseModuleScore && this.houseModuleScore.sections) {
        return this.widgets.map(widget => {
          const sectionWithscore = this.houseModuleScore.sections.find(s => s.code === widget.code)
          return {
            ...widget,
            value: +lget(sectionWithscore, 'score.value', 0),
            maxValue: +lget(sectionWithscore, 'score.max', 10)
          }
        })
      }
      return this.widgets.map(widget => {
        return {
          ...widget,
          value: 0,
          maxValue: 10
        }
      })
    },
    surveyComments () {
      if (this.surveyAnswer) {
        return lget(this.surveyAnswer, 'responses', [])
          .filter(response => response.questionModule === 'house' && response.keyFeature === true)
          .sort(compareQuestions)
          .map(response => response.responseCommentary)
      }
      return []
    },
    floorplans () {
      return lget(this.currentProperty, 'propertyImages', []).filter(o => o.type.toLowerCase() === 'floorplan').map(o => o.url)
    },
    floorArea () {
      return lget(this.getResponseByCode('DLQ01'), 'responseCommentary')
    },
    livingSpaces () {
      const items = ['DLQ16', 'DLQ17', 'DLQ18', 'DLQ19', 'DLQ27', 'DLQ28', 'DLQ30', 'DLQ34', 'DLQ35', 'DLQ49', 'DLQ70', 'DLQ53']
        .map(qcode => {
          const response = this.getResponseByCode(qcode)
          if (response) {
            return {
              text: response.questionText,
              included: response.responseCode === `${qcode}R1`
            }
          }
          return null
        })
        .filter(o => o !== null)
      items.push({
        text: 'Other Rooms',
        included: lget(this.surveyAnswer, 'responses', []).filter(response => ['DLQ50R1', 'DLQ51R1', 'DLQ52R1'].includes(response.responseCode)).length
      })
      return items
    },
    floors () {
      return [
        lget(this.getResponseByCode('DLQ05'), 'responseCode', null) === 'DLQ05R1' ? 'Third Floor' : '-',
        lget(this.getResponseByCode('DLQ04'), 'responseCode', null) === 'DLQ04R1' ? 'Second Floor' : '-',
        lget(this.getResponseByCode('DLQ03'), 'responseCode', null) === 'DLQ03R1' ? 'First Floor' : '-',
        lget(this.getResponseByCode('DLQ02'), 'responseCode', null) === 'DLQ02R1' ? 'Ground Floor' : '-',
        lget(this.getResponseByCode('DLQ06'), 'responseCode', null) === 'DLQ06R1' ? 'Lower 1 Floor' : '-',
        lget(this.getResponseByCode('DLQ07'), 'responseCode', null) === 'DLQ07R1' ? 'Lower 2 Floor' : '-',
        lget(this.getResponseByCode('DLQ08'), 'responseCode', null) === 'DLQ08R1' ? 'Lower 3 Floor' : '-'
      ]
    },
    kitchenFeatures () {
      return [
        {
          name: 'Pantry',
          value: lget(this.getResponseByCode('INQ01'), 'responseText', '')
        }, {
          name: 'Island Bench',
          value: lget(this.getResponseByCode('INQ49'), 'responseCode', null) === 'INQ49R1' ? 'Yes' : 'No'
        }, {
          name: 'Cooktop',
          value: lget(this.getResponseByCode('INQ48'), 'responseText', '')
        }
      ]
    },
    garage () {
      if (lget(this.getResponseByCode('DLQ09'), 'responseCode', null) === 'DLQ09R1') {
        return [
          {
            name: 'Garage Type',
            value: lget(this.getResponseByCode('DLQ10'), 'responseText', '')
          }, {
            name: 'Garage Spaces',
            value: lget(this.getResponseByCode('DLQ11'), 'responseText', '')
          }, {
            name: 'Garage Storage',
            value: lget(this.getResponseByCode('DLQ75'), 'responseText', '')
          }
        ]
      }
      return null
    },
    bedrooms () {
      const bedrooms = [
        // TODO: bedroom name should come from survey answer's question text so eventually it should be deleted
        ['DLQ42', 'INQ03', 'INQ04', 'INQ38', 'Master Bedroom (Bed 1)'],
        ['DLQ43', 'INQ05', 'INQ06', 'INQ39', 'Bed 2'],
        ['DLQ44', 'INQ08', 'INQ07', 'INQ40', 'Bed 3'],
        ['DLQ45', 'INQ09', 'INQ10', 'INQ41', 'Bed 4'],
        ['DLQ46', 'INQ11', 'INQ12', 'INQ42', 'Bed 5'],
        ['DLQ47', 'INQ14', 'INQ13', 'INQ43', 'Bed 6'],
        ['DLQ48', 'INQ16', 'INQ15', 'INQ44', 'Guest Bedroom']
      ].map(qcodes => {
        const item = {
          name: lget(this.getResponseByCode(qcodes[0]), 'questionText', null) || qcodes[4],
          value: lget(this.getResponseByCode(qcodes[0]), 'responseCode', null) === `${qcodes[0]}R1`
        }
        item.ensuite = item.value ? lget(this.getResponseByCode(qcodes[1]), 'responseCode', null) === `${qcodes[1]}R1` : null
        item.wardrobe = item.value ? lget(this.getResponseByCode(qcodes[2]), 'responseCode', null) === `${qcodes[2]}R1` : null
        item.cupboard = item.value ? lget(this.getResponseByCode(qcodes[3]), 'responseCode', null) !== `${qcodes[3]}R4` : null
        return item
      })
      return bedrooms
    },
    bathrooms () {
      return [
        {
          type: 'Powder Room',
          comment: lget(this.getResponseByCode('INQ02'), 'responseCode', null) === 'INQ02R1' ? '1' : '0'
        }, {
          type: 'Main Bathroom(s)',
          comment: lget(this.surveyAnswer, 'responses', []).filter(response => ['DLQ37R1', 'DLQ38R1', 'DLQ39R1'].includes(response.responseCode)).length
        }, {
          type: 'Ensuite(s)',
          comment: lget(this.surveyAnswer, 'responses', []).filter(response => ['INQ03R1', 'INQ05R1', 'INQ08R1', 'INQ09R1', 'INQ11R1', 'INQ14R1', 'INQ16R1'].includes(response.responseCode)).length
        }, {
          type: 'Separate Toilet(s)',
          comment: lget(this.surveyAnswer, 'responses', []).filter(response => ['DLQ40R1', 'DLQ41R1'].includes(response.responseCode)).length
        }, {
          type: 'Toilet/Shower/Bath in Laundry',
          comment: lget(this.getResponseByCode('DLQ36'), 'responseCode', null) === 'DLQ36R1' ? '1' : '0'
        }
      ]
    },
    extraFeatures () {
      return [
        {
          type: 'Elevator',
          comment: lget(this.getResponseByCode('INQ46'), 'responseCode', null) === 'INQ46R1'
        }, {
          type: 'Extra Internal Storage',
          comment: lget(this.getResponseByCode('INQ45'), 'responseCode', null) !== 'INQ45R6'
        }, {
          type: 'Rooms w/ access to a balcony',
          comment: lget(this.getResponseByCode('INQ17'), 'responseText', '')
        }, {
          type: 'Laundry External Access',
          comment: lget(this.getResponseByCode('DLQ21'), 'responseCode', null) === 'DLQ21R1'
        }
      ]
    },
    floorSummarySections () {
      const floorSummarySections = []
      const sections = [
        { qcode: 'DLQ02', name: 'Ground Floor', category: 'ground-floor' },
        { qcode: 'DLQ03', name: 'First Floor', category: '1st-floor' },
        { qcode: 'DLQ04', name: 'Second Floor', category: '2nd-floor' },
        { qcode: 'DLQ05', name: 'Third Floor', category: '3rd-floor' },
        { qcode: 'DLQ06', name: 'Lower First Floor', category: 'lower-1st-floor' },
        { qcode: 'DLQ07', name: 'Lower 2nd Floor', category: 'lower-2nd-floor' },
        { qcode: 'DLQ08', name: 'Lower 3rd Floor', category: 'lower-3rd-floor' }
      ]
      sections.forEach(section => {
        const responses = lget(this.surveyAnswer, 'responses', []).filter(r => r.questionCategory === section.category)
        if (responses.length) {
          floorSummarySections.push({
            name: section.name,
            comments: responses.sort(compareQuestions).map(r => r.responseCommentary)
          })
        }
      })
      return floorSummarySections
    },
    houseDetailSections () {
      const sections = []
      const response = this.getResponseByCode('DLQ23')

      if (lget(response, 'responseCode', null) === 'DLQ23R1') {
        const comments = lget(this.surveyAnswer, 'responses', [])
          .filter(r => r.questionCategory === 'kitchen-laundry')
          .sort(compareQuestions)
          .map(r => r.responseCommentary)
        sections.push({
          name: 'Kitchen/Laundry',
          comments
        })
      }
      [
        { name: 'Main Living Area', category: 'main-living-area' },
        { name: 'Outdoor Entertaining', category: 'outdoor-entertaining' },
        { name: 'Bathrooms', category: 'bathrooms' },
        { name: 'Bedrooms', category: 'bedrooms' },
        { name: 'Features', category: 'features' },
        { name: 'Internal Storage', category: 'internal-storage' },
        { name: 'Solar Access & Lighting', category: 'solar-access-lighting' },
        { name: 'Doors & Windows', category: 'doors-windows' },
        { name: 'Studio', category: 'studio' },
        { name: 'Exterior', category: 'exterior' },
        { name: 'Roof', category: 'roof' }
      ].forEach(section => {
        const responses = lget(this.surveyAnswer, 'responses', []).filter(r => r.questionCategory === section.category)
        if (responses.length) {
          sections.push({
            name: section.name,
            comments: responses.sort(compareQuestions).map(r => r.responseCommentary)
          })
        }
      })
      return sections
    }
  },
  mounted () {
    this.introduction = lget(this.currentProperty, 'houseReportIntroduction', houseReportIntroDefault)
  },
  methods: {
    getResponseByCode (qcode) {
      return lget(this.surveyAnswer, 'responses', []).find(response => response.questionCode === qcode)
    },
    onIntroductionSave (text) {
      this.introduction = text
      this.$store.dispatch(UPDATE_PROPERTY_DETAIL, {houseReportIntroduction: text})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.house-report {
  text-align: center;
  max-width: 800px;
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
  .inherit-height {
    height: inherit;
  }
  .full-height-table {
    height: calc(100% - 45px);
  }
  .bullet {
    display: flex;
    align-items: flex-start;
    position: relative;
    padding-top: 16px;
  }
}
</style>
