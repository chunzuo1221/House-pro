<template>
  <div class="service-edit-modal">
    <div class="modal-header">
      <h3 class="text-left">{{serviceId ? 'Edit' : 'Add'}} Service in Suburb</h3>
      <hr class="green-line"/>
    </div>
    <div class="modal-body">
      <div class="row form-group">
        <div class="col-sm-6 d-flex align-center">
          <label class="control-label">Lookup Type:</label>
          <el-select
            @change="onSelectLookupType"
            v-model="lookupType"
            class="fluid"
            placeholder="Select Lookup Type"
          >
            <el-option v-for="item in lookupTypeOptions" :key="item.value" :label="item.text" :value="item.value"/>
          </el-select>
        </div>
      </div>

      <div class="row form-group">
        <div class="col-sm-6 d-flex align-center">
          <label class="control-label">Name:</label>
          <vue-google-autocomplete
            v-show="lookupType === 'google'"
            ref="address"
            id="map"
            types=""
            @placechanged="getAddressData"
            placeholder="Enter service name"
            country="au"
          />
          <input type="text" readonly v-model="serviceName" v-show="lookupType !== 'google'">
        </div>
        <div class="col-sm-6 d-flex align-center">
          <label class="control-label">Google Place ID:</label>
          <input type="text" readonly v-model="googlePlaceId" name="googlePlaceId">
        </div>
      </div>

      <hr class="my-3"/>

      <div class="row form-group">
        <div class="col-sm-6 d-flex align-center">
          <label class="control-label">Category:</label>
          <el-select
            @change="onSelectCategory"
            v-model="serviceCategory"
            class="fluid"
            placeholder="Select Category"
          >
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.text" :value="item.value"/>
          </el-select>
        </div>
        <div class="col-sm-6 d-flex align-center">
          <label class="control-label">Keywords:</label>
          <vue-tags-input
            v-model="keyword"
            :tags="keywords"
            @tags-changed="onTagsChanged"
            :add-on-key="[9, 13]"
            :separators="[',',';',':','/','\\']"
          />
        </div>
      </div>

      <div class="row form-group">
        <div class="col-sm-6 d-flex align-center">
          <label class="control-label">Type:</label>
          <el-select
            v-model="serviceType"
            class="fluid"
            placeholder="Select Type"
            noDataText="No data"
          >
            <el-option v-for="item in serviceTypeOptions" :key="item.value" :label="item.text" :value="item.value"/>
          </el-select>
        </div>
        <div class="col-sm-6 d-flex align-center">
          <label class="control-label">Sub-Type:</label>
          <el-select
            v-model="serviceSubType"
            class="fluid"
            placeholder="Select Sub-Type"
            noDataText="No data"
          >
            <el-option v-for="item in serviceSubTypeOptions" :key="item.value" :label="item.text" :value="item.value"/>
          </el-select>
        </div>
      </div>

      <div class="row form-group">
        <div class="col-sm-6 d-flex align-center">
          <label class="control-label">Scoring Rules:</label>
          <basic-select :options="proximityRulesOptions"
            :selected-option="proximityRuleId"
            placeholder="select item"
            @select="onProximityRuleIdChange">
          </basic-select>
        </div>
      </div>

      <div class="row form-group">
        <div class="col-sm-12">
          <hr class="my-3"/>
          <div class="d-flex justify-space-between mb-2">
            <div class="section-title">
              <strong>Trip Options</strong>
              <small>(Optional ability control number of trips to evaluate and time of day)</small>
            </div>
            <button class="btn btn-primary" @click="openTripModal">Add Trip</button>
          </div>
          <vue-good-table
            :columns="tripColumns"
            :rows="trips"
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'action'">
                <button class="btn btn-danger" @click="deleteTrip(props.row)">Delete</button>
              </span>
              <span v-else>
                {{ props.formattedRow[props.column.field] }}
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>

      <div class="row form-group">
        <div class="col-sm-12">
          <hr class="my-3"/>
          <div class="d-flex justify-space-between mb-2">
            <div class="section-title">
              <strong>Penalty Options</strong>
              <small>(Award penalty points if a catchment of keyword service matches a specific placeID)</small>
            </div>
            <button class="btn btn-primary" @click="openPenaltyModal">Add Penalty</button>
          </div>
          <vue-good-table
            :columns="penaltyColumns"
            :rows="bonuses"
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'action'">
                <button class="btn btn-danger" @click="deletePenalty(props.row)">Delete</button>
              </span>
              <span v-else>
                {{ props.formattedRow[props.column.field] }}
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>

      <modal name="tripModal" height="auto">
        <trip-modal :trips="trips" @close="hideTripModal"/>
      </modal>

      <modal name="penaltyModal" height="auto">
        <penalty-modal :bonuses="bonuses" @close="hidePenaltyModal"/>
      </modal>

    </div>
    <div class="modal-footer pt-3 px-0 d-flex justify-end align-center">
      <button class="btn btn-primary mx-3" @click="onSaveClicked">Save</button>
      <button class="btn btn-default" @click="onCancelClicked">Cancel</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VueTagsInput from '@johmun/vue-tags-input'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import { VueGoodTable } from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import TripModal from './TripModal'
