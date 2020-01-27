<template>
  <div :id="property._id" class="detail-panel" v-bind:class="{'is-shown':isShown}">
    <div class="info-panel">
      <div class="header-panel"><span>{{ property.formatted_address }}</span></div>
      <div class="body-panel"><span>HouseProScore : {{ property.locationScores.overall.value }}</span></div>
    </div>
    <div class="direction-panel"></div>
  </div>
</template>
<script>

export default {
  name: 'PropertyMapMarker',
  inject: ['google', 'map'],
  props: {
    property: {}
  },
  data () {
    return {
      isShown: false,
      location: null,
      overlay: null,
      marker: null,
      point: null,
      isFullScreen: false
    }
  },
  mounted () {
    const self = this
    this.location = {lat: this.property.geometry.location.lat, lng: this.property.geometry.location.lng}
    // Add OverLay
    this.overlay = new this.google.maps.OverlayView()
    this.overlay.draw = function () {}
    this.overlay.setMap(this.map)
    // Add Marker
    const { Marker } = this.google.maps
    if (this.property.clonedFrom) {
      this.marker = new Marker({
        position: this.location,
        map: this.map,
        title: this.property.name,
        icon: './static/images/map_marker_yellow.png'
      })
    } else {
      this.marker = new Marker({
        position: this.location,
        map: this.map,
        title: this.property.name
      })
    }
    // Add Event
    this.google.maps.event.addListener(this.map, 'bounds_changed', function (e) {
      if ($(self.map.getDiv()).children().eq(0).height() === window.innerHeight && $(self.map.getDiv()).children().eq(0).width() === window.innerWidth) {
        self.isFullScreen = true
      } else {
        self.isFullScreen = false
      }
    })
    this.google.maps.event.addListener(this.marker, 'click', function (e) {
      self.$router.push({name: 'Property', params: {propertyId: self.property._id}})
    })
    this.google.maps.event.addListener(this.marker, 'mouseover', function (e) {
      const proj = self.overlay.getProjection()
      const pos = self.marker.getPosition()
      self.point = proj.fromLatLngToContainerPixel(pos)
      self.showDetailPanel()
    })
    this.google.maps.event.addListener(this.marker, 'mouseout', function (e) {
      self.showDetailPanel()
    })
    this.$emit('added-marker', this.marker)
  },
  methods: {
    showDetailPanel () {
      this.isShown = !this.isShown
      setTimeout(() => {
        const object = document.getElementById(this.property._id)
        if (object) {
          const markerHeight = object.offsetHeight
          const difHeight = markerHeight >= 100 ? markerHeight * 0.65 : markerHeight * 0.53
          const scrollY = this.point.y - (difHeight + (window.scrollY > 0 ? 110 : 0) + (this.isFullScreen ? 110 : 0))
          const scrollX = this.point.x - 65
          $('#' + this.property._id).css('top', scrollY)
          $('#' + this.property._id).css('left', scrollX)
        }
      }, 30)
    },
    calculateScore (scores) {
      if (scores && scores.maxScore && scores.maxScore !== 0 && typeof scores.surveyScore !== 'undefined') {
        return `${Number.parseFloat(((scores.surveyScore || 0) / scores.maxScore) * 10).toFixed(1)}`
      }
      return '?'
    }
  }
}
</script>
<style>
.detail-panel {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
  position: absolute;
}
.is-shown {
  visibility: visible;
  opacity: 1;
}
.info-panel {
  display: flex;
  flex-direction: column;
  position: relative;
  background: #FFFFFF;
  padding: 15px;
  border: 1px solid #AAA;
  margin-left: 20px;
  border-radius: 4px;
  height: auto;
  max-width: 350px;
  z-index: 9999999999;
}
.info-panel div {
  margin-top: 3px;
}
.info-panel .header-panel {
  flex: 1;
  font-weight: bold;
}
.info-panel .body-panel {
  height: auto;
}
.action-panel .eader-panel {
  height: 40px;
}
.info-panel .btn {
  margin-right: 15px;
}

.direction-panel {
  height: 0px;
}
.direction-panel:before, .direction-panel:after {
  content: '';
  display: block;
  position: relative;
  bottom: 100%;
  width: 0;
  height: 0;
}
.direction-panel:before {
  left: 50px;
  top: 0px;
  z-index: 9999999999;
  border-style: solid;
  border-width: 14px 14px 14px 14px;
  border-color: #999 transparent transparent transparent;
}
.direction-panel:after {
  left: 50px;
  top: -29px;
  z-index: 9999999999;
  border-style: solid;
  border-width: 14px 14px 14px 14px;
  border-color: #ffffff transparent transparent transparent;
}
</style>
