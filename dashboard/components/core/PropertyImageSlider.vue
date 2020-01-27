<template>
  <div class="property-image-slider">
    <v-carousel
      :cycle="false"
      hide-delimiters
      class="carousel"
      v-if="propertyImages.length"
    >
      <v-carousel-item
        v-for="(image, i) in propertyImages"
        :key="i"
        :src="image.url"
      ></v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import lget from 'lodash.get'
import { mapState } from 'vuex'

export default {
  name: 'PropertyImageSlider',
  computed: {
    ...mapState({
      currentProperty: state => state.portfolio.currentProperty.property
    }),
    propertyImages () {
      return lget(this.currentProperty, 'propertyImages', [])
    }
  }
}
</script>

<style lang="scss" scoped>
.property-image-slider {
  display: flex;
  justify-content: center;
  width: 100%;
  height: auto;

  .carousel {
    max-width:900px;
  }
}
</style>
