const axios = require('axios');
const Promise = require('bluebird');
const lget = require('lodash.get');
const Property = require('../models/Property');
const SurveyAnswer = require('../models/SurveyAnswer');
const Suburb = require('../models/Suburb');
const ServiceProximityAssessment = require('../models/ServiceProximityAssessment');
const QuestionClassification = require('../models/QuestionClassification');
const cartoApi = require('./carto-api');
const logger = require('./logger');
const {evaluatePropertyLocation, calculateComparativeRankings, classifySurveyAnswers} = require('./survey');
const {
  getDomainPropertyData,
  restructDomainPropertyData,
  restructDomainPropertyPhotoData,
  restructDomainListingData,
  restructDomainListingPhotoData,
  getDomainListingIds,
  getDomainListingForSale,
  getDomainAgent,
  getDomainAgency,
  restructDomainAgencyData,
  restructDomainAgentData
} = require('./domain-api');
const {responseMongooseSimple} = require('./api.utils');
const {
  getAddressComponentValue,
  calculateLevelScore
} = require('../util');

const searchProperties = (req, res) => {
  responseMongooseSimple(Property.find(req.query).exec(), req, res);
};

const getPropertyById = async (req, res) => {
  const { id } = req.params
  Property
    .findById(id)
    .lean()
    .then(property => {
      if (!property || !property.address_components) {
        throw new Error('Property not found.')
      }
      const lat = property.geometry.location.lat
      const lng = property.geometry.location.lng
      return Promise.props({
        catchment: Promise.resolve().then(() => {
          return cartoApi
            .getGovernmentSchoolDetail(lat, lng, null)
            .then(catchment => catchment)
            .catch(err => {
              logger.error(err)
              return null
            })
        }),
        scores: evaluatePropertyLocation(property._id, getAddressComponentValue(property.address_components, 'postal_code')),
        surveyAnswers: SurveyAnswer
          .find({propertyId: property._id})
          .populate({
            path: 'responses.questionId',
            select: 'questionModule questionSection questionCategory analysisTypes adjustmentQuestion'
          })
          .lean()
          .then(results => results)
          .catch(err => {
            logger.error(err)
            return null
          }),
        questionClassification: QuestionClassification
          .findOne({name: 'Question Classifications'}).lean()
      })
        .then(({catchment, scores, surveyAnswers, questionClassification}) => {
          const response = {...property}
          if (catchment.rows.length > 0) {
            response.services = catchment.rows
          }
          response.scores = scores
          response.surveyScores = classifySurveyAnswers(surveyAnswers, questionClassification)
          return res.status(200).json(response)
        })
    })
    .catch(err => {
      return res.status(404).json(err)
    })
};

const getPropertyBySuburb = async (req, res) => {
  const questionModule = req.query.questionModule
  const postCode = req.query.postCode
  const query = {
    "responses.questionModule": questionModule,
  };
  let properties = [];
  try {
    let surveyAnswers = await SurveyAnswer.find(query).populate('propertyId');
    surveyAnswers.forEach((answer) => {
      if (answer.propertyId.address_components.some(component => component.types.some(type => type === 'postal_code') && component.short_name === postCode )) {
        let responses = answer.responses.filter(response => response.questionModule === questionModule)
        let score = calculateLevelScore(responses, true);
        answer.propertyId[questionModule + "OverallScore"] = score;
        properties.push(answer.propertyId)
      }
    });
    properties.sort((a, b) => {
      if (a[questionModule + "OverallScore"].value < b[questionModule + "OverallScore"].value)
        return -1;
      if (a[questionModule + "OverallScore"].value > b[questionModule + "OverallScore"].value)
        return 1;
      return 0;
    })
  } catch (error) {
    return res.status(500).json(error);
  }
  return res.status(200).json(properties);
};

