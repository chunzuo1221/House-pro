<template>
  <div class="land-page">
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
              <h4 class="text-center">Property not found.</h4>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- property images carousel -->
    <modal name="imageModal" height="auto">
      <image-carousel :images="propertyImages"></image-carousel>
    </modal>

    <main v-if="property && property._id">
      <section class="pri-pad-b agent-single">
        <div class="container">
          <div class="row">
            <!-- Property Section -->
            <div class="col-md-12 col-sm-12">
              <div class="lst-vw top mb-50 full d-flex">
                <div class="property-image-box">
                  <figure>
                    <img :src="propertyImage" class="property-image">
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

            <!-- Description Section -->
            <div class="col-md-12">
              <div class="mb-50">
                <div class="sec-title icon-wrap mb-3">
                  <div class="d-flex justify-space-between mb-4">
                    <h4 class="mb-0">Land Analysis Report</h4>
                    <div class="d-flex">
                      <router-link class="black-link square-link ml-2" :to="{name: 'Property', params: { propertyId }}">
                        &lsaquo;&lsaquo; Back to Property Details </router-link>
                    </div>
                  </div>
                </div>
                <p>
                  The land is the most important physical attribute of a property. It is the basis of the value of any property. Being a finite resource that will remain constant through almost all catastophic events it provides the foundations for the house and dictates much of the functionality of a property.
                </p>
                <p>
                  The HousePro Land Report looks at a number of different aspects of the land component of the property in order to provide a detailed assessment that makes sense.
                </p>
                <p>
                  According to data available about this property from your local council we have found the following:
                </p>
                <div class="row mt-3">
                  <div class="col-sm-5">
                    <div class="mt-1"><b>Property Type</b> : {{ propertyType }}</div>
                    <div class="mt-1"><b>Lot Number</b> : {{ lotNumber }}</div>
                    <div class="mt-1"><b>Land Size</b> : {{ landSize }}</div>
                  </div>
                  <div class="col-sm-5 col-sm-offset-1">
                    <div class="mt-1"><b>Zoning</b> : {{ zoning }}</div>
                    <div class="mt-1"><b>Planning Instrument</b> : {{ planningInstrument }}</div>
                    <div class="mt-1"><b>Bush Fire Prone</b> : {{ bushFireProne }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Score Section -->
            <div class="col-md-12 col-sm-12 gages-container">
              <div class="gage-list pb-3 pt-3">
                <div class="row d-flex align-center p-2">
                  <div class="col-sm-3 col-md-3">
                    <div class="d-flex justify-center align-center">
                      <div class="level-score text-center">
                        <div class="score">{{landModuleScore}}</div>
                        <div class="text">Land Score</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-9 col-md-9 dark-blue">
                    <div v-html="scoreComments.moduleScoreComment"></div>
                    <div class="mt-2" v-if="scoreComments.responseCommentaries.length > 0">Some of the highlights of this property included:</div>
                    <ul class="mt-1">
                      <li v-if="scoreComments.planningComment" v-html="scoreComments.planningComment"></li>
                      <li v-if="scoreComments.topographyComment" v-html="scoreComments.topographyComment"></li>
                      <li v-for="(responseComment, index) in scoreComments.responseCommentaries" :key="index" v-html="responseComment"></li>
                    </ul>
                  </div>
                </div>
                <div class="d-flex align-center mt-2 dark-blue" v-html="scoreComments.comparedComment"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  FETCH_USER_PROPERTY,
  FETCH_SURVEY_ANSWER,
  FETCH_PROPERTY_SUBURB
} from '@/store/action-types'
import googleMapDirective from '@/directives/google-map'
import { getPropertyAddressComponentValue } from '@/utils'
import PropertiesApi from '@/api/properties'
import ContentFragmentApi from '@/api/content-fragments'