import PenaltyModal from './PenaltyModal'

import { uniqueArray } from '@/utils'
import { SAVE_SUBURB_SERVICE } from '@/store/action-types'
import { BasicSelect } from 'vue-search-select'
export default {
  name: 'ServiceEdit',
  components: {
    VueGoodTable,
    VueTagsInput,
    VueGoogleAutocomplete,
    TripModal,
    PenaltyModal,
    BasicSelect
  },
  props: {
    service: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      serviceId: '',
      serviceCategory: '',
      serviceType: '',
      serviceSubType: '',
      proximityRuleId: '',
      serviceName: '',
      googlePlaceId: '',
      location: null,
      lookupType: '',
      keyword: '',
      keywords: [],
      lookupTypeOptions: [
        { value: 'google', text: 'Google Maps' },
        { value: 'catchment', text: 'Public School Catchment' },
        { value: 'keyword', text: 'Nearest by Keyword' }
      ],
      tripColumns: [
        {
          label: 'Trip name',
          field: 'name',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align'
        }, {
          label: 'Start Time',
          field: 'time',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align'
        }, {
          label: 'Return Trip?',
          field: 'returnTrip',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align'
        }, {
          label: 'Action',
          field: 'action',
          html: true,
          width: '120px',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align',
          sortable: false
        }
      ],
      trips: [],
      penaltyColumns: [
        {
          label: 'Place name',
          field: 'placeName',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align'
        }, {
          label: 'Penalty',
          field: 'amount',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align'
        }, {
          label: 'Action',
          field: 'action',
          html: true,
          width: '120px',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align',
          sortable: false
        }
      ],
      bonuses: []
    }
  },
  created () {
    this.serviceId = this.service._id
    this.lookupType = this.service.lookupType || 'google'
    this.serviceName = this.service.name
    this.googlePlaceId = this.service.googlePlaceId
    this.location = this.service.location
    this.serviceCategory = this.service.serviceCategory
    this.serviceType = this.service.serviceType
    this.serviceSubType = this.service.serviceSubType
    this.keywords = this.service.keywords ? this.service.keywords.split(',').map(v => ({text: v})) : []
    this.proximityRuleId = this.service.proximityRuleId || { value: '', text: '' }
    if (this.service.proximityRuleId) {
      this.proximityRuleId.value = this.service.proximityRuleId._id
      this.proximityRuleId.text = this.service.proximityRuleId.name
    }
    this.trips = this.service.trips || []
    this.bonuses = this.service.bonuses || []
  },
  mounted () {
    this.$refs.address.update(this.serviceName)
    this.$refs.address.focus()
  },
  computed: {
    ...mapState({
      proximityRules: state => state.proximityRule.rules,
      serviceClassification: state => state.reference.serviceClassification
    }),
    categoryOptions () {
      let categories = [{value: '', text: ''}]
      if (this.serviceClassification && this.serviceClassification.serviceCategories) {
        categories = this.serviceClassification.serviceCategories.map(o => ({ value: o.code, text: o.text }))
        categories = uniqueArray(categories, 'value')
      }
      return categories
    },
    serviceTypeOptions () {
      let types = [{value: '', text: ''}]
      if (this.serviceClassification) {
        const categories = this.serviceClassification.serviceCategories
        if (categories && this.serviceCategory) {
          const category = categories.find(o => o.code === this.serviceCategory)
          if (category && category.serviceTypes) {
            types = category.serviceTypes.map(o => ({ value: o.code, text: o.text }))
            types = uniqueArray(types, 'value')
          }
        }
      }
      return types
    },
    serviceSubTypeOptions () {
      let subTypes = [{value: '', text: ''}]
      if (this.serviceClassification) {
        const categories = this.serviceClassification.serviceCategories
        if (categories && this.serviceCategory) {
          const category = categories.find(o => o.code === this.serviceCategory)
          if (category && category.serviceSubTypes) {
            subTypes = category.serviceSubTypes.map(o => ({ value: o.code, text: o.text }))
            subTypes = uniqueArray(subTypes, 'value')
          }
        }
      }
      return subTypes
    },
    proximityRulesOptions () {
      let rules = [{value: '', text: '', code: ''}]
      if (this.proximityRules) {
        rules = this.proximityRules.map(o => ({ _id: o._id, value: o._id, name: o.name, text: o.name, code: o.code }))
      }
      return rules
    }
  },
  methods: {
    onSaveClicked () {
      if (!this.serviceName || !this.serviceName.length || !this.proximityRuleId) {
        this.$snack.danger({
          text: 'Input Error! The service name and proximity rule fields must not be empty'
        })
        return
      }
      const service = {
        _id: this.serviceId,
        lookupType: this.lookupType,
        name: this.serviceName,
        googlePlaceId: this.lookupType === 'google' ? this.googlePlaceId : '',
        location: this.location,
        keywords: this.keywords.map(k => k.text).join(','),
        proximityRuleId: this.proximityRuleId,
        serviceCategory: this.serviceCategory,
        serviceType: this.serviceType,
        serviceSubType: this.serviceSubType,
        trips: this.trips,
        bonuses: this.bonuses
      }
      console.log('service:', service)
      this.$store.dispatch(SAVE_SUBURB_SERVICE, {service})
      this.$emit('close')
    },
    onCancelClicked () {
      this.$emit('close')
    },
    onSelectCategory (categoryCode) {
      this.serviceType = null
      this.serviceSubType = null
    },
    getAddressData (addressData, placeResultData, id) {
      this.serviceName = placeResultData.name
      this.googlePlaceId = placeResultData.place_id
      this.location = {
        lat: placeResultData.geometry.location.lat(),
        lng: placeResultData.geometry.location.lng()
      }
    },
    onTagsChanged (keywords) {
      this.keywords = keywords
    },
    onSelectLookupType (type) {
      switch (type) {
        case 'catchment':
          this.serviceName = 'Public School Catchment'
          this.googlePlaceId = 'N/A'
          this.location = null
          break
        case 'google':
          this.serviceName = ''
          this.googlePlaceId = ''
          this.location = null
          this.$refs.address.update(this.serviceName)
          this.$refs.address.focus()
          break
        case 'keyword':
          this.serviceName = 'Nearest by Keyword'
          this.googlePlaceId = 'N/A'
          this.location = null
          break
        default:
          break
      }
    },
    openTripModal () {
      this.$modal.show('tripModal', {}, {clickToClose: false})
    },
    hideTripModal (newTrip) {
      this.$modal.hide('tripModal')
      if (newTrip) {
        this.trips.push(newTrip)
      }
    },
    deleteTrip (trip) {
      if (this.trips.length) {
        const trips = [...this.trips]
        const index = trips.findIndex(o => o.name === trip.name)
        trips.splice(index, 1)
        trips.forEach((o, i) => {
          o.name = `Trip ${i + 1}`
        })
        this.trips = trips
      }
    },
    openPenaltyModal () {
      this.$modal.show('penaltyModal', {}, {clickToClose: false})
    },
    hidePenaltyModal (newPenalty) {
      this.$modal.hide('penaltyModal')
      if (newPenalty) {
        this.bonuses.push(newPenalty)
      }
    },
    deletePenalty (penalty) {
      if (this.bonuses.length) {
        const bonuses = [...this.bonuses]
        const index = bonuses.findIndex(o => o.placeName === penalty.placeName)
        bonuses.splice(index, 1)
        this.bonuses = bonuses
      }
    },
    onProximityRuleIdChange (event) {
      this.proximityRuleId = event
    }
  }
}
</script>

