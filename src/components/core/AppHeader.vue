<template>
  <div>
    <header id="header-bar" class="style2">
      <div v-if="!isAuthenticated && isMainPage === false" class="header-top header-report">
        <div class="container">
          <div class="row">
            <div class="col-md-5 col-sm-4 dark-blue-color">
              <div v-if="property">
                <div>Your Street Position Search is :</div>
                <div class="mt-1 property-info-pin">
                  <i class="fa fa-map-marker"></i>
                  <a href="javascript:;" class="dark-blue-color">{{property.formatted_address}}</a>
                </div>
              </div>
              <div v-else class="property-info-pin mt-2">
                <span class="hidden-xs">
                  <i class="fa fa-map-marker"></i>
                  Your Personal Property Expert
                </span>
              </div>
            </div>
            <div class="col-md-7 col-sm-7 hidden-xs">
              <div class="pull-right">
                <div class="col-md-5">
                  <router-link class="search-button" :to="{name: 'Home'}">
                    <img src="/static/images/search_icon.png" class="mt-1 search-img" alt="">
                  </router-link>
                  <button class="btn btn-border mt-1 pull-right" @click.prevent="openLogin">Login</button>
                </div>
                <div class="col-md-7">
                  <button class="btn btn-sucess mt-1" @click.prevent="openSignUp">Get a HousePro Account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="header-top">
        <div class="container">
          <div class="row">
            <div class="col-md-6 col-sm-6 col-xs-5 header-info">
              <span v-if="property" class="hidden-xs">
                <i class="fa fa-map-marker"></i>
                <router-link :to="{name: 'Property', params: {propertyId: property._id}}">{{property.formatted_address}}</router-link>
              </span>
              <span v-else class="hidden-xs">
                <i class="fa fa-map-marker"></i>
                Your Personal Property Expert
              </span>
            </div>
            <!--left-->
            <div class="col-md-6 col-sm-6 col-xs-7">
              <ul  v-if="isAuthenticated" class="header-links pull-right nav navbar-nav">
                <li>
                  <button class="top-nav-link" @click.prevent="onDashboardClick">Dashboard</button>
                </li>
                <li>
                  <router-link :to="{name: 'Profile'}">{{username}}</router-link>
                </li>
                <li v-if="isAdmin" class="dropdown">
                  <a href="#" class="dropdown-toggle">Admin
                    <span class="caret"></span>
                  </a>
                  <ul class="sub-menu dropdown-menu">
                    <li>
                      <router-link :to="{name: 'QuestionList'}">Survey Question Manager</router-link>
                    </li>
                    <li>
                      <router-link :to="{name: 'SuburbList'}">Suburb Research Management</router-link>
                    </li>
                    <li>
                      <router-link :to="{name: 'PropertyMap'}">Property Map</router-link>
                    </li>
                    <li>
                      <router-link :to="{name: 'ProximityList'}">Proximity Rule Management</router-link>
                    </li>
                    <li>
                      <router-link :to="{name: 'ReportContentManager'}">Report Content Manager</router-link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a @click.prevent="logout">Logout</a>
                </li>
              </ul>
              <ul v-else class="header-links pull-right nav navbar-nav">
                <li>
                  <a href="javascript:;" class="modal-login" @click.prevent="openLogin">Login</a>
                </li>
                <li>
                  <a href="javascript:;" class="modal-register" @click.prevent="openRegister">Register </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!--header top-->
      <nav class="navbar navbar-default">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"
              aria-expanded="false">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>

            <router-link class="navbar-brand" :to="{name: 'Home'}">
              <img src="/static/images/logo-housepro-blue.png" alt="" class="logo1">
              <img src="/static/images/logo-housepro-white.png" alt="" class="logo2">
            </router-link>
          </div>
          <!-- button -->
          <div v-if="!isAuthenticated && isMainPage === false" class="collapse navbar-collapse">
            <ul class="nav navbar-nav center">
              <li>
                <a href="javascript:;" id="overview" @click="scrollToElement" >OVERVIEW</a>
              </li>
              <li>
                <a href="javascript:;" id="access_to_service" @click="scrollToElement">ACCESS TO SERVICE</a>
              </li>
              <li>
                <a href="javascript:;" id="position_analysis" @click="scrollToElement">POSITION ANALYSIS</a>
              </li>
              <li>
                <a href="javascript:;" id="city_beach_train" @click="scrollToElement">CITY/BEACH/TRAIN</a>
              </li>
            </ul>
          </div>
          <div v-else class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav pull-right">
              <li class="current-menu-item dropdown">
                <a href="#" class="dropdown-toggle">Home
                  <span class="caret"></span>
                </a>
                <ul class="sub-menu dropdown-menu">
                  <li>
                    <router-link to="/">Find Property</router-link>
                  </li>
                </ul>
              </li>
              <li>
                <router-link to="/16-contact">Contact</router-link>
              </li>
              <li class="nav-btn">
                <a href="#">
                  <i class="fa fa-phone"></i><span class="pl-1">0418 117 740</span>
                </a>
              </li>
            </ul>
          </div>
          <!-- /.navbar-collapse -->
        </div>
      </nav>
    </header>
    <!-- SignUp Modal -->
    <modals-container/>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import {
  GLOBAL_SIGNOUT
} from '@/store/action-types'
import Cognito from '@/api/cognito'
import SignUp from '@/pages/SignUp'

