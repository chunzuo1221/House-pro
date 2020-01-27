<template>
  <section class="land-house-pane">
    <h3 class="section-title mb-3">Land and House Analysis</h3>
    <v-card color="grey darken-3" ripple raised hover>
      <v-img :src="landhouseTileImage" height="300px">
        <v-container
          fill-height
          fluid
          pa-2
          class="pa-3"
        >
          <v-layout fill-height>
            <v-flex xs12 align-end flexbox>
              <span class="white-border" v-text="landhouseScore.value"></span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-img>
      <v-card-title primary-title class="py-3 d-flex">
        <span class="text-xs-center white--text">Register with us to access our advanced Land and House analysis tools</span>
      </v-card-title>

      <v-card-actions class="justify-center pb-3">
        <v-btn flat color="white" outline>Get Started</v-btn>
      </v-card-actions>
    </v-card>
  </section>
</template>

<script>
import { formatScore } from '@/utils'

export default {
  name: 'LandHousePane',
  props: ['property'],
  computed: {
    landhouseTileImage () {
      return require('@/assets/images/land-house-analysis-tile.png')
    },
    landhouseScore () {
      if (this.property && this.property.scores && this.property.scores.landhouse) {
        return {
          value: formatScore(this.property.scores.landhouse.value),
          max: this.property.scores.landhouse.max || 10
        }
      }
      return {
        value: 0,
        max: 10
      }
    }
  }
}
</script>

<style scoped>
.white-border {
  color: #fff;
  border: 3px solid #fff;
  font-size: 36px;
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>
