<template>
  <div class="question-edit-page">
    <div class="container">
      <div class="pri-pad">
        <div class="d-flex flex-column">
          <h3 class="text-left">
            {{questionId ? 'Edit' : 'Add'}} Survey Question
          </h3>
          <hr class="green-line"/>
        </div>
        <div class="row form-group">
          <div class="col-sm-12 d-flex align-center">
            <label class="control-label" for="question">Question:</label>
            <input type="text" class="form-control" v-model="questionText" id="question" placeholder="Enter question" name="question">
          </div>
        </div>
        <div class="row form-group">
          <div class="col-sm-5 d-flex align-center">
            <label class="control-label" for="shortText">Short Text:</label>
            <input type="text" class="form-control" v-model="shortText" id="shortText" placeholder="Enter question" name="shortText">
          </div>
        </div>
        <div class="row form-group">
          <div class="col-md-3 col-xs-6">
            <div class="checkbox-wrap">
              <input type="checkbox" v-model="summaryQuestion" checked>
              <span class="control-label">Display in Summary</span>
            </div>
          </div>
          <div class="col-sm-3 col-xs-6">
            <div class="checkbox-wrap">
              <input type="checkbox" v-model="adjustmentQuestion" checked>
              <span class="control-label">Bonus Adjustment?</span>
            </div>
          </div>
          <div class="col-md-3 col-xs-6">
            <div class="checkbox-wrap">
              <input type="checkbox" v-model="keyFeature" checked>
              <span class="control-label">Key Feature:</span>
            </div>
          </div>
          <div class="col-sm-3 col-xs-6">
            <div class="checkbox-wrap">
              <input type="checkbox" v-model="displayInReport" checked>
              <span class="control-label">Display in Report</span>
            </div>
          </div>
        </div>

        <div class="row form-group">
          <div class="col-sm-4 mt-2 d-flex align-center">
            <label class="control-label" for="moduleFilter">Module:</label>
            <el-select
              id="moduleFilter"
              v-model="questionModule"
              class="fluid"
              placeholder="Select Module"
              noDataText="No data"
              @change="onSelectModule"
            >
              <el-option v-for="item in moduleOptions" :key="item.value" :label="item.text" :value="item.value"/>
            </el-select>
          </div>
          <div class="col-sm-4 mt-2 d-flex align-center">
            <label class="control-label" for="sectionFilter">Section:</label>
            <el-select
              id="sectionFilter"
              v-model="questionSection"
              class="fluid"
              placeholder="Select Section"
              noDataText="No data"
              @change="onSelectSection"
            >
              <el-option v-for="item in sectionOptions" :key="item.value" :label="item.text" :value="item.value"/>
            </el-select>
          </div>
          <div class="col-sm-4 mt-2 d-flex align-center">
            <label class="control-label" for="pwd">Category:</label>
            <el-select
              v-model="questionCategory"
              class="fluid"
              placeholder="Select Category"
              noDataText="No data"
            >
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.text" :value="item.value"/>
            </el-select>
          </div>
        </div>
        <div class="row form-group">
          <div class="col-md-6 mt-2 d-flex align-center">
            <label class="control-label">Best Source:</label>
            <el-select
              v-model="bestSource"
              multiple
              class="fluid"
              placeholder="Select Best Source"
              noDataText="No data"
            >
              <el-option
                v-for="type in bestSourceOptions"
                :key="type.value"
                :label="type.text"
                :value="type.value"
              />
            </el-select>
          </div>
          <div class="col-md-3 mt-2 d-flex align-center">
            <label class="control-label" for="questionCode">Code:</label>
            <input type="text" class="form-control" id="questionCode" v-model="questionCode" placeholder="Enter Code" name="code">
          </div>
          <div class="col-md-3 mt-2 d-flex align-center justify-end">
            <label class="control-label">Survey Order:</label>
            <input type="number" class="form-control" v-model="questionPageOrder" id="order" name="order">
          </div>
        </div>
        <div class="row form-group d-flex justify-end">
          <div class="col-md-3 mt-2 d-flex align-center">
            <label class="control-label">Report Order:</label>
            <input type="number" class="form-control" v-model="reportOrder" id="reportOrder" name="reportOrder">
          </div>
        </div>
         <!-- Property Applicability Rules Panel -->
        <div class="form-group">
          <div class="my-5">
            <h5> Property Applicability Rules </h5>
            <hr class="form-group mb-3"/>
          </div>
          <div class="row form-group">
            <div class="col-sm-6 d-flex align-center">
              <label class="control-label">Analysis Type:</label>
              <el-select
                v-model="analysisTypes"
                multiple
                class="fluid"
                placeholder="Select Analysis Types"
                noDataText="No data"
              >
                <el-option
                  v-for="type in analysisTypeOptions.types"
                  :key="type.code"
                  :label="type.text"
                  :value="type.code"
                />
              </el-select>
            </div>
            <div class="col-sm-6 d-flex align-center">
              <label class="control-label">Property Type:</label>
              <el-select
                v-model="propertyTypes"
                multiple
                class="fluid"
                placeholder="Select Property Types"
                noDataText="No data"
              >
                <el-option
                  v-for="type in propertyTypeOptions.types"
                  :key="type.code"
                  :label="type.text"
                  :value="type.code"
                />
              </el-select>
            </div>
          </div>
          <div class="row form-group">
            <div class="col-sm-3 d-flex align-center justify-end">
              <div class="checkbox-wrap">
                <input type="checkbox" v-model="propertyWithViews" >
                <span class="control-label">Properties with Views</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Question Inclusion/Exclusion Rules Panel -->
        <div class="row form-group">
          <div class="col-sm-12 mt-4">
            <h5>Question Inclusion / Exclusion Rules
              <small>(Questions will be included or excluded from the surveys based on the rules detailed below)</small>
            </h5>
            <hr class="form-group mb-3"/>
          </div>
          <div class="col-sm-4 d-flex align-center">
            <label class="control-label fluid">This question should be</label>
            <el-select
              v-model="dependentMode"
              placeholder="Select option"
              noDataText="No data"
            >
              <el-option
                v-for="mode in dependentModes"
                :key="mode.value"
                :label="mode.text"
                :value="mode.value"
              />
            </el-select>
          </div>
          <div class="col-sm-8 d-flex align-center">
            <label class="control-label fluid text-right">from the Suvery if the following question:</label>
            <v-suggestions
              v-model="dependentQuestionText"
              :options="suggestionOptions"
              :onInputChange="onQuestionInputChange"
              :onItemSelected="onQuestionItemSelected"
              class="fluid"
            >
              <div slot="item" slot-scope="props" class="">
                <span>{{props.item.text}}</span>
              </div>
            </v-suggestions>
          </div>
          <div class="col-sm-offset-4 col-sm-8 d-flex align-center mt-3">
            <label class="control-label fluid text-right">has a response of:</label>
            <el-select
              v-model="dependentResponseId"
              placeholder="Select Response"
              noDataText="No data"
              class="fluid"
            >
              <el-option
                v-for="response in dependentResponses"
                :key="response._id"
                :label="response.responseText"
                :value="response._id"
              />
            </el-select>
          </div>
        </div>
        <!-- Suburb Applicability Rules Panel -->
        <div class="row form-group my-4">
          <div class="col-sm-12">
            <h5>
              Suburb Applicability Rules
              <small>(Question should only be displayed if property is location in one of the suburbs listed below)</small>
            </h5>
            <el-select
              v-model="applicableSuburbs"
              multiple
              class="fluid"
              placeholder="Select Applicable Suburbs"
              noDataText="No data"
            >
              <el-option
                v-for="suburb in suburbs"
                :key="suburb._id"
                :label="suburb.name"
                :value="suburb.postCode"
              />
            </el-select>
          </div>
        </div>
        <br/>
        <!-- Response and Score Panel -->
        <div class="row form-group">
          <div class="col-sm-12 d-flex justify-space-between">
            <h5>Responses and Scores</h5>
            <div class="pull-right">
              <button type="button" class="btn btn-primary form-control" @click="openEditModal()">Add New</button>
            </div>
          </div>
        </div>
        <hr/>
        <div class="row">
          <div class="col-sm-12">
            <vue-good-table
              :columns="columns"
              :rows="responses"
              :paginate="true"
              :lineNumbers="true"
              :sort-options="sortOptions"
              :pagination-options="paginationOptions"
            >
              <template slot="table-row" slot-scope="props">
                <span v-if="props.column.field == 'action'">
                  <button class="btn btn-default" @click="openEditModal(props.row)">Edit</button>
                  <button class="btn btn-danger" @click="deleteResponse(props.row)">Delete</button>
                </span>
                <span v-else>
                  {{ props.formattedRow[props.column.field] }}
                </span>
              </template>
            </vue-good-table>
          </div>
        </div>
        <br/>
        <div class="progress-bar-wrapper">
          <hr/>
          <vue-progress-bar/>
        </div>
        <!-- Action Panel -->
        <div class="d-flex justify-end">
          <div class="px-3 form-group">
            <button class="btn btn-primary" @click="saveQuestion()">Save</button>
          </div>
          <div class="form-group">
            <router-link
              :to="{name: 'QuestionList'}"
              @click.prevent
              class="btn btn-default"
            >Cancel</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- response edit modal -->
    <modals-container/>

    <!-- response delete confirmation modal -->
    <modal name="confirmationModal" class="confirmation-modal" height="auto">
      <div class="modal-content">
        <h4 class="text-center">
          There are some of pending changes.<br/>
          Would you please double check it?
        </h4>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" @click="hideConfirmationModal">Yes</button>
        <button class="btn btn-default" @click="forceRoute">No</button>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VSuggestions from 'v-suggestions'
