<template>
  <div class="property-page">
    <div class="gallery-wrap full agent-full">
      <ul class="gallery-full">
        <li>
          <figure class="text-center" v-if="property" id="property-map" v-google-map="property">
          </figure>
        </li>
      </ul>
    </div>
    <main v-if="!loading && !property">
      <section class="pri-pad-b agent-single">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="mb-50"></div>
              <h4 class="text-center">The property not found</h4>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- property images carousel -->
    <modal name="imageModal" height="auto">
      <image-carousel :images="propertyImages"></image-carousel>
    </modal>

    <modal name="uploadModal" height="auto">
      <div class="modal-header">
        <h4 class="text-center mt-1">Property Images</h4>
      </div>
      <div class="modal-content">
        <div>Main image URL:</div>
        <input type="text" name="photoUrl" v-model="photoUrl">
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" @click="savePhotos">Save</button>
        <button class="btn btn-default" @click="closeUploadModal">Cancel</button>
      </div>
    </modal>

    <modal name="surveyManagerModal" class="survey-manager-modal" height="auto">
      <div class="modal-title">Survey Manager</div>
      <div class="modal-content">
        <div class="mb-1"><b>The following surveys have been collected for this property:</b></div>
        <table class="survey-manager-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Location</th>
              <th>Land</th>
              <th>House</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in surveys" :key="row._id">
              <td>{{ row.surveyor }}</td>
              <td>{{ row.location }}</td>
              <td>{{ row.land }}</td>
              <td>{{ row.house }}</td>
              <td>
                <toggle-button :name="row._id" v-model="surveysStatus[row._id]" @change="onChangeEventHandler" :sync="true" :labels="true"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </modal>

    <main v-if="property && property._id">
      <section class="pri-pad-b agent-single">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <div class="lst-vw top mb-50 full d-flex">
                <div class="property-image-box">
                  <figure v-if="propertyImage">
                    <img :src="propertyImage" class="property-image" @click="onImageClick">
                    <button class="btn btn-default image-upload d-flex justify-center align-center" @click.stop="openUploadModal">
                      <font-awesome-icon :icon="['fas', 'pencil-alt']" color="#528EC1" size="1x" />
                    </button>
                  </figure>
                  <figure v-else class="d-flex justify-center align-center">
                    <img src="/static/images/images-coming-soon.png" class="property-image">
                    <button class="btn btn-default image-upload d-flex justify-center align-center" @click.stop="openUploadModal">
                      <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" color="#528EC1" size="1x" />
                    </button>
                  </figure>
                </div>
                <div class="property-heading">
                  <h4 class="pull-left mb-0">
                    {{property.name}}
                    <span><i class="fa fa-map-marker"></i> {{property.formatted_address}} </span>
                  </h4>
                  <span class="pull-right"> {{administrativeAreaLevel2}}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-12">
              <div class="sec-title">
                <div class="d-flex justify-start mb-4">
                  <h4 class="mb-0 mr-4">Overview</h4>
                  <div class="d-flex">
                    <button class="btn btn-primary px-2" v-if="isAdmin" @click="refetchExternalData" :disabled="loading">Refresh Get External Data</button>
                  </div>
                  <div class="d-flex ml-3">
                    <button class="btn btn-primary px-2" v-if="isAdmin" @click="openSurveyManagerModal" :disabled="loading">Survey Manager</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-12">
              <p class="pb-4">Welcome to the HousePro Report for {{property.formatted_address}}. Our property analysis platform conducts a broad range of location, land and property analysis techniques to compile a comprehensive and easy-to-understand suite of reports to help you make your biggest purchasing decisions. Our team of experts and the latest technology are at your disposal.</p>
            </div>
          </div>

          <div class="row d-flex align-center">
            <div class="col-sm-9">
              <div class="row">
                <div class="col-sm-6 my-1">
                  <strong>Lot Number: </strong>{{allDataRecords.lot}}
                </div>
                <div class="col-sm-6 my-1">
                  <strong>Property Type: </strong>{{allDataRecords.propertyType}}
                </div>
                <div class="col-sm-6 my-1">
                  <strong>Land Size: </strong>
                  <span>{{allDataRecords.lotSize}}</span>
                  <span v-if="allDataRecords.unit">{{allDataRecords.unit}}<sup>2</sup></span>
                </div>
                <div class="col-sm-6 my-1">
                  <strong>Zoning: </strong>{{allDataRecords.zone}}
                </div>
                <div class="col-sm-6 my-1">
                  <strong>Waste Service Type: </strong>{{allDataRecords.wasteType}}
                </div>
                <div class="col-sm-6 my-1">
                  <strong>Waste Collection Day: </strong>{{allDataRecords.wasteCollectionDay}}
                </div>
                <div class="col-sm-6 my-1">
                  <strong>Federal Electorate: </strong>{{allDataRecords.cwlthElectDiv}}
                </div>
                <div class="col-sm-6 my-1">
                  <strong>State Electorate: </strong>{{allDataRecords.stateElectDiv}}
                </div>
                <div class="col-sm-6 my-1">
                  <strong>Ward: </strong>{{allDataRecords.ward}}
                </div>
              </div>
            </div>
            <div class="col-sm-3 d-flex justify-end">
              <div class="level-score">
                <div class="score">{{overallScore}}</div>
                <div class="text">Overall Property<br/>Score</div>
              </div>
            </div>
          </div>

          <div class="row my-5">
            <div class="col-sm-12">
              <div class="sec-title">
                <div class="d-flex justify-space-between mb-4">
                  <h4 class="mb-0">School Catchment Information</h4>
                </div>
              </div>
              <p>
                According to local education authority information this school is in the catchment area for the following public schools:
              </p>
              <div class="mt-3">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Level</th>
                      <th>Address</th>
                      <th>#Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in property.services" :key="item.ageid">
                      <td>{{item.school_name}}</td>
                      <td>{{item.level_of_schooling}}</td>
                      <td>{{item.street}}</td>
                      <td>{{parseInt(item.student_number)}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="row my-5">
            <div class="col-md-12 col-sm-12" v-if="suburb" v-html="suburb.overviewDescription"></div>
          </div>

          <div class="row my-3">
            <div class="col-sm-4">
              <div class="sec-title">
                <h4>Location Analysis</h4>
              </div>
              <div class="mb-30 analysis-item">
                <div class="ppt-list gd-vw">
                  <figure>
                    <div class="div-figure">
                      <div class="figure-score col-xs-4">{{ locationScore }}</div>
                    </div>
                    <a href="#" class="image-effect overlay" @click.prevent>
                      <img src="/static/images/location-tile.jpg" alt="">
                    </a>
                  </figure>
                  <div class="title">
                    <div class="text-center mb-5">{{property.name}}</div>
                    <router-link :to="{name: 'Explorer', params: {propertyId}}" @click.prevent class="tile-button">Edit Details</router-link>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="sec-title">
                <h4>Land and House Analysis</h4>
              </div>
              <div class="mb-30 analysis-item">
                <div class="ppt-list gd-vw">
                  <figure>
                    <div class="div-figure">
                      <div class="figure-score col-xs-4">{{ landHouseScore }}</div>
                    </div>
                    <a href="#" class="image-effect overlay" @click.prevent>
                      <img src="/static/images/land-house-analysis-tile.png" alt="">
                    </a>
                  </figure>
                  <div class="title">
                    <div class="text-center mb-5">Register with us to access our advanced Land and House analysis tools</div>
                    <router-link :to="{name: 'LandHouse', params: {propertyId}}" @click.prevent class="tile-button">Get Started</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row py-3">
            <div class="col-sm-12">
              <div class="sec-title">
                <h4>Debug Information</h4>
              </div>
              <table v-if="externalData.length">
                <template v-for="dataObject in externalData">
                  <tr :key="dataObject.providerId" v-if="dataObject">
                    <td>
                      <div>External Data Provider(s) used: {{dataObject.providerName}}</div>
                      <div>External ID: {{dataObject.extPropertyId}}</div>
                      <div>Request to get property details: {{dataObject.providerUrl}}</div>
                      <div>Source Data Mapped to Property Record:</div>
                      <template v-if="dataObject && dataObject.dataRecords">
                        <div v-for="dataKey in Object.keys(dataObject.dataRecords)" :key="dataObject.providerId + dataKey">
                          {{dataKey}}: {{dataObject.dataRecords[dataKey]}}
                        </div>
                      </template>
                    </td>
                  </tr>
                </template>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import lget from 'lodash.get'
import googleMapDirective from '@/directives/google-map'
import { getPropertyAddressComponentValue } from '@/utils'
import {
  FETCH_USER_PROPERTY,
  FETCH_PROPERTY_SUMMARY
} from '@/store/action-types'
import PropertiesApi from '@/api/properties'
import AnswerApi from '@/api/survey/answer'
import ImageCarousel from '@/components/core/ImageCarousel'
import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)

