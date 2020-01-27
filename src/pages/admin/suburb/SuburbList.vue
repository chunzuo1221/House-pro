<template>
  <div class="suburb-list-page">
    <div class="container">
      <div class="pri-pad">
        <div class="row">
          <h3 class="subject-title">Suburb Research Management</h3>
          <div class="table-actions">
            <router-link class="btn btn-primary" :to="{name: 'SuburbEdit'}">
              Add New Suburb
            </router-link>
          </div>
        </div>
        <div class="row">
          <hr class="green-line"/>
          <vue-good-table
            :columns="columns"
            :rows="getSuburbs"
            :paginate="true"
            :lineNumbers="true"
            :pagination-options="{ enabled: true, mode: 'page' }"
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field === 'action'">
                <router-link class="btn btn-default" :to="{name: 'SuburbEdit', params: {suburbId: props.row._id}}">Edit</router-link>
                <button class="btn btn-danger" @click="openConfirmation(props.row)">Delete</button>
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
          <h4 class="text-center">Are you sure you want to delete a suburb?</h4>
        </div>
        <div class="modal-footer">
          <button @click="deleteSuburb">Yes</button>
          <button @click="hideConfirmation">No</button>
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
  FETCH_SUBURBS,
  DELETE_SUBURB
} from '@/store/action-types'

export default {
  name: 'SuburbList',
  components: {
    VueGoodTable
  },
  data () {
    return {
      columns: [
        {
          label: 'Name',
          field: 'name',
          filterable: true
        }, {
          label: 'Postcode',
          field: 'postCode',
          filterable: true
        }, {
          label: '# Services',
          field: 'servicesTotal',
          filterable: false,
          sortable: false
        }, {
          label: 'Action',
          field: 'action',
          html: true,
          width: '190px',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align',
          sortable: false
        }
      ],
      error: {
        code: null,
        text: {
          [FETCH_SUBURBS]: 'The error occurred fetching suburbs',
          [DELETE_SUBURB]: 'The error occurred deleting a suburb'
        }
      }
    }
  },
  mounted () {
    this.loadSuburbs()
  },
  computed: {
    ...mapGetters([
      'getSuburbs'
    ])
  },
  methods: {
    loadSuburbs () {
      try {
        this.$store.dispatch(FETCH_SUBURBS)
      } catch (error) {
        this.error.code = FETCH_SUBURBS
        this.$snack.danger(`${this.error.text[FETCH_SUBURBS]}. \n error: ${JSON.stringify(error)}`)
      }
    },
    async deleteSuburb () {
      try {
        await this.$store.dispatch(DELETE_SUBURB, {_id: this.deleteSuburbId})
        this.hideConfirmation()
      } catch (error) {
        this.$snack.danger(`${this.error.text[DELETE_SUBURB]}. \n error: ${JSON.stringify(error)}`)
        this.hideConfirmation()
      }
    },
    openConfirmation (row) {
      this.deleteSuburbId = row._id
      this.$modal.show('confirmationModal')
    },
    hideConfirmation () {
      this.deleteSuburbId = ''
      this.$modal.hide('confirmationModal')
    }
  }
}
</script>

<style scoped>
.suburb-list-page {
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
</style>