const createProperty = (payload) => {
  // get postal_code, route, street_number values from property data input
  // if not get, consider it as a bad request
  const postCode = getAddressComponentValue(payload.address_components, 'postal_code')
  const streetName = getAddressComponentValue(payload.address_components, 'route')
  const streetNumber = +getAddressComponentValue(payload.address_components, 'street_number')

  if (!payload.formatted_address || !postCode || !streetName || !streetNumber) {
    return Promise.reject(new Error('Wrong property data'))
  }

  return Property
    .findOne({
      formatted_address: payload.formatted_address
    })
    .then(existedProperty => {
      if (existedProperty) {
        throw new Error('The property has already existed in database')
      }
    })
    .then(() => {
      logger.log(`Adding "${payload.formatted_address}" in properties collection`)
      return new Property(Object.assign(payload)).save()
    })
    .then(newProperty => {
      /**
       * Clone exiting surveyanswers and serviceproximityassessments of nearest property
       */
      logger.log('---------- Cloning logic ----------')
      // look for properties with same postal_code and route name
      const similarPropertyFilterQuery = {
        $and: [
          {
            'address_components.types': 'postal_code',
            'address_components.short_name': postCode
          },
          {
            'address_components.types': 'route',
            'address_components.short_name': streetName
          },
          {
            locked: true
          }
        ]
      }
      return Property.find(similarPropertyFilterQuery)
        .then(similarProperties => {
          if (similarProperties && similarProperties.length) {
            const similarAssessmentQuery = { propertyId: { $in: similarProperties.map(o => o._id) } }
            const nearestSortCompare = (a, b) => {
              const streetNumberA = +getAddressComponentValue(a.propertyId.address_components, 'street_number')
              const streetNumberB = +getAddressComponentValue(b.propertyId.address_components, 'street_number')
              const diff = Math.abs(streetNumber - streetNumberA) - Math.abs(streetNumber - streetNumberB)
              if (diff === 0) {
                return streetNumberB - streetNumberA
              }
              return diff
            }
            return Promise.all([
              // Clone nearest surveyanswer data
              SurveyAnswer.find(similarAssessmentQuery).populate('propertyId').lean()
                .then(similarSurveyAnswers => {
                  // if property data doesn't exist in properties collection then exclude it from cloning logic
                  return similarSurveyAnswers
                    .filter(surveyAnswer => {
                      if (surveyAnswer.propertyId) {
                        const nearStreetNumber = +getAddressComponentValue(surveyAnswer.propertyId.address_components, 'street_number')
                        // use properties less than 20 numbers away - up and down the street
                        const diff = Math.abs(streetNumber - nearStreetNumber)
                        if (diff < 20) {
                          if (surveyAnswer.responses && surveyAnswer.responses.length) {
                            return true
                          }
                        }
                      }
                      return false
                    })
                })
                .then(similarSurveyAnswers => {
                  if (similarSurveyAnswers.length) {
                    // sort similar surveyanswers in first nearest order
                    similarSurveyAnswers.sort(nearestSortCompare)
                    const nearestSurveyAnswer = similarSurveyAnswers[0]
                    const nearestPropertyName = nearestSurveyAnswer.propertyId.formatted_address
                    nearestSurveyAnswer._id = null
                    nearestSurveyAnswer.propertyId = newProperty._id
                    nearestSurveyAnswer.clonedFrom = nearestPropertyName
                    nearestSurveyAnswer.responses = nearestSurveyAnswer.responses.filter(o => o.questionModule === 'location')
                    return new SurveyAnswer(nearestSurveyAnswer).save()
                  }
                }),
              // Clone nearest serviceproximityassessment data
              ServiceProximityAssessment.find(similarAssessmentQuery).populate('propertyId').lean()
                .then(similarProximityAssessments => {
                  // if property data doesn't exist in properties collection then exclude it from cloning logic
                  return similarProximityAssessments
                    .filter(proximityAssessment => {
                      if (proximityAssessment.propertyId) {
                        const nearStreetNumber = +getAddressComponentValue(proximityAssessment.propertyId.address_components, 'street_number')
                        // use properties less than 20 numbers away - up and down the street
                        const diff = Math.abs(streetNumber - nearStreetNumber)
                        if (diff === 2 || diff === 4 || diff === 6) {
                          if (proximityAssessment.services && proximityAssessment.services.length) {
                            return true
                          }
                        }
                      }
                      return false
                    })
                })
                .then(similarProximityAssessments => {
                  if (similarProximityAssessments.length) {
                    // sort similar surveyanswers in first nearest order
                    similarProximityAssessments.sort(nearestSortCompare)
                    const nearestProximityAssessment = similarProximityAssessments[0]
                    const nearestPropertyName = nearestProximityAssessment.propertyId.formatted_address
                    nearestProximityAssessment._id = null
                    nearestProximityAssessment.propertyId = newProperty._id
                    nearestProximityAssessment.clonedFrom = nearestPropertyName
                    return new ServiceProximityAssessment(nearestProximityAssessment).save()
                  }
                })
            ])
              .spread((clonedSurveyAnswer, clonedProximityAssessment) => {
                if (clonedSurveyAnswer) {
                  logger.log('Cloned SurveyAnswer')
                } else {
                  logger.warn('No cloned SurveyAnswer')
                }
                if (clonedProximityAssessment) {
                  logger.log('Cloned ServiceProximityAssessment')
                } else {
                  logger.warn('No cloned ServiceProximityAssessment')
                }
                return newProperty
              })
              .catch(error => {
                logger.warn('Cloning logic error:', error)
                return newProperty
              })
          }
          return newProperty
        })
        .catch(error => {
          logger.warn('Cloning logic error:', error)
          return newProperty
        })
    })
    .then(property => {
      /**
       * fetch property data from external data service which has been registered in suburb research management,
       * and save it in the property
       */
      return fetchExternalDataForProperty(property)
        .then(p => p)
        .catch(error => {
          logger.warn('external service error:', error)
          return property
        })
    })
};

