<template>
  <div class="property-detail">
    <div v-if="currentProperty">
      <!-- Property Header Panel -->
      <div class="property-header-panel">
        <property-header :property="currentProperty"/>
      </div>
      <!-- Marketing Properties List -->
      <market-watcher></market-watcher>
      <!-- Property Content Panel -->
      <div class="property-content-panel">
        <!-- Tab Panel -->
        <v-tabs
          v-model="activePane"
          color="transparent"
          slider-color="primary"
          class="property-detail-tabs"
          v-if="currentProperty"
        >
          <v-tab
            v-for="(pane, index) in detailPanes"
            :key="index"
            ripple
            class="px-1"
          >
            <span class="pr-4">{{pane.title}}</span>
          </v-tab>

          <v-tabs-items class="px-3">
            <v-tab-item
              v-for="(pane, index) in detailPanes"
              :key="index"
              transition="fade-transition"
              :reverse-transition="false"
            >
              <keep-alive>
                <component
                  :is="pane.component"
                  v-bind="pane.componentProps"
                ></component>
              </keep-alive>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { FETCH_PROPERTY_DETAIL } from '@/store/action-types'
import { SET_FIRST_VISIT } from '@/store/mutation-types'
import { getPropertyAddressComponentValue } from '@/utils/index'
import AgentListing from '@/components/property/AgentListing'
import HouseReport from '@/components/property/HouseReport'
import LandReport from '@/components/property/LandReport'
import LocationReport from '@/components/property/LocationReport'
import LocationAnalysis from '@/components/property/LocationAnalysis'
import MarketWatcher from '@/components/property/MarketWatcher'
import PropertyComparison from '@/components/property/PropertyComparison'
import PropertyHeader from '@/components/property/PropertyHeader'
import PropertyLocationMap from '@/components/property/PropertyLocationMap'

export default {
  name: 'PropertyDetail',
  components: {
    PropertyHeader,
    MarketWatcher
  },
  props: {
    propertyId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      activePane: 0
    }
  },
  computed: {
    ...mapState({
      suburb: state => state.portfolio.currentProperty.suburb,
      currentProperty: state => state.portfolio.currentProperty.property,
      isFirstVisit: state => state.portfolio.isFirstVisit
    }),
    detailPanes () {
      return [
        {
          title: 'AGENT LISTING',
          component: AgentListing,
          componentProps: {property: this.currentProperty}
        },
        {
          title: 'LOCATION ANALYSIS',
          component: LocationAnalysis,
          componentProps: {property: this.currentProperty}
        },
        {
          title: 'LOCATION MAP',
          component: PropertyLocationMap,
          componentProps: {property: this.currentProperty}
        },
        {
          title: 'LOCATION REPORT',
          component: LocationReport,
          componentProps: {}
        },
        {
          title: 'LAND REPORT',
          component: LandReport,
          componentProps: {property: this.currentProperty}
        },
        {
          title: 'HOUSE REPORT',
          component: HouseReport,
          componentProps: {property: this.currentProperty}
        },
        {
          title: 'BUILDING/PEST REPORT',
          component: null,
          componentProps: {property: this.currentProperty}
        },
        {
          title: 'CONTRACT',
          component: null,
          componentProps: {property: this.currentProperty}
        },
        {
          title: 'COMPARE',
          component: PropertyComparison,
          componentProps: {property: this.currentProperty}
        }
      ]
    },
    getPropertyPostCode () {
      return getPropertyAddressComponentValue(this.currentProperty, 'postal_code')
    }
  },
  created () {
    this.fetchPropertyDetails()
  },
  mounted () {
    if (this.isFirstVisit) {
      this.activePane = this.detailPanes.findIndex(pane => pane.title === 'LOCATION ANALYSIS')
      this.$store.commit(SET_FIRST_VISIT, false)
    }
  },
  methods: {
    fetchPropertyDetails () {
      this.$store.dispatch(FETCH_PROPERTY_DETAIL, this.propertyId)
    }
  },
  watch: {
    '$route': {
      handler () {
        this.fetchPropertyDetails()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.property-detail {
  width: 100%;
  height: 100%;
  position: relative;
}
/* Header CSS */
.property-header-panel {
  padding-top: 15px;
  padding-left: 15px;
  padding-right: 15px;
  position: relative;
}
/* Content CSS */
.property-content-panel {
  border-top: solid 1px #EEE;
  position: relative;
  margin-right: 250px;
  height: 100%;
}
.property-detail-tabs {
  position: relative;
  margin-right: 253px;
  width: 100%;
  height: 100%;
}
/* Spinner CSS */
.spinner-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  justify-content: center;
  align-items: center;
}
.v-window__container {
  height: calc(100vh - 238px) !important;
  overflow: scroll;
  overflow-x:hidden;
}
</style>
