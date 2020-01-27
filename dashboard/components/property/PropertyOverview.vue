<template>
  <section class="property-overview-section">
    <div class="section-header">
      <h3 class="section-title">Overview</h3>
      <v-btn
        flat
        color="primary"
        class="refresh-button"
        @click="onRefreshButtonClick"
      >Refresh Get External Data</v-btn>
    </div>
    <p class="my-2">
      Welcome to the HousePro Report for <strong>{{property.formatted_address}}</strong>. Our property analysis platform conducts a broad range of location,
      land and property analysis techniques to compile a comprehensive and easy-to-understand suite of reports to help you make your biggest purchasing decisions.
      Our team of experts and the latest technology are at your disposal.
    </p>
    <v-layout v-if="refreshing" class="my-5 py-5">
      <v-flex d-flex justify-center align-center>
        <v-progress-circular
          indeterminate
          class="primary--text loading-spinner"
          :width="3"
          :size="30"
          color="black"
        ></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex sm-6 xs-12 class="external-data-section">
        <div class="property-attribute"><strong>Lot Number: </strong>{{allDataRecords.lot}}</div>
        <div class="property-attribute">
          <strong>Land Size: </strong>
          <span>{{allDataRecords.lotSize}}</span>
          <span v-if="allDataRecords.lotSize && allDataRecords.unit">{{allDataRecords.unit}}<sup>2</sup></span>
        <div class="property-attribute"><strong>Waste Service Type: </strong>{{allDataRecords.wasteType}}</div>
        <div class="property-attribute"><strong>State Electorate: </strong>{{allDataRecords.stateElectDiv}}</div>
      </v-flex>
      <v-flex sm-6 xs-12 class="external-data-section">
        <div class="property-attribute"><strong>Property Type: </strong>{{allDataRecords.propertyType}}</div>
        <div class="property-attribute"><strong>Zoning: </strong>{{allDataRecords.zone}}</div>
        <div class="property-attribute"><strong>Waste Collection Day: </strong>{{allDataRecords.wasteCollectionDay}}</div>
        <div class="property-attribute"><strong>Federal Electorate: </strong>{{allDataRecords.cwlthElectDiv}}</div>
        <div class="property-attribute"><strong>Ward: </strong>{{allDataRecords.ward}}</div>
      </v-flex>
    </v-layout>
  </section>
</template>

<script>
import { REFRESH_GET_PROPERTY_EXTERNAL_DATA } from '@/store/action-types'

export default {
  name: 'PropertyOverview',
  props: ['property'],
  data () {
    return {
      refreshing: false
    }
  },
  computed: {
    externalData () {
      if (this.property && this.property.externalData) {
        return this.property.externalData
      }
      return []
    },
    allDataRecords () {
      if (this.externalData.length) {
        return this.externalData.reduce((acc, itr) => {
          return itr ? {
            ...acc,
            ...itr.dataRecords
          } : acc
        }, {})
      }
      return {}
    }
  },
  methods: {
    async onRefreshButtonClick () {
      this.refreshing = true
      try {
        await this.$store.dispatch(REFRESH_GET_PROPERTY_EXTERNAL_DATA)
        this.refreshing = false
      } catch (error) {
        console.log(error)
        this.refreshing = false
      }
    }
  }
}
</script>

<style scoped>
.property-overview-section {
  margin-top: 40px;
}
.section-header {
  display: flex;
  align-items: center;
}
.refresh-button {
  margin-left: 24px;
}
.external-data-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 16px;
  padding-top: 16px;
}
.property-attribute {
  line-height: 2;
}
.score-box {
  margin-top: 16px;
  text-align: center;
  border: 3px solid #528EC1;
  border-radius: 20px;
  color: #528EC1;
  font-weight: bold;
}
.score-box .score {
  padding-top: 5px;
  font-size: 60px;
}
</style>
