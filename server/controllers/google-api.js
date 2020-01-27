const request = require('request'); // use request because @google/maps sometimes returns empty response
const logger = require('./logger');

const STATUS_OK = 'OK';
const OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT'

const defaultHeaders = {
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'accept-language': 'en-US;q=0.9,en;q=0.8',
  'cache-control': 'no-cache',
  dnt: 1,
  pragma: 'no-cache',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
};

const wait = (n) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, n);
  })
}

const sendRequest = async (url, qs) => {
  return new Promise(async (resolve, reject) => {
    request({
      url: url,
      qs: qs,
      json: true,
      headers: defaultHeaders
    }, async (error, response, data) => {
      await wait(50); // https://developers.google.com/maps/documentation/geocoding/usage-limits
      if (error) {
        reject(error)
      } else {
        if (data.status !== STATUS_OK) {
          reject({
            status: data.status,
            message: data.error_message
          });
        } else {
          resolve(data);
        }
      }
    })
  });
}

/**
 * @param location {String} example -33.7144857,151.1572744
 * @param radius {Number} in meters
 * @param type {String} "school" for example
 * @param keyword {String} "private" for example
 * @return {Promise}
 * */
const findPlaces = async (location, radius, type, keyword) => {
  let result = [];
  let fetch = (nextPageToken) => {
    let qs = {
      key: process.env.GOOGLE_API_KEY,
      keyword,
      type,
      radius,
      location
    };
    if (nextPageToken) {
      qs.pagetoken = nextPageToken;
    }
    logger.info('-------------------- google nearbysearch -------------------')
    return sendRequest("https://maps.googleapis.com/maps/api/place/nearbysearch/json", qs).then((data) => {
      if (data.status === STATUS_OK) {
        result = result.concat(data.results);
      }
      if (data.next_page_token) {
        return fetch(data.next_page_token)
      }
    });
  };
  return fetch().then(async () => {
    return result;
  })
}

/**
 * @param origins {String} example -33.7144857,151.1572744
 * @param destinations {String} example -33.7144857,151.1572744
 * @param mode {String} travel mode - 'driving | walking | bicycling | transit'
 * @param units {String} 'metric | imperial'
 * @return {Promise}
 * */
const getDistance = (origins, destinations, mode = 'driving', departure_time = 'now') => {
  logger.info('-------------------- google distancematrix -------------------')
  const units = 'imperial';
  return new Promise((resolve, reject) => {
    request({
      url: "https://maps.googleapis.com/maps/api/distancematrix/json",
      qs: {
        key: process.env.GOOGLE_API_KEY,
        mode,
        units,
        origins,
        destinations,
        departure_time,
      },
      json: true,
      headers: defaultHeaders
    }, (error, response, data) => {
      if (error) {
        reject(error)
      } else {
        if (data.status !== STATUS_OK) {
          reject({
            status: data.status,
            message: data.error_message
          });
        } else {
          resolve(data);
        }
      }
    })
  });
}

const getDirections = (origin, destination, mode = 'transit', departure_time = 'now') => {
  logger.info('-------------------- google directions -------------------')
  const units = 'imperial';
  const qs = {
    key: process.env.GOOGLE_API_KEY,
    mode,
    units,
    origin,
    destination
  };
  if (mode === 'transit') {
    qs.departure_time = departure_time;
  }

  return new Promise((resolve, reject) => {
    let retries = 0;
    const fetch = () => {
      sendRequest('https://maps.googleapis.com/maps/api/directions/json', qs)
        .then(data => {
          if (data.status === STATUS_OK) {
            resolve(data);
          }
        })
        .catch(err => {
          if (err.status === OVER_QUERY_LIMIT && retries < 3) {
            retries ++;
            fetch();
          } else {
            reject(err);
          }
        });
    }
    fetch();
  })
}

const populateSchools = async (lat, lng) => {
  return findPlaces(`${lat},${lng}`, 2000, "school", "private").then(async (data) => {
    let results = [];
    for (let i = 0; i < data.length; i++) {
      try {
        let location = data[i].geometry.location;
        let distance = await getDistance(`${lat},${lng}`, `${location.lat},${location.lng}`);
        if (distance.status === STATUS_OK) {
          results.push(Object.assign({}, distance.rows[0].elements[0], data[i]));
        }
      } catch (e) {
        console.log(e);
      }
    }
    return results;
  }, (e) => {
    console.log(e);
    return [];
  })
}

const lookupAddress = async (lat, lng) => {
  logger.info('-------------------- google lookupAddress -------------------')
  return new Promise((resolve, reject) => {
    request({
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      qs: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_API_KEY
      },
      json: true,
      headers: defaultHeaders
    }, (error, response, data) => {
      if (error) {
        reject(error)
      } else {
        if (data.status !== STATUS_OK) {
          reject({
            status: data.status,
            message: data.error_message
          });
        } else {
          resolve(data);
        }
      }
    })
  });
}

const lookupGeolocation = async (address) => {
  logger.info('-------------------- google lookupGeolocation -------------------')
  return new Promise((resolve, reject) => {
    request({
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      qs: {
        address,
        key: process.env.GOOGLE_API_KEY
      },
      json: true,
      headers: defaultHeaders
    }, (error, response, data) => {
      if (error) {
        reject(error)
      } else {
        if (data.status !== STATUS_OK) {
          reject({
            status: data.status,
            message: data.error_message
          });
        } else {
          resolve(data);
        }
      }
    })
  });
}

const getPlaceDetails = (placeId, fields) => {
  logger.info('-------------------- google place -------------------')
  const qs = {
    key: process.env.GOOGLE_API_KEY,
    placeid: placeId,
    fields
  };
  return new Promise((resolve, reject) => {
    let retries = 0;
    const fetch = () => {
      sendRequest('https://maps.googleapis.com/maps/api/place/details/json', qs)
        .then(data => {
          if (data.status === STATUS_OK) {
            resolve(data);
          }
        })
        .catch(err => {
          if (err.status === OVER_QUERY_LIMIT && retries < 3) {
            retries ++;
            fetch();
          } else {
            reject(err);
          }
        });
    }
    fetch();
  })
}

module.exports = {
  findPlaces,
  getDistance,
  getDirections,
  populateSchools,
  lookupAddress,
  lookupGeolocation,
  getPlaceDetails
}