const addProperty = async (req, res) => {
  try {
    const property = await createProperty(req.body)
    res.status(200).json(property)
  } catch (error) {
    logger.error(error)
    res.status(400).json(error)
  }
}

const getAddressOptionsForProvider = (property, suburb) => {
  let address = ''
  if (property) {
    if (property.address_components) {
      const streetNumber = property.address_components.find(c => c.types.includes('street_number'));
      const route = property.address_components.find(c => c.types.includes('route'));
      const locality = property.address_components.find(c => c.types.includes('locality'));
      if (streetNumber && route && locality) {
        address = `${streetNumber.long_name} ${route.long_name} ${locality.long_name}`;
      }
    }
    if (!address.length && property.formatted_address) {
      address = property.formatted_address
    }
    if (address && suburb && suburb.mappings && suburb.mappings.length) {
      const addressMap = suburb.mappings.find(o => address.includes(o.source))
      if (addressMap && addressMap.options) {
        return addressMap.options.split(',').map(o => address.replace(addressMap.source, o.trim()).replace(/,/g, '').replace(/\s/g, '+'))
      }
    }
  }
  return address ? [address] : []
}

const mapKmcData = (data) => {
  return data ? {
    landNumber: lget(data, 'LegalDesc[0].LandNo', 0),
    lot: lget(data, 'LegalDesc[0].Lot', null),
    lotSize: lget(data, 'LegalDesc[0].Area', 0),
    unit: lget(data, 'LegalDesc[0].Unit', null),
    bushFireProne: data.BushFireProne,
    zone: lget(data, 'Zoning[0].Zone', null),
    zoneInstrument: lget(data, 'Zoning[0].Instrument', null),
    extPropertyId: data.PropertyNo,
    propertyType: data.PropertyType,
    ward: data.Ward,
    cwlthElectDiv: data.CwlthElectDiv,
    stateElectDiv: data.StateElectDiv,
    datTeam: data.DATeam,
    wasteType: data.WasteType[0],
    wasteCollectionDay: lget(data, 'WasteCol[0].Day', null),
    cwlthElectDiv: data.CwlthElectDiv,
    stateElectDiv: data.StateElectDiv,
    heritageConservationArea: lget(data, 'HCA', []).length ? true : false,
    heritageItem: lget(data, 'HER', []).length ? true : false
  } : null
}

