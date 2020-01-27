<template>
  <div class="question-list-page">
    <div class="container">
      <div class="pri-pad">
        <div>
          <h3 class="subject-title">Question Manager </h3>
          <div class="table-actions">
            <router-link class="btn btn-primary" :to="{name: 'QuestionEdit'}">
              Add New Question
            </router-link>
          </div>
        </div>
        <div>
          <hr class="green-line"/>
          <div class="d-flex my-3">
            <div class="filter-control">
              <label class="control-label">Module: </label>
              <el-select
                v-model="moduleFilter"
                class="fluid"
                placeholder="Select Module"
                noDataText="No data"
                @change="onSelectModule"
                :disabled="loading"
              >
                <el-option v-for="item in moduleOptions" :key="item.value" :label="item.text" :value="item.value"/>
              </el-select>
            </div>
            <div class="filter-control">
              <label class="control-label" for="sectionFilter">Section: </label>
              <el-select
                id="sectionFilter"
                v-model="sectionFilter"
                class="fluid"
                placeholder="Select Section"
                noDataText="No data"
                @change="onSelectSection"
                :disabled="loading"
              >
                <el-option v-for="item in sectionOptions" :key="item.value" :label="item.text" :value="item.value"/>
              </el-select>
            </div>
            <div class="filter-control">
              <label class="control-label" for="categoryFilter">Category: </label>
              <el-select
                id="categoryFilter"
                v-model="categoryFilter"
                class="fluid"
                placeholder="Select Category"
                noDataText="No data"
                @change="onSelectCategory"
                :disabled="loading"
              >
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.text" :value="item.value"/>
              </el-select>
            </div>
          </div>
          <div class="d-flex my-3 align-center justify-space-between">
            <div class="d-flex">
              <div class="checkbox-wrap">
                <input
                  id="summaryQuestion"
                  type="checkbox"
                  v-model="summaryQuestion"
                  @change="onChangeCheckBox"
                  :disabled="loading"
                >
                <span class="control-label mr-4">Show Setup Questions</span>
              </div>
              <div class="checkbox-wrap">
                <input
                  id="adjustQuestion"
                  type="checkbox"
                  v-model="adjustmentQuestion"
                  @change="onChangeCheckBox"
                  :disabled="loading"
                >
                <span class="control-label">Show Bonus Questions</span>
              </div>
            </div>
            <div class="checkbox-wrap">
              <input
                id="isDeactivated"
                type="checkbox"
                v-model="isDeactivated"
                @change="toggleDeactivated"
                :disabled="loading"
              >
              <span class="control-label">Show Deactivated Questions</span>
            </div>
          </div>
          <div class="progress-bar-wrapper">
            <vue-progress-bar/>
          </div>
          <vue-good-table
            :columns="columns"
            :rows="filteredQuestions"
            :paginate="true"
            @on-page-change="onPageChange"
            @on-per-page-change="onPerPageChange"
            @on-sort-change="onSortChange"
            :pagination-options="paginationOptions"
            :sort-options="sortOptions"
            styleClass="vgt-table striped">
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'action'">
                <button v-if="props.row.isDeactivated" disabled class="btn btn-default">Edit</button>
                <router-link v-else class="btn btn-default" :to="{name: 'QuestionEdit', params: {questionId: props.row._id}}">Edit</router-link>
                <button v-if="props.row.isDeactivated" class="btn btn-success" @click="reactivateQuestion(props.row)">Reactivate</button>
                <button v-else class="btn btn-danger" @click="openConfirmation(props.row)">Deactivate</button>
              </span>
              <span v-else-if="props.column.field === 'questionModule'">
                {{ getModuleName(props.formattedRow[props.column.field]) }}
              </span>
              <span v-else-if="props.column.field === 'questionSection'">
                {{ getSectionName(props.formattedRow[props.column.field]) }}
              </span>
              <span v-else-if="props.column.field === 'questionCategory'">
                {{ getCategoryName(props.formattedRow[props.column.field]) }}
              </span>
              <span v-else>
                {{ props.formattedRow[props.column.field] }}
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>
      <modal name="confirmationModal" class="confirmation-modal" height="auto">
        <div class="modal-content">
          <h4 class="text-center">Are you sure you want to deactivate this question. It will no longer be available in future surveys?</h4>
        </div>
        <div class="modal-footer">
          <button @click="deactivateQuestion">Yes</button>
          <button @click="hideConfirmation">No</button>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { VueGoodTable } from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import { SET_QUESTION_QUERY } from '@/store/mutation-types'
import {
  FETCH_QUESTIONS,
  DEACTIVATE_QUESTION,
  FETCH_QUESTION_CLASSIFICATION
} from '@/store/action-types'
import { uniqueArray } from '@/utils'

