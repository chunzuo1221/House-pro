<template>
  <div class="proximity-list-page">
    <div class="container">
      <div class="pri-pad">
        <div class="row">
          <h3 class="subject-title">Proximity Rule Management</h3>
          <div class="table-actions">
            <router-link class="btn btn-primary" :to="{name: 'ProximityEdit'}">Add New Rule</router-link>
          </div>
        </div>
        <div class="row">
          <hr class="green-line"/>
          <vue-good-table
            :columns="columns"
            :rows="getRules"
            :lineNumbers="true"
            styleClass="vgt-table condensed"
            :pagination-options="{
              enabled: true,
              mode: 'records'
            }">
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'action'">
                <router-link class="btn btn-default action-button" :to="{name: 'ProximityEdit', params: {proximityRuleId: props.row._id}}">Edit</router-link>
                <button class="btn btn-danger action-button" @click="openConfirmationModal(props.row)">Delete</button>
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
          <h4 class="text-center">Are you sure you want to delete a rule?</h4>
        </div>
        <div class="modal-footer">
          <button @click="deleteRecord">Yes</button>
          <button @click="hideConfirmationModal">No</button>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { VueGoodTable } from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'

import {
  DELETE_PROXIMITY_RULE,
  FETCH_PROXIMITY_RULES
} from '@/store/action-types'

export default {
  name: 'ProximityList',
  data () {
    return {
      columns: [{
        label: 'Name',
        field: 'name',
        thClass: 'vgt-center-align',
        tdClass: 'vgt-center-align vgt-middle-align'
      }, {
        label: 'Code',
        field: 'code',
        thClass: 'vgt-center-align',
        tdClass: 'vgt-center-align vgt-middle-align'
      }, {
        label: 'Action',
        field: 'action',
        html: true,
        width: '200px',
        thClass: 'vgt-center-align',
        tdClass: 'vgt-center-align vgt-middle-align',
        sortable: false
      }]
    }
  },
  components: {
    VueGoodTable
  },
  mounted () {
    this.loadRecords()
  },
  computed: {
    ...mapGetters([
      'getRules'
    ])
  },
  methods: {
    loadRecords () {
      try {
        this.$store.dispatch(FETCH_PROXIMITY_RULES)
      } catch (error) {
        this.error.code = FETCH_PROXIMITY_RULES
        this.$snack.danger(`${this.error.text[FETCH_PROXIMITY_RULES]}. \n error: ${JSON.stringify(error)}`)
      }
    },
    async deleteRecord () {
      try {
        await this.$store.dispatch(DELETE_PROXIMITY_RULE, {ruleId: this.deleteProximityRuleId})
        this.hideConfirmationModal()
      } catch (error) {
        this.$snack.danger(`${this.error.text[DELETE_PROXIMITY_RULE]}. \n error: ${JSON.stringify(error)}`)
        this.hideConfirmationModal()
      }
    },
    openConfirmationModal (row) {
      this.deleteProximityRuleId = row._id
      this.$modal.show('confirmationModal')
    },
    hideConfirmationModal () {
      this.deleteProximityRuleId = ''
      this.$modal.hide('confirmationModal')
    }
  }
}
</script>

<style scoped>
.proximity-list-page {
  text-align: center;
  padding: 10px;
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