const fetchKmcData = (property) => {
  /**
   * https://housepro.atlassian.net/browse/HOUS-239
   * Collect External Data
   */
  let postCode = null;
  let addressComponentObj = property.address_components.find(o => o.types.includes('postal_code'));
  if (addressComponentObj) {
    postCode = addressComponentObj.short_name;
  }
  logger.log('-------------- External Data Provider logic --------------');
  return Promise.resolve()
    .then(() => Suburb.findOne({ postCode }))
    .then(suburb => {
      if (!suburb || !suburb.dataProviders || !suburb.dataProviders.length) {
        throw new Error('There is no any External Data Provider that is registered');
      }
      const addressOptions = getAddressOptionsForProvider(property, suburb)
      return Promise.all(suburb.dataProviders.map(provider => {
        if (provider.resolveExtIDUrl) {
          return Promise.all(addressOptions.map((addressOption) => {
            const resolveExtIDUrl = provider.resolveExtIDUrl.replace('{address}', addressOption);
            return axios.get(resolveExtIDUrl)
              .then(response => response.data);
          }))
          .then(responses => {
            let extId = null;
            if (!responses.length) {
              return null;
            }
            const response = responses.find(o => Object.keys(o).length)
            if (!response) {
              return null;
            }
            const keys = Object.keys(response);
            const fields = keys[0].split('|').map(entity => {
              const fields_1 = entity.split('~');
              return {
                key: fields_1[0],
                value: fields_1[1]
              };
            });
            if (fields && fields.length) {
              const field = fields.find(field_1 => field_1.key === 'Property_No');
              if (field) {
                extId = field.value;
                let extPropertyDetailsUrl = provider.getExtPropertyDetailsUrl.replace('{ExtId}', extId);
                return axios.get(extPropertyDetailsUrl)
                  .then(detailResponse => {
                    if (!detailResponse || !detailResponse.data) {
                      return null;
                    }
                    let entities = provider.processExternalResponseUrl.split(/\//);
                    if (entities.some(e => e === 'kmc')) {
                      // Ku-Ring-Gai council data processor
                      return {
                        providerId: provider._id,
                        providerUrl: extPropertyDetailsUrl,
                        providerName: provider.name,
                        extPropertyId: extId,
                        dataRecords: mapKmcData(detailResponse.data)
                      };
                    }
                    return null;
                  });
              }
            }
          })
        }
        return null;
      }))
    })
    .catch(err => {
      logger.error(err);
      return null;
    })
};

function fetchExternalDataForProperty(property) {
  return Promise.all([
    fetchKmcData(property),
    getDomainPropertyData(property)
      .then(propertyData => {
        const listingIds = getDomainListingIds(propertyData)
        return getDomainListingForSale(listingIds)
          .then(listingData => {
            return Promise.all([
              getDomainAgency(lget(listingData, 'advertiserIdentifiers.advertiserId', null)),
              getDomainAgent(lget(listingData, 'advertiserIdentifiers.contactIds.0', null))
            ])
              .spread((agencyData, agentData) => {
                return [
                  propertyData,
                  listingData,
                  agencyData,
                  agentData
                ]
              })
          })
          .catch(error => {
            logger.error(error)
            return [propertyData]
          })
      })
  ])
    .spread((extDataList, domainData) => {
      property.externalData = [
        ...extDataList,
        restructDomainPropertyData(domainData[0]),
        restructDomainListingData(domainData[1]),
        restructDomainAgencyData(domainData[2]),
        restructDomainAgentData(domainData[3])
      ].filter(o => o)
      property.propertyImages = [
        ...property.propertyImages,
        ...restructDomainPropertyPhotoData(lget(domainData[0], 'photos')),
        ...restructDomainListingPhotoData(lget(domainData[1], 'media'))
      ].filter(o => o)
      return new Property(property).save()
    })
}

const refreshGetExternalData = async (req, res) => {
  const { propertyId } = req.params;
  return Property.findById(propertyId)
    .then(property => {
      fetchExternalDataForProperty(property).then(() => {
        res.status(200).json(property.externalData)
      })
    })
    .catch(error => {
      logger.error('refreshGetExternalData() error:', error)
      res.status(500).json({error})
    })
};

const updateProperty = (req, res) => {
  const { id } = req.params;
  const promise = Property.findByIdAndUpdate(id, req.body, {upsert: true});
  responseMongooseSimple(promise.exec(), req, res);
};

const getLocationScore = async (req, res) => {
  const {propertyId, postCode} = req.params;
  evaluatePropertyLocation(propertyId, postCode)
    .then(result => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      logger.error(error);
      return res.status(500).json(error);
    })
}

const getComparativeRankings = (req, res) => {
  const { propertyId } = req.params;
  Property.findById(propertyId, '_id address_components').lean()
    .then(property => {
      return calculateComparativeRankings(
        property._id.toString(),
        getAddressComponentValue(property.address_components, 'postal_code')
      )
    })
    .then(rankings => {
      res.status(200).json(rankings)
    })
    .catch(error => {
      logger.log(error)
      res.status(500).json({error})
    })
}

const getOnMarketProperties = (req, res) => {
  const {postCode} = req.params;
  if (postCode) {
    const query = {
      'address_components.types': 'postal_code',
      'address_components.short_name': postCode,
      onMarket: true
    }
    Property.find(query).lean()
      .then(properties => {
        res.status(200).json(properties)
      })
      .catch(error => {
        logger.log(error)
        res.status(500).json({error})
      })
  }
}

module.exports = {
  searchProperties,
  getPropertyById,
  getPropertyBySuburb,
  createProperty,
  addProperty,
  updateProperty,
  refreshGetExternalData,
  getLocationScore,
  getComparativeRankings,
  getOnMarketProperties
};
