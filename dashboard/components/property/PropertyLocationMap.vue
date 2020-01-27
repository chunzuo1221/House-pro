<template>
  <div class="property-map">
    <div class="filters-overlay">
      <v-layout row wrap>
        <v-flex xs12 sm4>
          <v-select
            :items="categoryOptions"
            v-model="serviceCategory"
            label="Category"
            box
            hide-details
          ></v-select>
        </v-flex>
        <v-flex xs12 sm4>
          <v-select
            :items="serviceTypeOptions"
            v-model="serviceType"
            label="Type"
            box
            hide-details
          ></v-select>
        </v-flex>
        <v-flex xs12 sm4>
          <v-select
            :items="serviceSubTypeOptions"
            v-model="serviceSubType"
            label="Sub-Type"
            box
            hide-details
          ></v-select>
        </v-flex>
      </v-layout>
    </div>
    <gmap-map
      ref="mapRef"
      :center="propertyLocation"
      :zoom="12"
      map-type-id="roadmap"
      style="width: 100%; height: 40vh"
    >
      <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false" :z-index="4">
        <div class="mapInfoTile">
          <a v-if="infoContent.propertyUrl" :href="infoContent.propertyUrl" target="_blank">
            <img class="property-image" v-if="infoContent.image" :src="infoContent.image">
            <b>{{ infoContent.name }}</b>
            <br/>
            <small>{{ infoContent.details }}</small>
          </a>
          <div v-else>
            <b>{{ infoContent.name }}</b>
            <br/>
            <small>{{ infoContent.details }}</small>
          </div>
        </div>
      </gmap-info-window>
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :z-index="m.position === propertyLocation ? 1 : 0"
        :icon.sync="m.position === propertyLocation ? propertyMarker : serviceMarker"
        @click="onMarkerClick(m, index)"
      />
    </gmap-map>
    <v-layout row wrap>
      <v-flex sm6 mt-3>
      </v-flex>
    </v-layout>
    <h4 class="title mt-3">
      Walkable Services and Features
    </h4>
    <v-layout row wrap>
      <v-flex sm6 mt-3>
        <v-data-table
          :headers="walkableServiceHeaders"
          :items="walkableServices"
          class="elevation-3"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-center">{{ props.item.distance }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <h4 class="title mt-3">
      Other Services and Features
    </h4>
    <v-layout row wrap>
      <v-flex sm12 mt-3>
        <v-data-table
          :headers="otherServicesHeaders"
          :items="otherServices"
          class="elevation-3"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-center">{{ props.item.departAt }}</td>
            <td class="text-xs-center">{{ props.item.travelMode }}</td>
            <td class="text-xs-center">{{ props.item.distance }}</td>
            <td class="text-xs-center">{{ props.item.travelTime }}</td>
            <td class="text-xs-center">{{ props.item.arriveAt }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import { gmapApi } from 'vue2-google-maps'
import {
  getPrettyDistance,
  getPrettyDuration,
  uniqueArray
} from '@/utils'

export default {
  name: 'PropertyLocationMap',
  data () {
    return {
      walkableServiceHeaders: [
        {
          text: 'Service Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Distance',
          align: 'center',
          sortable: false,
          value: 'distance'
        }
      ],
      otherServicesHeaders: [
        {
          text: 'Service Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Depart At',
          align: 'center',
          sortable: false,
          value: 'departAt'
        },
        {
          text: 'Travel Mode',
          align: 'center',
          sortable: false,
          value: 'travelMode'
        },
        {
          text: 'Distance',
          align: 'center',
          sortable: false,
          value: 'distance'
        },
        {
          text: 'Travel Time',
          align: 'center',
          sortable: false,
          value: 'travelTime'
        },
        {
          text: 'Arrive At',
          align: 'center',
          sortable: false,
          value: 'arriveAt'
        }
      ],
      serviceCategory: 'school',
      serviceType: '',
      serviceSubType: '',
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      infoWindowPos: null,
      infoWinOpen: false,
      infoContent: '',
      currentMidx: null
    }
  },
  computed: {
    ...mapState({
      currentProperty: state => state.portfolio.currentProperty.property,
      suburb: state => state.portfolio.currentProperty.suburb,
      proximityAssessment: state => state.portfolio.currentProperty.proximityAssessment,
      serviceClassification: state => state.reference.serviceClassification
    }),
    propertyLocation () {
      if (this.currentProperty && this.currentProperty.geometry && this.currentProperty.geometry) {
        return this.currentProperty.geometry.location
      }
      return null
    },
    propertyImageThumbnail () {
      if (this.currentProperty.propertyImages && this.currentProperty.propertyImages[0]) {
        return this.currentProperty.propertyImages[0].url
      }
      return ''
    },
    propertyExtInfo () {
      if (this.currentProperty.externalData && this.currentProperty.externalData[0] && this.currentProperty.externalData[0].dataRecords) {
        return this.currentProperty.externalData[0].dataRecords.lot
      }
      return 'No External Data'
    },
    markers () {
      let markers = []
      if (this.propertyLocation) {
        markers.push({
          position: this.propertyLocation,
          info: {
            name: this.currentProperty.name,
            propertyUrl: `${window.location.origin}/properties/${this.currentProperty._id}`,
            image: this.propertyImageThumbnail,
            details: this.propertyExtInfo
          }
        })
      }
      let services = []
      if (this.walkableServices) {
        services = services.concat(this.walkableServices)
      }
      if (this.otherServices) {
        services = services.concat(this.otherServices)
      }
      markers = markers.concat(services.map(service => {
        if (service.location) {
          if (service.location.lat && service.location.lng) {
            return {
              position: {
                lat: service.location.lat,
                lng: service.location.lng
              },
              info: {
                name: service.name,
                details: `
                  ${this.getCategoryName(service.serviceCategory)}
                  ${this.getServiceTypeName(service.serviceType)}
                  ${this.getServiceSubTypeName(service.serviceSubType)}`
              }
            }
          }
        }
        return null
      }).filter(service => service !== null))
      return markers
    },
    departAt () {
      return '7:30 AM'
    },
    allServices () {
      if (this.proximityAssessment && this.proximityAssessment.services) {
        return this.proximityAssessment.services.map(service => {
          return service.travels.map(travel => {
            return {
              name: service.name,
              location: service.location,
              departAt: this.departAt,
              travelMode: travel.matchedTravelMode,
              distance: getPrettyDistance(travel.travelDistance),
              travelTime: getPrettyDuration(travel.travelTime),
              arriveAt: this.getArriveAt(travel.travelTime),
              serviceCategory: service.serviceCategory,
              serviceType: service.serviceType,
              serviceSubType: service.serviceSubType
            }
          })
        }).reduce((acc, itr) => {
          return [...acc, ...itr]
        }, [])
      }
      return []
    },
    walkableServices () {
      let services = []
      if (this.allServices.length) {
        this.allServices.forEach(element => {
          let isInclude = services.some(s => s.name === element.name)
          if (element.travelMode === 'walking' && isInclude === false) {
            services.push(element)
          }
        })
        if (this.serviceCategory) {
          services = services.filter(o => o.serviceCategory === this.serviceCategory)
          if (this.serviceType) {
            services = services.filter(o => o.serviceType === this.serviceType)
            if (this.serviceSubType) {
              services = services.filter(o => o.serviceSubType === this.serviceSubType)
            }
          }
        }
      }
      return services
    },
    otherServices () {
      let services = []
      let self = this
      if (this.allServices.length) {
        services = this.allServices.filter(o => {
          let isInclude = self.walkableServices.some(w => w.name === o.name)
          if (o.travelMode === 'walking' || isInclude === true) {
            return false
          }
          return true
        })
        if (this.serviceCategory) {
          services = services.filter(o => o.serviceCategory === this.serviceCategory)
          if (this.serviceType) {
            services = services.filter(o => o.serviceType === this.serviceType)
            if (this.serviceSubType) {
              services = services.filter(o => o.serviceSubType === this.serviceSubType)
            }
          }
        }
      }
      return services
    },
    google: gmapApi,
    serviceMarker () {
      return {
        url: require('@/assets/images/map_marker_service.png'),
        scaledSize: this.google && new this.google.maps.Size(12, 12),
        origin: this.google && new this.google.maps.Point(0, 0),
        anchor: this.google && new this.google.maps.Point(0, 0)
      }
    },
    propertyMarker () {
      return {
        url: require('@/assets/images/map_marker.png'),
        scaledSize: this.google && new this.google.maps.Size(39, 47),
        origin: this.google && new this.google.maps.Point(0, 0),
        anchor: this.google && new this.google.maps.Point(0, 0)
      }
    },
    categoryOptions () {
      let categories = [{value: '', text: 'ALL'}]
      if (this.serviceClassification && this.serviceClassification.serviceCategories) {
        const cats = this.serviceClassification.serviceCategories.map(o => ({ value: o.code, text: o.text }))
        if (cats.length) {
          categories = categories.concat(cats)
        }
      }
      return categories
    },
    serviceTypeOptions () {
      let types = [{value: '', text: 'All'}]
      if (this.serviceClassification) {
        const categories = this.serviceClassification.serviceCategories
        if (categories && this.serviceCategory) {
          const category = categories.find(o => o.code === this.serviceCategory)
          if (category && category.serviceTypes) {
            const collection = category.serviceTypes.map(o => ({ value: o.code, text: o.text }))
            types = types.concat(uniqueArray(collection, 'value'))
          }
        }
      }
      return types
    },
    serviceSubTypeOptions () {
      let subTypes = [{value: '', text: 'All'}]
      if (this.serviceClassification) {
        const categories = this.serviceClassification.serviceCategories
        if (categories && this.serviceCategory) {
          const category = categories.find(o => o.code === this.serviceCategory)
          if (category && category.serviceSubTypes) {
            const collection = category.serviceSubTypes.map(o => ({ value: o.code, text: o.text }))
            subTypes = subTypes.concat(uniqueArray(collection, 'value'))
          }
        }
      }
      return subTypes
    }
  },
  methods: {
    getArriveAt (travelTime) {
      return moment(this.departAt, 'h:mm A').add(travelTime, 'seconds').format('h:mm A')
    },
    getCategoryName (categoryCode) {
      if (this.categoryOptions) {
        const node = this.categoryOptions.find(o => o.value === categoryCode)
        if (node) {
          return node.text
        }
      }
      return ''
    },
    getServiceTypeName (serviceTypeCode) {
      if (this.serviceTypeOptions) {
        const node = this.serviceTypeOptions.find(o => o.value === serviceTypeCode)
        if (node) {
          return node.text
        }
      }
      return ''
    },
    getServiceSubTypeName (serviceSubTypeCode) {
      if (this.serviceSubTypeOptions) {
        const node = this.serviceSubTypeOptions.find(o => o.value === serviceSubTypeCode)
        if (node) {
          return node.text
        }
      }
      return ''
    },
    onMarkerClick (marker, idx) {
      this.infoWindowPos = marker.position
      this.infoContent = marker.info
      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen
      } else {
        this.infoWinOpen = true
        this.currentMidx = idx
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.property-map {
  width: 100%;
  height: 100%;
  position: relative;
}
.filters-overlay {
  position: absolute;
  max-width: 100%;
  z-index: 2;
  top: 10px;
  left: 280px;
  background-color: #fafafa;
}
.theme--light.v-card {
  background-color: #fafafa;
}
.mapInfoTile {
  width: 160px;
  padding: 2px;
  color: #0c1432;
  font-size: 14px;
}
.mapInfoTile a {
  text-decoration: none;
}
.property-image {
  width: 100%;
  height: auto;
  max-width: none;
}
</style>
<style>
.v-select .v-input__control .v-input__slot {
  background-color: #fafafa !important;
}
</style>
