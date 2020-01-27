<template>
  <div class="penalty-modal">
    <div class="modal-header">
      <h4 class="text-left">Add Penalty Option</h4>
      <hr>
    </div>
    <div class="modal-body">
      <div class="d-flex align-center mb-2">
        <label class="control-label">Place Name:</label>
        <input type="text" v-model="placeName" name="placeName">
      </div>
      <div class="row form-group">
        <div class="col-sm-6 d-flex align-center">
          <label class="control-label">Penalty:</label>
          <input type="number" v-model="amount" name="amount">
        </div>
      </div>
    </div>
    <div class="modal-footer mt-3 pt-3 px-0">
      <button class="btn btn-primary" @click="savePenalty">Save</button>
      <button class="btn btn-default" @click="hideModal">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PenaltyModal',
  props: ['bonuses'],
  data () {
    return {
      placeName: '',
      amount: 0
    }
  },
  methods: {
    getAddressData (addressData, placeResultData, id) {
      this.placeName = placeResultData.name
    },
    savePenalty () {
      if (!this.placeName || !this.placeName.trim().length) {
        this.$snack.danger({
          text: 'Input Error! The placeID field must be valid Google place ID',
          close: true
        })
        return
      }
      if (this.bonuses.length) {
        if (this.bonuses.findIndex(o => o.placeName === this.placeName) > -1) {
          this.$snack.danger({
            text: 'Input Error! The place already exists',
            close: true
          })
          return
        }
      }
      this.hideModal({
        placeName: this.placeName,
        amount: Number(this.amount)
      })
    },
    hideModal (newPenalty) {
      this.$emit('close', newPenalty)
    }
  }
}
</script>

<style scoped>
.penalty-modal {
  padding: 24px;
}
.modal-header {
  padding: 20px 0 0 0;
  border-bottom: none;
}
.control-label {
  min-width: 120px;
}
.control-height {
  height: 42px;
}
</style>
