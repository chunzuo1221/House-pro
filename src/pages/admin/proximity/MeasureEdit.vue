<template>
  <div class="measure-edit-modal">
    <div class="modal-header">
      <h3 class="text-left">Add/Edit Measure</h3>
      <hr class="green-line"/>
    </div>
    <div class="modal-body">
      <div class="row form-group">
        <label class="control-label col-sm-3 text-left" for="order">Order:</label>
        <div class="col-sm-9">
          <input type="number" class="form-control" v-model="order" name="order">
        </div>
      </div>
      <div class="row form-group">
        <label class="control-label col-sm-3 text-left">Travel mode:</label>
        <div class="col-sm-9">
          <el-select
            v-model="selectedTravelMode"
            class="fluid"
            placeholder="Select Category"
          >
            <el-option v-for="item in trvelModes" :key="item.value" :label="item.text" :value="item.value"/>
          </el-select>
        </div>
      </div>
      <div class="row form-group">
        <label class="control-label col-sm-3 text-left">Units:</label>
        <div class="col-sm-9">
          <el-select
            v-model="selectedUnits"
            class="fluid"
            placeholder="Select Units"
          >
            <el-option v-for="item in units" :key="item.value" :label="item.text" :value="item.value"/>
          </el-select>
        </div>
      </div>
      <div class="row form-group">
        <label class="control-label col-sm-3 text-left">Upper bound:</label>
        <div class="col-sm-9">
          <input type="number" class="form-control" v-model="upperBound" name="upperBound">
        </div>
      </div>
      <div class="row">
        <label class="control-label col-sm-3 text-left">Score:</label>
        <div class="col-sm-9">
          <input type="number" class="form-control" v-model="score" name="score">
        </div>
      </div>
    </div>
    <div class="modal-footer px-0 d-flex justify-space-between align-center">
      <label class="d-flex fluid error-text">{{error.code ? error.text[error.code] : ''}}</label>
      <div class="d-flex">
        <button class="btn btn-primary mx-3" @click="onSaveClicked">Save</button>
        <button class="btn btn-default" @click="onCancelClicked">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { SAVE_MEASURE } from '@/store/action-types'

export default {
  name: 'MeasureEdit',
  props: {
    measure: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      order: null,
      selectedTravelMode: null,
      selectedUnits: null,
      upperBound: null,
      score: null,
      error: {
        code: null,
        text: {
          INPUT_ERROR: 'Input error! Every field must not be empty.'
        }
      }
    }
  },
  created () {
    this.selectedTravelMode = this.measure.travelMode
    this.upperBound = this.measure.upperBound
    this.selectedUnits = this.measure.units
    this.score = this.measure.score
    this.order = this.measure.order
  },
  mounted () {
  },
  computed: {
    trvelModes () {
      let values = [
        {value: '', text: ''},
        {value: 'walking', text: 'Walking'},
        {value: 'driving', text: 'Driving'},
        {value: 'transit', text: 'Transit'}
      ]
      return values
    },
    units () {
      let values = [
        {value: '', text: ''},
        {value: 'metres', text: 'Metres'},
        {value: 'seconds', text: 'Seconds'}
      ]
      return values
    }
  },
  methods: {
    onSaveClicked () {
      if (!this.order || !this.score) {
        this.error.code = 'INPUT_ERROR'
        setTimeout(() => {
          this.error.code = ''
        }, 3000)
        return
      }
      let measure = {}
      if (this.measure._id) {
        measure = {
          _id: this.measure._id,
          travelMode: this.selectedTravelMode,
          upperBound: this.upperBound,
          units: this.selectedUnits,
          score: this.score,
          order: this.order
        }
        if (this.measure.isNew) {
          measure.isNew = this.measure.isNew
        }
      } else {
        measure = {
          _id: this.generateId(),
          travelMode: this.selectedTravelMode,
          upperBound: this.upperBound,
          units: this.selectedUnits,
          score: this.score,
          order: this.order,
          isNew: true
        }
      }
      this.$store.dispatch(SAVE_MEASURE, {measure})
      this.$emit('close')
    },
    onCancelClicked () {
      this.$emit('close')
    },
    generateId () {
      let id = ''
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < 13; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      return id
    }
  }
}
</script>

<style scoped>
.measure-edit-modal {
  padding: 24px;
}
button {
  min-width: 100px;
}
.modal-header {
  padding: 0;
  border-bottom: none;
}
.measure-edit-modal >>> .new-tag-input-wrapper input {
  height: auto;
}
.measure-edit-modal >>> .tag {
  background-color: #528EC1;
}
.measure-edit-modal >>> .modal-body {
  padding: 8px;
}
.error-text {
  color: #a94442;
}
</style>
