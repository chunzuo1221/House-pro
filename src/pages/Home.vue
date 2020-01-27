<template>
  <div class="home-page">
    <div class="banner overlay">
      <div class="banner-content">
        <div class="wrap">
          <div class="inner text-white">
            <h1 class="lh-normal mb-10 text-white text-center hide-mobile">
              Search for an address here :
            </h1>
            <form class="form-inline" @submit.prevent>
              <div class="form-group keyword keyword-full-width" v-if="googleApi">
                <vue-google-autocomplete id="map" types="address" v-on:keypress="address=''" placeholder="Enter your keywords" v-on:placechanged="getAddressData" country="au"/>
              </div>
              <div class="form-group">
                <button :disabled="!address" @click="search" v-loading-button="{isLoading: searchInProgress, loadingText: 'Searching'}" type="submit">Search
                  <i class="fa fa-long-arrow-right"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ul class="banner-slide">
        <li>
          <figure>
            <img src="/static/images/banner-slide1.jpg" alt="">
          </figure>
        </li>
        <li>
          <figure>
            <img src="/static/images/banner-slide2.jpg" alt="">
          </figure>
        </li>
        <li>
          <figure>
            <img src="/static/images/banner-slide3.jpg" alt="">
          </figure>
        </li>
      </ul>
    </div>
    <!--main-->
    <main class="pri-pad pb-0">
      <section class="subscription">
        <div class="parallax-wrap">
          <div class="image overlay" data-type="background" data-speed="0">
            <div class="stuff pri-pad">
              <div class="container">
                <div class="row">
                  <div class="col-md-8 col-sm-8 col-md-offset-2 col-sm-offset-2 text-center">
                    <div class="main-title full text-center">
                      <h2>Join our mailing list</h2>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy
                        text ever since the 1500s, when an unknown.
                      </p>
                    </div>
                    <!--title-->

                    <form action="#" class="form-inline">
                      <div class="form-group email">
                        <input type="text" placeholder="enter your email address">
                      </div>
                      <div class="form-group">
                        <button type="submit">
                          Subscribe
                          <i class="fa fa-long-arrow-right"></i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!--secbscription-->
    </main>
    <!-- Video Modal -->
    <modal name="warningModal" class="warning-modal" height="auto">
      <div class="modal-title">Warning</div>
      <div class="modal-content text-center">
        <div class="mb-1"><b>{{ warningMessage }}</b></div>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import loadingButton from '../directives/loading-button'
import PropertiesApi from '@/api/properties'
import SuburbApi from '@/api/suburbs'
import {
  getPropertyAddressComponentValue,
  saveInterestedPropertyToStorage
} from '@/utils'

export default {
  name: 'Home',
  components: {
    VueGoogleAutocomplete
  },
  directives: {
    loadingButton
  },
  data () {
    return {
      searchInProgress: false,
      address: null,
      searchError: false,
      warningMessage: ''
    }
  },
  computed: {
    ...mapState({
      googleApi: state => state.config.googleApi
    }),
    ...mapGetters([
      'isAuthenticated',
      'isAdmin'
    ])
  },
  mounted () {
    $('body,html').animate({
      scrollTop: 0
    }, 600)
    let $win = $(window)
    let $testi = $('.testi')
    let $bannerslide = $('.banner-slide')
    let $featuredBlog = $('.featured-blog-list')

    // banner slider
    $bannerslide.slick({
      dots: false,
      infinite: true,
      speed: 800,
      fade: true,
      cssEase: 'linear',
      autoplay: true,
      draggable: true,
      lazyLoad: 'ondemand',
      pauseOnFocus: false
    })

    // prise slider
    if ($win.width() < 767) {
      $featuredBlog.bxSlider({
        minSlides: 1,
        maxSlides: 1,
        slideWidth: 370,
        slideMargin: 30,
        moveSlides: 1,
        auto: true,
        pager: false,
        nextText: '<i class="fa fa-long-arrow-right">',
        prevText: '<i class="fa fa-long-arrow-left">'
      })
    } else {
      $featuredBlog.bxSlider({
        minSlides: 2,
        maxSlides: 3,
        slideWidth: 370,
        slideMargin: 30,
        moveSlides: 1,
        auto: true,
        pager: false,
        nextText: '<i class="fa fa-long-arrow-right">',
        prevText: '<i class="fa fa-long-arrow-left">'
      })
    }
    // testimonail sider
    $testi.bxSlider({
      pagerCustom: '.testimonail-thumb',
      auto: true
    })
  },
  methods: {
    onSearchDone (property) {
      this.searchInProgress = false
      this.searchError = false
      if (this.isAuthenticated) {
        if (this.isAdmin) {
          this.$router.push({
            name: 'Property',
            params: {
              propertyId: property._id
            }
          })
        } else {
          window.location = `${window.location.origin}/dashboard/properties/${property._id}`
        }
      } else {
        saveInterestedPropertyToStorage(property.formatted_address)
        this.$router.push({
          name: 'LocationAnalysisReport',
          params: {
            propertyId: property._id
          }
        })
      }
    },
    onSearchError () {
      this.searchError = true
      this.searchInProgress = false
    },
    async search () {
      this.searchInProgress = true
      if (this.address.place_id.length > 40) {
        this.searchInProgress = false
        this.openWarningModel('We have checked this address and it does not appear to exist, please try again.')
      } else {
        try {
          const postCode = getPropertyAddressComponentValue(this.address, 'postal_code')
          const suburbs = await SuburbApi.get({ postCode })
          if (suburbs && suburbs[0]) {
            const oldProperties = await PropertiesApi.get({ formatted_address: this.address.formatted_address })
            if (oldProperties && oldProperties.length > 0) {
              this.onSearchDone(oldProperties[0])
            } else {
              const newProperty = await PropertiesApi.post(this.address)
              this.onSearchDone(newProperty)
            }
          } else {
            this.searchInProgress = false
            this.openWarningModel('Unfortunately we haven\'t surveyed this suburb yet, we will get there soon!')
          }
        } catch (error) {
          this.onSearchError()
        }
      }
    },
    /**
     * When the location found
     * @param {Object} addressData Data of the found location
     * @param {Object} placeResultData PlaceResult object
     * @param {String} id Input container ID
     */
    getAddressData: function (addressData, placeResultData, id) {
      this.address = placeResultData
    },
    openWarningModel (message) {
      this.warningMessage = message
      this.$modal.show('warningModal')
    }
  }
}
</script>

<style>
.modal-content {
  padding: 16px;
  box-shadow: none;
  border: none;
}
.modal-title {
  height: 50px;
  background-color: #528EC1;
  color: #FFF;
  font-weight: bold;
  display: block;
  align-items: center;
  padding-left: 15px;
  padding-top: 15px;
}
</style>
