<template>
  <div class="response-edit-modal">
    <div class="modal-header">
      <h3 class="text-left">{{ id ? 'Edit' : 'Add'}} Content Item</h3>
      <hr class="green-line"/>
    </div>
    <div class="modal-body">
        <div class="row form-group">
        <div class="col-sm-3 d-flex align-center">
          <label class="control-label long mb-1">Module:</label>
        </div>
        <div class="col-sm-9 d-flex align-center">
            <el-select
              id="moduleFilter"
              v-model="contentModule"
              class="fluid"
              placeholder="Select Module"
              noDataText="No data"
            >
              <el-option v-for="item in moduleOptions" :key="item.value" :label="item.text" :value="item.value"/>
            </el-select>
        </div>
      </div>
        <div class="row form-group">
        <div class="col-sm-3 d-flex align-center">
          <label class="control-label long mb-1">Content Type:</label>
        </div>
        <div class="col-sm-9 d-flex align-center">
            <el-select
              id="contentTypeFilter"
              v-model="contentType"
              class="fluid"
              placeholder="Select Content Type"
              noDataText="No data"
            >
              <el-option v-for="item in contentTypeOptions" :key="item.value" :label="item.text" :value="item.value"/>
            </el-select>
        </div>
      </div>
       <div class="row form-group">
        <div class="col-sm-3">
          <label class="control-label mb-1">Content:</label>
        </div>
        <div class="col-sm-9">
          <textarea class="form-control" v-model="content" placeholder="Enter content"/>
        </div>
      </div>
      <div class="row form-group">
        <div class="col-sm-3 d-flex align-center">
          <label class="control-label long mb-1">Upper bound:</label>
        </div>
        <div class="col-sm-9 d-flex align-center">
          <input type="number" class="form-control" v-model="upperBound" placeholder="Enter upper bound">
        </div>
      </div>
    </div>
    <div class="modal-footer mt-3 pt-3 px-0 d-flex justify-end align-center">
      <button class="btn btn-primary mx-3" @click="onSaveClicked">Save</button>
      <button class="btn btn-default" @click="onCancelClicked">Cancel</button>
    </div>
    <modals-container/>
    <modal name="unsavedChangesWarning" height="auto">
      <confirmation-modal
       :message= "unsavedWarning"
       @confirmed="onConfirmationModal"
       @canceled="closeConfirmationModal" />
    </modal>
  </div>
</template>

<script>
import { FETCH_QUESTION_CLASSIFICATION, FETCH_REPORT_CONTENT_TYPES, SAVE_CONTENT_FRAGMENTS } from '@/store/action-types'
import { SET_CONTENT_FRAGMENTS_ERROR } from '@/store/mutation-types'
import { mapState } from 'vuex'
import { isEqual, cloneDeep } from 'lodash'
import ConfirmationModal from '@/components/core/ConfirmationModal'
import { UNSAVED_WARNING } from '@/utils/constants'
export default {
  name: 'ReportcontentEdit',
  components: {
    ConfirmationModal
  },
  props: {
    fragment: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      id: '',
      contentModule: '',
      contentType: '',
      content: '',
      upperBound: '',
      oldFragment: '',
      unsavedWarning: UNSAVED_WARNING
    }
  },
  computed: {
    ...mapState({
      questionClassification: state => state.reference.questionClassification,
      reportContentTypes: state => state.reference.reportContentTypes,
      error: state => state.contentFragments.error
    }),
    moduleOptions () {
      let options = []
      if (this.questionClassification && this.questionClassification.modules) {
        const modules = this.questionClassification.modules.map(o => ({ value: o.code, text: o.text }))
        if (modules.length) {
          options = options.concat(modules)
        }
      }
      return options
    },
    contentTypeOptions () {
      let contentTypes = []
      if (this.reportContentTypes && this.reportContentTypes.types) {
        const types = this.reportContentTypes.types.map(o => ({ value: o.code, text: o.text }))
        if (types.length) {
          contentTypes = contentTypes.concat(types)
        }
      }
      return contentTypes
    }
  },
  async mounted () {
    this.oldFragment = this.fragment
    this.unsavedWarning = UNSAVED_WARNING
    this.$store.dispatch(FETCH_REPORT_CONTENT_TYPES)
    this.$store.dispatch(FETCH_QUESTION_CLASSIFICATION)
  },
  async created () {
    this.$store.dispatch(FETCH_QUESTION_CLASSIFICATION)
    if (this.fragment._id) {
      this.id = this.fragment._id
    }
    this.contentModule = this.fragment.moduleCode
    this.contentType = this.fragment.reportContentType
    this.content = this.fragment.contentFragment
    this.upperBound = this.fragment.upperBound
  },
  methods: {
    async onSaveClicked () {
      let errorText
      if (!this.contentModule || !this.contentModule.trim().length) {
        errorText = 'Input Error! The module code field must not be empty'
      } else if (!this.contentType || !this.contentType.trim().length) {
        errorText = 'Input Error! The Content Type field must not be empty'
      } else if (!this.content || !this.content.trim().length) {
        errorText = 'Input Error! The Content field must not be empty'
      } else if (isNaN(this.upperBound)) {
        errorText = 'Input Error! The Upper Bound field must be a valid number'
      }
      if (errorText) {
        this.$snack.danger({
          text: errorText
        })
        return
      }
      const fragment = {
        _id: this.id,
        moduleCode: this.contentModule,
        reportContentType: this.contentType,
        contentFragment: this.content,
        upperBound: this.upperBound
      }
      await this.$store.dispatch(SAVE_CONTENT_FRAGMENTS, {fragment})
      if (this.error) {
        this.$snack.danger({
          text: this.error
        })
        this.$store.commit(SET_CONTENT_FRAGMENTS_ERROR, null)
      } else {
        this.$emit('close')
      }
    },
    onConfirmationModal () {
      this.$modal.hide('unsavedChangesWarning')
      this.$emit('close')
    },
    closeConfirmationModal () {
      this.$modal.hide('unsavedChangesWarning')
    },
    checkForUnsavedChanges (oldFragment, currentFragment) {
      if (!isEqual(oldFragment, currentFragment)) {
        this.$modal.show('unsavedChangesWarning', {
          width: 400,
          height: 'auto',
          clickToClose: false
        })
      } else {
        this.$emit('close')
      }
    },
    onCancelClicked () {
      const fragment = cloneDeep(this.oldFragment)
      fragment._id = this.id
      fragment.moduleCode = this.contentModule
      fragment.reportContentType = this.contentType
      fragment.contentFragment = this.content
      fragment.upperBound = this.upperBound
      if (this.contentModule || this.contentType || this.content || this.upperBound) {
        this.checkForUnsavedChanges(this.oldFragment, fragment)
      } else {
        this.$emit('close')
      }
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
