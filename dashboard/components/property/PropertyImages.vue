<template>
  <section class="property-images-view">
    <div class="images-list">
      <div class="d-flex">
        <v-card flat v-for="(image, i) in images" :key="i" class="property-image" @click.native="onImageClick(i)">
          <v-img
            :src="image.url"
            class="grey lighten-2"
            :width="240"
            :height="180"
          >
            <v-layout
              slot="placeholder"
              fill-height
              align-center
              justify-center
              ma-0
            >
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-layout>
          </v-img>
          <div class="image-delete">
            <v-icon small color="grey lighten-3" @click.stop="onDeleteImageClick(image)">close</v-icon>
          </div>
          <div class="image-edit">
            <v-icon small color="grey lighten-3" @click.stop="onEditImageClick(image)">edit</v-icon>
          </div>
        </v-card>
        <v-card tile class="add-new-image" color="grey lighten-1" @click.native="onAddImageClick">
          <v-icon x-large>add</v-icon>
        </v-card>
      </div>
    </div>

    <v-dialog v-model="carouselDialog" fullscreen>
      <v-card>
        <div class="modal-close">
          <v-btn icon dark @click.native="carouselDialog=false">
            <v-icon>close</v-icon>
          </v-btn>
        </div>
        <v-carousel :cycle="false" :value="imageIndex" @change="onCarouselChange" height="100%">
          <v-carousel-item
            v-for="(image, i) in images"
            :key="i"
            contain
          >
            <img :src="image.url" :alt="image.name">
          </v-carousel-item>
        </v-carousel>
        <div class="comment-text" v-if="imageIndex > -1 && images[imageIndex]">
          <v-chip color="primary" text-color="white">{{images[imageIndex].name}}</v-chip>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editImageDialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="pt-4 pb-0">
          <h3 class="headline">{{editModalTitle}}</h3>
        </v-card-title>
        <v-card-text>
          <v-form ref="inputForm" v-model="validInput" lazy-validation>
            <v-text-field
              v-model="imageUrl"
              :rules="urlRules"
              label="Image Url"
              required
            ></v-text-field>
            <v-text-field
              v-model="imageComment"
              label="Comment"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="onSaveClick">Save</v-btn>
          <v-btn flat @click.native="onCancelClick">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialog" persistent max-width="400px">
      <v-card>
        <v-card-title class="text-xs-center">
          <h4 class="mt-2 title">Are you sure you want to delete the selected image from the property?</h4>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="onDeleteOkClick">OK</v-btn>
          <v-btn flat @click.native="onDeleteCancelClick">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import { UPDATE_PROPERTY_DETAIL } from '@/store/action-types'

export default {
  name: 'PropertyImages',
  props: ['images'],
  data () {
    return {
      carouselDialog: false,
      editImageDialog: false,
      confirmDialog: false,
      imageIndex: -1,
      validInput: true,
      imageUrl: '',
      imageComment: '',
      urlRules: [
        v => !!v || 'Image Url is required',
        v => /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm.test(v) || 'Image Url must be valid'
      ],
      targetImage: null
    }
  },
  computed: {
    isValidUrl () {
      if (this.targetImage) {
        if (!this.images.some(o => o.url === this.imageUrl)) {
          return true
        }
        if (this.targetImage.url === this.imageUrl) {
          return true
        }
        return false
      }
      return !this.images.some(o => o.url === this.imageUrl)
    },
    editModalTitle () {
      return this.targetImage ? 'Edit Image' : 'Add New Image'
    }
  },
  methods: {
    showModal (index) {
      this.imageIndex = index
      this.carouselDialog = true
    },
    onAddImageClick () {
      this.targetImage = null
      this.$refs.inputForm.reset()
      this.editImageDialog = true
    },
    onImageClick (i) {
      this.showModal(i)
    },
    async onSaveClick () {
      if (this.$refs.inputForm.validate()) {
        if (this.isValidUrl) {
          let propertyImages
          if (this.targetImage) { // if edit image
            propertyImages = this.images.map(o => {
              if (o.url === this.targetImage.url) {
                return {
                  ...o,
                  url: this.imageUrl,
                  name: this.imageComment
                }
              }
              return o
            })
          } else {
            propertyImages = [
              ...this.images,
              {
                url: this.imageUrl,
                type: 'photo',
                name: this.imageComment
              }
            ]
          }
          await this.$store.dispatch(UPDATE_PROPERTY_DETAIL, { propertyImages })
          this.editImageDialog = false
        }
      }
    },
    onCancelClick () {
      this.$refs.inputForm.reset()
      this.editImageDialog = false
    },
    onDeleteImageClick (image) {
      this.targetImage = image
      this.confirmDialog = true
    },
    onEditImageClick (image) {
      this.targetImage = image
      this.imageUrl = image.url
      this.imageComment = image.name
      this.editImageDialog = true
    },
    async onDeleteOkClick () {
      await this.deleteImage()
      this.confirmDialog = false
    },
    onDeleteCancelClick () {
      this.confirmDialog = false
    },
    deleteImage () {
      return this.$store.dispatch(UPDATE_PROPERTY_DETAIL, {
        propertyImages: this.images.filter(o => o.url !== this.targetImage.url)
      })
    },
    onCarouselChange (index) {
      if (this.imageIndex !== index) {
        this.imageIndex = index
      }
    }
  }
}
</script>

<style scoped>
.images-list {
  display: flex;
  width: 100%;
  overflow-x: auto;
}
.property-image {
  cursor: pointer;
  margin-right: 8px;
}
.add-new-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 240px;
  max-width: 240px;
  height: 180px;
  cursor: pointer;
}
.v-carousel {
  height: 100vh !important;
}
.modal-close {
  position: absolute;
  width: 52px;
  height: 52px;
  top: 0;
  right: 0;
  z-index: 1;
}
.v-carousel__item >>> .v-responsive__content {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,.5);
}
.image-delete {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
}
.image-edit {
  position: absolute;
  bottom: 8px;
  right: 3px;
  width: 20px;
  height: 20px;
}
.comment-text {
  position: absolute;
  bottom: 0;
  right: 10px;
  height: 50px;
  z-index: 3;
  width: auto;
  display: flex;
  align-items: center;
}
</style>
