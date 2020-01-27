<template>
  <div class="property-list">
    <!-- Property List Panel -->
    <div class="property-list-pane" v-if="!isLoading">
      <v-toolbar flat height="80" color="transparent">
        <v-toolbar-title class="headline">Properties</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <div class="d-flex align-center">
            <v-btn fab dark small color="primary" class="mx-0" @click="onPropertySelect('new')">
              <v-icon dark>add</v-icon>
            </v-btn>
          </div>
        </v-toolbar-items>
      </v-toolbar>

      <v-tabs
        v-model="propertyStatus"
        color="transparent"
        slider-color="#35AF97"
        class="tabs-container"
      >
        <v-tab @click="onPortfolioTabBarSelected(false)">ALL</v-tab>
        <v-tab>ON MARKET</v-tab>
        <v-tab @click="onPortfolioTabBarSelected(true)">ARCHIVED</v-tab>
        <v-tabs-items class="tabs-items" ref="allProperties">
          <v-tab-item
            :transition="false"
            :reverse-transition="false"
          >
            <property-card
              v-for="property in properties"
              class="property-card"
              :class="{selected: selectedProperty && property._id === selectedProperty._id}"
              :key="property._id"
              :property="property"
              @compare="onPropertyCompare(property._id, $event)"
              @select="onPropertySelect(property)"
              @archived="onPropertyArchived(property._id)"
            ></property-card>
          </v-tab-item>
          <v-tab-item
            :transition="false"
            :reverse-transition="false"
          >
            <div class="py-4">
              On Market Properties
            </div>
          </v-tab-item>
          <v-tab-item
            :transition="false"
            :reverse-transition="false"
          >
            <property-card
              v-for="property in properties"
              class="property-card"
              :class="{selected: selectedProperty && property._id === selectedProperty._id}"
              :key="property._id"
              :property="property"
              @compare="onPropertyCompare(property._id, $event)"
              @select="onPropertySelect(property)"
              @archived="onPropertyArchived(property._id)"
            ></property-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>

    <!-- Property Detail Panel -->
    <div class="property-detail-pane" v-if="!isLoading">
      <router-view></router-view>
    </div>

    <!-- Add Property Modal -->
    <v-dialog v-model="propertyDialog" width="33%" max-width="500">
      <v-card class="px-3 py-3">
        <v-layout column>
          <v-flex d-flex align-center class="px-2 mt-4">
            <gmap-autocomplete
              id="map"
              ref="address"
              :types="['address']"
              @keypress="address=''"
              placeholder="Enter your keywords"
              @place_changed="getAddressData"
              country="au"
              class="google-autocomplete"
            />
          </v-flex>
          <v-flex d-flex align-end>
            <v-btn @click="addProperty" color="primary">Add Property</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>

    <v-dialog v-model="alertDialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Property Comparison
        </v-card-title>

        <v-card-text>
          You are able to compare properties up to three ones at once. If you want to compare the property, please deselect other one.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="alertDialog = false" >OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { SET_COMPARED_PROPERTY_IDS } from '@/store/mutation-types'
import {
  FETCH_PORTFOLIO,
  ADD_PROPERTY,
  FETCH_CONTENT_FRAGMENTS,
  UPDATE_PORTFOLIO_PROPERTIES
} from '@/store/action-types'
import PropertyCard from '@/components/property/PropertyCard'

