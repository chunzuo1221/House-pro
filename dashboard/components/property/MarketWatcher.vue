<template>
  <div class="market-watcher">
    <div class="side-pane-header primary--text">MARKET WATCHER</div>
    <div class="side-pane-content">
      <v-card v-for="property in onMarketProperties" :key="property._id">
        <v-img :src="property.adImageURL" height="150px">
        </v-img>
        <v-card-text class="pa-1">
          <div class="primary--text body-1 pointer" @click="onSelectProperty(property)">{{property.formatted_address}}</div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {
  ADD_PROPERTY,
  FETCH_PROPERTY_DETAIL
} from '@/store/action-types'

export default {
  name: 'MarketWatcher',
  data () {
    return {}
  },
  computed: {
    ...mapState({
      properties: state => state.portfolio.properties,
      onMarketProperties: state => state.portfolio.onMarketProperties
    })
  },
  methods: {
    async onSelectProperty (property) {
      if (!this.properties.some(o => o._id === property._id)) {
        await this.$store.dispatch(ADD_PROPERTY, {property})
      }
      await this.$store.dispatch(FETCH_PROPERTY_DETAIL, property._id)
    }
  }
}
</script>

<style lang="scss" scoped>
.market-watcher {
  width: 250px;
  position: sticky;
  top: 50px;
  float: right;
  border-left: solid 1px #EEE;
  height: calc(100vh - 190px);
  background-color: #FFF;
  padding: 10px;
  overflow-y: auto;

  .side-pane-header {
    border-bottom: solid 2px #5282c1;
    padding-bottom: 3px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 1px;
  }
  .side-pane-content {
    padding-top: 16px;
    padding-bottom: 16px;
  }
  .pointer {
    cursor: pointer;
  }
}
</style>
