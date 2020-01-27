<template>
  <div class="data-provider-edit-modal">
    <div class="modal-header">
      <h3 class="text-left">{{providerId ? 'Edit' : 'Add'}} Data Provider</h3>
      <hr class="green-line"/>
    </div>
    <div class="modal-body">
      <div class="row form-group">
        <div class="col-sm-12 d-flex align-center">
          <label class="control-label">Name:</label>
          <input type="text" class="form-control" v-model="providerName" name="providerName">
        </div>
      </div>
      <div class="row form-group">
        <div class="col-sm-12 d-flex align-center">
          <label class="control-label">Description:</label>
          <textarea class="form-control" v-model="description" name="description" rows="3"></textarea>
        </div>
      </div>
      <div class="row form-group">
        <div class="col-sm-12 d-flex align-center">
          <label class="control-label">Get ExtId Url:</label>
          <input type="text" class="form-control" v-model="resolveExtIDUrl" name="resolveExtIDUrl">
        </div>
      </div>
      <div class="row form-group">
        <div class="col-sm-12 d-flex align-center">
          <label class="control-label">Get Property Url:</label>
          <input type="text" class="form-control" v-model="getExtPropertyDetailsUrl" name="getExtPropertyDetailsUrl">
        </div>
      </div>
      <div class="row form-group">
        <div class="col-sm-12 d-flex align-center">
          <label class="control-label">Process Data Url:</label>
          <input type="text" class="form-control" v-model="processExternalResponseUrl" name="processExternalResponseUrl">
        </div>
      </div>
    </div>
    <div class="modal-footer pt-3 px-0 d-flex justify-end align-center">
      <button class="btn btn-primary mx-3" @click="onSaveClicked">Save</button>
      <button class="btn btn-default" @click="onCancelClicked">Cancel</button>
    </div>
  </div>
</template>

<script>
import { SAVE_SUBURB_DATA_PROVIDER } from '@/store/action-types'

export default {
  name: 'DataProviderEdit',
  props: {
    provider: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      providerId: '',
      providerName: '',
      description: '',
      resolveExtIDUrl: '',
      getExtPropertyDetailsUrl: '',
      processExternalResponseUrl: ''
    }
  },
  created () {
    this.providerId = this.provider._id
    this.providerName = this.provider.name
    this.description = this.provider.description
    this.resolveExtIDUrl = this.provider.resolveExtIDUrl
    this.getExtPropertyDetailsUrl = this.provider.getExtPropertyDetailsUrl
    this.processExternalResponseUrl = this.provider.processExternalResponseUrl
  },
  methods: {
    onSaveClicked () {
      if (!this.providerName || !this.providerName.trim().length) {
        this.$snack.danger({
          text: 'Input Error! The provider name must not be empty'
        })
        return
      }
      const provider = {
        _id: this.providerId,
        name: this.providerName,
        description: this.description,
        resolveExtIDUrl: this.resolveExtIDUrl,
        getExtPropertyDetailsUrl: this.getExtPropertyDetailsUrl,
        processExternalResponseUrl: this.processExternalResponseUrl
      }
      this.$store.dispatch(SAVE_SUBURB_DATA_PROVIDER, {provider})
      this.$emit('close')
    },
    onCancelClicked () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.data-provider-edit-modal {
  padding: 24px;
}
.modal-header {
  padding: 0;
  border-bottom: none;
}
.control-label {
  min-width: 160px;
}
button {
  min-width: 100px;
}
.data-provider-edit-modal >>> textarea {
  resize: vertical;
  min-height: 80px;
  font-size: 16px;
}
</style>
