const Promise = require('bluebird');
const moment = require('moment-timezone');
const logger = require('./logger');
const apiUtils = require('./api.utils');
const {getAddressComponentValue} = require('../util');
const googleApi = require('./google-api');
const cartoApi = require('./carto-api');
const Suburb = require('../models/Suburb');
const Property = require('../models/Property');
const ProximityRule = require('../models/ProximityRule');
const ServiceProximityAssessment = require('../models/ServiceProximityAssessment');
const ScoringRule = require('../models/ScoringRule');
/**
 * Suburb CRUD
 */
const getSuburbs = async (req, res) => {
  apiUtils.responseMongooseFind(Suburb.find(req.query).populate('services.proximityRuleId').exec(), req, res);
};

const getSuburbPostCodes = async (req, res) => {
  apiUtils.responseMongooseFind(Suburb.find({}, '_id name postCode').exec(), req, res);
};

const getSuburbById = (req, res) => {
  const { suburbId } = req.params;
  apiUtils.responseMongooseFind(Suburb.findById(suburbId).populate('services.proximityRuleId'), req, res);
};

const updateSuburb = (req, res) => {
  const { suburbId } = req.params;
  Suburb.find({
    postCode: req.body.postCode
  }).exec((err, models) => {
    const length = models.length;
    if (length > 1 || (length === 1 && String(models[0]._id) !== suburbId)) {
      return res.status(400).json({
        message: 'The requested post code already exists.'
      });
    }
    const suburb = new Suburb(req.body);
    const promise = Suburb.findByIdAndUpdate(suburbId, suburb, { upsert: true });
    apiUtils.responseMongooseSimple(promise.exec(), req, res);
  });
};

const createSuburb = (req, res) => {
  Suburb.find({
    postCode: req.body.postCode
  }).exec((err, data) => {
    if (!data || data.length === 0) {
      const suburb = new Suburb(req.body);
      apiUtils.responseMongooseCreate(suburb.save(), req, res);
    } else {
      return res.status(400).json({
        message: 'The requested post code already exists.'
      });
    }
  });
};

const deleteSuburb = (req, res) => {
  const { suburbId } = req.params;
  const promise = Suburb.deleteOne({ _id: suburbId });
  apiUtils.responseMongooseSimple(promise.exec(), req, res);
};

/**
 * Proximity Rules CRUD
 */
const getProximityRules = (req, res) => {
  apiUtils.responseMongooseFind(ProximityRule.find(req.query).exec(), req, res);
};

const getProximityRuleById = (req, res) => {
  const { proximityRuleId } = req.params;
  apiUtils.responseMongooseFind(ProximityRule.findById(proximityRuleId), req, res);
};

const updateProximityRule = (req, res) => {
  const { proximityRuleId } = req.params;
  const proximityRuleToUpdate = Object.assign({}, req.body);
  delete proximityRuleToUpdate._id;
  const promise = ProximityRule.findByIdAndUpdate(proximityRuleId, proximityRuleToUpdate, { upsert: true });
  apiUtils.responseMongooseSimple(promise.exec(), req, res);
};

const createProximityRule = (req, res) => {
  const proximityRule = new ProximityRule(req.body);
  apiUtils.responseMongooseCreate(proximityRule.save(), req, res);
};

const deleteProximityRule = (req, res) => {
  const { proximityRuleId } = req.params;
  const promise = ProximityRule.deleteOne({ _id: proximityRuleId });
  apiUtils.responseMongooseSimple(promise.exec(), req, res);
};

/**
 * SubTypeScoringRule CRUD
 */
const getScoringRules = (req, res) => {
  let { postCode } = req.params
  let query = {postCode: postCode}
  apiUtils.responseMongooseFind(ScoringRule.find(query).exec(), req, res);
};

const createScoringRule = (req, res) => {
  const scoringRule = new ScoringRule(req.body);
  apiUtils.responseMongooseCreate(scoringRule.save(), req, res);
};

const updateScoringRule = (req, res) => {
  const { scoringRuleID } = req.params;
  const scoringRuleToUpdate = Object.assign({}, req.body);
  delete scoringRuleToUpdate._id;
  const promise = ScoringRule.findByIdAndUpdate(scoringRuleID, scoringRuleToUpdate, { upsert: true });
  apiUtils.responseMongooseSimple(promise.exec(), req, res);
};

const getDepartureTime = (tripTime) => {
  const calendarNextMonday = moment().weekday(8).tz('Australia/Sydney').format('YYYY-MM-DD');
  const departureTime = +moment.tz(`${calendarNextMonday} ${tripTime}`, 'Australia/Sydney') / 1000;
  return departureTime;
};