export default {
  name: 'LandDetail',
  directives: {
    googleMap: googleMapDirective
  },
  data () {
    return {
      propertyId: this.$route.params.propertyId,
      loading: false,
      landModuleScore: '0.0',
      assessmentResults: null,
      contentFragments: [],
      properties: [],
      scoreComments: {
        moduleScoreComment: null,
        comparedComment: null,
        planningComment: null,
        topographyComment: null,
        responseCommentaries: []
      }
    }
  },
  computed: {
    ...mapState({
      property: state => state.main.property,
      surveyanswer: state => state.main.surveyanswer,
      suburb: state => state.main.suburb
    }),
    propertyImage () {
      if (this.property && this.property.propertyImages && this.property.propertyImages.length) {
        if (this.property.propertyImages[0].url) {
          return this.property.propertyImages[0].url
        }
      }
      return '/static/images/agent1.jpg'
    },
    propertyType () {
      let value = null
      if (this.property && this.property.externalData) {
        let externalData = this.property.externalData.find((data) => {
          if (data.dataRecords) {
            return true
          }
          return false
        })
        if (externalData) {
          value = externalData.dataRecords.propertyType
        }
      }
      return value
    },
    lotNumber () {
      let value = null
      if (this.property && this.property.externalData) {
        let externalData = this.property.externalData.find((data) => {
          if (data.dataRecords) {
            return true
          }
          return false
        })
        if (externalData) {
          value = externalData.dataRecords.lot
        }
      }
      return value
    },
    landSize () {
      let value = null
      if (this.property && this.property.externalData) {
        let externalData = this.property.externalData.find((data) => {
          if (data.dataRecords) {
            return true
          }
          return false
        })
        if (externalData) {
          value = externalData.dataRecords.lotSize
        }
      }
      return value
    },
    zoning () {
      let value = null
      if (this.property && this.property.externalData) {
        let externalData = this.property.externalData.find((data) => {
          if (data.dataRecords) {
            return true
          }
          return false
        })
        if (externalData) {
          value = externalData.dataRecords.zone
        }
      }
      return value
    },
    planningInstrument () {
      let value = null
      if (this.property && this.property.externalData) {
        let externalData = this.property.externalData.find((data) => {
          if (data.dataRecords) {
            return true
          }
          return false
        })
        if (externalData) {
          value = externalData.dataRecords.zoneInstrument
        }
      }
      return value
    },
    bushFireProne () {
      let value = null
      if (this.property && this.property.externalData) {
        let externalData = this.property.externalData.find((data) => {
          if (data.dataRecords) {
            return true
          }
          return false
        })
        if (externalData) {
          value = externalData.dataRecords.bushFireProne.toLowerCase() === 'true' ? 'Yes' : 'No'
        }
      }
      return value
    },
    propertyImages () {
      if (this.property && this.property.propertyImages) {
        return this.property.propertyImages
      }
      return []
    },
    administrativeAreaLevel2 () {
      return getPropertyAddressComponentValue(this.property, 'administrative_area_level_2', false)
    },
    surveyAssessmentRequest () {
      return {
        modules: [
          {
            module: 'land',
            sections: [
              { section: 'topography' },
              { section: 'planning' },
              { section: 'improvements' },
              { section: 'bonus' }
            ]
          }
        ]
      }
    }
  },
  async mounted () {
    this.loading = true
    await this.$store.dispatch(FETCH_USER_PROPERTY, { propertyId: this.propertyId })
    await this.$store.dispatch(FETCH_SURVEY_ANSWER, { propertyId: this.propertyId, query: { modules: 'land' } })
    await this.$store.dispatch(FETCH_PROPERTY_SUBURB, { propertyId: this.propertyId })
    await this.fetchContentFragements()
    await this.fetchSurveyScores()
    this.loading = false
  },
  methods: {
    async fetchContentFragements () {
      try {
        const query = {
          moduleCode: 'land'
        }
        this.contentFragments = await ContentFragmentApi.get(query)
      } catch (e) {
        this.contentFragments = []
      }
    },
    async fetchSurveyScores (renew = false) {
      this.loading = true
      try {
        const self = this
        this.properties = await PropertiesApi.getPropertiesBySuburb({questionModule: 'land', postCode: this.suburb.postCode})
        this.assessmentResults = await PropertiesApi.getSurveyScore(this.propertyId, this.surveyAssessmentRequest)
        // Fetch module score comment
        this.landModuleScore = this.formatScore(this.getAssessmentSummary('land').value)
        let overallComments = this.contentFragments.filter(fragment => fragment.reportContentType === 'overall')
        let comment = null
        overallComments.forEach((cmt) => {
          if (!comment && self.landModuleScore > 0) {
            comment = cmt
          } else if (comment) {
            if (Math.abs(comment.upperBound - self.landModuleScore) > Math.abs(cmt.upperBound - self.landModuleScore)) {
              comment = cmt
            }
          }
        })
        if (comment) {
          if (comment.upperBound < self.landModuleScore) {
            comment = overallComments.find(cmt => cmt.upperBound > comment.upperBound)
          }
        }
        if (comment) {
          this.scoreComments.moduleScoreComment = this.formatString(comment.contentFragment, [this.property.name, this.landModuleScore])
        }
        comment = null
        // Fetch planning comment
        const planningScore = this.formatScore(this.getAssessmentSummary('land', 'planning').value)
        overallComments = this.contentFragments.filter(fragment => fragment.reportContentType === 'planning')
        overallComments.forEach((cmt) => {
          if (!comment && planningScore > 0) {
            comment = cmt
          } else if (comment) {
            if (Math.abs(comment.upperBound - planningScore) > Math.abs(cmt.upperBound - planningScore)) {
              comment = cmt
            }
          }
        })
        if (comment) {
          if (comment.upperBound < planningScore) {
            comment = overallComments.find(cmt => cmt.upperBound > comment.upperBound)
          }
        }
        if (comment) {
          this.scoreComments.planningComment = this.formatString(comment.contentFragment, [planningScore])
        }
        comment = null
        // Fetch topography comment
        const topographyScore = this.formatScore(this.getAssessmentSummary('land', 'topography').value)
        overallComments = this.contentFragments.filter(fragment => fragment.reportContentType === 'topography')
        overallComments.forEach((cmt) => {
          if (!comment && topographyScore > 0) {
            comment = cmt
          } else if (comment) {
            if (Math.abs(comment.upperBound - topographyScore) > Math.abs(cmt.upperBound - topographyScore)) {
              comment = cmt
            }
          }
        })
        if (comment) {
          if (comment.upperBound < topographyScore) {
            comment = overallComments.find(cmt => cmt.upperBound > comment.upperBound)
          }
        }
        if (comment) {
          this.scoreComments.topographyComment = this.formatString(comment.contentFragment, [topographyScore])
        }
        comment = null
        // Fetch compared comment
        let percent = 0
        if (this.properties.length > 0) {
          let propertyIndex = this.properties.findIndex(property => property._id === this.property._id)
          percent = (propertyIndex / this.properties.length * 100).toFixed(1)
          this.scoreComments.comparedComment = '<p>Compared to other similar properties in the suburb this property is ranked in the <b>' + percent + 'th</b> percentile for land based on <b>' + this.properties.length + '</b> that we have assessed in <b>' + this.suburb.name + '</b></p>'
        }
        // Fetch response comments
        this.surveyanswer.responses.forEach((response) => {
          if (response.responseCommentary) {
            self.scoreComments.responseCommentaries.push(response.responseCommentary)
          }
        })
        this.loading = false
        this.$forceUpdate()
      } catch (error) {
        if (error.response.status === 404) {
          this.landModuleScore = '0.0'
          this.$forceUpdate()
          this.loading = false
        }
      }
    },
    formatScore (val, tenMax = true) {
      let value = val || 0
      return tenMax ? Number.parseFloat(value).toFixed(1) : Number.parseFloat(value).toFixed(0)
    },
    getAssessmentSummary (_module = null, _section = null, isBonus = false) {
      let summary = {}
      if (this.assessmentResults) {
        if (_module) {
          if (this.assessmentResults.modules) {
            const moduleLevel = this.assessmentResults.modules.find(m => m.module === _module)
            if (moduleLevel) {
              if (_section) {
                if (moduleLevel.sections) {
                  const sectionLevel = moduleLevel.sections.find(s => s.section === _section)
                  if (sectionLevel) {
                    summary = sectionLevel.score
                  }
                }
              } else {
                if (moduleLevel.score) {
                  if (isBonus) {
                    summary = moduleLevel.score.bonus
                  } else {
                    summary = moduleLevel.score
                  }
                }
              }
            }
          }
        } else {
          summary = this.assessmentResults.score
        }
      }
      return summary
    },
    formatString (str, args) {
      let matchs = str.match(/{(.+?)(?=\})}/g)
      for (let k in matchs) {
        str = str.replace(matchs[k], '<b>' + args[k] + '</b>')
      }
      return str
    }
  }
}
</script>

