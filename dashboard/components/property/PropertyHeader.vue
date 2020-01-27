<template>
  <div class="property-header">
    <div class="d-flex justify-start mt-3">
      <div>
        <v-icon class="property-icon" size="50">location_city</v-icon>
      </div>
      <div class="property-name">
        <h3>{{propertyAddress}}</h3>
        <label class="pl-1">{{extPropertyName}}</label>
      </div>
    </div>
    <div class="property-score">
      <v-progress-circular :value="circleProgress" :size="80" :width="8" :rotate="90" color="primary">
        <v-icon x-large color="primary">home</v-icon>
      </v-progress-circular>
      <div class="score-text">{{overallScore.value}}<small>/{{overallScore.max}}</small></div>
    </div>
  </div>
</template>

<script>
import { formatScore } from '@/utils'

export default {
  name: 'PropertyHeader',
  props: ['property'],
  computed: {
    propertyAddress () {
      if (this.property && this.property.formatted_address) {
        return this.property.formatted_address.replace(', Australia', '')
      }
      return ''
    },
    extPropertyName () {
      if (this.property && this.property.externalData) {
        for (let i = 0; i < this.property.externalData.length; i++) {
          const ext = this.property.externalData[i]
          if (ext && ext.dataRecords) {
            if (ext.dataRecords.lot) {
              return `${ext.dataRecords.lot} ${ext.dataRecords.stateElectDiv}`
            }
          }
        }
      }
      return ''
    },
    overallScore () {
      if (this.property && this.property.scores && this.property.scores.overall) {
        return {
          value: formatScore(this.property.scores.overall.value),
          max: this.property.scores.overall.max || 10
        }
      }
      return {
        value: 0,
        max: 10
      }
    },
    circleProgress () {
      const max = this.overallScore.max === 0 ? 10 : this.overallScore.max
      return (this.overallScore.value / max) * 100
    }
  }
}
</script>

<style scoped>
.property-header {
  display: flex;
  justify-content: space-between;
}
.property-score {
  text-align: center;
}
.score-text {
  font-size: 30px;
  font-weight: bold;
  color: #528EC1;
  padding-left: 14px;
}
.score-text small {
  font-size: 10px;
  font-weight: normal;
  color: #000;
}
.property-name {
  padding-left: 10px;
  margin-top: 15px;
  margin-left: 15px;
}
.property-name h3 {
  font-size: 24px;
  font-weight: normal;
  line-height: 1.2;
  padding-top: 3px;
}
</style>