export default {
  name: 'QuestionList',
  components: {
    VueGoodTable
  },
  data () {
    return {
      columns: [
        {
          label: 'Order',
          field: 'questionPageOrder',
          type: 'number',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align'
        }, {
          label: 'Code',
          field: 'questionCode'
        }, {
          label: 'Question',
          field: 'text'
        }, {
          label: 'Module',
          field: 'questionModule'
        }, {
          label: 'Section',
          field: 'questionSection'
        }, {
          label: 'Category',
          field: 'questionCategory'
        }, {
          label: 'Action',
          field: 'action',
          html: true,
          width: '220px',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align',
          sortable: false
        }
      ],
      error: {
        code: null,
        text: {
          [FETCH_QUESTIONS]: 'The error occurred in fetching questions',
          [DEACTIVATE_QUESTION]: 'The error occurred in deleting a question'
        }
      },
      // Filter variables
      moduleFilter: '',
      sectionFilter: '',
      categoryFilter: '',
      summaryQuestion: false,
      adjustmentQuestion: false,
      pageNumber: undefined,
      pageSize: undefined,
      sort: 'questionPageOrder',
      allSections: null,
      allCategories: null,
      queryHash: '',
      isDeactivated: false,
      loading: false,
      targetQuestion: null
    }
  },
  created () {
    this.loadQuery()
  },
  async mounted () {
    this.$Progress.start()
    await this.$store.dispatch(FETCH_QUESTION_CLASSIFICATION)
    await this.$store.dispatch(FETCH_QUESTIONS)
    this.$Progress.finish()
  },
  computed: {
    ...mapState({
      questionClassification: state => state.reference.questionClassification,
      questions: state => state.question.questions,
      total: state => state.question.total,
      savedQuery: state => state.question.query
    }),
    moduleOptions () {
      let options = [{value: '', text: 'All'}]
      if (this.questionClassification && this.questionClassification.modules) {
        const modules = this.questionClassification.modules.map(o => ({ value: o.code, text: o.text }))
        if (modules.length) {
          options = options.concat(modules)
        }
      }
      return options
    },
    sectionOptions () {
      let options = [{value: '', text: 'All'}]
      if (this.questionClassification) {
        const modules = this.questionClassification.modules
        if (modules && this.moduleFilter) {
          const moduleFilter = modules.find(o => o.code === this.moduleFilter)
          if (moduleFilter && moduleFilter.sections) {
            let sections = moduleFilter.sections.map(o => ({value: o.code, text: o.text}))
            sections = uniqueArray(sections, 'value')
            options = options.concat(sections)
          }
        }
      }
      return options
    },
    categoryOptions () {
      let options = [{value: '', text: 'All'}]
      if (this.questionClassification) {
        const modules = this.questionClassification.modules
        if (modules && this.moduleFilter) {
          const moduleFilter = modules.find(o => o.code === this.moduleFilter)
          if (moduleFilter) {
            const sections = moduleFilter.sections
            if (sections && this.sectionFilter) {
              const sectionFilter = sections.find(o => o.code === this.sectionFilter)
              if (sectionFilter && sectionFilter.categories) {
                let categories = sectionFilter.categories.map(o => ({value: o.code, text: o.text}))
                categories = uniqueArray(categories, 'value')
                options = options.concat(categories)
              }
            }
          }
        }
      }
      return options
    },
    filteredQuestions () {
      let questions = this.questions
      // if (questions) {
      //   if (this.moduleFilter !== '') {
      //     questions = questions.filter(question => question.questionModule === this.moduleFilter)
      //   }
      //   if (this.sectionFilter !== '') {
      //     questions = questions.filter(question => question.questionSection === this.sectionFilter)
      //   }
      //   if (this.categoryFilter !== '') {
      //     questions = questions.filter(question => question.questionCategory === this.categoryFilter)
      //   }
      //   if (this.summaryQuestion) {
      //     questions = questions.filter(question => question.summaryQuestion === this.summaryQuestion)
      //   }
      //   if (this.adjustmentQuestion) {
      //     questions = questions.filter(question => question.adjustmentQuestion === this.adjustmentQuestion)
      //   }
      // }
      return questions
    },
    sortOptions () {
      const type = this.sort.charAt() === '-' ? 'desc' : 'asc'
      const field = this.sort.charAt() === '-' ? this.sort.substring(1) : this.sort
      return {
        enabled: true,
        initialSortBy: { field, type }
      }
    },
    paginationOptions () {
      return {
        enabled: true,
        mode: 'page',
        perPage: this.pageSize,
        setCurrentPage: this.pageNumber
      }
    }
  },
  methods: {
    getModuleName (code) {
      if (this.moduleOptions) {
        const option = this.moduleOptions.find(o => o.value === code)
        if (option) {
          return option.text
        }
      }
      return code
    },
    getSectionName (code) {
      if (!this.allSections) {
        if (this.questionClassification) {
          const modules = this.questionClassification.modules
          if (modules) {
            let merged = modules.reduce((acc, cur) => ({
              sections: acc.sections.concat(cur.sections)
            }))
            this.allSections = merged.sections
            merged = this.allSections.reduce((acc, cur) => ({
              categories: acc.categories.concat(cur.categories)
            }))
            this.allCategories = merged.categories
          }
        }
      }
      if (this.allSections) {
        const section = this.allSections.find(o => o.code === code)
        if (section) {
          return section.text
        }
      }
      return code
    },
    getCategoryName (code) {
      if (!this.allCategories) {
        if (this.questionClassification) {
          const modules = this.questionClassification.modules
          if (modules) {
            let merged = modules.reduce((acc, cur) => ({
              sections: acc.sections.concat(cur.sections)
            }))
            this.allSections = merged.sections
            merged = this.allSections.reduce((acc, cur) => ({
              categories: acc.categories.concat(cur.categories)
            }))
            this.allCategories = merged.categories
          }
        }
      }
      if (this.allCategories) {
        const category = this.allCategories.find(o => o.code === code)
        if (category) {
          return category.text
        }
      }
      return code
    },
    async deactivateQuestion () {
      try {
        const question = {
          _id: this.targetQuestion._id,
          questionCode: this.targetQuestion.questionCode,
          isDeactivated: true
        }
        await this.$store.dispatch(DEACTIVATE_QUESTION, {question})
        this.hideConfirmation()
      } catch (error) {
        if (error.response) {
          this.$snack.danger(`${this.error.text[DEACTIVATE_QUESTION]}. \n error: ${JSON.stringify(error)}`)
          this.hideConfirmation()
        }
      }
    },
    async reactivateQuestion (row) {
      try {
        const question = {
          _id: row._id,
          questionCode: row.questionCode,
          isDeactivated: false
        }
        await this.$store.dispatch(DEACTIVATE_QUESTION, {question})
      } catch (error) {
        if (error.response) {
          this.$snack.danger(`${this.error.text[DEACTIVATE_QUESTION]}. \n error: ${JSON.stringify(error)}`)
        }
      }
    },
    getQuery () {
      return {
        module: this.moduleFilter,
        section: this.sectionFilter,
        category: this.categoryFilter,
        summaryQuestion: this.summaryQuestion,
        adjustmentQuestion: this.adjustmentQuestion,
        sort: this.sort,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        isDeactivated: this.isDeactivated
      }
    },
    loadQuery () {
      this.moduleFilter = this.savedQuery.module
      this.sectionFilter = this.savedQuery.section
      this.categoryFilter = this.savedQuery.category
      this.summaryQuestion = this.savedQuery.summaryQuestion
      this.adjustmentQuestion = this.savedQuery.adjustmentQuestion
      this.sort = this.savedQuery.sort
      this.pageNumber = this.savedQuery.pageNumber
      this.pageSize = this.savedQuery.pageSize
      this.isDeactivated = this.savedQuery.isDeactivated || false
    },
    // Table handler methods.
    async updateQuery () {
      this.$store.commit(SET_QUESTION_QUERY, this.getQuery())
      this.loading = true
      await this.$store.dispatch(FETCH_QUESTIONS)
      this.loading = false
    },
    onPageChange (params) {
      this.pageNumber = params.currentPage
      this.updateQuery()
    },
    onPerPageChange (params) {
      this.pageSize = params.currentPerPage
      this.updateQuery()
    },
    onSortChange (params) {
      const { columnIndex, sortType } = params
      if (this.columns[columnIndex]) {
        this.sort = (sortType === 'asc' ? '' : '-') + this.columns[columnIndex].field
        this.updateQuery()
      }
    },
    onSelectModule () {
      this.sectionFilter = ''
      this.categoryFilter = ''
      this.updateQuery()
    },
    onSelectSection () {
      this.categoryFilter = ''
      this.updateQuery()
    },
    onSelectCategory (item) {
      this.updateQuery()
    },
    onChangeCheckBox () {
      this.updateQuery()
    },
    toggleDeactivated () {
      this.updateQuery()
    },
    openConfirmation (row) {
      this.targetQuestion = row
      this.$modal.show('confirmationModal')
    },
    hideConfirmation () {
      this.targetQuestion = null
      this.$modal.hide('confirmationModal')
    }
  }
}
</script>

<style scoped>
.question-list-page {
  text-align: center;
}
.v--modal-box.v--modal {
  height: 100% !important;
}
.confirmation-modal h4 {
  padding: 20px;
}
.confirmation-modal button {
  padding:  10px 40px;
  border-radius: 5px;
}
.confirmation-modal .modal-content {
  box-shadow: none;
}
.subject-title {
  float: left;
}
.table-actions {
  float: right;
}
.filter-control {
  display: flex;
  align-items: center;
  margin-right: 50px;
}
.filter-control label {
  margin-right: 8px;
}
.control-label {
  min-width: 50px;
}
.checkbox-wrap input+span:before{
  top: 4px;
}
.checkbox-wrap {
  margin-top: 0;
}
</style>