<style scoped>
.title-analysis-type {
  display: flex;
  align-items: center;
}
.gage-list {
  padding-left: 20px;
  padding-right: 20px;
  margin-left: 0px;
  margin-right: 0px;
  background: #fcfcfc;
  border-radius: 2px;
  border: 1px solid #ccc;
}
.gages-container {
  margin-bottom: 50px;
}
.static-gage {
  display: flex;
  justify-content: center;
  align-items: center;
}
.static-gage > div {
  height: 100px;
  width: 100px;
  line-height: 100px;
  font-size: 2.3em;
  margin-bottom: 0.25em;
  margin-top: 0.3em;
  color: rgba(170, 41, 35, 0.85);
  border: 4px solid rgba(170, 41, 35, 0.85);
  border-radius: 8px;
}
.static-gage-title {
  color: #999999;
  font-size: 15px;
  font-family: sans-serif;
  font-weight: bold;
  text-align: center;
  display: inline-block;
}
.static-gage-link:hover {
  text-decoration: none;
}
.static-gage-link:hover .static-gage-title {
  color: #2dc31d;
}
.loading-spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 60px;
}
.level-score .score {
  line-height: 1.4;
}
.level-score .text {
  font-size: 1.5em;
  line-height: 1.6;
}
.dark-blue {
  color: #528EC1;
}
</style>
