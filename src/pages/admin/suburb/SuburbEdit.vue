<template>
  <div class="suburb-edit-page">
    <div class="container">
      <div class="pri-pad">
        <div>
          <h3 class="text-left">Suburb Research Management</h3>
          <hr class="green-line"/>
        </div>
        <div class="d-flex justify-space-between">
          <!-- Suburb Panel -->
          <div class="d-flex align-center">
            <label class="control-label" for="suburbName">Name:</label>
            <input type="text" class="form-control" id="suburbName" v-model="suburbName" placeholder="Enter name" name="name">
          </div>
          <div class="d-flex col-sm-6 align-center">
            <label class="control-label">Postcode:</label>
            <MaskedInput
              v-model="postCode"
              placeholder="Enter Code"
              class="form-control"
              name="code"
              :mask="{
                pattern: '1111'
              }"
            />
          </div>
        </div>

        <br/><br/>

        <el-tabs type="border-card">

          <el-tab-pane label="Services">
            <div class="d-flex justify-space-between py-2">
              <div class="d-flex align-center">
                <label class="control-label">Filter:</label>
                <el-select
                  v-model="categoryFilter"
                  class="fluid"
                  noDataText="No data"
                  placeholder="Select Category"
                >
                  <el-option v-for="item in categoryOptions" :key="item.value" :label="item.text" :value="item.value"/>
                </el-select>
              </div>
              <button type="button" class="btn btn-primary" @click="() => openServiceEditModal()">Add New</button>
            </div>
            <hr/>
            <div class="active-button">
              <button type="button" class="btn btn-primary" @click="() => selectAllService()">Activate All</button>
              <button type="button" class="btn btn-primary" @click="() => deselectAllService()">Deactivate All</button>
            </div>
            <div class="table-row">
              <vue-good-table
                :columns="serviceColumns"
                :rows="filteredServices"
                :paginate="true"
                :lineNumbers="true"
                :pagination-options="{ enabled: true, mode: 'page' }"
              >
                <template slot="table-row" slot-scope="props">
                  <span v-if="props.column.field == 'action'">
                    <button class="btn btn-default" @click="openServiceEditModal(props.row)">Edit</button>
                    <button class="btn btn-danger" @click="deleteService(props.row)">Delete</button>
                  </span>
                  <span v-else-if="props.column.field === 'serviceCategory'">
                    {{ getCategoryName(props.formattedRow[props.column.field]) }}
                  </span>
                  <span v-else-if="props.column.field === 'serviceType'">
                    {{ getServiceTypeName(props.formattedRow[props.column.field]) }}
                  </span>
                  <span v-else-if="props.column.field === 'serviceSubType'">
                    {{ getServiceSubTypeName(props.formattedRow[props.column.field]) }}
                  </span>
                  <span v-else-if="props.column.field === 'isActive'">
                    <input type="checkbox" @click="serviceOnCheck(props.row)" v-model="props.formattedRow[props.column.field]" :value="props.formattedRow[props.column.field]" />
                  </span>
                  <span v-else-if="props.column.field === 'proximityRuleId'">
                    {{ props.row.proximityRuleId && props.row.proximityRuleId.code ? props.row.proximityRuleId.code.toUpperCase() : 'None' }}
                  </span>
                  <span v-else>
                    {{ props.formattedRow[props.column.field] }}
                  </span>
                </template>
              </vue-good-table>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Scoring Rules">
            <div class="d-flex justify-space-between py-2">
              <div class="d-flex align-center">
                <label class="control-label">Filter:</label>
                <el-select
                  v-model="categoryFilter"
                  class="fluid"
                  noDataText="No data"
                  placeholder="Select Category"
                >
                  <el-option v-for="item in categoryOptions" :key="item.value" :label="item.text" :value="item.value"/>
                </el-select>
              </div>
            </div>

            <hr/>

            <div class="table-row">
              <vue-good-table
                :columns="scoringColumns"
                :rows="getScoringRules"
                :paginate="true"
                :lineNumbers="true"
                :pagination-options="{ enabled: true, mode: 'page' }"
                :search-options="{
                  enabled: true
                }">
              >
                <template slot="table-row" slot-scope="props">
                  <span v-if="props.column.field == 'action'">
                    <button class="btn btn-default" @click="openScoringRuleEditModal(props.row)">Edit</button>
                  </span>
                  <span v-else>
                    {{ props.formattedRow[props.column.field] }}
                  </span>
                </template>
              </vue-good-table>
            </div>
          </el-tab-pane>

          <el-tab-pane label="External Data Providers">
            <div class="d-flex justify-space-between py-2">
              <div>
                <button type="button" class="btn btn-primary" @click="onMappingsClick">Manage Address Mappings</button>
                <modal name="mappingsModal" :width="800" height="auto" :click-to-close="false">
                  <address-mappings :mappings="mappings" @close="onMappingsModalClose"></address-mappings>
                </modal>
              </div>
              <div>
                <button type="button" class="btn btn-primary" @click="openDataProviderEditModal()">Add New</button>
              </div>

            </div>
            <hr/>
            <div class="table-row">
              <vue-good-table
                :columns="dataProviderColumns"
                :rows="dataProviders"
                :paginate="true"
                :lineNumbers="true"
                :pagination-options="{ enabled: true, mode: 'page' }"
              >
                <template slot="table-row" slot-scope="props">
                  <span v-if="props.column.field == 'action'">
                    <button class="btn btn-default" @click="openDataProviderEditModal(props.row)">Edit</button>
                    <button class="btn btn-danger" @click="deleteProvider(props.row)">Delete</button>
                  </span>
                  <span v-else>
                    {{ props.formattedRow[props.column.field] }}
                  </span>
                </template>
              </vue-good-table>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Overview">
            <p class="my-3"><strong>The following text will be used to provide an overview description of the suburb in our reports.</strong></p>
            <wysiwyg v-model="overviewDescription" />
          </el-tab-pane>
        </el-tabs>

        <br/>
        <hr/>

        <div class="d-flex justify-end">
          <div class="px-3 form-group">
            <button class="btn btn-primary" @click="saveSuburb()">Save</button>
          </div>
          <div class="form-group">
            <router-link
              :to="{name: 'SuburbList'}"
              @click.prevent
              class="btn btn-default"
            >Cancel</router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="spiner-container" v-show="isSaving"></div>
    <clip-loader :loading="isSaving" :color="color" :size="size"></clip-loader>
    <!-- service edit modal -->
    <modals-container/>
    <modal name="confirmationModal" height="auto">
      <confirmation-modal
       :message="message"
       @confirmed="onConfirm"
       @canceled="closeConfirmationModal" />
    </modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MaskedInput from 'vue-masked-input'