<style scoped>
.service-edit-modal {
  padding: 24px;
}
button {
  min-width: 100px;
}
.modal-header {
  padding: 0;
  border-bottom: none;
}
.service-edit-modal >>> .new-tag-input-wrapper input {
  height: auto;
}
.service-edit-modal >>> .tag {
  background-color: #528EC1;
}
.control-label {
  min-width: 140px;
}
.section-title {
  font-size: 18px;
}
</style>
<style>
.ui.fluid.search.selection.dropdown {
  border: 1px solid rgba(34, 36, 38, 0.4);
  border-radius: 0;
}
.ui.fluid.search.selection.active.dropdown .menu {
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-overflow-scrolling: touch;
  border-top-width: 1px !important;
  width: auto;
  outline: none;
  margin: 0px -1px;
  min-width: calc(100% + 2px );
  width: calc(100% + 2px );
  box-shadow: 2px 2px 3px 2px rgba(34, 36, 38, 0.15);
  -webkit-transition: opacity 0.1s ease;
  transition: opacity 0.1s ease;
  border-radius: 5px;
}
.ui.fluid.search.selection.dropdown .menu.visible .item {
  min-height: 30px;
  line-height: 34px;
}
.ui.fluid.search.selection.active.dropdown.visible .menu.visible{
  margin-top: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
