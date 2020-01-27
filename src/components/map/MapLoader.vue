<template>
  <div class="map-loader">
    <div class="property-map" ref="map"></div>
    <template v-if="!!this.googleApi && !!this.map">
      <map-provider :google="googleApi" :map="map">
        <slot/>
      </map-provider>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MapProvider from './MapProvider'

export default {
  props: {
    mapConfig: null
  },
  components: {
    MapProvider
  },
  data () {
    return {
      map: null,
      bounds: null
    }
  },
  computed: {
    ...mapState({
      googleApi: state => state.config.googleApi
    })
  },
  mounted () {
    this.initializeMap()
  },
  methods: {
    async initializeMap () {
      if (this.googleApi) {
        const mapContainer = this.$refs.map
        const { Map } = this.googleApi.maps
        const option = {
          mapTypeId: this.googleApi.maps.MapTypeId.ROADMAP
        }
        this.map = new Map(mapContainer, option)
        this.setBounds()
      }
    },
    setBounds () {
      if (this.mapConfig && this.googleApi && this.googleApi.maps) {
        this.bounds = new this.googleApi.maps.LatLngBounds()
        for (var i = 0; i < this.mapConfig.length; i++) {
          this.bounds.extend(this.mapConfig[i])
        }
        this.map.fitBounds(this.bounds)
      }
    }
  },
  watch: {
    mapConfig () {
      this.setBounds()
    },
    googleApi (val) {
      if (val) {
        this.initializeMap()
      }
    }
  }
}
</script>

<style scoped>
.map-loader .property-map {
  height: 70vh;
  width: 100%;
}
</style>
