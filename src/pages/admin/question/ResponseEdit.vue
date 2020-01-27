<template>
  <div class="response-edit-modal">
    <div class="modal-header">
      <h3 class="text-left">{{responseId ? 'Edit' : 'Add'}} Survey Response</h3>
      <hr class="green-line"/>
    </div>
    <div class="modal-body">
      <div class="row form-group">
        <!-- Question Panel -->
        <div class="col-sm-3 d-flex align-center">
          <label class="control-label">Code:</label>
          <input type="text" class="form-control short" v-model="responseCode" placeholder="Enter code">
        </div>
        <div class="col-sm-3 d-flex align-center">
          <label class="control-label">Score:</label>
          <input type="number" class="form-control short" v-model="responseScore" placeholder="Enter score">
        </div>
        <div class="col-sm-3 d-flex align-center">
          <label class="control-label">Order:</label>
          <input type="number" class="form-control short" v-model="responseOrder" placeholder="Enter order">
        </div>
      </div>

      <div class="row form-group">
        <div class="col-sm-12 d-flex align-center">
          <label class="control-label long mb-1">Response Text:</label>
        </div>
        <div class="col-sm-12 d-flex align-center">
          <input type="text" class="form-control" v-model="responseText" placeholder="Enter text">
        </div>
      </div>

      <div class="row form-group">
        <div class="col-sm-12">
          <label class="control-label mb-1">Response Commentary:</label>
        </div>
        <div class="col-sm-12">
          <textarea class="form-control" v-model="responseCommentary" placeholder="Enter commentary"/>
        </div>
      </div>
    </div>

    <div class="modal-footer mt-3 pt-3 px-0 d-flex justify-end align-center">
      <button class="btn btn-primary mx-3" @click="onSaveClicked">Save</button>
      <button class="btn btn-default" @click="onCancelClicked">Cancel</button>
    </div>
  </div>
</template>

<script>
import { SAVE_QUESTION_RESPONSE } from '@/store/action-types'

export default {
  name: 'ResponseEdit',
  props: {
    response: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      responseId: '',
      responseCode: '',
      responseScore: '',
      responseOrder: '',
      responseText: '',
      responseCommentary: ''
    }
  },
  created () {
    this.responseId = this.response._id
    this.responseCode = this.response.responseCode
    this.responseText = this.response.responseText
    this.responseScore = this.response.responseScore
    this.responseOrder = this.response.responseOrder
    this.responseCommentary = this.response.responseCommentary
  },
  methods: {
    onSaveClicked () {
      let errorText
      if (!this.responseCode || !this.responseCode.trim().length) {
        errorText = 'Input Error! The Code field must not be empty'
      } else if (!this.responseText || !this.responseText.trim().length) {
        errorText = 'Input Error! The Text field must not be empty'
      } else if (isNaN(this.responseScore)) {
        errorText = 'Input Error! The Score field must be a valid number'
      }
      if (errorText) {
        this.$snack.danger({
          text: errorText
        })
        return
      }
      const response = {
        _id: this.responseId,
        responseCode: this.responseCode,
        responseText: this.responseText,
        responseOrder: this.responseOrder,
        responseScore: Number(this.responseScore),
        responseCommentary: this.responseCommentary
      }
      this.$store.dispatch(SAVE_QUESTION_RESPONSE, {response})
      this.$emit('close')
    },
    onCancelClicked () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.response-edit-modal {
  padding: 24px;
}
button {
  min-width: 100px;
}
.modal-header {
  padding: 0;
  border-bottom: none;
}
.response-edit-modal >>> .new-tag-input-wrapper input {
  height: auto;
}
.response-edit-modal >>> .tag {
  background-color: #528EC1;
}
.control-label {
  min-width: 50px;
}
.control-label.long {
  min-width: 140px;
}
.form-control {
  font-size: 16px;
}
.form-control.short {
  max-width: 100px;
}
</style>