export default {
  name: 'Property',
  components: {
    ImageCarousel
  },
  directives: {
    googleMap: googleMapDirective
  },
  data () {
    return {
      overallScore: '?',
      locationScore: '?',
      landHouseScore: '?',
      propertyId: this.$route.params.propertyId,
      loading: false,
      externalData: [],
      photoUrl: '',
      surveysStatus: {}
    }
  },
  computed: {
    ...mapState({
      property: state => state.main.property,
      suburb: state => state.main.suburb,
      surveys: state => state.main.surveys,
      overallAssessment: state => state.main.overallAssessment,
      landHouseAssessment: state => state.main.landHouseAssessment
    }),
    ...mapGetters([
      'isAdmin'
    ]),
    administrativeAreaLevel2 () {
      return getPropertyAddressComponentValue(this.property, 'administrative_area_level_2', false)
    },
    addressForProvider () {
      let address = ''
      if (this.property.formatted_address) {
        address = this.property.formatted_address.replace(/,/g, '').replace(/\s/g, '+')
      }
      if (this.property && this.property.address_components) {
        const streetNumber = this.property.address_components.find(c => c.types.includes('street_number'))
        const route = this.property.address_components.find(c => c.types.includes('route'))
        const locality = this.property.address_components.find(c => c.types.includes('locality'))
        if (streetNumber && route && locality) {
          address = `${streetNumber.long_name} ${route.long_name} ${locality.long_name}`.replace(/\s/g, '+')
        }
      }
      return address
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
    },
    propertyImage () {
      if (this.property && this.property.propertyImages && this.property.propertyImages.length) {
        if (this.property.propertyImages[0].url) {
          return this.property.propertyImages[0].url
        }
      }
      return null
    },
    propertyImages () {
      if (this.property && this.property.propertyImages) {
        return this.property.propertyImages
      }
      return []
    }
  },
  async mounted () {
    this.loading = true
    try {
      await this.$store.dispatch(FETCH_PROPERTY_SUMMARY, { propertyId: this.propertyId })
      if (this.property) {
        this.externalData = this.property.externalData || []
      }
      this.photoUrl = this.propertyImage
      this.surveys.forEach(survey => {
        this.surveysStatus[survey._id] = survey.surveyStatus === 'published'
      })
      this.locationScore = this.formatScore(lget(this.property, 'scores.overall.value', 0))
      this.overallScore = this.formatScore(this.getAssessmentSummary(this.overallAssessment).value)
      this.landHouseScore = this.formatScore(this.getAssessmentSummary(this.landHouseAssessment).value)
      this.loading = false
    } catch (error) {
      this.loading = false
      this.locationScore = '?'
      this.landHouseScore = '?'
      this.overallScore = '?'
      console.log(error)
    }
  },
  methods: {
    getAssessmentSummary (assessmentResults, _module = null) {
      let summary = {}
      if (assessmentResults) {
        if (_module) {
          if (assessmentResults.modules) {
            const moduleLevel = assessmentResults.modules.find(m => m.module === _module)
            if (moduleLevel && moduleLevel.score) {
              summary = moduleLevel.score
            }
          }
        } else {
          summary = assessmentResults.score
        }
      }
      return summary
    },
    formatScore (val, tenMax = true) {
      let value = val || 0
      return tenMax ? Number.parseFloat(value).toFixed(1) : Number.parseFloat(value).toFixed(0)
    },
    calculateScore (scores) {
      if (scores && scores.maxScore && scores.maxScore !== 0 && typeof scores.surveyScore !== 'undefined') {
        return `${Number.parseFloat(((scores.surveyScore || 0) / scores.maxScore) * 10).toFixed(1)}`
      }
      return '?'
    },
    async refetchExternalData () {
      try {
        this.externalData = []
        this.loading = true
        const externalData = await PropertiesApi.getRefreshExternalData(this.propertyId)
        this.loading = false
        this.externalData = externalData || []
        if (this.externalData.length === 0) {
          this.$snack.danger('No External Data')
        }
      } catch (error) {
        this.loading = false
        this.$snack.danger(`Error: ${JSON.stringify(error)}`)
      }
    },
    onImageClick () {
      if (this.propertyImages.length) {
        this.$modal.show('imageModal')
      }
    },
    openUploadModal () {
      this.$modal.show('uploadModal')
    },
    async savePhotos () {
      if (this.property) {
        const propertyImages = this.property.propertyImages || []
        propertyImages[0] = {
          url: this.photoUrl,
          type: 'photo',
          name: 'Front'
        }
        const property = {
          ...this.property,
          propertyImages
        }
        this.loading = true
        await PropertiesApi.put(this.propertyId, property)
        this.closeUploadModal()
        await this.$store.dispatch(FETCH_USER_PROPERTY, { propertyId: this.propertyId })
        this.loading = false
      }
    },
    closeUploadModal () {
      this.$modal.hide('uploadModal')
    },
    openSurveyManagerModal () {
      this.$modal.show('surveyManagerModal')
    },
    async onChangeEventHandler (val) {
      if (val.value) {
        const keys = Object.keys(this.surveysStatus)
        keys.forEach((key) => {
          if (val.srcEvent.srcElement.name !== key) {
            this.surveysStatus[key] = false
          }
        })
      }
      this.$forceUpdate()
      try {
        let response = await AnswerApi.publishAnswer(
          val.srcEvent.srcElement.name,
          {
            surveyStatus: val.value,
            propertyId: this.propertyId
          }
        )
        if (response) {
          this.loadPropertyScores()
          this.$modal.hide('surveyManagerModal')
        }
      } catch (error) {
        console.log(error)
        this.surveysStatus[val.srcEvent.srcElement.name] = false
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style scoped>
.analysis-item .overlay {
  max-height: 300px;
}

@media (min-width: 576px) {
  .services-list {
    -webkit-column-count: 2;
    -moz-column-count: 2;
    column-count: 2;
    -webkit-column-gap: 1.2rem;
    -moz-column-gap: 1.2rem;
    column-gap: 1.2rem;
  }
}

@media (min-width: 576px) {
  .services-list .service-item {
    display: inline-block;
    width: 100%;
  }
  .analysis-item .image-effect {
    max-height: 195px;
  }
}

@media (min-width: 992px) {
  .services-list {
    -webkit-column-count: 3;
    -moz-column-count: 3;
    column-count: 3;
    -webkit-column-gap: 2rem;
    -moz-column-gap: 2rem;
    column-gap: 2rem;
  }
  .analysis-item .image-effect {
    min-height: 270px;
  }
}
@media (min-width: 1202px) {
  .analysis-item .image-effect {
    min-height: 330px;
  }
}

.service-item {
  display: inline-block;
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}

.service-item figure img {
  width: 100%;
  min-height: 194px;
}

.analysis-item .tile-button {
  border: 1px solid;
  padding: 2px 12px;
  display: block;
  margin: 0 2em;
  text-align: center;
  color: white;
  opacity: 0.8;
}

.analysis-item .tile-button:hover:not(.tile-button-disabled) {
  opacity: 1;
}

.analysis-item .tile-button-disabled {
  color: #6d6d6d;
}

.analysis-item figure img {
  width: 100%;
}

.analysis-item .title {
  padding-top: 5px;
  padding-bottom: 14px;
}

.analysis-item {
  margin: 0 auto;
  display: block;
}
.div-figure {
  position:absolute;
  left: 15px;
  top: 15px;
}
.figure-score {
  border: 2px solid white;
  text-align: center;
  min-width: 60px;
  padding-left: 3px;
  padding-right: 3px;
  height: 60px;
  width: 70px;
  line-height: 60px;
  z-index: 19;
  color: white;
  font-size: 33px;
}

.figure-title {
  text-align: center;
  width: auto;
  height: 60px;
  line-height: 30px;
  z-index: 19;
  color: white;
  font-size: 33px;
  display: flex;
  align-items: center;
}

@media screen and (max-width: 1199px) and (min-width: 992px){
  .figure-title {
    font-size: 26px;
  }
}
@media screen and (max-width: 991px) and (min-width: 768px) {
  .figure-title {
    font-size: 19px;
  }
}
.figure-score img {
  margin-bottom: 5px;
  max-width:60px;
}
.level-score {
  text-align: center;
  border: 3px solid #528EC1;
  border-radius: 20px;
  max-width: 200px;
  width: 100%;
  color: #528EC1;
  padding: 16px;
}
.level-score .score {
  font-size: 6em;
  font-weight: bold;
  line-height: 1.2;
}
.level-score .text {
  font-size: 1.3em;
  font-weight: bold;
  line-height: 1.4;
}
</style>
<style>
.map-info-title {
  margin-top: 8px;
}
.map-info-title p {
  font-weight: bold;
  font-size: 15px;
}
.map-info-content {
  margin-top: 5px;
}
.image-upload {
  width: 32px;
  height: 32px;
  padding: 6px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 12px;
  right: 12px;
}
.btn-default.image-upload {
  border-color: #528EC1 !important;
}
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
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-top: 5px;
}
.survey-manager-table th{
  text-align: center;
  vertical-align: middle;
}
.survey-manager-table td{
  text-align: center;
  vertical-align: middle;
}
h4 {
  font-weight:600;
}
</style>
