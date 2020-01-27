<template>
    <div class="confirmation-modal">
        <div class="modal-content">
            <div class="text-center" v-html="message"></div>
        </div>
        <div class="modal-footer">
            <button @click="onConfirm">Yes</button>
            <button @click="onCancel">No</button>
        </div>
    </div>
</template>

<script>

export default {
  name: 'ConfirmationModal',
  props: ['message'],
  methods: {
    onConfirm () {
      this.$emit('confirmed')
    },
    onCancel () {
      this.$emit('canceled')
    }
  }
}

</script>

<style scoped>

.modal-enter {
  opacity: 0;
}
.confirmation-modal .modal-content div {
  padding-top: 30px;
  padding-bottom: 20px;
}
.confirmation-modal button {
  padding:  10px 40px;
  border: 1px solid black;
}
.confirmation-modal button:hover,
.confirmation-modal button:focus {
  border: none;
}
.confirmation-modal .modal-content {
  box-shadow: none;
  padding: 0px 20px;
}
.confirmation-modal .modal-footer {
  padding-top: 20px;
  padding-bottom: 20px;
}

</style>
