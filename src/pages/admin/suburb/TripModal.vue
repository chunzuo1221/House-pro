<template>
  <div class="trip-modal">
    <div class="modal-header">
      <h4 class="text-left">Add Trip Option</h4>
      <hr>
    </div>
    <div class="modal-body">
      <div class="row form-group">
        <div class="col-sm-9 d-flex align-center">
          <label class="control-label">Start Time:</label>
          <el-select
            v-model="startDow"
            placeholder="Day of Week"
            :disabled="true"
          >
            <el-option v-for="item in daysOfWeek" :key="item" :label="item" :value="item"/>
          </el-select>
          <el-time-picker
            v-model="startTime"
            placeholder="Time"
            class="start-time"
            format="HH:mm"
            size="medium"
          />
        </div>
        <div class="col-sm-3 d-flex align-center control-height">
          <el-checkbox v-model="returnTrip">Return Trip?</el-checkbox>
        </div>
      </div>
    </div>
    <div class="modal-footer mt-3 pt-3 px-0">
      <button class="btn btn-primary" @click="saveTrip">Save</button>
      <button class="btn btn-default" @click="hideTripModal()">Cancel</button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'TripModal',
  props: ['trips'],
  data () {
    return {
      startDow: 'Mon',
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      startTime: new Date(),
      returnTrip: true
    }
  },
  methods: {
    saveTrip () {
      if (!this.startDow || !this.startTime) {
        this.$snack.danger({
          text: 'Input Error! The Day of Week and Time field must not be empty',
          close: true
        })
        return
      }
      const startTime = `${moment(new Date(this.startTime)).format('HH:mm')}`
      if (this.trips.length) {
        if (this.trips.findIndex(o => o.time === startTime) > -1) {
          this.$snack.danger({
            text: 'Input Error! The start time already exists',
            close: true
          })
          return
        }
      }
      this.hideTripModal({
        name: `Trip ${this.trips.length + 1}`,
        time: startTime,
        returnTrip: this.returnTrip
      })
    },
    hideTripModal (newTrip) {
      this.$emit('close', newTrip)
    }
  }
}
</script>

<style scoped>
.trip-modal {
  padding: 24px;
}
.modal-header {
  padding: 20px 0 0 0;
  border-bottom: none;
}
.trip-modal >>> .modal-body .start-time input {
  padding-left: 2em;
}
.control-label {
  min-width: 100px;
}
.control-height {
  height: 42px;
}
.trip-modal >>> .el-checkbox__label {
  font-size: 16px;
  font-weight: normal;
}
.trip-modal >>> .el-checkbox__input.is-checked+.el-checkbox__label {
  color: black;
}
.trip-modal >>> .el-checkbox__label {
  color: black;
}
.trip-modal >>> .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #528EC1;
  border-color: #528EC1;
}
.trip-modal >>> .el-checkbox__inner:hover {
  border-color: #528EC1;
}
.trip-modal >>> .el-checkbox__inner {
  width: 18px;
  height: 18px;
}
.trip-modal >>> .el-checkbox__inner::after {
  top: 3px;
  left: 6px;
}
</style>
