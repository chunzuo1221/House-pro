<template>
  <v-app>
    <!-- Right Side Panel -->
    <v-navigation-drawer fixed clipped v-model="drawer" width="170" app>
      <v-list class="pt-0">
        <v-list-tile
          v-for="item in drawerMenus"
          :key="item.title"
          @click="() => onMenuClicked(item)"
          class="drawer-menu-item"
          :class="item.path === currentPage ? 'selected' : null"
        >
          <v-list-tile-action class="justify-start">
            <v-icon size="24" color="#35AF97">{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title class="drawer-menu-title">{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!-- Navigation Panel -->
    <v-toolbar color="primary" dense fixed clipped-left app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="mr-5 align-center">
        <span class="logo-title">HousePro</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn color="white" flat @click.prevent="onHomeClick" class="top-nav-menu">Home</v-btn>
        <v-menu v-if="isAdmin" :nudge-width="100" offset-y>
          <v-btn slot="activator" flat class="top-nav-menu" color="white">
            <span>Admin</span>
            <v-icon dark>arrow_drop_down</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-for="(item, index) in adminMenuItems" :key="index" @click="onAdminMenuItemClick(item)">
              <v-list-tile-title v-text="item.name"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn color="white" flat @click.prevent="onLogoutClick" class="top-nav-menu">Log out</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- Content Panel -->
    <v-content>
      <v-container fluid fill-height class="px-0 py-0">
        <router-view></router-view>
      </v-container>
    </v-content>
    <!-- Progress Dialog -->
    <v-dialog
      v-model="pendingCalls.length"
      persistent
      width="400"
    >
      <v-card>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 d-flex justify-center pb-4>
              <v-icon color="primary" size="80px">mdi-home-circle</v-icon>
            </v-flex>
            <v-flex xs12 v-for="(call, index) in pendingCalls" :key="index" mb-3>
              <div class="body-1 font-weight-bold">{{call.text}}</div>
              <v-progress-linear
                indeterminate
                color="primary"
                class="mt-1 mb-0"
              ></v-progress-linear>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { SIGN_OUT } from '@/store/action-types'

export default {
  data () {
    return {
      drawer: false,
      drawerMenus: [
        {
          title: 'Properties',
          icon: 'home',
          path: '/properties'
        }
      ],
      currentPage: '/properties',
      progress: {
        pending: true
      }
    }
  },
  computed: {
    ...mapState({
      currentProperty: state => state.portfolio.currentProperty.property
    }),
    ...mapGetters([
      'isAdmin',
      'pendingCalls'
    ]),
    adminMenuItems () {
      const adminMenuItems = []
      if (this.currentProperty) {
        adminMenuItems.push({
          name: 'Location Analysis',
          path: `/properties/${this.currentProperty._id}/explorer`
        }, {
          name: 'Land/House Analysis',
          path: `/properties/${this.currentProperty._id}/landandhouse`
        }, {
          name: 'Survey Question Manager',
          path: '/admin/questions'
        }, {
          name: 'Suburb Research Management',
          path: '/admin/suburbs'
        }, {
          name: 'Property Map',
          path: '/admin/propertymap'
        }, {
          name: 'Proximity Rule Management',
          path: '/admin/proximities'
        }, {
          name: 'Report Content Management',
          path: '/admin/report'
        })
      }
      return adminMenuItems
    }
  },
  methods: {
    onMenuClicked (menu) {
      this.currentPage = menu.path
      this.$router.push({path: menu.path})
    },
    onHomeClick () {
      this.goHome()
    },
    onAdminMenuItemClick (item) {
      window.location = window.location.origin + item.path
    },
    async onLogoutClick () {
      await this.$store.dispatch(SIGN_OUT)
      this.goHome()
    },
    goHome () {
      window.location = window.location.origin
    }
  }
}
</script>

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  box-shadow: 0 0 0px 1000px white inset;
  transition: background-color 5000s ease-in-out 0s;
}
.theme--light .v-toolbar__side-icon .v-btn__content .v-icon {
  color: white;
}
.v-navigation-drawer.main-menu {
  background: #DEE8E7;
}
.v-navigation-drawer.main-menu > .v-list .v-list__tile {
  height: 60px;
  width: 100%;
}
.drawer-menu-item {
  border-bottom: 0.5px solid #eeeeee;
}
.drawer-menu-item.selected {
  background: #f8f8f8;
}
.drawer-menu-title {
  color: #4DB6AC;
}
.drawer-menu-item.selected .drawer-menu-title {
  color: #000;
}
.top-nav-menu {
  margin-left: 0 !important;
  margin-right: 0 !important;
  height: 100% !important;
  font-size: 14px;
  font-weight: 500;
}
.drawer-menu-item >>> .v-list__tile__action {
  min-width: 40px;
}
.logo-title {
  color: #FFF;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 1.2px;
}
</style>
