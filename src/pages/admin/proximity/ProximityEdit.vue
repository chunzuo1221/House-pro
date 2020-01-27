  <template>
  <div class="proximity-edit-page">
    <div class="container">
      <div class="pri-pad">
        <div class="row">
          <h3 class="text-left">Add/Edit Proximity Rule</h3>
          <hr class="green-line"/>
        </div>
        <!-- Proximity Edit Panel -->
        <div class="row proximity-edit-panel">
          <div class="col-sm-6">
            <label class="col-sm-2 mt-1" for="proximityName">Name:</label>
            <div class="col-sm-6">
              <input type="text" id="proximityName" v-model="proximityName" placeholder="Enter name" name="proximityName">
            </div>
          </div>
          <div class="col-sm-6">
            <label class="col-sm-2 mt-1" for="proximityCode">Code:</label>
            <div class="col-sm-6">
              <input type="text" id="proximityCode" v-model="proximityCode" placeholder="Enter code" name="proximityCode">
            </div>
          </div>
        </div>
        <br/><br/>
        <!-- Measure Action Panel -->
        <div><h4 class="text-left">Measure</h4></div>
        <div class="d-flex justify-end py-2">
          <button type="button" class="btn btn-primary" @click="openEditModal()">Add New</button>
        </div>
        <hr/>
        <!-- Measure Table -->
        <div class="table-row">
          <vue-good-table class="pagination-table"
            :columns="columns" :rows="measures"
            :paginate="true"
            :lineNumbers="true"
            styleClass="vgt-table condensed"
            :pagination-options="{ enabled: true, mode: 'records' }"
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'action'">
                <button class="btn btn-default action-button" @click="openEditModal(props.row)">Edit</button>
                <button class="btn btn-danger action-button" @click="openDeleteConfirmationModal(props.row)">Delete</button>
              </span>
              <span v-else>
                {{ props.formattedRow[props.column.field] }}
              </span>
            </template>
          </vue-good-table>
        </div>
        <br/>
        <hr/>
        <!-- Proximity Action Panel -->
        <div class="d-flex justify-end proximity-action-panel">
          <div class="px-3 form-group">
            <button class="btn btn-primary" @click="saveProximityRule()">Save</button>
          </div>
          <div class="form-group">
            <router-link class="btn btn-default" :to="{name: 'ProximityList'}" @click.prevent>Cancel</router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- Measure modal -->
    <modals-container/>
    <!-- Confirmation modal -->
    <modal name="pendingChangesModel" class="confirmation-modal" height="auto">
      <div class="modal-content">
        <h4 class="text-center">
          There are some of pending changes.<br/>
          Will you check it again?
        </h4>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" @click="closePandingConfirmationModal">Yes</button>
        <button class="btn btn-default" @click="forceRoute">No</button>
      </div>
    </modal>

    <modal name="confirmDeleteModel" class="confirmation-modal" height="auto">
      <div class="modal-content">
        <h4 class="text-center">Are you sure you want to delete a measure?</h4>
      </div>
      <div class="modal-footer">
        <button @click="deleteMeasure">Yes</button>
        <button @click="closeDeleteConfirmationModel">No</button>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { VueGoodTable } from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import {
  UPDATE_CURRENT_PROXIMITY_RULE,
  UPDATE_PROXIMITY_RULE,
  FETCH_CURRENT_PROXIMITY_RULE,
  INIT_CURRENT_PROXIMITY_RULE,
  DELETE_MEASURE
} from '@/store/action-types'
import MeasureEdit from './MeasureEdit'

