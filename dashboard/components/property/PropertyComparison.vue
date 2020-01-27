<template>
  <v-container pa-1>
    <v-layout row wrap>
      <v-flex xs4 v-for="(n, i) in 3" :key="i">
        <v-card class="mx-1" height="calc(100vh - 300px)">
          <v-toolbar color="grey lighten-2 elevation-0" dense>
            <v-toolbar-title>{{i === 0 ? 'Current Property' : `Property #${n}`}}</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text v-if="comparedProperties[i]">
            <div class="subtitle">{{propertyAddress(comparedProperties[i])}}</div>
            <v-divider color="#528EC1" class="mx-1 my-3"></v-divider>
            <v-responsive aspect-ratio="1/1" class="ma-1">
              <gmap-map
                :ref="`mapRef${i}`"
                :center="getPropertyLocation(comparedProperties[i])"
                :zoom="12"
                map-type-id="roadmap"
                style="width: 100%; height: 200px"
                :options="{
                  zoomControl: false,
                  scaleControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  streetViewControl: false
                }"
              >
                <gmap-marker
                  :position="getPropertyLocation(comparedProperties[i])"
                  :clickable="true"
                />
              </gmap-map>
            </v-responsive>
          </v-card-text>
          <v-card-text v-else class="text-xs-center">
            Select a property to compare
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 class="px-1">
        <property-comparison-dialog></property-comparison-dialog>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import PropertyComparisonDialog from './PropertyComparisonDialog'

export default {
  name: 'PropertyComparison',
  props: ['property'],
  components: {
    PropertyComparisonDialog
  },
  computed: {
    ...mapState({
      comparedPropertyIds: state => state.portfolio.comparedPropertyIds,
      properties: state => state.portfolio.properties
    }),
    comparedProperties () {
      return this.comparedPropertyIds.map(propertyId => this.properties.find(o => o._id === propertyId))
    }
  },
  methods: {
    propertyAddress (property) {
      if (property && property.name) {
        return property.name
      }
      return ''
    },
    getPropertyLocation (property) {
      if (property && property.geometry && property.geometry) {
        return property.geometry.location
      }
      return null
    }
  }
}
</script>
