<template>
  <v-dialog v-model="dialog" width="600" persistent>
    <v-btn slot="activator" color="primary" outline dark>Edit</v-btn>
    <v-card>
      <v-toolbar color="elevation-0" flat>
        <v-toolbar-title>
          {{title}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon @click="dialog = false" class="close-button">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <wysiwyg v-model="text"/>
      </v-card-text>
      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="onSaveClick">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'RichTextEditModal',
  props: {
    title: {
      type: String,
      required: false
    },
    defaultText: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      dialog: false,
      text: ''
    }
  },
  mounted () {
    this.text = this.defaultText
  },
  watch: {
    defaultText (text) {
      this.text = text
    }
  },
  methods: {
    onSaveClick () {
      this.$emit('save', this.text)
      this.dialog = false
    }
  }
}
</script>

<style scoped>
.close-button.v-btn {
  margin-right: -12px;
}
</style>