export default {
  name: 'ProximityEdit',
  components: {
    MeasureEdit,
    VueGoodTable
  },
  data () {
    return {
      proximityRuleId: this.$route.params.proximityRuleId,
      proximityName: null,
      proximityCode: null,
      modalDisplayProperty: 'none',
      columns: [
        {
          label: 'Order',
          field: 'order',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align vgt-middle-align',
          html: true
        }, {
          label: 'Travel mode',
          field: 'travelMode',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align vgt-middle-align',
          html: true
        }, {
          label: 'Upper bound',
          field: 'upperBound',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align vgt-middle-align',
          html: true
        }, {
          label: 'Units',
          field: 'units',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align vgt-middle-align',
          html: true
        }, {
          label: 'Score',
          field: 'score',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align vgt-middle-align',
          html: true
        }, {
          label: 'Action',
          field: 'action',
          html: true,
          width: '200px',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align vgt-middle-align',
          sortable: false
        }
      ],
      measureFilter: '*'
    }
  },
  async mounted () {
    if (this.proximityRuleId) {
      await this.$store.dispatch(FETCH_CURRENT_PROXIMITY_RULE, {ruleId: this.proximityRuleId})
    } else {
      this.$store.dispatch(INIT_CURRENT_PROXIMITY_RULE)
    }
    this.proximityName = this.proximityRule.name
    this.proximityCode = this.proximityRule.code
  },
  computed: {
    ...mapState({
      proximityRule: state => state.proximityRule.currentRule,
      hasPendingChanges: state => state.proximityRule.hasPendingChanges
    }),
    measures () {
      if (this.proximityRule) {
        let measures = this.proximityRule.measures
        measures.sort((a, b) => a.order - b.order)
        if (this.measureFilter !== '*') {
          measures = measures.filter(o => o.name === this.measureFilter)
        }
        return measures
      }
      return []
    }
  },
  methods: {
    async saveProximityRule () {
      if (!this.proximityName || !this.proximityCode) {
        this.$snack.danger('Input Error! The Name and Postcode fields must not be empty')
        return
      }
      this.proximityRule.measures.forEach(function (element) {
        if (element.isNew) {
          delete element._id
          delete element.isNew
        }
      })
      const rule = {
        _id: this.proximityRuleId,
        name: this.proximityName,
        code: this.proximityCode,
        measures: this.proximityRule.measures
      }
      await this.$store.dispatch(UPDATE_PROXIMITY_RULE, {rule})
      this.$router.push({name: 'ProximityList'})
    },
    openEditModal (measure = {}) {
      this.$modal.show(MeasureEdit, {
        measure
      }, {
        width: 630,
        height: 'auto',
        clickToClose: false
      })
    },
    deleteMeasure () {
      this.$store.dispatch(DELETE_MEASURE, {_id: this.deleteMeausreId})
      this.closeDeleteConfirmationModel()
    },
    closeModal () {
      this.$modal.close()
    },
    closePandingConfirmationModal () {
      this.$modal.hide('pendingChangesModel')
    },
    forceRoute () {
      if (this.next) {
        this.next()
      }
    },
    openDeleteConfirmationModal (row) {
      this.deleteMeausreId = row._id
      this.$modal.show('confirmDeleteModel')
    },
    closeDeleteConfirmationModel () {
      this.deleteMeausreId = ''
      this.$modal.hide('confirmDeleteModel')
    }
  },
  watch: {
    proximityName (val) {
      if (val) {
        this.$store.dispatch(UPDATE_CURRENT_PROXIMITY_RULE, {
          rule: {
            ...this.proximityRule,
            name: val
          }
        })
      }
    },
    proximityCode (val) {
      if (val) {
        this.$store.dispatch(UPDATE_CURRENT_PROXIMITY_RULE, {
          rule: {
            ...this.proximityRule,
            code: val
          }
        })
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (!this.hasPendingChanges) {
      next()
    } else {
      this.next = next
      this.$modal.show('pendingChangesModel', {}, { clickToClose: false })
    }
  }
}
</script>

<style scoped>
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
.control-label {
  padding-right: 20px;
}
.form-control {
  display: inline-flex;
}
.proximity-action-panel .btn{
  min-width: 120px;
}
.proximity-edit-page >>> input {
  height: 42px;
}
.proximity-edit-page >>> .ui.dropdown .menu > .item {
  font-size: 14px;
}
.v--modal-box.v--modal {
    height: 100% !important;
}
.confirmation-modal h4 {
  padding: 20px;
}
.confirmation-modal button {
  padding:  10px 40px;
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
.action-button {
  min-width: 80px;
}
@media screen and (max-width: 768px) {
  .action-button {
    min-width: 90px;
    margin-top: 3px;
    margin-bottom: 3px;
  }
}
</style>
<style>
.vgt-middle-align {
  vertical-align: middle !important;
}
</style>