const assessSuburbServices = (propertyId, force = false, isReadOnly = false) => {
  const assessedResults = {    
    propertyId,
    suburbId: null,
    services: [],
    assessmentDateTime: new Date()
  }

  return Promise.all([
    ServiceProximityAssessment.findOne({ propertyId }).lean(),
    Property
      .findById(propertyId)
      .then(property => {
        if (!property) {
          throw new Error('Property not found.')
        }
        const postCode = getAddressComponentValue(property.address_components, 'postal_code')
        if (!postCode) {
          throw new Error('Property\'s post_code not found.')
        }
        return property
      })
  ])
  .spread((existedAssessment, property) => {
    if ((existedAssessment && !force) || isReadOnly) {
      return existedAssessment
    }
    const postCode = getAddressComponentValue(property.address_components, 'postal_code')
    return Suburb.findOne({postCode}).lean()
      .then(suburb => {
        if (!suburb) {
          throw new Error('Suburb not found.')
        }
        assessedResults.suburbId = suburb._id
        return Promise.all(suburb.services.map(service => {
          if (!service.isActive) {
            if (existedAssessment && existedAssessment.services && service._id) {
              const existedService = existedAssessment.services.find(o => o.suburbServiceId === service._id.toString())
              if (existedService) {
                if (service.location) {
                  existedService.location = {
                    lat: service.location.lat,
                    lng: service.location.lng
                  }
                }
                return existedService
              }
            }
            return null
          }
          return ProximityRule
            .findById(service.proximityRuleId)
            .then(proximityRule => {
              if (!proximityRule || !proximityRule.measures || proximityRule.measures.length === 0) {
                return null
              }
              // service assessment result object
              const serviceAssessment = {
                name: service.name,
                googlePlaceId: service.googlePlaceId,
                serviceCategory: service.serviceCategory,
                serviceType: service.serviceType,
                serviceSubType: service.serviceSubType,
                proximityRuleCode: proximityRule.code,
                keywords: service.keywords,
                suburbServiceId: service._id,
                location: service.location,
                servicePenalty: 0
              }
              // school catchment logic
              logger.log('service.lookupType:', service.lookupType)
              if (service.lookupType === 'catchment') {
                // fetch latitude/longitude detail of public/goverment school from carto service
                const lat = property.geometry.location.lat
                const lng = property.geometry.location.lng
                logger.log('======================= Request to Carto service ========================')
                logger.log(`latitude: ${lat}, longitude: ${lng}`)
                logger.log('service type:', service.serviceType)
                return cartoApi.getGovernmentSchoolDetail(lat, lng, service.serviceType)
                  .then(catchment => {
                    // logger.log('catchment response:', catchment)
                    if (catchment.total_rows < 1) {
                      throw new Error('Catchment data not found')
                    }
                    const schoolDetail = catchment.rows[0]
                    // use the geometry data to calculate the distance and time to travel as Carto does not store the GooglePlaceID
                    const origins = `${lat},${lng}`
                    const destinations = `${schoolDetail.latitude},${schoolDetail.longitude}`
                    serviceAssessment.name = schoolDetail.school_name
                    const servicePlaceName = serviceAssessment.name
                    return googleApi.lookupAddress(schoolDetail.latitude, schoolDetail.longitude)
                      .then(geocoding => {
                        logger.log('geocoding.results:', geocoding.results)
                        logger.log('servicePlaceName: ', servicePlaceName)
                        const servicePlaceId = geocoding.results[0].place_id
                        serviceAssessment.googlePlaceId = servicePlaceId
                        serviceAssessment.location = geocoding.results[0].geometry.location
                        if (service.bonuses && service.bonuses.length) {
                          logger.log('bonuses:', service.bonuses);
                          for (const bonus of service.bonuses) {
                            if (bonus.placeName === servicePlaceName) {
                              serviceAssessment.servicePenalty = bonus.amount
                              logger.log('bonus match is found. bonus amount:', bonus.amount)
                              break
                            }
                          }
                        }
                        return { origins, destinations, proximityRule, serviceAssessment }
                      })
                  })
                  .catch(err => {
                    logger.error(err)
                    return { origins: null, destinations: null, proximityRule, serviceAssessment }
                  })
              }
              if (service.lookupType === 'google') {
                // use the GooglePlaceID to calculate the distance (m) and time(s) to travel
                const origins = `place_id:${property.place_id}`
                const destinations = `place_id:${service.googlePlaceId}`
                return { origins, destinations, proximityRule, serviceAssessment }
              }
              if (service.lookupType === 'keyword') {
                const distances = [500, 1000, 1500, 2000, 2500, 3000]
                return Promise
                  .any(
                    distances.map(radius => {
                      const location = `${property.geometry.location.lat},${property.geometry.location.lng}`
                      const keyword = service.keywords
                      logger.log(`Google Places API: Searching by the keyword - "${keyword}" at distance of ${radius} metres ...`)
                      logger.log('location:', location)
                      return googleApi.findPlaces(location, radius, null, keyword)
                    })
                  )
                  .then(places => places[0])
                  .then(place => {
                    const servicePlaceId = place.place_id
                    const servicePlaceName = place.name
                    /**
                     * - Suburb Service Bonus logic:
                     * if a match is found, then the ‘Bonus’ amount should be written into the serviceproximityassessment record
                     *  in the service object as a new field called ‘servicePenalty’.
                     */
                    if (service.bonuses && service.bonuses.length) {
                      logger.log('bonuses:', service.bonuses)
                      for (const bonus of service.bonuses) {
                        if (bonus.placeName === servicePlaceName) {
                          serviceAssessment.servicePenalty = bonus.amount
                          logger.log('bonus match is found. bonus amount:', bonus.amount)
                          break
                        }
                      }
                    }
                    const origins = `place_id:${property.place_id}`
                    const destinations = `place_id:${servicePlaceId}`
                    serviceAssessment.googlePlaceId = servicePlaceId
                    serviceAssessment.location = place.geometry.location
                    serviceAssessment.name = servicePlaceName
                    return { origins, destinations, proximityRule, serviceAssessment }
                  })
                  .catch(err => {
                    logger.error(err)
                    return { origins: null, destinations: null, proximityRule, serviceAssessment }
                  })
              }
              return { origins: null, destinations: null, proximityRule, serviceAssessment }
            })
            .then(data => {
              if (!data) {
                return null
              }
              const { origins, destinations, proximityRule, serviceAssessment } = data
              if (!origins || !destinations) {
                return null
              }
              // get the max score regardless what travel modes in proximity rule's measures
              proximityRule.measures.sort((a, b) => b.score - a.score)
              const travelModes = proximityRule.measures.reduce((acc, itr) => {
                if (acc && !acc.includes(itr.travelMode)) {
                  acc.push(itr.travelMode)
                }
                return acc
              }, [])
              const maxScore = proximityRule.measures[0].score
              if (service.trips && service.trips.length) {
                /**
                 * if a Trip is defined then the Google Directions API call logic
                 *  should be adjusted as follows:
                 */
                return Promise
                  .all(travelModes.map(travelMode => {
                    logger.log(`---------------- calculating in ${travelMode} mode ----------------`)
                    return Promise
                      .all(service.trips.map(trip => {
                        /**
                         * call Google Directions API for service property,
                         * use 'transit' mode and specify the departure time.
                         */
                        const expectedDepartureTime = travelMode === 'transit' ? getDepartureTime(trip.time) : undefined
                        if (trip.returnTrip === true) {
                          /**
                           * if the "returntrip" attribute is TRUE,
                           * then call the Google Directions API from property to service, setting mode=transit and departure_time = trip.time
                           */
                          let outwardDirection = null
                          logger.log('> return trip')
                          logger.log('----------- outward journey ----------')
                          logger.log('origins:', origins)
                          logger.log('destinations:', destinations)
                          logger.log('travelMode:', travelMode)
                          logger.log('expected departureTime:', expectedDepartureTime)
                          return googleApi.getDirections(origins, destinations, travelMode, expectedDepartureTime)
                            .then(outward => {
                              outwardDirection = outward.routes[0].legs[0]
                              logger.log('outward direction distance:', outwardDirection.distance.value)
                              logger.log('outward direction duration:', outwardDirection.duration.value)
                              logger.log('outward direction arrival_time:', outwardDirection.arrival_time)
                              let departureTime
                              if (travelMode === 'transit' && outwardDirection.arrival_time) {
                                departureTime = outwardDirection.arrival_time.value
                              }
                              /**
                               * From the response capture the distance.value and duration.value from the "leg" array.
                               * Reverse the origin and destination, ie from Service location to property.
                               * Specify the departure time as the original departure time PLUS the time of the outgoing trip.
                               */
                              logger.log('----------- homeward journey ----------')
                              logger.log('origins:', destinations)
                              logger.log('destinations:', origins)
                              logger.log('travelMode:', travelMode)
                              logger.log('departureTime:', departureTime)
                              return googleApi.getDirections(destinations, origins, travelMode, departureTime)
                            })
                            .then(homeward => {
                              const homewardDirection = homeward.routes[0].legs[0];
                              logger.log('homeward direction distance:', homewardDirection.distance.value)
                              logger.log('homeward direction duration:', homewardDirection.duration.value)
                              logger.log('homeward direction arrival_time:', homewardDirection.arrival_time)
                              // Calculate the distance by summing the 2 distance.value elements
                              const distance = outwardDirection.distance.value + homewardDirection.distance.value;
                              // Calculate the duration by arrival_time - departure_time of the outward journey and convert to seconds.
                              let duration = outwardDirection.duration.value + homewardDirection.duration.value;
                              if (travelMode === 'transit' && homewardDirection.arrival_time) {
                                duration = homewardDirection.arrival_time.value - outwardDirection.departure_time.value;
                              }
                              return {
                                distance: { value: distance },
                                duration: { value: duration }
                              }
                            })
                            .catch(err => {
                              logger.error(err)
                              return null
                            })
                        }
                        logger.log('> one way trip')
                        // if the "returntrip" attribute is FALSE, then stop here
                        logger.log('origins:', origins)
                        logger.log('travelMode:', travelMode)
                        logger.log('expected departureTime:', expectedDepartureTime)
                        return googleApi.getDirections(origins, destinations, travelMode, expectedDepartureTime)
                          .then(directionResponse => {
                            const direction = directionResponse.routes[0].legs[0]
                            let duration = direction.duration
                            /**
                             * https://housepro.atlassian.net/browse/HOUS-287
                             * Possible bug in the calculation of travel times in service proximity algorithm
                             */
                            if (direction.arrival_time && expectedDepartureTime) {
                              duration = {
                                value: direction.arrival_time.value - expectedDepartureTime
                              }
                            }
                            logger.log('direction distance:', direction.distance.value)
                            logger.log('direction duration:', direction.duration.value)
                            logger.log('direction arrival_time:', direction.arrival_time)
                            return {
                              distance: direction.distance,
                              duration
                            }
                          })
                          .catch(err => {
                            logger.error(err)
                            return null
                          })
                      }))
                      .then(durations => durations.filter(o => o))
                      .then(durations => {
                        if (!durations.length) {
                          return null
                        }
                        /**
                         * if there are more trip then repeat and aggregate the total time of the trips
                         *  before using proximittyrule to score service.
                         */
                        const travel = durations.reduce((prev, curr) => ({
                          distance: { value: prev.distance.value + curr.distance.value },
                          duration: { value: prev.duration.value + curr.duration.value }
                        }));
                        logger.log('travel:', travel)
                        // use proximityrule to score the service
                        const matchedMeasures = proximityRule.measures.filter(measure => {
                          if (measure.travelMode === travelMode) {
                            if (measure.units === 'seconds' || measure.units === 'metres') {
                              const value = measure.units === 'metres' ? travel.distance.value : travel.duration.value;
                              if (value <= measure.upperBound) {
                                return true
                              }
                            }
                          }
                          return false
                        }).map(measure => measure.score)
                        logger.log('matched measure rules count:', matchedMeasures.length)
                        if (!matchedMeasures.length) {
                          return null
                        }
                        return {
                          matchedTravelMode: travelMode,
                          travelDistance: travel.distance.value,
                          travelTime: travel.duration.value,
                          score: Math.max(...matchedMeasures),
                          maxScore
                        }
                      })
                  }))
                  .then(travels => travels.filter(o => o))
                  .then(travels => {
                    serviceAssessment.travels = travels
                    return serviceAssessment
                  })
              } else {
                /**
                 * if no 'Trips' are defined for a service,
                 * then the algorithm assumes a one-way trip as per current solution
                 */
                return Promise
                  .all(travelModes.map(travelMode => {
                    return googleApi.getDistance(origins, destinations, travelMode)
                      .then(distanceResponse => {
                        if (distanceResponse.status === 'OK') {
                          const travel = distanceResponse.rows[0].elements[0]
                          // seek out all the possible travel modes.
                          const matchedMeasures = proximityRule.measures.filter(measure => {
                            if (measure.travelMode === travelMode) {
                              if (measure.units === 'seconds' || measure.units === 'metres') {
                                const value = measure.units === 'metres' ? travel.distance.value : travel.duration.value
                                if (value <= measure.upperBound) {
                                  return true
                                }
                              }
                            }
                            return false
                          }).map(measure => measure.score)

                          if (!matchedMeasures.length) {
                            return null
                          }
                          return {
                            matchedTravelMode: travelMode,
                            travelDistance: travel.distance.value,
                            travelTime: travel.duration.value,
                            score: Math.max(...matchedMeasures),
                            maxScore
                          }
                        }
                      })
                      .catch(err => {
                        logger.error(err)
                        return null
                      })
                  }))
                  .then(travels => travels.filter(o => o))
                  .then(travels => {
                    serviceAssessment.travels = travels
                    return serviceAssessment
                  })
              }
            })
        }))
      })
      .then(services => services.filter(o => o))
      .then(services => {
        assessedResults.services = services
        const query = {
          propertyId,
          suburbId: assessedResults.suburbId
        }
        return ServiceProximityAssessment.findOneAndUpdate(query, assessedResults, { new: true, upsert: true })
      })
  })
}

