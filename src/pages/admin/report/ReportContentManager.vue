<template>
  <div class="suburb-list-page">
    <div class="container">
      <div class="pri-pad">
        <div class="row">
          <h3 class="subject-title">Report Content Management</h3>
          <div class="table-actions">
            <button class="btn btn-primary" @click="openContentEditDialog()">
              Add New
            </button>
          </div>
        </div>
        <div class="row">
          <hr class="green-line"/>
          <vue-good-table
            :columns="reportContentColumns"
            :rows="fragments"
            :paginate="true"
            :lineNumbers="true"
            :pagination-options="{ enabled: true, mode: 'page' }"
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field === 'action'">
                <button class="btn btn-default" @click="openContentEditDialog(props.row)">Edit</button>
                <button class="btn btn-danger" @click="openConfirmationModal(props.row)">Delete</button>
              </span>
              <span v-else>
                {{ props.formattedRow[props.column.field] }}
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>
    </div>
    <modals-container/>
      <modal name="confirmationModal" height="auto">
      <confirmation-modal
       :message= "deleteConfirmationMessage"
       @confirmed="deleteFragment"
       @canceled="closeConfirmationModal"
      />
    </modal>
     <modal name="reportContentModal" height="auto">
      <report-content-edit :fragment="fragment" @close="closeReportContentEditModal"/>
    </modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { VueGoodTable } from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import ConfirmationModal from '@/components/core/ConfirmationModal'
import ReportContentEdit from './ReportContentEdit'
import { FETCH_CONTENT_FRAGMENTS, DELETE_CONTENT_FRAGMENT } from '@/store/action-types'
import { FRAGMENT_DELETE_WARNING } from '@/utils/constants'
export default {
  name: 'ReportContentManager',
  components: {
    VueGoodTable,
    ConfirmationModal,
    ReportContentEdit
  },
  data () {
    return {
      reportContentColumns: [
        {
          label: 'Module',
          field: 'moduleCode',
          tdClass: 'vgt-center-align',
          thClass: 'vgt-center-align'
        }, {
          label: 'Content Type',
          field: 'reportContentType',
          tdClass: 'vgt-center-align',
          thClass: 'vgt-center-align'
        }, {
          label: 'Content',
          field: 'contentFragment',
          tdClass: 'vgt-center-align',
          thClass: 'vgt-center-align'
        }, {
          label: 'Upper Bound',
          field: 'upperBound',
          tdClass: 'vgt-center-align',
          thClass: 'vgt-center-align'
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
      fragment: {},
      deleteConfirmationMessage: FRAGMENT_DELETE_WARNING
    }
  },
  async mounted () {
    await this.$store.dispatch(FETCH_CONTENT_FRAGMENTS)
  },
  computed: {
    ...mapState({
      fragments: state => state.contentFragments.fragments
    })
  },
  methods: {
    deleteFragment () {
      this.$store.dispatch(DELETE_CONTENT_FRAGMENT, this.deleteFragmentId)
      this.closeConfirmationModal()
    },
    openContentEditDialog (fragment = {}) {
      this.fragment = fragment
      this.$modal.show('reportContentModal', {}, {
        width: 900,
        height: 'auto',
        scrollable: true,
        clickToClose: false
      })
    },
    closeReportContentEditModal () {
      this.$modal.hide('reportContentModal')
    },
    closeConfirmationModal () {
      this.$modal.hide('confirmationModal')
    },
    openConfirmationModal ({ _id }) {
      this.deleteFragmentId = _id
      this.$modal.show('confirmationModal', {
        width: 800,
        height: 'auto',
        clickToClose: false
      })
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
.service-edit-modal >>> .new-tag-input-wrapper input {
  height: auto;
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