import { VueGoodTable } from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'

import ServiceEdit from './ServiceEdit'
import ScoringRuleEdit from './ScoringRuleEdit'
import DataProviderEdit from './DataProviderEdit'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import {
  UPSERT_SUBURB,
  INIT_CURRENT_SUBURB,
  FETCH_CURRENT_SUBURB,
  DELETE_SUBURB_SERVICE,
  FETCH_PROXIMITY_RULES,
  FETCH_SERVICE_CLASSIFICATION,
  INIT_TEMPLATE_SCORING_RULES,
  FETCH_CALCULATION_METHODS,
  UPSERT_SCORING_RULE,
  FETCH_SUBURB_SCORING_RULES,
  DELETE_SUBURB_DATA_PROVIDER
} from '@/store/action-types'
import { SET_CURRENT_SUBURB } from '@/store/mutation-types'
import { UNSAVED_WARNING, ACTIVATE_ALL_MESSAGE, DEACTIVATE_ALL_MESSAGE } from '@/utils/constants'
import ConfirmationModal from '@/components/core/ConfirmationModal'
import AddressMappings from './AddressMappings'

export default {
  name: 'SuburbEdit',
  components: {
    VueGoodTable,
    MaskedInput,
    ConfirmationModal,
    ClipLoader,
    AddressMappings
  },
  data () {
    return {
      suburbId: this.$route.params.suburbId,
      suburbName: null,
      postCode: null,
      overviewDescription: null,
      categoryFilter: '*',
      serviceColumns: [
        {
          label: 'Active',
          field: 'isActive',
          tdClass: 'vgt-center-align',
          sortable: false
        }, {
          label: 'Name',
          field: 'name'
        }, {
          label: 'Category',
          field: 'serviceCategory'
        }, {
          label: 'Type',
          field: 'serviceType'
        }, {
          label: 'Sub-Type',
          field: 'serviceSubType'
        }, {
          label: 'Proximity Rule',
          field: 'proximityRuleId',
          sortFn: this.proximityRuleSortFn
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
      scoringColumns: [
        {
          label: 'Category',
          field: 'categoryName'
        }, {
          label: 'Type',
          field: 'typeName'
        }, {
          label: 'Subtype',
          field: 'subTypeName'
        }, {
          label: 'Calculation Method',
          field: 'calculationMethodName'
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
      dataProviderColumns: [
        {
          label: 'Provider Name',
          field: 'name'
        }, {
          label: 'Description',
          field: 'description'
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
      mappings: [],
      serviceIdToDelete: null,
      serviceTypes: null,
      serviceSubTypes: null,
      message: null,
      onConfirm: null,
      isSaving: false,
      color: '#3AB982',
      size: '35px'
    }
  },
  async mounted () {
    try {
      this.isSaving = true
      if (this.suburbId) {
        await this.$store.dispatch(FETCH_CURRENT_SUBURB, {_id: this.suburbId})
        await this.$store.dispatch(FETCH_SUBURB_SCORING_RULES, {postCode: this.$store.state.suburb.currentSuburb.postCode})
        await this.$store.dispatch(FETCH_CALCULATION_METHODS)
      } else {
        await this.$store.dispatch(INIT_CURRENT_SUBURB)
        await this.$store.dispatch(INIT_TEMPLATE_SCORING_RULES)
        await this.$store.dispatch(FETCH_CALCULATION_METHODS)
      }
      this.suburbName = this.currentSuburb.name
      this.postCode = this.currentSuburb.postCode
      this.overviewDescription = this.currentSuburb.overviewDescription
      this.mappings = this.currentSuburb.mappings
      await this.$store.dispatch(FETCH_PROXIMITY_RULES)
      await this.$store.dispatch(FETCH_SERVICE_CLASSIFICATION)
    } catch (error) {
      this.$snack.danger('Something error has occurred while loading data')
    }
    this.isSaving = false
  },
  computed: {
    ...mapState({
      currentSuburb: state => state.suburb.currentSuburb,
      proximityRules: state => state.proximityRule.rules,
      serviceClassification: state => state.reference.serviceClassification,
      hasPendingChanges: state => state.suburb.hasPendingChanges,
      scoringRules: state => state.scoringRule.scoringRules,
      calculationMethods: state => state.scoringRule.calculationMethods
    }),
    getCalculationMethods () {
      return this.calculationMethods
    },
    filteredServices () {
      if (this.currentSuburb) {
        let services = this.currentSuburb.services
        if (this.categoryFilter !== '*') {
          services = services.filter(o => o.serviceCategory === this.categoryFilter)
        }
        return services
      }
      return []
    },
    getScoringRules () {
      if (this.$store.state.scoringRule.scoringRules) {
        let rules = this.$store.state.scoringRule.scoringRules
        return rules
      }
      return []
    },
    categoryOptions () {
      let categories = [{value: '*', text: 'All'}]
      if (this.serviceClassification && this.serviceClassification.serviceCategories) {
        const cats = this.serviceClassification.serviceCategories.map(o => ({ value: o.code, text: o.text }))
        if (cats.length) {
          categories = categories.concat(cats)
        }
      }
      return categories
    },
    dataProviders () {
      if (this.currentSuburb) {
        if (this.currentSuburb.dataProviders) {
          return this.currentSuburb.dataProviders
        }
      }
      return []
    }
  },
  methods: {
    proximityRuleSortFn (x, y, col, rowX, rowY) {
      return (x.code < y.code ? -1 : (x.code > y.code ? 1 : 0))
    },
    getCategoryName (code) {
      if (this.categoryOptions) {
        const option = this.categoryOptions.find(o => o.value === code)
        if (option) {
          return option.text
        }
      }
      return code
    },
    getServiceTypeName (code) {
      if (!this.serviceTypes) {
        if (this.serviceClassification && this.serviceClassification.serviceCategories) {
          const allCats = this.serviceClassification.serviceCategories.reduce((acc, cur) => {
            return {
              serviceTypes: acc.serviceTypes.concat(cur.serviceTypes),
              serviceSubTypes: acc.serviceSubTypes.concat(cur.serviceSubTypes)
            }
          })
          this.serviceTypes = allCats.serviceTypes
          this.serviceSubTypes = allCats.serviceSubTypes
        }
      }
      if (this.serviceTypes) {
        const type = this.serviceTypes.find(o => o.code === code)
        if (type) {
          return type.text
        }
      }
      return code
    },
    getServiceSubTypeName (code) {
      if (!this.serviceSubTypes) {
        if (this.serviceClassification && this.serviceClassification.serviceCategories) {
          const allCats = this.serviceClassification.serviceCategories.reduce((acc, cur) => {
            return {
              serviceTypes: acc.serviceTypes.concat(cur.serviceTypes),
              serviceSubTypes: acc.serviceSubTypes.concat(cur.serviceSubTypes)
            }
          })
          this.serviceTypes = allCats.serviceTypes
          this.serviceSubTypes = allCats.serviceSubTypes
        }
      }
      if (this.serviceSubTypes) {
        const type = this.serviceSubTypes.find(o => o.code === code)
        if (type) {
          return type.text
        }
      }
      return code
    },
    deleteService ({_id}) {
      this.$store.dispatch(DELETE_SUBURB_SERVICE, {serviceId: _id})
    },
    serviceOnCheck (suburbService) {
      if (this.currentSuburb && this.currentSuburb.services) {
        this.currentSuburb.services.map(service => {
          if (service._id === suburbService._id) {
            service.isActive = !service.isActive
          }
          return service
        })
      }
    },
    openConfirmationModal (message, onConfirm) {
      this.message = message
      this.onConfirm = onConfirm
      this.$modal.show('confirmationModal', {
        width: 800,
        height: 'auto',
        clickToClose: false
      })
    },
    closeConfirmationModal () {
      this.$modal.hide('confirmationModal')
    },
    selectAllService () {
      this.openConfirmationModal(ACTIVATE_ALL_MESSAGE, this.activeAllServices)
    },
    deselectAllService () {
      this.openConfirmationModal(DEACTIVATE_ALL_MESSAGE, this.deActiveAllServices)
    },
    activeAllServices () {
      this.currentSuburb.services.map(service => {
        service.isActive = true
        return service
      })
      this.closeConfirmationModal()
    },
    deActiveAllServices () {
      this.currentSuburb.services.map(service => {
        service.isActive = false
        return service
      })
      this.closeConfirmationModal()
    },
    getSuburbId () {
      let suburbId = {
        id: this.suburbId
      }
      return suburbId
    },
    getRequestBody () {
      return {
        _id: this.suburbId,
        name: this.suburbName,
        postCode: this.postCode,
        services: this.currentSuburb.services,
        dataProviders: this.currentSuburb.dataProviders,
        overviewDescription: this.overviewDescription,
        mappings: this.mappings
      }
    },
    getScoringRulesRequestBody () {
      let scoringRules = this.$store.state.scoringRule.scoringRules
      let scoringRulesToUpsert = []
      if (scoringRules) {
        scoringRules.forEach(scoringRule => {
          if (!(scoringRule.postCode)) {
            scoringRule.postCode = this.postCode
          }
        })
        scoringRules.forEach(scoringRule => {
          if (scoringRule.calculationMethodCode) {
            if (scoringRule.ruleEdited) {
              scoringRulesToUpsert.push(scoringRule)
            }
          }
        })
      }
      return scoringRulesToUpsert
    },
    async saveSuburb () {
      this.isSaving = true
      if (!this.suburbName || !this.suburbName.trim().length ||
          !this.postCode || !this.postCode.trim().length) {
        this.$snack.danger({
          text: 'Input Error! The Name and Postcode fields must not be empty'
        })
        this.isSaving = false
        return
      }
      const scoringRules = this.getScoringRulesRequestBody()
      await this.$store.dispatch(UPSERT_SCORING_RULE, {scoringRules})
      const suburb = this.getRequestBody()
      await this.$store.dispatch(UPSERT_SUBURB, {suburb})
      this.$router.push({name: 'SuburbList'})
      this.isSaving = false
    },
    openServiceEditModal (service = {}) {
      this.$modal.show(ServiceEdit, {
        service
      }, {
        width: 900,
        height: 'auto',
        scrollable: true,
        clickToClose: false
      })
    },
    openScoringRuleEditModal (scoringRule, suburbId) {
      this.$modal.show(ScoringRuleEdit, {
        scoringRule,
        suburbId
      }, {
        width: 900,
        height: 'auto',
        clickToClose: false
      })
    },
    openDataProviderEditModal (provider = {}) {
      this.$modal.show(DataProviderEdit, {
        provider
      }, {
        width: 800,
        height: 'auto',
        clickToClose: false
      })
    },
    deleteProvider ({_id}) {
      this.$store.dispatch(DELETE_SUBURB_DATA_PROVIDER, {providerId: _id})
    },
    forceRoute () {
      this.next && this.next()
    },
    onMappingsClick () {
      this.$modal.show('mappingsModal')
    },
    onMappingsModalClose (mappings) {
      if (typeof mappings !== 'undefined') {
        this.mappings = [...mappings]
      }
      this.$modal.hide('mappingsModal')
    }
  },
  async beforeRouteLeave (to, from, next) {
    const suburb = this.getRequestBody()
    await this.$store.commit(SET_CURRENT_SUBURB, {suburb})
    if (!this.hasPendingChanges) {
      next()
    } else {
      this.next = next
      this.$modal.show('confirmationModal', {}, { clickToClose: false })
      this.openConfirmationModal(UNSAVED_WARNING, this.forceRoute)
    }
  }
}
</script>

<style scoped>
.table-row {
  margin-left: 0px;
  margin-right: 0px;
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
  width: 80%;
  max-width: 900px;
  margin: 0px auto;
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
#suburbName {
  width: auto;
}
.form-control {
  width: auto;
  display: inline-flex;
}
.suburb-edit-page >>> input {
  height: 42px;
  font-size: 16px;
}
.suburb-edit-page >>> .ui.dropdown .menu > .item {
  font-size: 14px;
}
.v--modal-box.v--modal {
    height: 100% !important;
}
.confirmation-modal h4 {
  padding-top: 30px;
  padding-bottom: 20px;
}
.confirmation-modal button {
  padding:  10px 40px;
}
.confirmation-modal .modal-content {
  box-shadow: none;
}
.confirmation-modal .modal-footer {
  padding-top: 20px;
  padding-bottom: 20px;
}
.subject-title {
  float: left;
}
.table-actions {
  float: right;
}
.control-label {
  min-width: 80px;
}
.suburb-edit-page >>> .el-tabs__item {
  height: 60px;
  padding-top: 10px;
  font-size: 18px;
}
.active-button {
  margin: 0 0 1.75em;
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
