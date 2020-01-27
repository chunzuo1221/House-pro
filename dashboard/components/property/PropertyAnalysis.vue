<template>
  <v-card flat class="px-3 py-3">
    <property-images :images="propertyImages" />
    <property-overview :property="property" />
    <property-catchment :property="property" />
  </v-card>
</template>

<script>
import PropertyImages from './PropertyImages'
import PropertyOverview from './PropertyOverview'
import PropertyCatchment from './PropertyCatchment'

export default {
  name: 'PropertyAnalysis',
  props: ['property'],
  components: {
    PropertyImages,
    PropertyOverview,
    PropertyCatchment
  },
  computed: {
    propertyImages () {
      if (this.property && this.property.propertyImages) {
        return this.property.propertyImages
      }
      return []
    }
  }
}
</script>

<style scoped>
</style>
