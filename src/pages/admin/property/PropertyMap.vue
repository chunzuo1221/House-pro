<template>
  <div class="property-map-page">
    <div class="div-map mb-1">
      <MapLoader :map-config="bounds">
        <PropertyMapMarker v-for="property in suburbProperties" :key="property._id" :property="property" @added-marker="onAddedMarker"></PropertyMapMarker>
      </MapLoader>
    </div>
    <div class="pri-pad row">
      <div class="col-sm-2 pl-2">
        <el-select
          v-model="postCode"
          @change="onChangePostCode"
          class="fluid"
          placeholder="Select Postal Code"
        >
          <el-option v-for="item in suburbPostCodes" :key="item._id" :label="item.postCode" :value="item.postCode"/>
        </el-select>
      </div>
      <div class="col-sm-2 pl-2">
        <el-select
          v-model="selectedModule"
          @change="onChangeModule"
          class="fluid"
          placeholder="Select Units"
        >
          <el-option v-for="item in moduleOptions" :key="item.value" :label="item.text" :value="item.value"/>
        </el-select>
      </div>
      <div class="col-sm-2 pl-2">
        <el-select
          v-model="selectedAnalysisType"
          @change="onChangeAnalysisType"
          class="fluid"
          placeholder="Select Units"
        >
          <el-option v-for="item in analysisTypeOptions" :key="item.value" :label="item.text" :value="item.value"/>
        </el-select>
      </div>
      <div class="col-sm-5 col-sm-offset-1 pl-2 checkbox-wrap">
        <input
          id="showClonedProperty"
          type="checkbox"
          v-model="showClonedProperty"
          @change="onChangeShowCloned"
        >
        <span class="control-label ml-2">Show Properties with cloned Position data</span>
      </div>
      <div class="col-sm-12 mt-3">
        <div class="progress-bar-wrapper">
          <vue-progress-bar/>
        </div>
        <vue-good-table
          :columns="columns"
          :rows="tableData"
          :lineNumbers="true"
          styleClass="vgt-table condensed"
          :pagination-options="{ enabled: true, mode: 'records' }"
          :sort-options="{ enabled: true, initialSortBy: columns.length ? {field: columns[columns.length - 1].field, type: 'desc'} : {} }"
        >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'formattedAddress'">
              <router-link class="" :to="{ name: 'Property', params: { propertyId: props.row.propertyId }}">{{ props.formattedRow[props.column.field] }}</router-link>
            </span>
            <span v-else-if="props.column.field == 'survey'">
              <button class="btn btn-primary" @click="loadSurveyAnswers(props.row.propertyId)">...</button>
            </span>
            <span v-else-if="props.column.field == 'locked'">
              <toggle-button
                v-model="props.formattedRow[props.column.field]"
                :sync="true"
                :color="toggleColor"
                :disabled="true"/>
            </span>
            <span v-else>
              {{ props.formattedRow[props.column.field] }}
            </span>
          </template>
        </vue-good-table>
      </div>
    </div>
    <clip-loader :loading="isProcessing"></clip-loader>
    <modal name="surveyManagerModal" class="survey-manager-modal" height="auto">
      <div class="modal-title">Survey Manager</div>
      <div class="modal-content">
        <div class="mb-1"><b>The following surveys have been collected for this property:</b></div>
        <table class="survey-manager-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Location</th>
              <th>Land</th>
              <th>House</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in surveyAnswers" :key="row._id">
              <td>{{ row.userId }}</td>
              <td>{{ row.location }}</td>
              <td>{{ row.land }}</td>
              <td>{{ row.house }}</td>
              <td>
                <toggle-button :name="row._id" v-model="surveyAnswersStatus[row._id]" @change="onChangeSurveyStatus(row._id, $event)" :sync="true" :labels="true"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import MapLoader from '@/components/map/MapLoader'
import PropertyMapMarker from '@/components/map/PropertyMapMarker'
import PropertyApi from '@/api/properties'
import SuburbApi from '@/api/suburbs'
import AnswerApi from '@/api/survey/answer'
import { VueGoodTable } from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import {
  FETCH_QUESTION_CLASSIFICATION,
  FETCH_ANALYSIS_TYPES
} from '@/store/action-types'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)

