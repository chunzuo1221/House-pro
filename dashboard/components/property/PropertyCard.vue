<template>
  <v-card
    height="auto"
    class="my-4"
  >
    <v-toolbar flat height="50">
      <v-toolbar-title class="property-score">{{overallScore.value}}<small>/{{overallScore.max}}</small></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-chip
        :color="isCompared ? 'primary' : ''"
        :text-color="isCompared ? 'white' : 'black'"
        @click="onCompareClick"
      >Compare</v-chip>
    </v-toolbar>
    <v-divider light></v-divider>
    <v-card-title primary-title>
      <v-icon class="property-icon" large>location_city</v-icon>
      <small>{{postedAt}}</small>
      <h3 class="property-address" @click="onAddressClick">{{property.formatted_address}}</h3>
      <small>{{propertyName}}</small>
    </v-card-title>
    <v-divider light></v-divider>
    <v-card-actions class="pa-3">
      <v-icon>email</v-icon>
      <span class="ml-3">X new messages</span>
      <span class="ml-3">
        <img v-if="property.isArchived === true" :src="require('@/assets/images/untrash_icon.png')" class="ml-3 archive-img" @click="onArchiveClicked(false)"/>
        <img v-else :src="require('@/assets/images/trash_icon.png')" class="ml-3 archive-img" @click="onArchiveClicked(true)"/>
      </span>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import { formatScore } from '@/utils'
import PortfolioApi from '@/api/portfolio'

export default {
  name: 'PropertyCard',
  props: ['property'],
  computed: {
    ...mapState({
      comparedPropertyIds: state => state.portfolio.comparedPropertyIds,
      currentProperty: state => state.portfolio.currentProperty.property
    }),
    propertyName () {
      if (this.property.externalData) {
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
    postedAt () {
      if (this.property.createdAt) {
        return `Posted ${moment(this.property.createdAt).format('DD MMM YYYY')}`
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
    isCompared () {
      if (this.property) {
        return this.comparedPropertyIds.includes(this.property._id)
      }
      return false
    }
  },
  methods: {
    onAddressClick () {
      this.$emit('select')
    },
    onCompareClick () {
      if (this.currentProperty._id !== this.property._id) {
        this.$emit('compare', !this.isCompared)
      }
    },
    onArchiveClicked (archive) {
      const self = this
      PortfolioApi.archiveProperty(this.property._id, {archived: archive}).then(function (value) {
        self.$emit('archived')
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.property-icon {
  position: absolute;
  top: 24px;
  left: 10px;
}
.archive-img {
  height: 20px;
  cursor: pointer;
  margin-top: 5px;
}
.v-card__title {
  padding-left: 55px;
  padding-top: 16px;
  padding-bottom: 16px;
  position: relative;
}
.v-toolbar__content {
  padding-left: 14px;
  padding-right: 14px;
}
.property-score {
  font-size: 28px;
  font-weight: bold;
  color: #528EC1;
}
.property-score small {
  color: #000;
  font-size: 12px;
}
.v-input--selection-controls >>> .v-input__slot {
  display: flex;
  justify-content: flex-end;
}
.v-input--selection-controls.v-input >>> .v-label {
  font-size: 14px;
}
.property-address {
  cursor: pointer;
  color: #5282c1;
}
.v-chip >>> .v-chip__content {
  cursor: pointer;
}
</style>
