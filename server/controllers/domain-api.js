const qs = require('qs')
const axios = require('axios')
const moment = require('moment')
const _ = require('lodash')
const logger = require('./logger')
const ExternalToken = require('../models/ExternalToken')
const {getAddressComponentValue} = require('../util')

const AUTH_URL = 'https://auth.domain.com.au'
const BASE_URL = 'https://api.domain.com.au'
const DOMAIN_PROVIDER_ID = 'domain'
const PROPERTY_LOCATION_SCOPE_KEY = 'properties_locations'
const AGENCY_LISTING_SCOPE_KEY = 'agencies_listings'

const base64 = str => Buffer.from(str).toString('base64')
const scopes = {
  [PROPERTY_LOCATION_SCOPE_KEY]: {
    scope: 'api_properties_read api_locations_read',
    credentials: base64(`${process.env.DOMAIN_PROPERTY_LOCATION_API_CLIENT_ID}:${process.env.DOMAIN_PROPERTY_LOCATION_API_SECRET}`)
  },
  [AGENCY_LISTING_SCOPE_KEY]: {
    scope: 'api_agencies_read api_listings_read',
    credentials: base64(`${process.env.DOMAIN_AGENT_LISTING_API_CLIENT_ID}:${process.env.DOMAIN_AGENT_LISTING_API_SECRET}`)
  }
}

const verifyToken = ({updatedAt, expiresIn}) => {
  /**
   * expiresIn is always 43000s viz 12 hours but actual lifetime is 3600s = 1hour
   * so the logic should force the expiresIn with 3600.
   */
  return moment().diff(updatedAt, 'seconds') < (3600/*expiresIn*/ - 30)
}

function getBearerToken(scopeKey = PROPERTY_LOCATION_SCOPE_KEY) {
  return ExternalToken.findOne({providerId: DOMAIN_PROVIDER_ID})
    .then(extToken => {
      if (extToken) {
        const apiClient = _.get(extToken, 'apiClients', []).find(o => o.scope === scopes[scopeKey].scope)
        if (apiClient) {
          if (verifyToken(apiClient)) {
            return `Bearer ${apiClient.accessToken}`
          }
        }
      }
      return getNewAccessToken(scopeKey).then(token => token ? `Bearer ${token}` : null)
    })
}

/**
 * Gets a new access token via client credentials from domain authorization server, and caches it on database
 * @param {String} scopeKey
 */