export default {
  name: 'AppHeader',
  data () {
    return {
      isMainPage: true
    }
  },
  components: {
    SignUp
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'userInfo',
      'isAdmin'
    ]),
    ...mapState({
      property: (state) => state.main.property
    }),
    username () {
      return this.userInfo.givenName || this.userInfo.familyName || 'Account'
    }
  },
  mounted () {
    this.updateHeader()
  },
  methods: {
    openLogin () {
      Cognito.login()
    },
    openRegister () {
      Cognito.signUp()
    },
    openSignUp (response = {}) {
      this.$modal.show(SignUp, {
        response
      }, {
        width: 900,
        height: 'auto',
        clickToClose: false
      })
    },
    async logout () {
      try {
        await this.$store.dispatch(GLOBAL_SIGNOUT)
      } catch (error) {
        console.log(error)
      }
      this.$router.push('/')
    },
    updateHeader () {
      const self = this
      setTimeout(() => {
        if (self.$router.currentRoute.name !== 'Home') {
          self.isMainPage = false
        } else {
          self.isMainPage = true
        }
        self.$forceUpdate()
      }, 5)
    },
    scrollToElement (event) {
      const element = document.getElementById(event.srcElement.id + '_section')
      let headerOffset = 150
      let elementPosition = element.offsetTop
      let offsetPosition = elementPosition - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    },
    onDashboardClick () {
      window.location = `${window.location.origin}/dashboard`
    }
  },
  watch: {
    $route (to, from) {
      this.updateHeader()
    }
  }
}
</script>

<style scoped>
.header-top .navbar-nav li ul.sub-menu {
  margin-top: 10px;
}
button.top-nav-link {
  background: transparent;
  color: #fff;
  border: none;
  font-size: 11px;
  text-transform: uppercase;
  padding-top: 0;
  padding-bottom: 0;
  line-height: 1;
}
button.top-nav-link:focus {
  outline: none;
}
.center {
  display: table;
  margin: 0 auto;
}
.header-report {
  background-color: #f5f5f5;
  padding: 10px;
  border-bottom: solid 2px #000;
}
.header-report .row {
  padding: 10px;
}
.btn-border {
  border-color: #528EC1;
  background-color: #FFF;
  color: #528EC1;
}
.navbar-nav {
  float: inherit;
}
.search-button img {
  height: 25px;
  margin-right: 30px;
}
.dark-blue-color {
  color: #528EC1;
}
.property-info-pin {
  font-size: 14px;
  font-weight: 900;
}
.search-img {
  margin-top: 15px !important;
}
@media (max-width: 991px) {
  .navbar-nav>li>a {
    padding-top: 8px;
    padding-bottom: 8px;
    line-height: 12px;
  }
  .navbar>.container .navbar-brand, .navbar>.container-fluid .navbar-brand {
    margin: 7px 0 0;
  }
}
</style>