const getProximityAssessment = (req, res) => {
  const { propertyId } = req.params
  const { force } = req.query
  assessSuburbServices(propertyId, force === 'true')
    .then(assessment => {
      res.status(200).json(assessment)
    })
    .catch(err => {
      logger.error(err)
      res.status(404).json({ error: err.toString() })
    })
}

const resetProximityAssessment = (req, res) => {
  const { propertyId } = req.params
  ServiceProximityAssessment
    .deleteOne({ propertyId })
    .then(() => assessSuburbServices(propertyId, true))
    .then(assessment => {
      res.status(200).json(assessment)
    })
    .catch(err => {
      logger.error(err)
      res.status(500).json({ error: err.toString() })
    })
};

const migrateSuburbServices = (req, res) => {
  let concurrency = +req.query.concurrency || 10;
  if (concurrency < 0) {
    concurrency = 10;
  } else if (concurrency > 20) {
    concurrency = 20;
  }
  logger.log('migrateSuburbServices is running...');
  logger.log('concurrency: ', concurrency);
  const startAt = new Date();
  logger.log('start at:', startAt.toLocaleTimeString());
  let updatedProximityServices = 0;
  let updatedSuburbServices = 0;

  ServiceProximityAssessment.find({}).lean()
    .then(assessments => {
      return Promise.map(
        assessments,
        (assessment) => {
          return Promise.map(
            assessment.services,
            (service => {
              return Promise.resolve().then(() => {
                if (!service.googlePlaceId || service.location) {
                  return service
                }
                return googleApi
                  .getPlaceDetails(service.googlePlaceId, 'geometry')
                  .then(response => {
                    return {
                      ...service,
                      location: response.result.geometry.location
                    }
                  })
                  .catch(err => {
                    logger.error(err)
                    return service
                  })
              })
            }),
            {concurrency: 10}
          )
            .then(services => {
              updatedProximityServices ++;
              return ServiceProximityAssessment.findByIdAndUpdate(assessment._id, {services}, {upsert: true, new: true})
            })
            .catch(err => {
              logger.error(err)
              return assessment
            })
        },
        {concurrency}
      )
    })
    .then(() => {
      Suburb.find({}).lean()
        .then(suburbs => {
          return Promise.mapSeries(
            suburbs,
            (suburb) => {
              return Promise.map(
                suburb.services,
                (service) => {
                  return Promise.resolve().then(() => {
                    if (!service.googlePlaceId || service.location) {
                      return service
                    }
                    return googleApi
                      .getPlaceDetails(service.googlePlaceId, 'geometry')
                      .then(response => {
                        return {
                          ...service,
                          location: response.result.geometry.location
                        }
                      })
                      .catch(err => {
                        logger.error(err)
                        return service
                      })
                  })
                },
                {concurrency}
              )
                .then(services => {
                  updatedSuburbServices ++;
                  return Suburb.findByIdAndUpdate(suburb._id, {services}, {upsert: true, new: true})
                })
                .catch(err => {
                  logger.error(err)
                  return suburb
                })
            }
          )
        })
    })
    .then(() => {
      const endAt = new Date();
      logger.log('end at:', endAt.toLocaleTimeString());
      logger.log('results:', results);
      const results = {
        startAt: startAt.toLocaleTimeString(),
        endAt: endAt.toLocaleTimeString(),
        elapsedMinutes: moment(endAt).diff(moment(startAt), 'minutes'),
        updatedSuburbServices,
        updatedProximityServices
      };
      res.status(200).json({results});
    })
    .catch(error => {
      logger.log('error at:', new Date().toTimeString());
      res.status(500).json({error})
    })
}

module.exports = {
  getSuburbs,
  getSuburbPostCodes,
  getSuburbById,
  updateSuburb,
  createSuburb,
  deleteSuburb,
  getProximityRules,
  getProximityRuleById,
  updateProximityRule,
  createProximityRule,
  deleteProximityRule,
  getScoringRules,
  createScoringRule,
  updateScoringRule,
  getProximityAssessment,
  resetProximityAssessment,
  migrateSuburbServices,
  assessSuburbServices
};