function getNewAccessToken(scopeKey) {
  const data = qs.stringify({
    grant_type: 'client_credentials',
    scope: scopes[scopeKey].scope
  })

  return axios.post(`${AUTH_URL}/v1/connect/token`, data, {
    headers: {
      'Authorization': `Basic ${scopes[scopeKey].credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(result => {
    const { access_token, expires_in } = result.data

    return ExternalToken.findOne({providerId: DOMAIN_PROVIDER_ID})
      .then(extToken => {
        // new apiClient object to be replaced with
        const apiClient = {
          scope: scopes[scopeKey].scope,
          accessToken: access_token,
          updatedAt: new Date(),
          expiresIn: expires_in
        }

        if (extToken) {
          if (extToken.apiClients) {
            const index = extToken.apiClients.findIndex(o => o.scope === scopes[scopeKey].scope)
            if (index > -1) {
              extToken.apiClients[index] = apiClient
            } else {
              extToken.apiClients.push(apiClient)
            }
          } else {
            extToken.apiClients = [apiClient]
          }
          return extToken.save()
        }
        const model = {
          providerId: DOMAIN_PROVIDER_ID,
          apiClients: [apiClient]
        }
        return new ExternalToken(model).save()
      })
      .then(() => access_token)
  }).catch(err => {
    logger.error(err.response.data)
    return null
  })
}

function restructDomainPropertyData(data) {
  return data ? {
    providerId: 'domain',
    providerName: 'Domain Developer Portal',
    extPropertyId: data.id,
    updated: new Date(),
    dataRecords: {
      cadastreType: data.cadastreType,
      onMarketTypes: data.onMarketTypes,
      status: data.status,
      address: data.address,
      addressCoordinate: data.addressCoordinate,
      addressId: data.addressId,
      areaSize: data.areaSize,
      bathrooms: data.bathrooms,
      bedrooms: data.bedrooms,
      carSpaces: data.carSpaces,
      created: data.created,
      features: data.features,
      flatNumber: data.flatNumber,
      id: data.id,
      isResidential: data.isResidential,
      planNumber: data.planNumber,
      postcode: data.postcode,
      propertyCategory: data.propertyCategory,
      propertyCategoryId: data.propertyCategoryId,
      sectionNumber: data.sectionNumber,
      state: data.state,
      streetAddress: data.streetAddress,
      streetName: data.streetName,
      streetNumber: data.streetNumber,
      streetType: data.streetType,
      streetTypeLong: data.streetTypeLong,
      suburb: data.suburb,
      suburbId: data.suburbId,
      zone: data.zone
    }
  } : null
}

function restructDomainPropertyPhotoData(photos) {
  if (photos) {
    return photos.map(photo => ({
      url: photo.fullUrl,
      type: photo.imageType,
      source: 'domain',
      advertId: photo.advertId,
      date: photo.date,
      rank: photo.rank
    }))
  }
  return []
}

function restructDomainListingData(data) {
  return data ? {
    providerId: 'domainListing',
    providerName: 'Domain Developer Portal',
    listingId: data.id,
    updated: new Date(),
    dataRecords: {
      objective: data.objective,
      propertyTypes: data.propertyTypes,
      status: data.status,
      saleMode: data.saleMode,
      channel: data.channel,
      addressParts: data.addressParts,
      advertiserIdentifiers: data.advertiserIdentifiers,
      bathrooms: data.bathrooms,
      bedrooms: data.bedrooms,
      carspaces: data.carspaces,
      dateUpdated: data.dateUpdated,
      description: data.description,
      geoLocation: data.geoLocation,
      headline: data.headline,
      id: data.id,
      isNewDevelopment: data.isNewDevelopment,
      priceDetails: data.priceDetails,
      saleDetails: data.saleDetails,
      seoUrl: data.seoUrl,
      virtualTourUrl: data.virtualTourUrl
    }
  } : null
}

function restructDomainAgencyData(data) {
  return data ? {
    providerId: 'domainAgency',
    providerName: 'Domain Developer Portal',
    agencyId: data.id,
    updated: new Date(),
    dataRecords: {...data}
  } : null
}

function restructDomainAgentData(data) {
  return data ? {
    providerId: 'domainAgent',
    providerName: 'Domain Developer Portal',
    updated: new Date(),
    dataRecords: {...data}
  } : null
}

function restructDomainListingPhotoData(photos) {
  if (photos) {
    return photos.map(photo => ({
      url: photo.url,
      type: photo.type,
      source: 'domainListing',
      category: photo.category
    }))
  }
  return []
}

function getDomainPropertyData(property) {
  const propertyName = property.formatted_address
  const postCode = getAddressComponentValue(property.address_components, 'postal_code')

  // https://housepro.atlassian.net/wiki/spaces/HH/pages/146636825/Get+Property+Data+from+Domain+API
  logger.info(`============= fetching the data for the property ${propertyName} from Domain =============`)
  return getBearerToken()
    .then(bearerToken => {
      logger.log('got bear token.')
      return axios({
        method: 'get',
        headers: {
          'Authorization': bearerToken
        },
        url: `${BASE_URL}/v1/properties/_suggest`,
        params: {
          terms: propertyName
        }
      }).then(result => {
        logger.log('------------ got the suggest data from Domain -----------')
        const domainProperty = result.data.find(o => o.relativeScore === 100 && (o.addressComponents.postcode === postCode))
        if (domainProperty) {
          return axios({
            method: 'get',
            headers: {
              'Authorization': bearerToken
            },
            url: `${BASE_URL}/v1/properties/${domainProperty.id}`
          }).then(result => {
            logger.log('------------ got the property data from Domain -----------')
            logger.log(result.data)
            return result.data
          })
        }
        return null
      })
    })
    .catch(err => {
      logger.error(err)
      return null
    })
}

function getDomainListingIds(domainPropertyData) {
  const listingIds = _.get(domainPropertyData, 'photos', [])
    .sort((a, b) => moment(b.date).diff(a.date, 'seconds'))
    .reduce((ids, obj) => ids.includes(obj.advertId) ? ids : [...ids, obj.advertId], [])
  logger.log('listing IDs:', listingIds)
  return listingIds
}

/**
 * Fetch Listing Data for Sale from Domain API
 * https://developer.domain.com.au/docs/endpoints/listings/listings_get
 * GET https://api.domain.com.au/v1/listings/{id}
 * 
 * @param {Array<String>} listingIds 
 */
function getDomainListingForSale(listingIds) {
  logger.info(`============= fetching the property listing data from Domain =============`)
  return getBearerToken(AGENCY_LISTING_SCOPE_KEY)
    .then(bearerToken => {
      logger.log('got bearer token.')
      const loop = (i = 0) => {
        if (i < listingIds.length) {
          return axios({
            method: 'get',
            headers: {
              'Authorization': bearerToken
            },
            url: `${BASE_URL}/v1/listings/${listingIds[i]}`
          }).then(result => {
            const listingData = result.data
            logger.log('got listing data. objective:', listingData.objective)
            if (listingData) {
              if (listingData.objective === 'sale') {
                return listingData
              }
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve(loop(i + 1))
                }, 50)
              })
            }
            return null
          }).catch(err => {
            logger.error(err)
            return null
          })
        }
        return Promise.resolve(null)
      }
      return loop()
    })
}

/**
 * https://developer.domain.com.au/docs/endpoints/agencies/agencies_get
 * GET https://api.domain.com.au/v1/agencies/{id}
 * @param {String} advertiserId
 */
function getDomainAgency(advertiserId) {
  if (advertiserId) {
    logger.info('================ Fetching Agency data from Domain ================')
    return getBearerToken(AGENCY_LISTING_SCOPE_KEY)
    .then(bearerToken => {
      return axios({
        method: 'get',
        headers: {
          'Authorization': bearerToken
        },
        url: `${BASE_URL}/v1/agencies/${advertiserId}`
      })
    }).then(result => result.data)
  }
  return null
}

/**
 * https://developer.domain.com.au/docs/endpoints/agents/agents_get
 * GET https://api.domain.com.au/v1/agents/{id}
 * @param {*} contactId
 */
function getDomainAgent(contactId) {
  if (contactId) {
    logger.info('================ Fetching Agent data from Domain ================')
    return getBearerToken(AGENCY_LISTING_SCOPE_KEY)
      .then(bearerToken => {
        return axios({
          method: 'get',
          headers: {
            'Authorization': bearerToken
          },
          url: `${BASE_URL}/v1/agents/${contactId}`
        })
      }).then(result => result.data)
  }
  return null
}

module.exports = {
  getBearerToken,
  getDomainPropertyData,
  restructDomainPropertyData,
  restructDomainPropertyPhotoData,
  restructDomainListingData,
  restructDomainListingPhotoData,
  getDomainListingIds,
  getDomainListingForSale,
  getDomainAgency,
  getDomainAgent,
  restructDomainAgencyData,
  restructDomainAgentData
}