export default {
  name: 'PropertyList',
  components: {
    VuePerfectScrollbar,
    PropertyCard
  },
  data () {
    return {
      scrollSettings: {
        maxScrollbarLength: 100
      },
      propertyDialog: false,
      address: null,
      propertyStatus: null,
      alertDialog: false,
      selectedProperty: null
    }
  },
  computed: {
    ...mapState({
      properties: state => state.portfolio.properties,
      comparedPropertyIds: state => state.portfolio.comparedPropertyIds,
      apiCalls: state => state.portfolio.apiCalls
    }),
    isLoading () {
      return this.apiCalls.FETCH_PORTFOLIO.pending
    }
  },
  async mounted () {
    this.$store.dispatch(FETCH_CONTENT_FRAGMENTS)
    await this.$store.dispatch(FETCH_PORTFOLIO)
    if (this.properties.length) {
      const propertyId = this.$route.params.id
      let selectedProperty = null
      if (propertyId) {
        selectedProperty = this.properties.find(o => o._id === propertyId)
      }
      if (selectedProperty) {
        this.selectedProperty = selectedProperty
      } else {
        this.selectedProperty = this.properties[0]
      }
      this.goToPropertyDetail(this.selectedProperty._id)
    }
  },
  methods: {
    goToPropertyDetail (id) {
      this.$router.push({path: `/properties/${id}`})
    },
    async onPortfolioTabBarSelected (isArchived = false) {
      if (isArchived === true) {
        await this.$store.dispatch(FETCH_PORTFOLIO, {isArchived: true})
      } else {
        await this.$store.dispatch(FETCH_PORTFOLIO)
      }
      if (this.properties.length > 0) {
        this.selectedProperty = this.properties[0]
        this.goToPropertyDetail(this.selectedProperty._id)
      }
    },
    async onPropertyArchived (propertyId) {
      let properties = this.properties
      const propertyIndex = properties.findIndex(p => p._id === propertyId)
      properties.splice(propertyIndex, 1)
      await this.$store.dispatch(UPDATE_PORTFOLIO_PROPERTIES, properties)
      if (this.properties.length > 0) {
        if (this.selectedProperty._id === propertyId) {
          this.selectedProperty = this.properties[0]
          this.goToPropertyDetail(this.selectedProperty._id)
        }
      }
    },
    onPropertySelect (property) {
      if (property === 'new') {
        this.address = null
        this.propertyDialog = true
      } else {
        if (property._id !== this.selectedProperty._id) {
          this.selectedProperty = property
          this.goToPropertyDetail(this.selectedProperty._id)
        }
      }
    },
    onPropertyCompare (propertyId, isCompared) {
      if (this.comparedPropertyIds.length === 3 && isCompared) {
        this.alertDialog = true
      } else {
        let comparedPropertyIds = [...this.comparedPropertyIds]
        if (isCompared) {
          if (propertyId === this.selectedProperty._id) {
            comparedPropertyIds = [propertyId]
          } else {
            comparedPropertyIds.push(propertyId)
          }
        } else {
          comparedPropertyIds.splice(comparedPropertyIds.indexOf(propertyId), 1)
        }
        this.$store.commit(SET_COMPARED_PROPERTY_IDS, comparedPropertyIds)
      }
    },
    getAddressData (addressData) {
      this.address = addressData
    },
    async addProperty () {
      if (this.address) {
        await this.$store.dispatch(ADD_PROPERTY, {property: this.address})
        const property = this.properties.find(o => o.formatted_address === this.address.formatted_address)
        if (property) {
          this.scrollToCurrentProperty()
        }
      }
      this.propertyDialog = false
    },
    scrollToCurrentProperty () {
      setTimeout(() => {
        const parent = this.$refs.allProperties.$el
        const current = parent.querySelector('.property-card.selected')
        parent.scrollTop = current.offsetTop - parent.offsetTop
      }, 100)
    }
  }
}
</script>

<style scoped>
.property-list {
  width: 100%;
  height: 100%;
  display: flex;
}
.property-list-pane {
  position: fixed;
  width: 320px;
  background: #f8f8f8;
  height: calc(100vh - 48px);
  border-right: 1px solid #ddd;
}
.property-list-pane >>> .v-toolbar__content {
  padding-left: 16px;
  padding-right: 16px;
}
.property-list-pane >>> .v-tabs__item--active {
  color: #35AF97;
}
.property-detail-pane {
  width: 100%;
  padding-left: 320px;
}
.property-card {
  border: 2px solid #ddd;
  box-shadow: none;
  margin-right: 16px;
}
.property-card:hover,
.property-card.selected {
  border-color: #35AF97;
}
.property-card.selected::after {
  content: '';
  position: absolute;
  top: calc(50% - 5px);
  right: -10px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 0 6px 8px;
  border-color: transparent transparent transparent #35AF97;
}
label.short-label {
  max-width: 80px;
}
.google-autocomplete {
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 16px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 16px;
  outline-color: transparent;
}
.placeId {
  word-break: break-all;
}
.tabs-container {
  position: absolute;
  top: 80px;
  right: 0;
  bottom: 0;
  left: 16px;
}
.tabs-items {
  position: absolute;
  top: 48px;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
}
</style>
