<template>
  <v-dialog
    v-model="dialog"
    full-width
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-btn slot="activator" color="primary" dark block @click="onDialogActivate">Compare Properties</v-btn>
    <v-card>
      <v-toolbar color="elevation-0">
        <v-toolbar-title>
          Property Comparison
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-tabs
          v-model="activePane"
          grow
          slider-color="primary"
          class="tabs-container"
        >
          <v-tab
            v-for="(pane, index) in panes"
            :key="index"
            ripple
          >
            <span class="pr-4">{{pane.title}}</span>
          </v-tab>

          <v-tabs-items class="tabs-items">
            <v-tab-item
              v-for="(pane, index) in panes"
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
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { FETCH_COMPARED_PROPERTY_DETAILS } from '@/store/action-types'
import LocationComparison from './LocationComparison'
import LandComparison from './LandComparison'
import HouseComparison from './HouseComparison'

export default {
  name: 'PropertyComparisonDialog',
  data () {
    return {
      dialog: false,
      panes: [
        {
          title: 'Location',
          component: LocationComparison,
          componentProps: {}
        }, {
          title: 'Land',
          component: LandComparison,
          componentProps: {}
        }, {
          title: 'House',
          component: HouseComparison,
          componentProps: {}
        }
      ],
      activePane: null
    }
  },
  methods: {
    onDialogActivate (event) {
      this.$store.dispatch(FETCH_COMPARED_PROPERTY_DETAILS)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.v-dialog__container {
  width: 100%;
}
.v-dialog__content {
  align-items: flex-end;

  /deep/ .v-dialog {
    margin: 0;
    max-height: 100%;
    height: calc(100% - 48px);
    background: white;

    .v-toolbar__content {
      padding-right: 10px;
    }
    .theme--light.v-tabs__bar {
      background: lightgray;

      .v-tabs__div {
        .v-tabs__item.v-tabs__item--active {
          background: #fff;
          border: 1px solid $housepro-primary-color;
          color: $housepro-primary-color;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
