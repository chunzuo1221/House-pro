<template>
  <section class="agent-listing">
    <v-layout row wrap justify-center>
      <v-flex
        sm12
        :style="{background: backgroundColour}"
        v-if="forSale"
      >
        <div class="standard-logo">
          <img
            v-if="agencyBanner"
            :src="agencyBanner"
          />
        </div>
      </v-flex>
      <v-flex sm12>
        <property-image-slider></property-image-slider>
      </v-flex>
    </v-layout>

    <v-layout pa-2>
      <!-- Content Section -->
      <v-flex
        :sm9="forSale"
        :sm12="!forSale"
        class="content-section" pa-3
      >
        <div class="mt-2">{{propertyName}}</div>

        <!-- PROPERTY SUMMARY -->
        <v-layout v-if="status" align-center justify-space-between row my-2>
          <v-flex sm4>
            <h4>Status: {{status}}</h4>
          </v-flex>
          <v-flex sm4>
            <h4 v-if="price">{{price}}</h4>
          </v-flex>
          <v-flex sm4 hidden>
            <h4></h4>
          </v-flex>
        </v-layout>

        <v-divider></v-divider>

        <div class="my-2">
          <img :src="images.bedIcon" height="15px"/>
          <span class="ml-1">{{domainData.bedrooms}}</span>
          <img :src="images.bathroomIcon" height="20px" class="ml-3"/>
          <span class="ml-1">{{domainData.bathrooms}}</span>
          <img :src="images.carIcon" height="15px" class="ml-3"/>
          <span class="ml-1">{{domainData.carSpaces}}</span>
        </div>

        <v-divider></v-divider>

        <v-layout row wrap my-2>
          <v-flex xs4 my-1 v-for="(feature, index) in features" :key="index">
            {{feature}}
          </v-flex>
        </v-layout>

        <v-divider></v-divider>

        <!-- PROPERTY DESCRIPTION -->
        <v-layout row wrap mt-5 v-if="description">
          <h2>PROPERTY DESCRIPTION</h2>
          <div class="mt-2">
            <pre v-if="hasMore">{{description | truncate(300)}}</pre>
            <pre v-else>{{description}}</pre>
            <v-btn
              flat
              small
              color="primary"
              class="mx-0 mb-3"
              @click="hasMore=!hasMore"
            >
              Read {{hasMore ? 'More' : 'Less'}}
            </v-btn>
          </div>
        </v-layout>

        <v-divider></v-divider>

        <!-- LISTING AND AVAILABLE DATA -->
        <v-layout row wrap mt-4 v-if="forSale">
          <v-flex sm12>
            <v-layout lign-center justify-center row>
              <v-flex sm5>
                <h1>LISTING AND AVAILABLE DATA</h1>
              </v-flex>
            </v-layout>
            <v-layout lign-center justify-center text-xs-left row mt-3 mb-4>
              <v-flex sm5>
                <v-layout align-space-around justify-space-between fill-height column mt-2>
                  <v-flex>
                    <h3>Inspection Times</h3>
                  </v-flex>
                  <v-flex class="inspection-table-container" mt-2>
                    <table width="100%" class="inspection-table" cellspacing="0">
                      <tr v-for="(item, index) in tableItems" :key="index">
                        <td class="text-xs-left">{{ item.text }}</td>
                        <td class="text-xs-right">{{ item.value }}</td>
                      </tr>
                    </table>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>

      <!-- Right Side Section -->
      <v-flex sm3 text-xs-center v-if="forSale">
        <div class="sticky-panel">
          <v-card>
            <v-toolbar dark dense :color="backgroundColour">
              <div class="small-logo">
                <img
                  v-if="agencyLogoSmall"
                  :src="agencyLogoSmall"
                />
              </div>
            </v-toolbar>
            <v-list three-line>
              <template v-for="(agent, index) in agents">
                <v-list-tile :key="agent.agentId" avatar>
                  <v-list-tile-avatar>
                    <img :src="agent.photo">
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{getAgentFullName(agent)}}</v-list-tile-title>
                    <v-list-tile-sub-title>{{agent.phone}}</v-list-tile-sub-title>
                    <v-list-tile-sub-title >{{agent.email}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider v-if="index + 1 < agents.length" :key="`divider-${index}`"></v-divider>
              </template>
            </v-list>
          </v-card>
        </div>
      </v-flex>
    </v-layout>
  </section>
</template>

<script>
import lget from 'lodash.get'
import { mapState } from 'vuex'
import PropertyImageSlider from '@/components/core/PropertyImageSlider'

export default {
  name: 'AgentListing',
  components: {
    PropertyImageSlider
  },
  data () {
    return {
      loading: false,
      hasMore: true,
      tableItems: [
        { text: 'Wednesday 12th December', value: '10:30AM' },
        { text: 'Wednesday 12th December', value: '10:30AM' },
        { text: 'Wednesday 12th December', value: '10:30AM' },
        { text: 'Wednesday 12th December', value: '10:30AM' }
      ]
    }
  },
  computed: {
    ...mapState({
      currentProperty: state => state.portfolio.currentProperty.property
    }),
    propertyName () {
      return this.domainData.address || lget(this.currentProperty, 'formatted_address', '')
    },
    images () {
      return {
        bedIcon: require('@/assets/images/bed_icon.png'),
        bathroomIcon: require('@/assets/images/bathroom_icon.png'),
        carIcon: require('@/assets/images/small_car_icon.png')
      }
    },
    domainData () {
      return lget(lget(this.currentProperty, 'externalData', []).find(o => o.providerId === 'domain'), 'dataRecords', {})
    },
    domainListingData () {
      return lget(lget(this.currentProperty, 'externalData', []).find(o => o.providerId === 'domainListing'), 'dataRecords', {})
    },
    domainAgencyData () {
      return lget(lget(this.currentProperty, 'externalData', []).find(o => o.providerId === 'domainAgency'), 'dataRecords', null)
    },
    domainAgentData () {
      return lget(lget(this.currentProperty, 'externalData', []).find(o => o.providerId === 'domainAgent'), 'dataRecords', null)
    },
    forSale () {
      return this.domainListingData.saleMode === 'buy'
    },
    status () {
      switch (this.domainListingData.saleMode) {
        case 'buy':
          return 'For Sale'
        case 'sold':
          return 'SOLD - ' + lget(this.domainListingData, 'saleDetails.soldDetails.soldDate', '')
        default:
          return null
      }
    },
    price () {
      switch (this.domainListingData.saleMode) {
        case 'buy':
          const priceDetails = lget(this.domainListingData, 'priceDetails', {})
          return priceDetails.canDisplayPrice ? priceDetails.displayPrice : null
        case 'sold':
          const soldDetails = lget(this.domainListingData, 'saleDetails.soldDetails', {})
          return soldDetails.canDisplayPrice ? `Price: $${soldDetails.soldPrice}` : null
        default:
          return null
      }
    },
    features () {
      return lget(this.domainListingData, 'features') || lget(this.domainData, 'features')
    },
    description () {
      return lget(this.domainListingData, 'description', '').trim()
    },
    agencyBanner () {
      return lget(this.domainAgencyData, 'profile.agencyBanner', null)
    },
    agencyLogoStandard () {
      return lget(this.domainAgencyData, 'profile.agencyLogoStandard', null)
    },
    agencyLogoSmall () {
      return lget(this.domainAgencyData, 'profile.agencyLogoSmall', null)
    },
    logoColour () {
      return lget(this.domainAgencyData, 'profile.logoColour', null)
    },
    backgroundColour () {
      return lget(this.domainAgencyData, 'profile.backgroundColour', null)
    },
    agents () {
      if (this.domainAgentData) {
        return [{
          agentId: this.domainAgentData.agentId,
          photo: this.domainAgentData.photo,
          firstName: this.domainAgentData.firstName,
          lastName: this.domainAgentData.lastName,
          phone: this.domainAgentData.phone,
          email: this.domainAgentData.email
        }]
      }
      return []
    }
  },
  filters: {
    truncate (text, length, suffix = '') {
      let end = text.indexOf('\n')
      if (end < 0) {
        end = length
      }
      return text.substring(0, end) + suffix
    }
  },
  methods: {
    getAgentFullName (agent) {
      return `${agent.firstName} ${agent.lastName}`
    },
    getAgentDatail (agent) {
      return `${agent.phone}\n${agent.email}`
    }
  }
}
</script>

<style scoped>
.standard-logo {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.small-logo {
  display: flex;
  height: 48px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.inspection-table-container {
  border: solid 1px #AAA;
  border-radius: 10px;
  padding: 10px;
}
.inspection-table tr {
  height: 30px;
}
.inspection-table td {
  border-bottom: solid 1px #AAA;
  padding: 8px;
}
.sticky-panel {
  position: sticky;
  top: 50px;
}
pre {
  word-wrap: break-word;
  white-space: pre-wrap;
  font-family: 'Roboto';
}
</style>
