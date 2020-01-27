<template>
  <div class="address-mappings-modal">
    <div class="modal-header">
      <h4 class="text-left">Manage Address Mappings</h4>
      <hr>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-sm-9">
          <div class="d-flex align-center mb-2">
            <label class="control-label">Source Name:</label>
            <input type="text" v-model.trim="source" name="source">
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-sm-9">
          <div class="d-flex justify-space-between">
            <div class="d-flex align-center fluid">
              <label class="control-label">Available Names:</label>
              <div class="fluid">
                <input type="text" v-model.trim="options" name="options">
                <small>(It's allowed to give several options separated by comma)</small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-3 d-flex justify-end">
          <button class="btn btn-primary" @click="onAddMappingClick">Add Mapping</button>
        </div>
      </div>
      <hr/>
      <vue-good-table
        :columns="columns"
        :rows="mappingUpdates"
        :paginate="false"
      >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'action'">
            <button class="btn btn-danger" @click="onDeleteMappingClick(props.row)">Delete</button>
          </span>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>
    <div class="modal-footer mt-3 pt-3 px-0">
      <button class="btn btn-primary" :disabled="!changed" @click="onOkClick">OK</button>
      <button class="btn btn-default" @click="onCancelClick">Cancel</button>
    </div>
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table'
import { isEqual } from '@/utils'

export default {
  name: 'AddressMappingsModal',
  components: {
    VueGoodTable
  },
  props: ['mappings'],
  data () {
    return {
      source: '',
      options: '',
      columns: [
        {
          label: 'Source Name',
          field: 'source'
        },
        {
          label: 'Available Names',
          field: 'options'
        },
        {
          label: 'Action',
          field: 'action',
          html: true,
          width: '100px',
          thClass: 'vgt-center-align',
          tdClass: 'vgt-center-align',
          sortable: false
        }
      ],
      mappingUpdates: [...this.mappings]
    }
  },
  computed: {
    changed () {
      return !isEqual(this.mappings, this.mappingUpdates)
    }
  },
  methods: {
    onAddMappingClick () {
      if (this.source && this.options) {
        if (this.mappingUpdates.some(o => o.source === this.source)) {
          this.$snack.danger('That source name has been already defined!')
          this.source = ''
          return
        }
        this.mappingUpdates.push({
          source: this.source,
          options: this.options
        })
        this.source = ''
        this.options = ''
      }
    },
    onDeleteMappingClick (row) {
      this.mappingUpdates.splice(this.mappingUpdates.findIndex(o => o.source === row.source), 1)
    },
    onOkClick () {
      this.hideModal(this.mappingUpdates)
    },
    onCancelClick () {
      this.hideModal()
    },
    hideModal (mappingUpdates) {
      this.$emit('close', mappingUpdates)
    }
  }
}
</script>

<style scoped>
.address-mappings-modal {
  padding: 24px;
}
.modal-header {
  padding: 20px 0 0 0;
  border-bottom: none;
}
.control-label {
  min-width: 160px;
}
.control-height {
  height: 42px;
}
</style>