export default {
  name: 'PropertyMap',
  components: {
    MapLoader,
    PropertyMapMarker,
    VueGoodTable,
    ClipLoader
  },
  data () {
    return {
      map: null,
      google: null,
      propertyScores: [],
      selectedModule: 'location',
      selectedAnalysisType: 'all',
      markers: [],
      showClonedProperty: false,
      surveyAnswers: [],
      surveyAnswersStatus: {},
      isProcessing: false,
      suburbPostCodes: [],
      postCode: '',
      selectedPropertyId: '',
      suburbProperties: [],
      toggleColor: {checked: 'red', unchecked: '#25EF02'}
    }
  },
  computed: {
    ...mapState({
      referenceData: state => state.reference
    }),
    moduleOptions () {
      let options = []
      if (this.referenceData && this.referenceData.questionClassification && this.referenceData.questionClassification.modules) {
        const modules = this.referenceData.questionClassification.modules.map(o => ({ value: o.code, text: o.text }))
        if (modules.length) {
          options = options.concat(modules)
        }
      }
      return options
    },
    analysisTypeOptions () {
      let options = [{ value: 'all', text: 'All' }]
      if (this.referenceData && this.referenceData.analysisTypes && this.referenceData.analysisTypes.types) {
        const analysisTypes = this.referenceData.analysisTypes.types.map(o => ({ value: o.code, text: o.text }))
        if (analysisTypes.length) {
          options = options.concat(analysisTypes)
        }
      }
      return options
    },
    columns () {
      const columns = []
      if (this.referenceData && this.referenceData.questionClassification && this.referenceData.questionClassification.modules) {
        columns.push(
          this.columnMetadata('Address', 'formattedAddress', 'string'),
          this.columnMetadata('Survey', 'survey', 'string', false),
          this.columnMetadata('Locked', 'locked', 'boolean')
        )
        const moduleMetadata = this.referenceData.questionClassification.modules.find(m => m.code === this.selectedModule)
        moduleMetadata.sections.forEach(s => {
          if (s.code !== 'bonus') {
            columns.push(this.columnMetadata(s.text, s.code))
          }
        })
        if (this.selectedModule === 'location') {
          columns.push(
            this.columnMetadata('Schools', 'school'),
            this.columnMetadata('Parks', 'park'),
            this.columnMetadata('Shopping', 'shopping'),
            this.columnMetadata('Medical', 'medical'),
            this.columnMetadata('Public Transport', 'publicTransport'),
            this.columnMetadata('Position', 'position'),
            this.columnMetadata('Access To Services', 'accessservice')
          )
        }
        columns.push({
          label: 'Overall',
          field: 'overall',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align vgt-middle-align',
          type: 'number'
        })
      }
      return columns
    },
    tableData () {
      let collection = []
      if (this.suburbProperties.length) {
        collection = this.suburbProperties.map(p => {
          const row = {
            propertyId: p._id,
            formattedAddress: p.formatted_address,
            locked: p.locked || false
          }
          if (this.selectedModule === 'location') {
            const moduleScore = p.locationScores.position
            if (moduleScore) {
              moduleScore.sections.forEach(s => {
                row[s.section] = s.score.value
              })
            }
            const accessservice = p.locationScores.accessservice
            row.school = this.getServiceScore(accessservice.services, 'school')
            row.park = this.getServiceScore(accessservice.services, 'park')
            row.shopping = this.getServiceScore(accessservice.services, 'shopping')
            row.medical = this.getServiceScore(accessservice.services, 'medical')
            row.publicTransport = this.getServiceScore(accessservice.services, 'public-transport')
            row.position = p.locationScores.position.score.value
            row.accessservice = p.locationScores.accessservice.score.value
            row.overall = p.locationScores.overall.value
          } else if (p.surveyScores) {
            const moduleScore = p.surveyScores.modules.find(o => o.code === this.selectedModule)
            moduleScore.sections.forEach(s => {
              row[s.code] = s.score.value
            })
            row.overall = moduleScore.score.value
          }
          return row
        })
      }
      return collection
    },
    bounds () {
      const bounds = []
      this.suburbProperties.forEach(o => {
        if (o.geometry) {
          bounds.push({lat: o.geometry.location.lat, lng: o.geometry.location.lng})
        }
      })
      return bounds
    }
  },
  mounted () {
    Promise.all([
      this.$store.dispatch(FETCH_QUESTION_CLASSIFICATION),
      this.$store.dispatch(FETCH_ANALYSIS_TYPES),
      SuburbApi.getSuburbPostCodes()
        .then((response) => {
          this.suburbPostCodes = response.sort((a, b) => a.postCode - b.postCode)
          this.postCode = response[0].postCode
          this.loadProperties()
        })
    ])
  },
  methods: {
    columnMetadata (label, field, type = 'number', sortable = true) {
      return {
        label,
        field,
        thClass: 'vgt-center-align',
        tdClass: 'vgt-center-align vgt-middle-align',
        type,
        sortable
      }
    },
    getServiceScore (services, serviceType) {
      if (services) {
        const service = services.find(o => o.serviceType === serviceType)
        if (service) {
          return service.value
        }
      }
      return 0
    },
    async loadSurveyAnswers (propertyId) {
      try {
        this.selectedPropertyId = propertyId
        this.isProcessing = true
        this.surveyAnswers = await AnswerApi.getAnswers(propertyId)
        this.isProcessing = false
        const states = {}
        this.surveyAnswers.forEach((surveyAnswer) => {
          states[surveyAnswer._id] = surveyAnswer.surveyStatus === 'published'
        })
        this.surveyAnswersStatus = states
        this.$modal.show('surveyManagerModal')
      } catch (error) {
        console.log(error)
      } finally {
        this.isProcessing = false
      }
    },
    async loadProperties () {
      this.$Progress.start()
      try {
        this.propertyScores = []
        this.propertyScores = await PropertyApi.getSuburbScores(this.postCode)
        this.updateSuburbProperties()
      } finally {
        this.$Progress.finish()
      }
    },
    onAddedMarker (value) {
      this.markers.push(value)
    },
    removeMarkers () {
      this.markers.forEach((marker) => {
        marker.setMap(null)
      })
      this.markers = []
    },
    async onChangeSurveyStatus (surveyAnswerId, event) {
      const surveyStatus = event.value
      const states = {}
      this.surveyAnswers.forEach((surveyAnswer) => {
        states[surveyAnswer._id] = false
      })
      try {
        const response = await AnswerApi.publishAnswer(
          surveyAnswerId,
          {
            surveyStatus,
            propertyId: this.selectedPropertyId
          }
        )
        const index = this.propertyScores.findIndex(o => o._id === this.selectedPropertyId)
        this.propertyScores.splice(index, 1, response)
        states[surveyAnswerId] = surveyStatus
        this.surveyAnswersStatus = states
        this.$modal.hide('surveyManagerModal')
      } catch (error) {
        console.log(error)
        states[surveyAnswerId] = !surveyStatus
        this.surveyAnswersStatus = states
      }
    },
    onChangePostCode () {
      this.loadProperties()
    },
    updateSuburbProperties () {
      this.removeMarkers()
      this.suburbProperties = []
      setTimeout(() => {
        this.suburbProperties = this.propertyScores.filter(p => {
          if (!this.showClonedProperty && p.clonedFrom) {
            return false
          }
          if (this.selectedModule === 'location') {
            return p.locationScores
          }
          if (p.surveyScores && p.surveyScores.modules) {
            return p.surveyScores.modules.some(m => {
              if (this.selectedAnalysisType !== 'all') {
                if (p.surveyScores.analysisType !== this.selectedAnalysisType) {
                  return false
                }
              }
              return m.code === this.selectedModule
            })
          }
          return false
        })
      }, 100)
    },
    onChangeModule () {
      this.updateSuburbProperties()
    },
    onChangeAnalysisType () {
      this.updateSuburbProperties()
    },
    onChangeShowCloned () {
      this.updateSuburbProperties()
    }
  }
}
</script>

<style scoped>
.pri-pad {
  margin-left: 0px;
  margin-right: 0px;
}
.checkbox-wrap input+span:before{
  top: 4px;
}
.checkbox-wrap {
  margin-top: 0;
}
.modal-content {
  padding: 16px;
  box-shadow: none;
  border: none;
}
.modal-title {
  height: 50px;
  background-color: #528EC1;
  color: #FFF;
  font-weight: bold;
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-top: 5px;
}
.survey-manager-table th{
  text-align: center;
  vertical-align: middle;
}
.survey-manager-table td{
  text-align: center;
  vertical-align: middle;
}
.spiner-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top:0;
  z-index: 99999;
  background-color: #000000;
  opacity: 0.1;
}
.v-spinner {
  position: fixed;
  top:50%;
  left: 50%;
  z-index: 99999;
  display: flex;
  align-items: center;
}
</style>