import 'v-suggestions/dist/v-suggestions.css'
import { VueGoodTable } from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import { BasicSelect, MultiSelect } from 'vue-search-select'

import QuestionApi from '@/api/questions'
import ResponseEdit from './ResponseEdit'
import {
  FETCH_SUBURBS,
  UPSERT_QUESTION,
  INIT_CURRENT_QUESTION,
  FETCH_CURRENT_QUESTION,
  UPDATE_CURRENT_QUESTION,
  DELETE_QUESTION_RESPONSE,
  FETCH_QUESTION_CLASSIFICATION,
  FETCH_ANALYSIS_TYPES,
  FETCH_PROPERTY_TYPES
} from '@/store/action-types'
import { uniqueArray } from '@/utils'

export default {
  name: 'QuestionEdit',
  components: {
    ResponseEdit,
    BasicSelect,
    MultiSelect,
    VSuggestions,
    VueGoodTable
  },
  data () {
    return {
      displayInReport: false,
      propertyWithViews: false,
      questionId: this.$route.params.questionId,
      question: null,
      questions: [],
      dependentQuestionId: '',
      dependentQuestion: null,
      dependentQuestionText: '',
      suggestionOptions: {
        debounce: 1000
      },
      questionText: null,
      shortText: null,
      questionCode: null,
      analysisTypes: [],
      propertyTypes: [],
      bestSource: [],
      bestSourceOptions: [
        { value: 'contract-addendum', text: 'Contract - Addendum' },
        { value: 'contract-planning-certificate', text: 'Contract - Planning Certificate' },
        { value: 'contract-sewer-diagram', text: 'Contract - Sewer Diagram' },
        { value: 'contract-survey', text: 'Contract - Survey' },
        { value: 'contract-title-search', text: 'Contract - Title Search' },
        { value: 'floor-plan', text: 'Floor Plan' },
        { value: 'google-maps', text: 'Google Maps' },
        { value: 'on-site', text: 'On-Site' },
        { value: 'off-site', text: 'Off-Site' },
        { value: 'solicitor', text: 'Solicitor' },
        { value: 'real-estate-agent', text: 'Real Estate Agent' }
      ],
      questionPageOrder: 0,
      reportOrder: 0,
      summaryQuestion: false,
      keyFeature: false,
      adjustmentQuestion: false,
      classification: null,
      questionModule: '',
      questionSection: '',
      questionCategory: '',
      dependentMode: null,
      dependentResponseId: '',
      dependentResponses: [],
      applicableSuburbs: [],
      columns: [
        {
          label: 'Order',
          field: 'responseOrder',
          type: 'number',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align'
        }, {
          label: 'Code',
          field: 'responseCode',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align'
        }, {
          label: 'Response Text',
          field: 'responseText'
        }, {
          label: 'Score',
          field: 'responseScore',
          type: 'number',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align'
        }, {
          label: 'Action',
          field: 'action',
          html: true,
          width: '200px',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align',
          sortable: false
        }
      ],
      dependentModes: [
        { value: 'include', text: 'Included' },
        { value: 'exclude', text: 'Excluded' }
      ],
      sortOptions: {
        enabled: true,
        initialSortBy: {
          field: 'responseOrder',
          type: 'asc'
        }
      },
      paginationOptions: {
        enabled: true,
        mode: 'page'
      }
    }
  },
  computed: {
    ...mapState({
      questionClassification: state => state.reference.questionClassification,
      analysisTypeOptions: state => state.reference.analysisTypes || {types: []},
      propertyTypeOptions: state => state.reference.propertyTypes || {types: []},
      currentQuestion: state => state.question.currentQuestion,
      hasPendingChanges: state => state.question.hasPendingChanges,
      suburbs: state => state.suburb.suburbs
    }),
    moduleOptions () {
      let options = []
      if (this.questionClassification && this.questionClassification.modules) {
        const modules = this.questionClassification.modules.map(o => ({ value: o.code, text: o.text }))
        if (modules.length) {
          options = options.concat(modules)
        }
      }
      return options
    },
    sectionOptions () {
      let options = []
      if (this.questionClassification) {
        const modules = this.questionClassification.modules
        if (modules && this.questionModule) {
          const selectedModule = modules.find(o => o.code === this.questionModule)
          if (selectedModule && selectedModule.sections) {
            let sections = selectedModule.sections.map(o => ({value: o.code, text: o.text}))
            sections = uniqueArray(sections, 'value')
            options = options.concat(sections)
          }
        }
      }
      return options
    },
    categoryOptions () {
      let options = []
      if (this.questionClassification) {
        const modules = this.questionClassification.modules
        if (modules && this.questionModule) {
          const selectedModule = modules.find(o => o.code === this.questionModule)
          if (selectedModule) {
            const sections = selectedModule.sections
            if (sections && this.questionSection) {
              const selectedSection = sections.find(o => o.code === this.questionSection)
              if (selectedSection && selectedSection.categories) {
                let categories = selectedSection.categories.map(o => ({value: o.code, text: o.text}))
                categories = uniqueArray(categories, 'value')
                options = options.concat(categories)
              }
            }
          }
        }
      }
      return options
    },
    responses () {
      return this.currentQuestion.responses
    }
  },
  async mounted () {
    this.$Progress.start()
    if (this.questionId) {
      await this.$store.dispatch(FETCH_CURRENT_QUESTION, {_id: this.questionId})
    } else {
      this.$store.dispatch(INIT_CURRENT_QUESTION)
    }
    await this.$store.dispatch(FETCH_PROPERTY_TYPES)
    await this.$store.dispatch(FETCH_SUBURBS)
    await this.$store.dispatch(FETCH_QUESTION_CLASSIFICATION)
    await this.$store.dispatch(FETCH_ANALYSIS_TYPES)
    this.questionText = this.currentQuestion.text
    this.shortText = this.currentQuestion.shortText
    this.questionCode = this.currentQuestion.questionCode
    this.questionModule = this.currentQuestion.questionModule
    this.questionSection = this.currentQuestion.questionSection
    this.questionCategory = this.currentQuestion.questionCategory
    this.analysisTypes = this.currentQuestion.analysisTypes
    this.propertyTypes = this.currentQuestion.propertyTypes
    this.bestSource = this.currentQuestion.bestSource
    this.questionPageOrder = this.currentQuestion.questionPageOrder
    this.reportOrder = this.currentQuestion.reportOrder
    this.summaryQuestion = this.currentQuestion.summaryQuestion
    this.keyFeature = this.currentQuestion.keyFeature
    this.adjustmentQuestion = this.currentQuestion.adjustmentQuestion
    this.dependentMode = this.currentQuestion.dependentMode
    this.displayInReport = this.currentQuestion.displayInReport
    this.propertyWithViews = this.currentQuestion.propertyWithViews
    this.dependentQuestionId = this.currentQuestion.dependentQuestionId || ''
    if (this.dependentQuestionId.length) {
      this.dependentQuestion = await QuestionApi.getOne(this.dependentQuestionId)
      this.dependentQuestionText = this.dependentQuestion.text
      this.dependentResponses = this.dependentQuestion.responses
      this.dependentResponseId = this.currentQuestion.dependentResponseId || ''
    }
    this.applicableSuburbs = this.currentQuestion.applicableSuburbs
    this.$Progress.finish()
  },
  methods: {
    async saveQuestion () {
      if (!this.questionText || !this.questionText.trim().length ||
          !this.questionCode || !this.questionCode.trim().length) {
        this.$snack.danger({
          text: 'Input Error! The question text and code fields must not be empty'
        })
      }
      const question = this.getRequestBody()
      this.$Progress.start()
      await this.$store.dispatch(UPSERT_QUESTION, {question})
        .then(() => {
          this.$Progress.finish()
          setTimeout(() => {
            this.$router.push({name: 'QuestionList'})
          }, 500)
        })
        .catch((error) => {
          this.$Progress.fail()
          if (error.response.data.message) {
            this.$snack.danger(error.response.data.message)
          }
        })
    },
    getRequestBody () {
      return {
        _id: this.questionId,
        text: this.questionText,
        shortText: this.shortText,
        questionCode: this.questionCode,
        questionModule: this.questionModule,
        questionSection: this.questionSection,
        questionCategory: this.questionCategory,
        analysisTypes: this.analysisTypes,
        propertyTypes: this.propertyTypes,
        bestSource: this.bestSource,
        questionPageOrder: this.questionPageOrder,
        reportOrder: this.reportOrder,
        summaryQuestion: this.summaryQuestion,
        keyFeature: this.keyFeature,
        adjustmentQuestion: this.adjustmentQuestion,
        dependentMode: this.dependentMode,
        dependentQuestionId: this.dependentQuestionId,
        dependentResponseId: this.dependentResponseId,
        applicableSuburbs: this.applicableSuburbs,
        responses: this.currentQuestion.responses,
        displayInReport: this.displayInReport,
        propertyWithViews: this.propertyWithViews
      }
    },
    deleteResponse ({_id}) {
      this.$store.dispatch(DELETE_QUESTION_RESPONSE, {responseId: _id})
    },
    onSelectModule () {
      this.questionSection = ''
      this.questionCategory = ''
    },
    onSelectSection () {
      this.questionCategory = ''
    },
    async onQuestionInputChange (query) {
      this.questions = await QuestionApi.autocomplete({text: query})
      return this.questions
    },
    onQuestionItemSelected (item) {
      this.dependentQuestion = item
      this.dependentQuestionText = item.text
      this.dependentQuestionId = item._id
      this.dependentResponses = item.responses
      this.dependentResponseId = ''
    },
    openEditModal (response = {}) {
      this.$modal.show(ResponseEdit, {
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
    hideConfirmationModal () {
      this.$modal.hide('confirmationModal')
    },
    forceRoute () {
      this.next && this.next()
    }
  },
  async beforeRouteLeave (to, from, next) {
    const question = this.getRequestBody()
    await this.$store.dispatch(UPDATE_CURRENT_QUESTION, {question})
    if (!this.hasPendingChanges) {
      next()
    } else {
      this.next = next
      this.$modal.show('confirmationModal', {}, { clickToClose: false })
    }
  }
}
</script>

<style scoped>
.table-row {
  margin-left: 0px;
  margin-right: 0px;
}
h5 {
  text-align: left;
}
.question-edit-page {
  text-align: center;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  width: 60%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}
.modal-body {
  margin: 20px 0;
}
.modal-default-button {
  float: right;
}
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.question-edit-page >>> input {
  height: 42px;
  font-size: 16px;
}
.question-edit-page >>> .ui.dropdown .menu > .item {
  font-size: 14px;
}
.checkbox-wrap input+span:before {
  top: 4px !important;
}
.confirmation-modal h4 {
  padding: 20px;
}
input.form-control {
  min-width: 100px;
}
</style>
