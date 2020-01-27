const request = require("request");

const defaultHeaders = {
    "accept": "text/json,application/json"
};

const getGovernmentSchoolDetail = (latitude, longitude, schoolType = 'primary') => {
    const EPSG = 4326;
    let q = 'SELECT s.*, b.catch_type FROM masterdatasetnightlybatchcollections AS s JOIN catchments AS b ON s.school_code = b.use_id '
    q += ' WHERE ('
    q += `ST_CONTAINS(b.the_geom, ST_SetSRID(ST_Point(${longitude},${latitude}),${EPSG})) `
    if (schoolType) {
        if (schoolType === 'primary') {
            q += `AND (b.catch_type IN ('PRIMARY','INFANTS'))`
        } else if (schoolType === 'secondary') {
            q += `AND (b.catch_type IN ('HIGH_BOYS', 'HIGH_GIRLS', 'HIGH_COED','CENTRAL_HIGH'))`
        } else {
            q += `AND (b.catch_type IN ('${schoolType}'))`
        }
    }
    q += ')'
    return new Promise((resolve, reject) => {
        request({
            url: process.env.CARTO_SQLAPI_URL,
            qs: { q },
            json: true,
            headers: defaultHeaders
        }, (error, response, data) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(data);
            }
        })
    });
};

module.exports = {
    getGovernmentSchoolDetail
};
