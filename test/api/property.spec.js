const server = require('../../server/app')
const mongoose = require('mongoose');

let Property = require('../../server/models/Property')
let Survey = require('../../server/models/SurveyAnswer')
let Question = require('../../server/models/Question')

describe('Property API Tests', () => {
  let token = null
  let userId = null
  before((done) => {
    if (!token) {
      const user = {
        name: 'Tester',
        email: 'test1@mail.com',
        password: 'Passw0rd',
        confirmPassword: 'Passw0rd'
      }
      chai.request(server)
        .post(`/signup`)
        .send(user)
        .then(function (res) {
          expect(res.statusCode).to.equal(201)
          expect(res.body).to.be.a('object')
          userId = res.body.userId
          // console.log('------------------------------------------------ User -------------------------------------------------\n', res.body)
          // console.log('\n------------------------------------------------ End User -------------------------------------------------')
          
          chai.request(server)
            .post('/login')
            .send({
              email: user.email,
              password: user.password
            })
            .then((response) => {
              expect(response.statusCode).to.equal(200)
              expect(response.body).to.have.property('token')
              token = response.body.token
              var jsonQuestions = [
                {
                  "_id": {
                    "$oid": "5b2f2d0d1a3c7a09e059dc35"
                  },
                  "dependentQuestionTrue": [],
                  "responses": [{
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199c1"
                    },
                    "responseCode": "HANQ1r1",
                    "responseText": "Highway/Freeway",
                    "responseOrder": 1,
                    "responseScore": -30,
                    "responseCommentary": "The property is located on a highway. This is the worst possible outcome. Impacts on: property devaluation, health and safety and social factors. Very Bad. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199c2"
                    },
                    "responseCode": "HANQ1r2",
                    "responseText": "Arterial",
                    "responseOrder": 2,
                    "responseScore": -20,
                    "responseCommentary": "The property is located on an arterial road. Impacts on: property devaluation, health and safety and social factors. Bad. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199c3"
                    },
                    "responseCode": "HANQ1r3",
                    "responseText": "Feeder",
                    "responseOrder": 3,
                    "responseScore": -8,
                    "responseCommentary": "The property is located on a feeder. Impacts on: property devaluation, health and safety and social factors. Not good. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199c4"
                    },
                    "responseCode": "HANQ1r4",
                    "responseText": "None",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": ""
                  }],
                  "questionCode": "HANQ1",
                  "text": "What type of road?",
                  "questionSection": "street-traffic-parking",
                  "questionCategory": "street-traffic-parking",
                  "questionModule": "location",
                  "questionPageOrder": 12,
                  "dependentResponseId": "",
                  "adjustmentQuestion": false,
                  "detailedSurveyQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["google-maps"],
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": ""
                },
                {
                  "_id": {
                    "$oid": "5b2f49321a3c7a09e059dc3e"
                  },
                  "dependentQuestionTrue": [],
                  "responses": [{
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200b6"
                    },
                    "responseCode": "TRAQ7r4",
                    "responseText": "Chicanes",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Potential noise and safety issues due to street controls. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200b4"
                    },
                    "responseCode": "TRAQ7r2",
                    "responseText": "Roundabout",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Potential noise and safety issues due to street controls. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200b7"
                    },
                    "responseCode": "TRAQ7r5",
                    "responseText": "Other",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Potential noise and safety issues due to street controls. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200b5"
                    },
                    "responseCode": "TRAQ7r3",
                    "responseText": "Speed Bumps",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Potential noise and safety issues due to street controls. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200b3"
                    },
                    "responseCode": "TRAQ7r1",
                    "responseText": "None",
                    "responseOrder": 1,
                    "responseScore": 8,
                    "responseCommentary": "There are no street control structures."
                  }],
                  "text": "Are there any street controls?",
                  "questionSection": "street-traffic-parking",
                  "questionCategory": "street-traffic-parking",
                  "questionModule": "location",
                  "questionPageOrder": 11,
                  "dependentResponseId": "",
                  "adjustmentQuestion": false,
                  "detailedSurveyQuestion": false,
                  "analysisTypes": ["knockdown-rebuild", "new-house", "vacant-land", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "__v": 0,
                  "questionCode": "TRAQ7",
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b848c792978bb001484ba5f"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Media Room",
                  "questionCode": "DLQ08",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 18,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b848c792978bb001484ba60"
                    },
                    "responseCode": "DLQ08R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Media room - YES"
                  }, {
                    "_id": {
                      "$oid": "5b848cb82978bb001484ba62"
                    },
                    "responseCode": "DLQ08R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Media Room - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b85afd998937e00148e0d00"
                  },
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What description best describes the Gardens of the properties within the street ?",
                  "questionCode": "ASQ1",
                  "questionModule": "location",
                  "questionSection": "street-aesthetics",
                  "questionCategory": "street-aesthetics",
                  "questionPageOrder": 1,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b85afd998937e00148e0d05"
                    },
                    "responseCode": "ASQ01R1",
                    "responseText": "Professional- Excellent",
                    "responseOrder": 1,
                    "responseScore": 17,
                    "responseCommentary": "Gardens are of a professional standard - Impresive. \n"
                  }, {
                    "_id": {
                      "$oid": "5b85afd998937e00148e0d04"
                    },
                    "responseCode": "ASQ01R2",
                    "responseText": "Professional- Good",
                    "responseOrder": 2,
                    "responseScore": 15,
                    "responseCommentary": "Gardens are of a professional standard - Excellant. \n"
                  }, {
                    "_id": {
                      "$oid": "5b85afd998937e00148e0d03"
                    },
                    "responseCode": "ASQ01R3",
                    "responseText": "Good",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "Gardens are of maintained standard - Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b85afd998937e00148e0d02"
                    },
                    "responseCode": "ASQ01R4",
                    "responseText": "Average",
                    "responseOrder": 4,
                    "responseScore": 8,
                    "responseCommentary": "Gardens are of average standard - Ok. \n"
                  }, {
                    "_id": {
                      "$oid": "5b85afd998937e00148e0d01"
                    },
                    "responseCode": "ASQ01R5",
                    "responseText": "Poor",
                    "responseOrder": 5,
                    "responseScore": 5,
                    "responseCommentary": "Gardens are of below average standard - Not a good sign. \n"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b2f4b9c1a3c7a09e059dc40"
                  },
                  "dependentQuestionTrue": [],
                  "responses": [{
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200c1"
                    },
                    "responseCode": "TRAQ9r1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 8,
                    "responseCommentary": "The width of the street is good."
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200c2"
                    },
                    "responseCode": "TRAQ9r2",
                    "responseText": "Yes",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Narrow streets are bad for passing, reversing and safety. "
                  }],
                  "questionCode": "TRAQ9",
                  "text": "Is the street narrow?",
                  "questionSection": "street-traffic-parking",
                  "questionCategory": "street-traffic-parking",
                  "questionModule": "location",
                  "questionPageOrder": 9,
                  "dependentResponseId": "",
                  "adjustmentQuestion": false,
                  "detailedSurveyQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": ""
                },
                {
                  "_id": {
                    "$oid": "5b2f59561a3c7a09e059dc41"
                  },
                  "dependentQuestionTrue": [],
                  "responses": [{
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200c3"
                    },
                    "responseCode": "TRAQ10r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 8,
                    "responseCommentary": "The road is kerb and guttered. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200c4"
                    },
                    "responseCode": "TRAQ10r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The street is not concrete kerb and gutter"
                  }],
                  "questionCode": "TRAQ10",
                  "text": "Is all of the road concrete kerbed?",
                  "questionSection": "street-traffic-parking",
                  "questionCategory": "street-traffic-parking",
                  "questionModule": "location",
                  "questionPageOrder": 10,
                  "dependentResponseId": "",
                  "adjustmentQuestion": false,
                  "detailedSurveyQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": ""
                },
                {
                  "_id": {
                    "$oid": "5b2f2a461a3c7a09e059dc34"
                  },
                  "dependentQuestionTrue": [],
                  "responses": [{
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199a1"
                    },
                    "responseCode": "SURQ1r1",
                    "responseText": "75-100%",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "new homes dominate the Streetscape. \n"
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199a2"
                    },
                    "responseCode": "SURQ1r2",
                    "responseText": "50-75%",
                    "responseOrder": 2,
                    "responseScore": 8,
                    "responseCommentary": "Many New homes. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199a3"
                    },
                    "responseCode": "SURQ1r3",
                    "responseText": "25-50%",
                    "responseOrder": 3,
                    "responseScore": 6,
                    "responseCommentary": "An increasing number of  New homes."
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199a4"
                    },
                    "responseCode": "SURQ1r4",
                    "responseText": "0-25%",
                    "responseOrder": 4,
                    "responseScore": 2,
                    "responseCommentary": "Low number of  new homes. "
                  }],
                  "questionCode": "SURQ1",
                  "text": "What percentage are new homes or like new?",
                  "questionSection": "street-surrounding-real-estate",
                  "questionCategory": "street-surrounding-real-estate",
                  "questionModule": "location",
                  "questionPageOrder": 3,
                  "dependentResponseId": "",
                  "adjustmentQuestion": false,
                  "detailedSurveyQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b2f2fb81a3c7a09e059dc36"
                  },
                  "dependentQuestionTrue": [],
                  "responses": [{
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199a5"
                    },
                    "responseCode": "SURQ3R1",
                    "responseText": "75-100%",
                    "responseOrder": 1,
                    "responseScore": 9,
                    "responseCommentary": "Most properties have front fences.Fencing is synonymous with quality Real Estate, privacy and a sense of security. Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199a6"
                    },
                    "responseCode": "SURQ3R2",
                    "responseText": "50-75%",
                    "responseOrder": 2,
                    "responseScore": 7,
                    "responseCommentary": "More properties than most have front fences. Fencing is synonymous with quality Real Estate, privacy and a sense of security. Very good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199a7"
                    },
                    "responseCode": "SURQ3R3",
                    "responseText": "25-50%",
                    "responseOrder": 3,
                    "responseScore": 3,
                    "responseCommentary": "Has a number of front fences. Fencing is synonymous with quality Real Estate, privacy and a sense of security.  Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199a8"
                    },
                    "responseCode": "SURQ3R4",
                    "responseText": "0-25%",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Very few front fences. Fencing is synonymous with quality Real Estate, privacy and a sense of security.  \n"
                  }],
                  "questionCode": "SURQ3",
                  "text": "What percentage of houses have front fences or a hedge that's like a fence?",
                  "questionSection": "street-surrounding-real-estate",
                  "questionCategory": "street-surrounding-real-estate",
                  "questionModule": "location",
                  "questionPageOrder": 1,
                  "dependentResponseId": "",
                  "adjustmentQuestion": false,
                  "detailedSurveyQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "renovated"],
                  "bestSource": ["on-site"],
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b2f34e91a3c7a09e059dc39"
                  },
                  "dependentQuestionTrue": [],
                  "responses": [{
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199e2"
                    },
                    "responseCode": "TRAQ2R3",
                    "responseText": "Medium",
                    "responseOrder": 3,
                    "responseScore": 3,
                    "responseCommentary": "Moderate traffic congestion during off peak times. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199e1"
                    },
                    "responseCode": "TRAQ2R1",
                    "responseText": "Low",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "No traffic congestion during off peak times. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199e3"
                    },
                    "responseCode": "TRAQ2R5",
                    "responseText": "High",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "High traffic congestion during off peak times. "
                  }, {
                    "_id": {
                      "$oid": "5b9796b703513900158958c8"
                    },
                    "responseCode": "TRAQ2R2",
                    "responseText": "Low - Medium",
                    "responseOrder": 2,
                    "responseScore": 7,
                    "responseCommentary": "Low to Moderate Traffic congestion during peak times. "
                  }, {
                    "_id": {
                      "$oid": "5b97976603513900158958dc"
                    },
                    "responseCode": "TRAQ2R4",
                    "responseText": "Medium - High",
                    "responseOrder": 4,
                    "responseScore": 2,
                    "responseCommentary": "Medium - High Traffic congestion during peak times. "
                  }],
                  "questionCode": "TRAQ2",
                  "text": "What is the traffic level during off-peak periods?",
                  "questionSection": "street-traffic-parking",
                  "questionCategory": "street-traffic-parking",
                  "questionModule": "location",
                  "questionPageOrder": 2,
                  "dependentResponseId": "",
                  "adjustmentQuestion": false,
                  "detailedSurveyQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b2f480c1a3c7a09e059dc3c"
                  },
                  "dependentQuestionTrue": [],
                  "responses": [{
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200a7"
                    },
                    "responseCode": "TRAQ5r2",
                    "responseText": "Medium",
                    "responseOrder": 2,
                    "responseScore": 2,
                    "responseCommentary": "Possible parking problems during off-peak periods. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200a6"
                    },
                    "responseCode": "TRAQ5r1",
                    "responseText": "Low",
                    "responseOrder": 1,
                    "responseScore": 8,
                    "responseCommentary": "Good parking during off-peak periods. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200a8"
                    },
                    "responseCode": "TRAQ5r3",
                    "responseText": "High",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Parking is an issue during off peak periods. "
                  }],
                  "questionCode": "TRAQ5",
                  "text": "How much parking congestion during off-peak periods?",
                  "questionSection": "street-traffic-parking",
                  "questionCategory": "street-traffic-parking",
                  "questionModule": "location",
                  "questionPageOrder": 5,
                  "dependentResponseId": "",
                  "adjustmentQuestion": false,
                  "detailedSurveyQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "post-new-renovated", "new-house", "renovated-house", "unrenovated"],
                  "bestSource": ["on-site"],
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": ""
                },
                {
                  "_id": {
                    "$oid": "5b2f59f81a3c7a09e059dc42"
                  },
                  "dependentQuestionTrue": [],
                  "responses": [{
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200c5"
                    },
                    "responseCode": "TRAQ11r1",
                    "responseText": "Flat",
                    "responseOrder": 1,
                    "responseScore": 15,
                    "responseCommentary": "The street is flat. "
                  }, {
                    "_id": {
                      "$oid": "5b57ad361e574500148a5b7b"
                    },
                    "responseCode": "TRAQ11r2",
                    "responseText": "Gentle Slope",
                    "responseOrder": 2,
                    "responseScore": 13,
                    "responseCommentary": "The street has a gentle slope. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200c6"
                    },
                    "responseCode": "TRAQ11r3",
                    "responseText": "Moderate",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "The street has a moderate gradient. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200c7"
                    },
                    "responseCode": "TRAQ11r4",
                    "responseText": "Steep",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Steep streets have parking and safety issues. "
                  }],
                  "questionCode": "TRAQ11",
                  "text": "What is the slope of the street?",
                  "questionSection": "street-traffic-parking",
                  "questionCategory": "street-traffic-parking",
                  "questionModule": "location",
                  "questionPageOrder": 13,
                  "dependentResponseId": "",
                  "adjustmentQuestion": false,
                  "detailedSurveyQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b2f48b61a3c7a09e059dc3d"
                  },
                  "dependentQuestionTrue": [],
                  "responses": [{
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200b2"
                    },
                    "responseCode": "TRAQ6r3",
                    "responseText": "High",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "There is high potential for speeding, this raises safety issues & traffic noise. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200b1"
                    },
                    "responseCode": "TRAQ6r2",
                    "responseText": "Medium",
                    "responseOrder": 2,
                    "responseScore": 2,
                    "responseCommentary": "There is medium potential for speeding, this raises safety issues & traffic noise.  "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200a9"
                    },
                    "responseCode": "TRAQ6r1",
                    "responseText": "Low",
                    "responseOrder": 1,
                    "responseScore": 8,
                    "responseCommentary": "Potential for speeding has been rated as low, not saying speeding is not possible. "
                  }],
                  "questionCode": "TRAQ6",
                  "text": "What is the potential for speeding?",
                  "questionSection": "street-traffic-parking",
                  "questionCategory": "street-traffic-parking",
                  "questionModule": "location",
                  "questionPageOrder": 7,
                  "dependentResponseId": "",
                  "adjustmentQuestion": false,
                  "detailedSurveyQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b5eab794ecb5a0014e2caa2"
                  },
                  "questionCategory": "street-traffic-parking",
                  "questionModule": "location",
                  "questionPageOrder": 8,
                  "questionSection": "street-traffic-parking",
                  "responses": [{
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200b8"
                    },
                    "responseCode": "TRAQ8r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Cul-de-sacs are lifestyle streets and suburban lifestyle. - Excellant "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200b9"
                    },
                    "responseCode": "TRAQ8r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": ""
                  }],
                  "text": "Is it a Cul-de-sac / Dead End? (Located between the cul-de-sac and the nearest cross street)",
                  "questionCode": "TRAQ8",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": ""
                },
                {
                  "_id": {
                    "$oid": "5b2f45e81a3c7a09e059dc3a"
                  },
                  "dependentQuestionTrue": [],
                  "responses": [{
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200a2"
                    },
                    "responseCode": "TRAQ3r2",
                    "responseScore": 0,
                    "responseText": "Yes",
                    "responseCommentary": "There are parking restrictions. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200a1"
                    },
                    "responseCode": "TRAQ3r1",
                    "responseScore": 8,
                    "responseText": "No",
                    "responseCommentary": "There are no parking restrictions. "
                  }],
                  "questionCode": "TRAQ3",
                  "text": "Are there parking restrictions?",
                  "questionSection": "street-traffic-parking",
                  "questionCategory": "street-traffic-parking",
                  "questionModule": "location",
                  "questionPageOrder": 3,
                  "dependentResponseId": "",
                  "adjustmentQuestion": false,
                  "detailedSurveyQuestion": false,
                  "analysisTypes": [],
                  "bestSource": [{
                    "_id": "5b6beeb1c43dc40014e009b6",
                    "code": "off-site",
                    "text": "Off-Site"
                  }],
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": ""
                },
                {
                  "_id": {
                    "$oid": "5b60eb0fafdcb5001477f10b"
                  },
                  "questionCategory": "street-surrounding-real-estate",
                  "questionModule": "location",
                  "questionPageOrder": 4,
                  "questionSection": "street-surrounding-real-estate",
                  "responses": [{
                    "_id": {
                      "$oid": "5b60eb0fafdcb5001477f10f"
                    },
                    "responseCode": "SURQ4R4",
                    "responseText": "75-100%",
                    "responseOrder": 4,
                    "responseScore": 14,
                    "responseCommentary": "The surrounding real-estate has many substantial old established home. A sign of stature - Excellent"
                  }, {
                    "_id": {
                      "$oid": "5b60eb0fafdcb5001477f10e"
                    },
                    "responseCode": "SURQ4R3",
                    "responseText": "50-75%",
                    "responseOrder": 3,
                    "responseScore": 11,
                    "responseCommentary": "The surrounding real-estate has many old established home. A sign of stature - Good"
                  }, {
                    "_id": {
                      "$oid": "5b60eb0fafdcb5001477f10d"
                    },
                    "responseCode": "SURQ4R2",
                    "responseText": "25-50%",
                    "responseOrder": 2,
                    "responseScore": 8,
                    "responseCommentary": "The surrounding real-estate has a few substantial old established homes. A sign past of potential stature - Good"
                  }, {
                    "_id": {
                      "$oid": "5b60eb0fafdcb5001477f10c"
                    },
                    "responseCode": "SURQ4R1",
                    "responseText": "0-25%",
                    "responseOrder": 1,
                    "responseScore": 3,
                    "responseCommentary": ""
                  }],
                  "text": "What percentage of the surrounding homes are Old, Substantial, Period homes?",
                  "questionCode": "SURQ4",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b6f4bb90f59760014643e50"
                  },
                  "questionCategory": "topography",
                  "questionModule": "land",
                  "questionPageOrder": 2,
                  "questionSection": "topography",
                  "responses": [{
                    "_id": {
                      "$oid": "5b6f4bb90f59760014643e51"
                    },
                    "responseCode": "TOPQ2R1",
                    "responseText": "0 - 0.5m",
                    "responseOrder": 1,
                    "responseScore": 25,
                    "responseCommentary": "The cross – fall of the land is flat - building, garden and access attributes are Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b6f4d3c0f59760014643e60"
                    },
                    "responseCode": "TOPQ2R2",
                    "responseText": "0.5 - 1.5m",
                    "responseOrder": 2,
                    "responseScore": 17,
                    "responseCommentary": "The cross – fall of the land is moderate - building, garden and access attributes can be impacted. OK. \n"
                  }, {
                    "_id": {
                      "$oid": "5b6f4d3c0f59760014643e5f"
                    },
                    "responseCode": "TOPQ2R3",
                    "responseText": "1.5 - 3.0m",
                    "responseOrder": 3,
                    "responseScore": 4,
                    "responseCommentary": "The cross – fall of the land is significant -  Design, building, garden and access is impacted and should be considered. Not good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b6f4d3c0f59760014643e5e"
                    },
                    "responseCode": "TOPQ2R4",
                    "responseText": ">3.0m",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "The cross – fall of the land is Large – significant design, building, garden and access will be impacted, consideration should be given. Not good .\n"
                  }],
                  "text": "What is the Left to Right Cross-Fall of the Land ?",
                  "questionCode": "TOPQ2",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70bc368651870014addf43"
                  },
                  "questionCategory": "performance",
                  "questionModule": "land",
                  "questionPageOrder": 3,
                  "questionSection": "performance",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70bc368651870014addf45"
                    },
                    "responseCode": "PERQ3r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 5,
                    "responseCommentary": "The property has a second vehicle access point -  development, design, parking and access attributes are Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70bc368651870014addf44"
                    },
                    "responseCode": "PERQ3r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0
                  }],
                  "text": "Is there more than 1 Vehicle Access? ",
                  "questionCode": "PERQ3",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b836e7bc47e4d00140795a2"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Garage",
                  "questionCode": "DLQ01",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 6,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b836e7bc47e4d00140795a4"
                    },
                    "responseCode": "DLQ01",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 80,
                    "responseCommentary": "Garage - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b836e7bc47e4d00140795a3"
                    },
                    "responseCode": "DLQ02",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Garage - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b83704ec47e4d00140795a5"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Foyer/Entry",
                  "questionCode": "DLQ02",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 13,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b83704ec47e4d00140795a7"
                    },
                    "responseCode": "DLQ02R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Foyer - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b83704ec47e4d00140795a6"
                    },
                    "responseCode": "DLQ02r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Foyer - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b8374a1c47e4d0014079604"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Study",
                  "questionCode": "DLQ03",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 14,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8374a1c47e4d0014079606"
                    },
                    "responseCode": "DLQ03R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 3,
                    "responseCommentary": "Study - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b8374a1c47e4d0014079605"
                    },
                    "responseCode": "DLQ03R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Study - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b8375e8c47e4d0014079607"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Formal Lounge/Living ",
                  "questionCode": "DLQ04",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 32.1,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8375e8c47e4d0014079609"
                    },
                    "responseCode": "DLQ04R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Formal Lounge/Living - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b8375e8c47e4d0014079608"
                    },
                    "responseCode": "DLQ04R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Formal Lounge/Living - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b83770dc47e4d001407960a"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Formal Dining",
                  "questionCode": "DLQ05",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 32.2,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b83770dc47e4d001407960c"
                    },
                    "responseCode": "DLQ05R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Formal Dining - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b83770dc47e4d001407960b"
                    },
                    "responseCode": "DLQ05R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Formal Dining - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b8489da2978bb001484ba59"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Carport",
                  "questionCode": "DLQ06",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 9,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b836e7bc47e4d00140795a2",
                  "dependentResponseId": "5b836e7bc47e4d00140795a3",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8489da2978bb001484ba5b"
                    },
                    "responseCode": "DLQ06R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 30,
                    "responseCommentary": "Carport - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b8489da2978bb001484ba5a"
                    },
                    "responseCode": "DLQ06R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Carport - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b848bee2978bb001484ba5c"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Rumpus Room",
                  "questionCode": "DLQ07",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 17,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b848bee2978bb001484ba5e"
                    },
                    "responseCode": "DLQ07R01",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Rumpus room - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b848bee2978bb001484ba5d"
                    },
                    "responseCode": "DLQ07R02",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Rumpus room - No"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b848dd92978bb001484ba66"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Laundry",
                  "questionCode": "DLQ09",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 19,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b848dd92978bb001484ba68"
                    },
                    "responseCode": "DLQ09R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Laundry - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b848dd92978bb001484ba67"
                    },
                    "responseCode": "DLQ09R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Laundry - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b85205025ac1800144a0fb4"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "2nd Floor",
                  "questionCode": "DLQ36",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 3.2,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b851f7025ac1800144a0faa",
                  "dependentResponseId": "5b851f7025ac1800144a0fab",
                  "responses": [{
                    "_id": {
                      "$oid": "5b85205025ac1800144a0fb6"
                    },
                    "responseCode": "DLQ36R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": -15,
                    "responseCommentary": "2nd Floor - Yes The property has 3 levels consider more stairs and access problems for the elderly. Multiple levels can be a negative in both price and functionality ; Preferable not"
                  }, {
                    "_id": {
                      "$oid": "5b85205025ac1800144a0fb5"
                    },
                    "responseCode": "DLQ36R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "2nd Floor - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b6a48abdc87d000145e6a2d"
                  },
                  "questionCategory": "topography",
                  "questionModule": "land",
                  "questionPageOrder": 1,
                  "questionSection": "topography",
                  "responses": [{
                    "_id": {
                      "$oid": "5b6a48abdc87d000145e6a33"
                    },
                    "responseCode": "TOPQ1r1",
                    "responseText": "Top of Hill",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "The property is positioned on top of a hill – full solar access & range, low drainage issues, possible views. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b6a48abdc87d000145e6a32"
                    },
                    "responseCode": "TOPQ1r2",
                    "responseText": "North slope of Hill",
                    "responseOrder": 2,
                    "responseScore": 20,
                    "responseCommentary": "The property is positioned on the northern slope of a hill – full solar access & range, possible drainage issues, possible views. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b6a48abdc87d000145e6a31"
                    },
                    "responseCode": "TOPQ1r3",
                    "responseText": "East slope of Hill",
                    "responseOrder": 3,
                    "responseScore": 15,
                    "responseCommentary": "The property is positioned on eastern slope of a hill – morning solar access & range, possible drainage issues, possible views. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b6a48abdc87d000145e6a30"
                    },
                    "responseCode": "TOPQ1r4",
                    "responseText": "Bottom of Hill",
                    "responseOrder": 4,
                    "responseScore": 10,
                    "responseCommentary": "The property is positioned at the bottom of the slope of a hill – solar access and range may be affected, possible drainage issues and privacy issues. Not good. "
                  }, {
                    "_id": {
                      "$oid": "5b6a48abdc87d000145e6a2f"
                    },
                    "responseCode": "TOPQ1r5",
                    "responseText": "West slope of Hill",
                    "responseOrder": 5,
                    "responseScore": 5,
                    "responseCommentary": "The property is positioned on western slope of a hill – afternoon solar access & range, hot in summer, possible drainage issues, possible views. OK. "
                  }, {
                    "_id": {
                      "$oid": "5b6a48abdc87d000145e6a2e"
                    },
                    "responseCode": "TOPQ1r6",
                    "responseText": "South slope of Hill",
                    "responseOrder": 6,
                    "responseScore": 0,
                    "responseCommentary": "The property is positioned on the southern slope of a hill – solar access and winter range is affected, possible colder winters, dampness and drainage issues. Not good. \n"
                  }],
                  "text": "What is the Natural Topography of the Land ?",
                  "questionCode": "TOPQ1",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b60f1d3afdcb5001477f11c"
                  },
                  "questionCategory": "street-surrounding-real-estate",
                  "questionModule": "location",
                  "questionPageOrder": 5,
                  "questionSection": "street-surrounding-real-estate",
                  "responses": [{
                    "_id": {
                      "$oid": "5b60f1d3afdcb5001477f123"
                    },
                    "responseCode": "SURQ5R1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 8
                  }, {
                    "_id": {
                      "$oid": "5b60f1d3afdcb5001477f122"
                    },
                    "responseCode": "SURQ5R2",
                    "responseText": "High-Rise Units ",
                    "responseOrder": 2,
                    "responseScore": 5,
                    "responseCommentary": "The surrounding real estate includes multi-storey residential units, high density living. This can devalue traditional free standing homes or increase value with the applicable zoning."
                  }, {
                    "_id": {
                      "$oid": "5b60f1d3afdcb5001477f11e"
                    },
                    "responseCode": "SURQ5R6",
                    "responseText": "Church/Education/Day Cares",
                    "responseOrder": 6,
                    "responseScore": 5,
                    "responseCommentary": "The surrounding real estate includes Church/educational facilities. This can devalue traditional free standing homes due traffic, parking congestion and noise like issues. Possible development potential may exist."
                  }, {
                    "_id": {
                      "$oid": "5b60f1d3afdcb5001477f11d"
                    },
                    "responseCode": "SURQ5R7",
                    "responseText": "More than one of the above",
                    "responseOrder": 9,
                    "responseScore": 4,
                    "responseCommentary": "The surrounding real estate includes multiple higher density living or services that can devalue traditional free standing homes due traffic, parking congestion and noise like issues. Possible development potential may exist."
                  }, {
                    "_id": {
                      "$oid": "5b60f1d3afdcb5001477f120"
                    },
                    "responseCode": "SURQ5R5",
                    "responseText": "High Voltage Power Lines",
                    "responseOrder": 5,
                    "responseScore": 5,
                    "responseCommentary": "The Property is located close to High Voltage power lines - consider valuation and possible health effects. Not Good"
                  }, {
                    "_id": {
                      "$oid": "5b60f1d3afdcb5001477f11f"
                    },
                    "responseCode": "SURQ5R4",
                    "responseText": "Retirement Facilities/Over 55's",
                    "responseOrder": 4,
                    "responseScore": 5,
                    "responseCommentary": "The surrounding real estate includes Retirement facilities/Over 55’s, medium density living. This can devalue traditional free standing homes or can increase value with the applicable zoning."
                  }, {
                    "_id": {
                      "$oid": "5b60f1d3afdcb5001477f121"
                    },
                    "responseCode": "SURQ5R3",
                    "responseText": "Low-Rise Units/Town houses",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "The surrounding real estate includes Townhouses/low rise residential units, medium density living. This can devalue traditional free standing homes or can increase value with the applicable zoning."
                  }, {
                    "_id": {
                      "$oid": "5b75e93549d99a0014435d50"
                    },
                    "responseCode": "SUR5QR7",
                    "responseText": "Freeway/Hwy/Major/Busy Road",
                    "responseOrder": 7,
                    "responseScore": 4,
                    "responseCommentary": "The property is located near a Majour Road - Consider health, noise, aesthetics and financial impact. - Not Good"
                  }, {
                    "_id": {
                      "$oid": "5b89d795652d140014ddc996"
                    },
                    "responseCode": "SUR5QR8",
                    "responseText": "Shops/Commercial",
                    "responseOrder": 8,
                    "responseScore": 4,
                    "responseCommentary": "Shops"
                  }],
                  "text": "Within 100m, does any of the surrounding real estate include any of the following?",
                  "questionCode": "SURQ5",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "renovated-house", "new-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b6f50ef0f59760014643e68"
                  },
                  "questionCategory": "topography",
                  "questionModule": "land",
                  "questionPageOrder": 3,
                  "questionSection": "topography",
                  "responses": [{
                    "_id": {
                      "$oid": "5b6f50ef0f59760014643e6c"
                    },
                    "responseCode": "TOPQ3R1",
                    "responseText": "<1.5m",
                    "responseOrder": 1,
                    "responseScore": 50,
                    "responseCommentary": "The Front to back fall of the land is flat - building, garden and access attributes are Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b6f50ef0f59760014643e6b"
                    },
                    "responseCode": "TOPQ3R2",
                    "responseText": "1.5 - 3.0m",
                    "responseOrder": 2,
                    "responseScore": 25,
                    "responseCommentary": "The Front to back fall of the land is moderate – building, garden and access attributes should be considered. Ok. \n"
                  }, {
                    "_id": {
                      "$oid": "5b6f50ef0f59760014643e6a"
                    },
                    "responseCode": "TOPQ3R3",
                    "responseText": "3.0 - 5.0m",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "The Front to back fall of the land is steep – the design, build, garden, access and lifestyle will be impacted and consideration to these impacts must be given. Not good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b6f50ef0f59760014643e69"
                    },
                    "responseCode": "TOPQ3R4",
                    "responseText": ">5.0m",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "The Front to back fall of the land is steep – the design, build, garden, access and lifestyle will be impacted and consideration to these impacts must be given. Not good. \n"
                  }],
                  "text": "What is the Front to Back Fall of the Land ? ",
                  "questionCode": "TOPQ3",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b6f51fc0f59760014643e6e"
                  },
                  "questionCategory": "topography",
                  "questionModule": "land",
                  "questionPageOrder": 4,
                  "questionSection": "topography",
                  "responses": [{
                    "_id": {
                      "$oid": "5b6f51fc0f59760014643e71"
                    },
                    "responseCode": "TOPQ4R1",
                    "responseText": "Higher",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "The property is located on the high side of the street – street appeal, access and drainage attributes are Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b6f51fc0f59760014643e70"
                    },
                    "responseCode": "TOPQ4R2",
                    "responseText": "Level",
                    "responseOrder": 2,
                    "responseScore": 20,
                    "responseCommentary": "The property is located level to the street – street appeal and access attributes are excellent, although possible drainage issues can occur. Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b6f51fc0f59760014643e6f"
                    },
                    "responseCode": "TOPQ4R3",
                    "responseText": "Lower",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "The property is located on the low side of the street – street appeal, possible access and drainage issues may occur. Not good. \n"
                  }],
                  "text": "What is the Land Height in Relation to the Road ? ",
                  "questionCode": "TOPQ4",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b6f54d40f59760014643e73"
                  },
                  "questionCategory": "topography",
                  "questionModule": "land",
                  "questionPageOrder": 5,
                  "questionSection": "topography",
                  "responses": [{
                    "_id": {
                      "$oid": "5b6f54d40f59760014643e77"
                    },
                    "responseCode": "TOPQ5R1",
                    "responseText": "Rectangular",
                    "responseOrder": 1,
                    "responseScore": 40,
                    "responseCommentary": "The shape of the block of land is rectangular - symmetry works well with design and usage of space. Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b6f54d40f59760014643e76"
                    },
                    "responseCode": "TOPQ5R2",
                    "responseText": "Irregular by 1 side",
                    "responseOrder": 2,
                    "responseScore": 30,
                    "responseCommentary": "The shape of the block of land is rectangular with one irregular side/boundary – the impacts on design and usage of space is minimal.  Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b6f54d40f59760014643e75"
                    },
                    "responseCode": "TOPQ5R3",
                    "responseText": "Irregular by 2 side",
                    "responseOrder": 3,
                    "responseScore": 15,
                    "responseCommentary": "The shape of the block of land has two irregular sides/boundaries – the impacts on design and usage of space can affect the properties performance.  Not Good.  \n"
                  }, {
                    "_id": {
                      "$oid": "5b6f54d40f59760014643e74"
                    },
                    "responseCode": "TOPQ5R4",
                    "responseText": "Irregular Shape",
                    "responseOrder": 4,
                    "responseScore": 5,
                    "responseCommentary": "The shape of the block of land is bound by no regular sides/boundaries – the impacts on design and usage of space can materially affect the property's performance and usage. Not Good. \n"
                  }],
                  "text": "What is the Shape of the Land’s Border (Excluding Battleaxe Handle if applicable)? ",
                  "questionCode": "TOPQ5",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["contract-title-search"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b6f56b50f59760014643e7a"
                  },
                  "questionCategory": "topography",
                  "questionModule": "land",
                  "questionPageOrder": 6,
                  "questionSection": "topography",
                  "responses": [{
                    "_id": {
                      "$oid": "5b6f56b50f59760014643e7d"
                    },
                    "responseCode": "TOPQ6R1",
                    "responseText": ">20m",
                    "responseOrder": 1,
                    "responseScore": 30,
                    "responseCommentary": "The width of the property is wide – Good design with high street appeal is associated with wide blocks. Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b6f56b50f59760014643e7c"
                    },
                    "responseCode": "TOPQ6R2",
                    "responseText": "18 - 20m",
                    "responseOrder": 2,
                    "responseScore": 20,
                    "responseCommentary": "The width of the property is average – design with street appeal can be achieved. Ok.\n"
                  }, {
                    "_id": {
                      "$oid": "5b6f56b50f59760014643e7b"
                    },
                    "responseCode": "TOPQ6R3",
                    "responseText": "<18m",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "The width of the property is narrow – design, street appeal and liveability of the house can be impacted. Not Good. \n"
                  }],
                  "text": "What is the Width of the Frontage of the Land ? ",
                  "questionCode": "TOPQ6",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["contract-title-search"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70ab138651870014addd95"
                  },
                  "questionCategory": "planning",
                  "questionModule": "land",
                  "questionPageOrder": 3,
                  "questionSection": "planning",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70ab138651870014addd97"
                    },
                    "responseCode": "PLAQ3R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "The property can be developed by complying development – a state policy that allows you to develop a property through a set of guidelines. There is no council involvement.  Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70ab138651870014addd96"
                    },
                    "responseCode": "PLAQ3R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The property cannot be developed by complying development – all development will have to be undertaken by council’s development codes.  Not Good. \n"
                  }],
                  "text": "May Complying Development be Carried Out?",
                  "questionCode": "PLAQ3",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "post-new-renovated", "unrenovated", "renovated-house"],
                  "bestSource": [{
                    "_id": "5b70b7b18651870014addef6",
                    "code": "on-site",
                    "text": "On-Site"
                  }, "contract-planning-certificate"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70ac848651870014addda0"
                  },
                  "questionCategory": "planning",
                  "questionModule": "land",
                  "questionPageOrder": 4,
                  "questionSection": "planning",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70ac848651870014addda2"
                    },
                    "responseCode": "PLAQ4R1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "The property is not heritage listed. Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70ac848651870014addda1"
                    },
                    "responseCode": "PLAQ4R2",
                    "responseText": "Yes",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The property is heritage listed - a heritage listed property is difficult to develop, there are many rules and regulations. The property cannot be knocked down. Not Good. \n\n"
                  }],
                  "text": "Is the House a Heritage Item? ",
                  "questionCode": "PLAQ4",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["knockdown-rebuild", "new-house", "post-new-renovated", "unrenovated", "renovated-house", "vacant-land"],
                  "bestSource": [{
                    "_id": "5b70b7c68651870014addf04",
                    "code": "on-site",
                    "text": "On-Site"
                  }, "contract-planning-certificate"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70a915ca33f4001499e8a7"
                  },
                  "questionCategory": "planning",
                  "questionModule": "land",
                  "questionPageOrder": 1,
                  "questionSection": "planning",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70a915ca33f4001499e8ac"
                    },
                    "responseCode": "PLAQ1R1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 40,
                    "responseCommentary": "The property title is clear of major restrictions. Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70a915ca33f4001499e8ab"
                    },
                    "responseCode": "PLAQ1R2",
                    "responseText": "Right of way",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The property title includes a Right of Way - Definition: established by a usage or grant; a car or pedestrian must pass along specific grounds to reach the property. Clarify with conveyancer. Not Good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b70a915ca33f4001499e8aa"
                    },
                    "responseCode": "PLAQ1R3",
                    "responseText": "Covenant",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "The property title includes a Covenant - Definition: An agreement made by owners that some restriction is in place on how you build or alter the property. Clarify with conveyancer. Not Good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b70a915ca33f4001499e8a9"
                    },
                    "responseCode": "PLAQ1R4",
                    "responseText": "Easement",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "The property title includes an easement – Definition: a right to cross or otherwise use someone else’s land for a specific purpose. Clarify with conveyancer. Not Good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b70a915ca33f4001499e8a8"
                    },
                    "responseCode": "PLAQ1R5",
                    "responseText": "Other",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "The property title is restricted - Clarify with conveyancer. Not Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b947636427b890015a106b2"
                    },
                    "responseCode": "PLAQ1R5",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 20,
                    "responseCommentary": "The property title details - Unknown Data Inaccuracy "
                  }],
                  "text": "Are any of the following Restrictions on the Property title? ",
                  "questionCode": "PLAQ1",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["post-new-renovated", "vacant-land", "knockdown-rebuild", "new-house", "unrenovated", "renovated-house"],
                  "bestSource": ["contract-title-search", "contract-planning-certificate"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70b9bd8651870014addf21"
                  },
                  "questionCategory": "planning",
                  "questionModule": "land",
                  "questionPageOrder": 7,
                  "questionSection": "planning",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70b9bd8651870014addf25"
                    },
                    "responseCode": "PLAQ7r1",
                    "responseText": "Dual Street Frontage (Not a corner)",
                    "responseOrder": 1,
                    "responseScore": 30,
                    "responseCommentary": "The property has Dual street frontage – development, design, parking and access attributes are Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70b9bd8651870014addf24"
                    },
                    "responseCode": "PLAQ7r2",
                    "responseText": "Single Street Frontage",
                    "responseOrder": 2,
                    "responseScore": 20,
                    "responseCommentary": "The property is a single street frontage – Most houses are this option. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70b9bd8651870014addf23"
                    },
                    "responseCode": "PLAQ7r3",
                    "responseText": "Corner Block",
                    "responseOrder": 3,
                    "responseScore": 15,
                    "responseCommentary": "The property is a corner block – development, design, parking and access attributes are excellent, although garden areas and privacy can be an affected. Good."
                  }, {
                    "_id": {
                      "$oid": "5b70b9bd8651870014addf22"
                    },
                    "responseCode": "PLAQ7r4",
                    "responseText": "Battleaxe",
                    "responseOrder": 4,
                    "responseScore": 5,
                    "responseCommentary": "The property is a battleaxe block – No street appeal, possible impact on development and design. Multiple neighbours can increase risks such as disputes, noise and privacy. Ok. "
                  }],
                  "text": "Describe the Frontage of the Property? ",
                  "questionCode": "PLAQ7",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": [{
                    "_id": "5b70b9bd8651870014addf26",
                    "code": "on-site",
                    "text": "On-Site"
                  }, "contract-survey", "contract-title-search"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70bac08651870014addf30"
                  },
                  "questionCategory": "performance",
                  "questionModule": "land",
                  "questionPageOrder": 1,
                  "questionSection": "performance",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70bac08651870014addf33"
                    },
                    "responseCode": "PERQ1r1",
                    "responseText": "Good",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "The vehicle access to the property is - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70bac08651870014addf32"
                    },
                    "responseCode": "PERQ1r2",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "The vehicle access to the property is average - consider factors such as slope, traction, driveway angle to the street, potential safety and property/vehicle damage. Sports cars or lowly slung vehicle have difficulties with less than perfect driveways. Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b70bac08651870014addf31"
                    },
                    "responseCode": "PERQ1r3",
                    "responseText": "Difficult",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "The vehicle access to the property is difficult - consider factors such as slope, traction, driveway angle to the street, potential safety and property/vehicle damage. Sports cars or lowly slung vehicle have difficulties with less than perfect driveways. Not Good."
                  }],
                  "text": "Describe the Main vehicle access from the Street to the Garage/Land, factoring: slope, angle to the street, ability to drive into the garage or parking and street traffic.",
                  "questionCode": "PERQ1",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70bba78651870014addf3e"
                  },
                  "questionCategory": "performance",
                  "questionModule": "land",
                  "questionPageOrder": 2,
                  "questionSection": "performance",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70bba78651870014addf41"
                    },
                    "responseCode": "PERQ2r1",
                    "responseText": "4 or less stairs and/or slope <1m",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "The pedestrian access to the property is - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70bba78651870014addf40"
                    },
                    "responseCode": "PERQ2r2",
                    "responseText": "5-9 stairs and/or slope 1-2m",
                    "responseOrder": 2,
                    "responseScore": 5,
                    "responseCommentary": "The pedestrian access to the property is average - consider usage, difficulty, safety, seniors or people with disabilities. Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b70bba78651870014addf3f"
                    },
                    "responseCode": "PERQ2r3",
                    "responseText": ">9 stairs and/or slope >2m",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "The pedestrian access to the property is difficult - consider usage, difficulty, safety, seniors or people with disabilities.  Not Good. "
                  }],
                  "text": "Describe the Main Pedestrian Access from the Street to the Front Door/Land",
                  "questionCode": "PERQ2",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70bdd98651870014addf4b"
                  },
                  "questionCategory": "performance",
                  "questionModule": "land",
                  "questionPageOrder": 13,
                  "questionSection": "performance",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70bdd98651870014addf4f"
                    },
                    "responseCode": "PERQ5r1",
                    "responseText": "0-25%",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "The impact of shade on the property is low - solar access is Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70bdd98651870014addf4e"
                    },
                    "responseCode": "PERQ5r2",
                    "responseText": "25-50%",
                    "responseOrder": 2,
                    "responseScore": 5,
                    "responseCommentary": "The impact of shade on the property is moderate - Some shade is good for solar protection, although consider the impact on living spaces, outdoor open space, vegetation and mosquitoes in the garden. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70bdd98651870014addf4d"
                    },
                    "responseCode": "PERQ5r3",
                    "responseText": "50-75%",
                    "responseOrder": 3,
                    "responseScore": 2,
                    "responseCommentary": "The impact of shade on the property is high - Some shade is good for solar protection, although consider the impact on living spaces, outdoor open space, vegetation and mosquitoes in the garden. Not Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70bdd98651870014addf4c"
                    },
                    "responseCode": "PERQ5r4",
                    "responseText": "75-100%",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "The impact of shade on the property is very high - Some shade is good for solar protection, although consider the impact on living spaces, outdoor open space, vegetation and mosquitoes in the garden. Bad. "
                  }],
                  "text": "How much of the Land is Affected by Shade from Neighbouring Trees, Hills or Structures? ",
                  "questionCode": "PERQ5",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70c4f58651870014addf5b"
                  },
                  "questionCategory": "performance",
                  "questionModule": "land",
                  "questionPageOrder": 5,
                  "questionSection": "performance",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70c4f58651870014addf5f"
                    },
                    "responseCode": "PERQ7r1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 25
                  }, {
                    "_id": {
                      "$oid": "5b70c4f58651870014addf5e"
                    },
                    "responseCode": "PERQ7r2",
                    "responseText": "Driveway - Right of Way",
                    "responseOrder": 2,
                    "responseScore": 10,
                    "responseCommentary": "The property has a bordering Right of Way (driveway) - consider noise, lights and security. Not Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70c4f58651870014addf5d"
                    },
                    "responseCode": "PERQ7r3",
                    "responseText": "Pedestrian Access - Right of Way",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "The property has a bordering Right of Way (pedestrian access)  - consider noise, lights and security. Not Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70c4f58651870014addf5c"
                    },
                    "responseCode": "PERQ7r4",
                    "responseText": "Body of water",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "The property has a body of water running through or bordering it - consider mosquitoes and other vermin, potential flooding and safety hazards for children exposed to unenclosed water. Not Good. \n"
                  }],
                  "text": "Do any of the following run along the boundary or through the Property?",
                  "questionCode": "PERQ7",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["contract-title-search", "on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70c6038651870014addf61"
                  },
                  "questionCategory": "performance",
                  "questionModule": "land",
                  "questionPageOrder": 7,
                  "questionSection": "performance",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70c6038651870014addf65"
                    },
                    "responseCode": "PERQ8r1",
                    "responseText": "None",
                    "responseOrder": 1,
                    "responseScore": 30,
                    "responseCommentary": "The rear and side of the property have good privacy. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70c6038651870014addf64"
                    },
                    "responseCode": "PERQ8r2",
                    "responseText": "1-2",
                    "responseOrder": 2,
                    "responseScore": 10,
                    "responseCommentary": "The rear and side of the property has minor privacy issues. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70c6038651870014addf63"
                    },
                    "responseCode": "PERQ8r3",
                    "responseText": "3-4",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "The rear and side of the property has privacy issues - The noted windows looking into the property should be considered. Ok. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70c6038651870014addf62"
                    },
                    "responseCode": "PERQ8r4",
                    "responseText": "5+",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "The rear and side of the property has several privacy issues - The noted windows looking into the property should be considered. Not Good. \n"
                  }],
                  "text": "How Many Neighbouring Windows (Excluding Highlight Windows) Look into your Rear or Side Open Space Areas?",
                  "questionCode": "PERQ8",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70c6da8651870014addf67"
                  },
                  "questionCategory": "performance",
                  "questionModule": "land",
                  "questionPageOrder": 8,
                  "questionSection": "performance",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70c6da8651870014addf6a"
                    },
                    "responseCode": "PERQ9r1",
                    "responseText": "Low",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "At the property, the background noise was low. Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70c6da8651870014addf69"
                    },
                    "responseCode": "PERQ9r2",
                    "responseText": "Medium",
                    "responseOrder": 2,
                    "responseScore": 5,
                    "responseCommentary": "At the property, background noise was noted – consideration should be given to the effects of weather and time of day on this noise. Not Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70c6da8651870014addf68"
                    },
                    "responseCode": "PERQ9r3",
                    "responseText": "High",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "At the property, background noise was noted as high – consideration should be given to the effects of weather and time of day on this noise. Investigate if the noise can be heard inside the house and what impacts it will have on your lifestyle. Bad. "
                  }],
                  "text": "What is the level of Background Noise? (e.g. Planes,Trains & Automobiles)",
                  "questionCode": "PERQ9",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70c77f8651870014addf6c"
                  },
                  "questionCategory": "performance",
                  "questionModule": "land",
                  "questionPageOrder": 9,
                  "questionSection": "performance",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70c77f8651870014addf6f"
                    },
                    "responseCode": "PERQ10r1",
                    "responseText": "Low",
                    "responseOrder": 1,
                    "responseScore": 20
                  }, {
                    "_id": {
                      "$oid": "5b70c77f8651870014addf6e"
                    },
                    "responseCode": "PERQ10r2",
                    "responseText": "Medium",
                    "responseOrder": 2,
                    "responseScore": 10,
                    "responseCommentary": "At the property, periodical background noise was noted – consideration should be given to the effects and time periods of this noise. Not Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70c77f8651870014addf6d"
                    },
                    "responseCode": "PERQ10r3",
                    "responseText": "High",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "At the property, periodical background noise was noted as high – consideration should be given to the effects and time periods of this noise and if it will be an inconvenience. Not Good. \n"
                  }],
                  "text": "What is the potential for background noise? (e.g. Planes,Trains & Automobiles)",
                  "questionCode": "PERQ10",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70c86f8651870014addf71"
                  },
                  "questionCategory": "performance",
                  "questionModule": "land",
                  "questionPageOrder": 10,
                  "questionSection": "performance",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70c86f8651870014addf76"
                    },
                    "responseCode": "PERQ11r1",
                    "responseText": "None",
                    "responseOrder": 1,
                    "responseScore": 30,
                    "responseCommentary": "No large trees are located on or surrounding the property. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70c86f8651870014addf75"
                    },
                    "responseCode": "PERQ11r2",
                    "responseText": "1",
                    "responseOrder": 2,
                    "responseScore": 10,
                    "responseCommentary": "A large tree is located on the property – consideration to potential property valuation impact due to solar, leaf, garden degradation, safety from falling debris and exclusion zones for development. Shade is a positive aspect during summer periods. Not Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70c86f8651870014addf74"
                    },
                    "responseCode": "PERQ11r3",
                    "responseText": "2-3",
                    "responseOrder": 3,
                    "responseScore": 6,
                    "responseCommentary": "Multiple large trees are located on the property – consideration to potential property valuation impact due to solar, leaf, garden degradation, safety from falling debris and exclusion zones for development. Shade is a positive aspect during summer periods.  Bad. "
                  }, {
                    "_id": {
                      "$oid": "5b70c86f8651870014addf73"
                    },
                    "responseCode": "PERQ11r4",
                    "responseText": "4-7",
                    "responseOrder": 4,
                    "responseScore": 3,
                    "responseCommentary": "Several large trees are located on the property – consideration to potential property valuation impact due to solar, leaf, garden degradation, safety from falling debris and exclusion zones for development. Shade is a positive aspect during summer periods.  Bad."
                  }, {
                    "_id": {
                      "$oid": "5b70c86f8651870014addf72"
                    },
                    "responseCode": "PERQ11r5",
                    "responseText": "8+",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Numerous large trees are located on the property – consideration to potential property valuation impact due to solar, leaf, garden degradation, safety form falling debris and exclusion zones for development. Shade is a positive aspect during summer periods.  Bad.\n"
                  }],
                  "text": "Are there any Trees that Neighbour or are Located on the Property (>15m high)? ",
                  "questionCode": "PERQ11",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70c9bf8651870014addf78"
                  },
                  "questionCategory": "performance",
                  "questionModule": "land",
                  "questionPageOrder": 11,
                  "questionSection": "performance",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70c9bf8651870014addf7d"
                    },
                    "responseCode": "PERQ12r1",
                    "responseText": "8+",
                    "responseOrder": 1,
                    "responseScore": 11,
                    "responseCommentary": "Numerous large non-native trees are located on the property - aesthetically pleasing, deciduous trees have approximately 2 six-week cycles of leaf litter. During winter they provide good solar access, and in summer shade, however, be careful of exclusion zones. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70c9bf8651870014addf7c"
                    },
                    "responseCode": "PERQ12r2",
                    "responseText": "4-7",
                    "responseOrder": 2,
                    "responseScore": 9,
                    "responseCommentary": "Several large non-native trees are located on the property - aesthetically pleasing, deciduous trees have approximately 2 six-week cycles of leaf litter. During winter they provide good solar access, and in summer shade, however, be careful of exclusion zones. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70c9bf8651870014addf7b"
                    },
                    "responseCode": "PERQ12r3",
                    "responseText": "2-3",
                    "responseOrder": 3,
                    "responseScore": 7,
                    "responseCommentary": "Multiple large non-native trees are located on the property - aesthetically pleasing, deciduous trees have approximately 2 six-week cycles of leaf litter. During winter they provide good solar access, and in summer shade, however, be careful of exclusion zones. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70c9bf8651870014addf7a"
                    },
                    "responseCode": "PERQ12r4",
                    "responseText": "1",
                    "responseOrder": 4,
                    "responseScore": 5,
                    "responseCommentary": "A large non-native is located on the property - aesthetically pleasing, deciduous trees have approximately 2 six-week cycles of leaf litter. During winter they provide good solar access, and in summer shade, however, be careful of exclusion zones. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70c9bf8651870014addf79"
                    },
                    "responseCode": "PERQ12r5",
                    "responseText": "None",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "No large non-native tree’s on the property. Ok. "
                  }],
                  "text": "How many of the trees that Neighbour or are Located on the Property are Deciduous/Non-native (>15m high)? ",
                  "questionCode": "PERQ12",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70ca758651870014addf7f"
                  },
                  "questionCategory": "performance",
                  "questionModule": "land",
                  "questionPageOrder": 12,
                  "questionSection": "performance",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70ca758651870014addf82"
                    },
                    "responseCode": "PERQ13r1",
                    "responseText": "None",
                    "responseOrder": 1,
                    "responseScore": 20
                  }, {
                    "_id": {
                      "$oid": "5b70ca758651870014addf81"
                    },
                    "responseCode": "PERQ13r2",
                    "responseText": "1",
                    "responseOrder": 2,
                    "responseScore": 5,
                    "responseCommentary": "A large tree is located within 10m of the house – consider drainage and building issues due to roots and potential safety issues from falling debris. Bushfire zones may be able to remove the tree under special provisions. Bad. "
                  }, {
                    "_id": {
                      "$oid": "5b70ca758651870014addf80"
                    },
                    "responseCode": "PERQ13r3",
                    "responseText": ">1",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Multiple large trees are located within 10m of the house - consider drainage and building issues due to roots and potential safety issues from falling debris. Bush Fire zones may be able to remove the tree under special provisions. Bad. "
                  }],
                  "text": "Are there any Trees that are on or are within 10m of the House (>10m high)? ",
                  "questionCode": "PERQ13",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "renovated-house", "new-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70e40e36d9f70014dc9d81"
                  },
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["off-site"],
                  "applicableSuburbs": [],
                  "text": "What is the Land Size (Performance)?",
                  "questionCode": "PERQ15",
                  "questionModule": "land",
                  "questionSection": "performance",
                  "questionCategory": "performance",
                  "questionPageOrder": 14,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70e40e36d9f70014dc9d86"
                    },
                    "responseCode": "PERQ15r1",
                    "responseText": ">1800m^2",
                    "responseOrder": 1,
                    "responseScore": 45
                  }, {
                    "_id": {
                      "$oid": "5b70e40e36d9f70014dc9d85"
                    },
                    "responseCode": "PERQ152",
                    "responseText": "1451-1800m^2",
                    "responseOrder": 2,
                    "responseScore": 40
                  }, {
                    "_id": {
                      "$oid": "5b70e40e36d9f70014dc9d84"
                    },
                    "responseCode": "PERQ15r3",
                    "responseText": "951-1450m^2",
                    "responseOrder": 3,
                    "responseScore": 30
                  }, {
                    "_id": {
                      "$oid": "5b70e40e36d9f70014dc9d83"
                    },
                    "responseCode": "PERQ15r4",
                    "responseText": "750-950m^2",
                    "responseOrder": 4,
                    "responseScore": 10
                  }, {
                    "_id": {
                      "$oid": "5b70e40e36d9f70014dc9d82"
                    },
                    "responseCode": "PERQ15r5",
                    "responseText": "<750m^2",
                    "responseOrder": 5,
                    "responseScore": 0
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70e4b936d9f70014dc9d87"
                  },
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "renovated-house", "new-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is more than 15% of the land unusable due to the terrain?",
                  "questionCode": "PERQ16",
                  "questionModule": "land",
                  "questionSection": "performance",
                  "questionCategory": "performance",
                  "questionPageOrder": 15,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70e4b936d9f70014dc9d89"
                    },
                    "responseCode": "PERQ16r1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 10
                  }, {
                    "_id": {
                      "$oid": "5b70e4b936d9f70014dc9d88"
                    },
                    "responseCode": "PERQ16r2",
                    "responseText": "Yes",
                    "responseOrder": 2,
                    "responseScore": 0
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70e72436d9f70014dc9d8f"
                  },
                  "analysisTypes": ["post-new-renovated", "renovated-house", "new-house", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Are there Water Tanks on the Property? If so, what Size? (L) ",
                  "questionCode": "IMPQ1",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 22,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70e72436d9f70014dc9d93"
                    },
                    "responseCode": "IMPQ1r1",
                    "responseText": ">15,000L",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "The property has a >15,000L water tank - this provides irrigation and small job usage to the property. Consider maintenance. Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b70e72436d9f70014dc9d92"
                    },
                    "responseCode": "IMPQ1r2",
                    "responseText": "5,000-15,000L",
                    "responseOrder": 2,
                    "responseScore": 6,
                    "responseCommentary": "The property has a 5,000L -15,000L water tank -  this provides irrigation and small job usage to the property. Consider maintenance. Good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b70e72436d9f70014dc9d91"
                    },
                    "responseCode": "IMPQ1r3",
                    "responseText": "<5,000L",
                    "responseOrder": 3,
                    "responseScore": 3,
                    "responseCommentary": "The property has a <5,000L water tank - this provides irrigation and small job usage to the property. Consider maintenance. Good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b70e72436d9f70014dc9d90"
                    },
                    "responseCode": "IMPQ1r4",
                    "responseText": "None",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "No water tanks on the property. Not Good. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70e88b36d9f70014dc9d94"
                  },
                  "analysisTypes": ["post-new-renovated", "renovated-house", "new-house", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the Quality of the Garden on the Property?",
                  "questionCode": "IMPQ2",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 1,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70e88b36d9f70014dc9d99"
                    },
                    "responseCode": "IMPQ2r1",
                    "responseText": "Professional - Excellent",
                    "responseOrder": 1,
                    "responseScore": 25,
                    "responseCommentary": "Gardens are of a professional standard - health, environmental and enjoyment advantages. Consider maintenance. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70e88b36d9f70014dc9d98"
                    },
                    "responseCode": "IMPQ2r2",
                    "responseText": "Professional - Good",
                    "responseOrder": 2,
                    "responseScore": 20,
                    "responseCommentary": "Gardens are of a professional standard - health, environmental and enjoyment advantages. Consider maintenance. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70e88b36d9f70014dc9d97"
                    },
                    "responseCode": "IMPQ2r3",
                    "responseText": "Good",
                    "responseOrder": 3,
                    "responseScore": 15,
                    "responseCommentary": "Gardens are of maintained standard - health, environmental and enjoyment advantages. Consider maintenance. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70e88b36d9f70014dc9d96"
                    },
                    "responseCode": "IMPQ2r4",
                    "responseText": "Average",
                    "responseOrder": 4,
                    "responseScore": 10,
                    "responseCommentary": "Gardens are of average standard - Consider upgrades to achieve health, environmental and enjoyment advantages. Ok. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70e88b36d9f70014dc9d95"
                    },
                    "responseCode": "IMPQ2r5",
                    "responseText": "Poor",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Gardens are of below average standard - Consider upgrades to achieve health, environmental and enjoyment advantages. Prone to animal problems and ticks. Bad. \n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70ed4f36d9f70014dc9e42"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the Property have an Irrigation System?",
                  "questionCode": "IMPQ6",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 10,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70ed4f36d9f70014dc9e45"
                    },
                    "responseCode": "IMPQ6r1",
                    "responseText": "Fully Automated",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "The gardens have a fully automated irrigation system. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70ed4f36d9f70014dc9e44"
                    },
                    "responseCode": "IMPQ6r2",
                    "responseText": "Partially Automated",
                    "responseOrder": 2,
                    "responseScore": 4,
                    "responseCommentary": "The gardens have a partially automated irrigation system, consider upgrade. Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b70ed4f36d9f70014dc9e43"
                    },
                    "responseCode": "IMPQ6r3",
                    "responseText": "None",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "The gardens are not irrigated. Not Good. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70effc36d9f70014dc9e46"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["contract-addendum"],
                  "applicableSuburbs": [],
                  "text": "Does the Property have Termite Control, if so what type? ",
                  "questionCode": "IMPQ7",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 19,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70effc36d9f70014dc9e4c"
                    },
                    "responseCode": "IMPQ7r1",
                    "responseText": "Termite Chemical Soil Treatment",
                    "responseOrder": 1,
                    "responseScore": 3,
                    "responseCommentary": "The property is Termite protected by Chemical soil treatment. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70effc36d9f70014dc9e4b"
                    },
                    "responseCode": "IMPQ7r2",
                    "responseText": "Khordon",
                    "responseOrder": 2,
                    "responseScore": 3,
                    "responseCommentary": "The property is Termite protected by Khordon treatment. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70effc36d9f70014dc9e4a"
                    },
                    "responseCode": "IMPQ7r3",
                    "responseText": "Stainless Mesh",
                    "responseOrder": 3,
                    "responseScore": 3,
                    "responseCommentary": "The property is Termite protected by Stainless Steel Mesh. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70effc36d9f70014dc9e49"
                    },
                    "responseCode": "IMPQ7r4",
                    "responseText": "Graded Stone",
                    "responseOrder": 4,
                    "responseScore": 3,
                    "responseCommentary": "The property is Termite protected by Graded Stone. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70effc36d9f70014dc9e48"
                    },
                    "responseCode": "IMPQ7r5",
                    "responseText": "Termite Baiting Stations",
                    "responseOrder": 5,
                    "responseScore": 3,
                    "responseCommentary": "The property is Termite protected by Baiting Stations. Excellent . "
                  }, {
                    "_id": {
                      "$oid": "5b70effc36d9f70014dc9e47"
                    },
                    "responseCode": "IMPQ7r6",
                    "responseText": "Physical Barriers / None",
                    "responseOrder": 6,
                    "responseScore": 2,
                    "responseCommentary": "The property is Termite protected by Physical Barriers. Regular inspections are necessary. Bad. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70f08436d9f70014dc9e4d"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["contract-addendum"],
                  "applicableSuburbs": [],
                  "text": "Has the Property been Inspected in the Past 12 Months for Termite Control? ",
                  "questionCode": "IMPQ8",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 20,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70f08436d9f70014dc9e4f"
                    },
                    "responseCode": "IMPQ8r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 3,
                    "responseCommentary": "The property has been inspected for Termites in the last 12 Months. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70f08436d9f70014dc9e4e"
                    },
                    "responseCode": "IMPQ8r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The property has had no regular inspections -  The property must be inspected regularly to avoid devaluation. Bad. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70f24936d9f70014dc9e50"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the Front Yard Fence?",
                  "questionCode": "IMPQ9",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 2,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70f24936d9f70014dc9e56"
                    },
                    "responseCode": "IMPQ9r1",
                    "responseText": "Front yard fenced with Pedestrian & Electric Vehicle Gates",
                    "responseOrder": 1,
                    "responseScore": 5,
                    "responseCommentary": "Front yard fenced with Pedestrian & Electric Vehicle Gates. Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70f24936d9f70014dc9e55"
                    },
                    "responseCode": "IMPQ9r2",
                    "responseText": "Front yard fenced with Electric Vehicle gate",
                    "responseOrder": 2,
                    "responseScore": 4,
                    "responseCommentary": "Front yard fenced with Electric Vehicle gate. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70f24936d9f70014dc9e53"
                    },
                    "responseCode": "IMPQ9r3",
                    "responseText": "Front yard is fenced",
                    "responseOrder": 3,
                    "responseScore": 2,
                    "responseCommentary": "Front is Fenced. Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b70f24936d9f70014dc9e52"
                    },
                    "responseCode": "IMPQ9r4",
                    "responseText": "Needs new front yard fencing",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Needs new front fencing. Not Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70f24936d9f70014dc9e51"
                    },
                    "responseCode": "IMPQ9r5",
                    "responseText": "No fencing to front yard",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "No fencing to front yard. Not Good. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70f36a36d9f70014dc9e62"
                  },
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the Side and Rear Garden Fences?",
                  "questionCode": "IMPQ10",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 17,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70f36a36d9f70014dc9e65"
                    },
                    "responseCode": "IMPQ10r1",
                    "responseText": "Fenced and will keep",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Rear and side gardens are fenced. "
                  }, {
                    "_id": {
                      "$oid": "5b70f36a36d9f70014dc9e64"
                    },
                    "responseCode": "IMPQ10r2",
                    "responseText": "Fenced and needs some work",
                    "responseOrder": 2,
                    "responseScore": 1,
                    "responseCommentary": "Rear and side gardens are fenced but needs some work. "
                  }, {
                    "_id": {
                      "$oid": "5b70f36a36d9f70014dc9e63"
                    },
                    "responseCode": "IMPQ10r3",
                    "responseText": "Needs new fences",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "The rear and side gardens needs new fences. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70f40436d9f70014dc9e6d"
                  },
                  "analysisTypes": ["renovated-house", "new-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is the Rear Garden Dog Proof?",
                  "questionCode": "IMPQ11",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 18,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70f40436d9f70014dc9e6f"
                    },
                    "responseCode": "IMPQ11r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "The rear garden is dog proof. "
                  }, {
                    "_id": {
                      "$oid": "5b70f40436d9f70014dc9e6e"
                    },
                    "responseCode": "IMPQ11r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The rear garden is not dog proof. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70f4cf36d9f70014dc9e75"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "renovated", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "If there is a Clothesline, is it in a Sunny Position?",
                  "questionCode": "IMPQ12",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 21,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70f4cf36d9f70014dc9e78"
                    },
                    "responseCode": "IMPQ12r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "The clothesline is in a sunny position. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70f4cf36d9f70014dc9e77"
                    },
                    "responseCode": "IMPQ12r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 1,
                    "responseCommentary": "The clothesline is not in a sunny position. Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b70f4cf36d9f70014dc9e76"
                    },
                    "responseCode": "IMPQ12r3",
                    "responseText": "Not there",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "There is no clothesline. Bad. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70f72636d9f70014dc9e79"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the Driveway Finish?",
                  "questionCode": "IMPQ13",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 6,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70f72636d9f70014dc9e80"
                    },
                    "responseCode": "IMPQ13r1",
                    "responseText": "Concrete",
                    "responseOrder": 1,
                    "responseScore": 8,
                    "responseCommentary": "The driveway is Concrete - consider cracking and wear with coloured concrete. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70f72636d9f70014dc9e7f"
                    },
                    "responseCode": "IMPQ13r2",
                    "responseText": "Pavers - Loose Fit",
                    "responseOrder": 2,
                    "responseScore": 10,
                    "responseCommentary": "The driveway is Loose Fit Pavers, excellent movement and repairing qualities and ability to change. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70f72636d9f70014dc9e7e"
                    },
                    "responseCode": "IMPQ13r3",
                    "responseText": "Pavers/Tiles - Glued",
                    "responseOrder": 3,
                    "responseScore": 7,
                    "responseCommentary": "The driveway is Fixed Pavers/Tiles can be prone cracking and popping. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70f72636d9f70014dc9e7d"
                    },
                    "responseCode": "IMPQ13r4",
                    "responseText": "Bitumen",
                    "responseOrder": 4,
                    "responseScore": 6,
                    "responseCommentary": "The driveway is Bitumen - limited life span prone to melting and holes. OK. "
                  }, {
                    "_id": {
                      "$oid": "5b70f72636d9f70014dc9e7c"
                    },
                    "responseCode": "IMPQ13r5",
                    "responseText": "Gravel",
                    "responseOrder": 5,
                    "responseScore": 5,
                    "responseCommentary": "The driveway is Gravel - prone to washing away, trapping in shoes, tracking into the house and dirt. OK. "
                  }, {
                    "_id": {
                      "$oid": "5b70f72636d9f70014dc9e7b"
                    },
                    "responseCode": "IMPQ13r6",
                    "responseText": "Dirt/Grass",
                    "responseOrder": 6,
                    "responseScore": 4,
                    "responseCommentary": "The driveway is Dirt/Grass - prone to washing away, trapping in shoes, tracking into the house, General dirt. OK. "
                  }, {
                    "_id": {
                      "$oid": "5b70f72636d9f70014dc9e7a"
                    },
                    "responseCode": "IMPQ13r7",
                    "responseText": "Unknown",
                    "responseOrder": 7,
                    "responseScore": 5,
                    "responseCommentary": "The driveway finish is unknown - Data Inaccuracy.\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70f87b36d9f70014dc9e90"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "renovated", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the pathway to the Front Door?",
                  "questionCode": "IMPQ14",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 9,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70f87b36d9f70014dc9e97"
                    },
                    "responseCode": "IMPQ14r1",
                    "responseText": "Concrete",
                    "responseOrder": 1,
                    "responseScore": 8,
                    "responseCommentary": "The pathway to the house is Concrete - consider cracking and wear with coloured concrete. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70f87b36d9f70014dc9e96"
                    },
                    "responseCode": "IMPQ14r2",
                    "responseText": "Pavers - Loose Fit",
                    "responseOrder": 2,
                    "responseScore": 10,
                    "responseCommentary": "The pathway to the house is Loose Fit Pavers - excellent movement and repairing qualities and ability to change. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70f87b36d9f70014dc9e95"
                    },
                    "responseCode": "IMPQ14r3",
                    "responseText": "Pavers/Tiles - Glued",
                    "responseOrder": 3,
                    "responseScore": 7,
                    "responseCommentary": "The pathway to the house is Fixed Pavers/Tiles - consider cracking and popping. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70f87b36d9f70014dc9e94"
                    },
                    "responseCode": "IMPQ14r4",
                    "responseText": "Bitumen",
                    "responseOrder": 4,
                    "responseScore": 6,
                    "responseCommentary": "The pathway to the house is Bitumen - limited life span, prone to melting and holes. OK. "
                  }, {
                    "_id": {
                      "$oid": "5b70f87b36d9f70014dc9e93"
                    },
                    "responseCode": "IMPQ14r5",
                    "responseText": "Gravel",
                    "responseOrder": 5,
                    "responseScore": 5,
                    "responseCommentary": "The pathway to the house is Gravel - prone to washing away, trapping in shoes, tracking into the house and dirt. OK. "
                  }, {
                    "_id": {
                      "$oid": "5b70f87b36d9f70014dc9e92"
                    },
                    "responseCode": "IMPQ14r6",
                    "responseText": "Dirt/Grass",
                    "responseOrder": 6,
                    "responseScore": 4,
                    "responseCommentary": "The pathway to the house is Dirt/Grass - prone to washing away, trapping in shoes, tracking into the house, General dirt. OK. "
                  }, {
                    "_id": {
                      "$oid": "5b70f87b36d9f70014dc9e91"
                    },
                    "responseCode": "IMPQ14r7",
                    "responseText": "Unknown",
                    "responseOrder": 7,
                    "responseScore": 5,
                    "responseCommentary": "The pathway to the house finish is unknown - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70f95236d9f70014dc9e98"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the Condition of the Driveway?",
                  "questionCode": "IMPQ15",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 7,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70f95236d9f70014dc9e9d"
                    },
                    "responseCode": "IMPQ15r1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 12,
                    "responseCommentary": "The driveway is new - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70f95236d9f70014dc9e9c"
                    },
                    "responseCode": "IMPQ15r2",
                    "responseText": "Good Condition",
                    "responseOrder": 2,
                    "responseScore": 10,
                    "responseCommentary": "The driveway is in good condition - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b70f95236d9f70014dc9e9b"
                    },
                    "responseCode": "IMPQ15r3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 7,
                    "responseCommentary": "The driveway is in average condition - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b70f95236d9f70014dc9e9a"
                    },
                    "responseCode": "IMPQ15r4",
                    "responseText": "Needs some work",
                    "responseOrder": 4,
                    "responseScore": 4,
                    "responseCommentary": "The driveway needs some work - $125-$200 per m^2. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70f95236d9f70014dc9e99"
                    },
                    "responseCode": "IMPQ15r5",
                    "responseText": "Needs complete replacement",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "The driveway needs complete replacement -  $125-$200 per m^2. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b7104413bf5340014e52631"
                  },
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "renovated-house", "new-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["contract-title-search", "contract-survey"],
                  "applicableSuburbs": [],
                  "text": "What is the Land Size (Upscale)?",
                  "questionCode": "UPSQ1",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 1,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b7104413bf5340014e52637"
                    },
                    "responseCode": "UPSQ1r1",
                    "responseText": ">1800m^2",
                    "responseOrder": 1,
                    "responseScore": 70,
                    "responseCommentary": "The land size is large. Garden maintenance and costs should be considered. Overall very good. "
                  }, {
                    "_id": {
                      "$oid": "5b7104413bf5340014e52636"
                    },
                    "responseCode": "UPSQ1r2",
                    "responseText": "1451-1800m^2",
                    "responseOrder": 2,
                    "responseScore": 50,
                    "responseCommentary": "The land size is large. Garden maintenance and costs should be considered. Overall very good. "
                  }, {
                    "_id": {
                      "$oid": "5b7104413bf5340014e52635"
                    },
                    "responseCode": "UPSQ1r3",
                    "responseText": "1101-1450m^2",
                    "responseOrder": 3,
                    "responseScore": 50,
                    "responseCommentary": "The land size is good, the perfect land size is 1100m2 for a big family home. Garden maintenance and costs should be considered. Overall very good. "
                  }, {
                    "_id": {
                      "$oid": "5b7104413bf5340014e52634"
                    },
                    "responseCode": "UPSQ1r4",
                    "responseText": "951-1100m^2",
                    "responseOrder": 4,
                    "responseScore": 7,
                    "responseCommentary": "The land size is good, this is the perfect size for a large family home in the suburbs. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b7104413bf5340014e52633"
                    },
                    "responseCode": "UPSQ1r5",
                    "responseText": "750-950m^2",
                    "responseOrder": 5,
                    "responseScore": -5,
                    "responseCommentary": "Land below 950m2 may be restrictive in building size. Careful consideration should be given to future development as it may be restricted or difficult due to land size. \n"
                  }, {
                    "_id": {
                      "$oid": "5b7104413bf5340014e52632"
                    },
                    "responseCode": "UPSQ1r6",
                    "responseText": "<750m^2",
                    "responseOrder": 6,
                    "responseScore": -15,
                    "responseCommentary": "Land below 750m2 may be restrictive in building size. Careful consideration should be given to future development as it may be restricted or difficult due to land size. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b7105a73bf5340014e52638"
                  },
                  "analysisTypes": ["knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Pool",
                  "questionCode": "UPSQ11",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 56,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "5b58193c1e574500148a5e8f",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b7105a73bf5340014e5263a"
                    },
                    "responseCode": "UPSQ11r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Pool - YES"
                  }, {
                    "_id": {
                      "$oid": "5b7105a73bf5340014e52639"
                    },
                    "responseCode": "UPSQ11r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Pool - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b7105e73bf5340014e5263b"
                  },
                  "analysisTypes": ["unrenovated", "post-new-renovated", "renovated-house", "new-house", "knockdown-rebuild"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Tennis Court",
                  "questionCode": "UPSQ12",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 55,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b7105e73bf5340014e5263d"
                    },
                    "responseCode": "UPSQ12r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 40,
                    "responseCommentary": "Tennis Court - YES"
                  }, {
                    "_id": {
                      "$oid": "5b7105e73bf5340014e5263c"
                    },
                    "responseCode": "UPSQ12r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Tennis Court - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b7106413bf5340014e5263e"
                  },
                  "analysisTypes": ["knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Granny Flat",
                  "questionCode": "UPSQ13",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 58,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b7106413bf5340014e52640"
                    },
                    "responseCode": "UPSQ13r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Granny Flat - YES"
                  }, {
                    "_id": {
                      "$oid": "5b7106413bf5340014e5263f"
                    },
                    "responseCode": "UPSQ13r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Granny Flat - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b7106a03bf5340014e52641"
                  },
                  "analysisTypes": ["knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Poolhouse/Cabana",
                  "questionCode": "UPSQ14",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 57,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105a73bf5340014e52638",
                  "dependentResponseId": "5b7105a73bf5340014e5263a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b7106a03bf5340014e52643"
                    },
                    "responseCode": "UPSQ14r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Poolhouse/Cabana - YES"
                  }, {
                    "_id": {
                      "$oid": "5b7106a03bf5340014e52642"
                    },
                    "responseCode": "UPSQ14r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Poolhouse/Cabana - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b7108cd3bf5340014e52644"
                  },
                  "analysisTypes": ["knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["contract-addendum"],
                  "applicableSuburbs": [],
                  "text": "Does the pool have a compliance certificate?",
                  "questionCode": "UPSQ2",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 3,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105a73bf5340014e52638",
                  "dependentResponseId": "5b7105a73bf5340014e5263a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b7108cd3bf5340014e52646"
                    },
                    "responseCode": "UPSQ2r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 3,
                    "responseCommentary": "The pool has a compliance certificate. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b7108cd3bf5340014e52645"
                    },
                    "responseCode": "UPSQ2r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The pool does not have compliance certificate and the works noted must be completed in the statutory time. Not good. Cost and Aesthetic impacts should be considered. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b7109723bf5340014e52647"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": [],
                  "applicableSuburbs": [],
                  "text": "Is the pool heated, if so, what type?",
                  "questionCode": "UPSQ3",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 4,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105a73bf5340014e52638",
                  "dependentResponseId": "5b7105a73bf5340014e5263a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b7109723bf5340014e5264a"
                    },
                    "responseCode": "UPSQ3r1",
                    "responseText": "Solar",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Solar heating works by running tubes on the roof full of water, Electricity costs around 50c/h for the pump and leaks on the roof can cause roof of gutter problems depending on construction material. "
                  }, {
                    "_id": {
                      "$oid": "5b7109723bf5340014e52649"
                    },
                    "responseCode": "UPSQ3r2",
                    "responseText": "Gas",
                    "responseOrder": 2,
                    "responseScore": 1,
                    "responseCommentary": "Gas is rapid heating although can be expensive to run perhaps $4 per hour on natural gas. "
                  }, {
                    "_id": {
                      "$oid": "5b7109723bf5340014e52648"
                    },
                    "responseCode": "UPSQ3r3",
                    "responseText": "No",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "No pool heating. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b7109da3bf5340014e5264b"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is the filtration system more than 5 years old?",
                  "questionCode": "UPSQ4",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 5,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105a73bf5340014e52638",
                  "dependentResponseId": "5b7105a73bf5340014e5263a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b7109da3bf5340014e5264d"
                    },
                    "responseCode": "UPSQ4r1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 3,
                    "responseCommentary": "Filtration system is under 5 years and relatively new - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b7109da3bf5340014e5264c"
                    },
                    "responseCode": "UPSQ4r2",
                    "responseText": "Yes",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Filtration system over 5 years is out of warranty and the pumps and other equipment may need replacing. These can be expensive if the old system isn't working correctly it means more maintenance and chemicals. Not Good. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b710b013bf5340014e5264e"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the pool have an automated cleaning system? (not connected to the skimmer box)",
                  "questionCode": "UPSQ5",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 6,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105a73bf5340014e52638",
                  "dependentResponseId": "5b7105a73bf5340014e5263a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b710b013bf5340014e52650"
                    },
                    "responseCode": "UPSQ5r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "The pool has an integrated cleaning system. "
                  }, {
                    "_id": {
                      "$oid": "5b710b013bf5340014e5264f"
                    },
                    "responseCode": "UPSQ5r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The pool doesn’t have an integrated cleaning system meaning time will be needed, possible 5h/week. Robotic cleaners are the best option. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b710b8a3bf5340014e52651"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "How impacted is the pool by shade",
                  "questionCode": "UPSQ6",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 7,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105a73bf5340014e52638",
                  "dependentResponseId": "5b7105a73bf5340014e5263a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b710b8a3bf5340014e52655"
                    },
                    "responseCode": "UPSQ6r1",
                    "responseText": "Low",
                    "responseOrder": 1,
                    "responseScore": 4,
                    "responseCommentary": "The pool has low shade. "
                  }, {
                    "_id": {
                      "$oid": "5b710b8a3bf5340014e52653"
                    },
                    "responseCode": "UPSQ6r2",
                    "responseText": "Medium",
                    "responseOrder": 2,
                    "responseScore": 2,
                    "responseCommentary": "The pool shade is moderate and consideration should be given as it effects the chemistry and temperature of the water, in turn affecting the useability. "
                  }, {
                    "_id": {
                      "$oid": "5b710b8a3bf5340014e52652"
                    },
                    "responseCode": "UPSQ6r3",
                    "responseText": "High",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "The pool shade is high and consideration should be given as it effects the chemistry and temperature of the water, in turn affecting the useability. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b710cb73bf5340014e52656"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "How impacted is the pool by leaves",
                  "questionCode": "UPSQ7",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 8,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105a73bf5340014e52638",
                  "dependentResponseId": "5b7105a73bf5340014e5263a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b710cb73bf5340014e52659"
                    },
                    "responseCode": "UPSQ7r1",
                    "responseText": "Low",
                    "responseOrder": 1,
                    "responseScore": 4,
                    "responseCommentary": "The pool has low impact from leaves. "
                  }, {
                    "_id": {
                      "$oid": "5b710cb73bf5340014e52658"
                    },
                    "responseCode": "UPSQ7r2",
                    "responseText": "Medium",
                    "responseOrder": 2,
                    "responseScore": 2,
                    "responseCommentary": "The pool is moderately impacted by leaves, consideration should be given as maintenance to manual pool skimming, cleaning filters & skimmer boxes. Emptying auto cleaners and chemical imbalances with prevalent algae. "
                  }, {
                    "_id": {
                      "$oid": "5b710cb73bf5340014e52657"
                    },
                    "responseCode": "UPSQ7r3",
                    "responseText": "High",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "The pool is greatly impacted by leaves, consideration should be given as maintenance to manual  pool skimming, cleaning filters & skimmer boxes. Emptying auto cleaners and chemical imbalances with prevalent algae. Bad."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b710dad3bf5340014e52661"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the pool fence",
                  "questionCode": "UPSQ16",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 9,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105a73bf5340014e52638",
                  "dependentResponseId": "5b7105a73bf5340014e5263a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b710dad3bf5340014e52667"
                    },
                    "responseCode": "UPSQ16r1",
                    "responseText": "Glass",
                    "responseOrder": 1,
                    "responseScore": 3
                  }, {
                    "_id": {
                      "$oid": "5b710dad3bf5340014e52666"
                    },
                    "responseCode": "UPSQ16r2",
                    "responseText": "Glass & Metal",
                    "responseOrder": 2,
                    "responseScore": 2
                  }, {
                    "_id": {
                      "$oid": "5b710dad3bf5340014e52665"
                    },
                    "responseCode": "UPSQ16r3",
                    "responseText": "Metal",
                    "responseOrder": 3,
                    "responseScore": 1
                  }, {
                    "_id": {
                      "$oid": "5b710dad3bf5340014e52664"
                    },
                    "responseCode": "UPSQ16r4",
                    "responseText": "Needs replacing due to age",
                    "responseOrder": 4,
                    "responseScore": 0
                  }, {
                    "_id": {
                      "$oid": "5b710dad3bf5340014e52663"
                    },
                    "responseCode": "UPSQ16r5",
                    "responseText": "No Pool Fence",
                    "responseOrder": 5,
                    "responseScore": 0
                  }, {
                    "_id": {
                      "$oid": "5b710dad3bf5340014e52662"
                    },
                    "responseCode": "UPSQ16r6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 1
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b710ff03bf5340014e52668"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the finish and condition of the pool",
                  "questionCode": "UPSQ17",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 10,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105a73bf5340014e52638",
                  "dependentResponseId": "5b7105a73bf5340014e5263a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b710ff03bf5340014e52671"
                    },
                    "responseCode": "UPSQ17r1",
                    "responseText": "Tile - Good condition",
                    "responseOrder": 1,
                    "responseScore": 3
                  }, {
                    "_id": {
                      "$oid": "5b710ff03bf5340014e52670"
                    },
                    "responseCode": "UPSQ17r2",
                    "responseText": "Tile - Needs work",
                    "responseOrder": 2,
                    "responseScore": 1
                  }, {
                    "_id": {
                      "$oid": "5b710ff03bf5340014e5266f"
                    },
                    "responseCode": "UPSQ17r3",
                    "responseText": "Aggregate - Good condition",
                    "responseOrder": 3,
                    "responseScore": 2
                  }, {
                    "_id": {
                      "$oid": "5b710ff03bf5340014e5266e"
                    },
                    "responseCode": "UPSQ17r4",
                    "responseText": "Aggregate - Needs work",
                    "responseOrder": 4,
                    "responseScore": 0
                  }, {
                    "_id": {
                      "$oid": "5b710ff03bf5340014e5266d"
                    },
                    "responseCode": "UPSQ17r5",
                    "responseText": "Plaster/Render - Good condition",
                    "responseOrder": 5,
                    "responseScore": 2
                  }, {
                    "_id": {
                      "$oid": "5b710ff03bf5340014e5266c"
                    },
                    "responseCode": "UPSQ17r6",
                    "responseText": "Plaster/Render - Needs work",
                    "responseOrder": 6,
                    "responseScore": 0
                  }, {
                    "_id": {
                      "$oid": "5b710ff03bf5340014e5266b"
                    },
                    "responseCode": "UPSQ17r7",
                    "responseText": "Other - Good condition",
                    "responseOrder": 7,
                    "responseScore": 2
                  }, {
                    "_id": {
                      "$oid": "5b710ff03bf5340014e5266a"
                    },
                    "responseCode": "UPSQ17r8",
                    "responseText": "Other - Needs work",
                    "responseOrder": 8,
                    "responseScore": 0
                  }, {
                    "_id": {
                      "$oid": "5b710ff03bf5340014e52669"
                    },
                    "responseCode": "UPSQ17r9",
                    "responseText": "Unknown",
                    "responseOrder": 9,
                    "responseScore": 1
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b7110fe3bf5340014e52698"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the finish of the pool sunning area",
                  "questionCode": "UPSQ18",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 11,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105a73bf5340014e52638",
                  "dependentResponseId": "5b7105a73bf5340014e5263a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b7110fe3bf5340014e5269d"
                    },
                    "responseCode": "UPSQ18r1",
                    "responseText": "Tiles",
                    "responseOrder": 1,
                    "responseScore": 0
                  }, {
                    "_id": {
                      "$oid": "5b7110fe3bf5340014e5269c"
                    },
                    "responseCode": "UPSQ18r2",
                    "responseText": "Pavers",
                    "responseOrder": 2,
                    "responseScore": 0
                  }, {
                    "_id": {
                      "$oid": "5b7110fe3bf5340014e5269b"
                    },
                    "responseCode": "UPSQ18r3",
                    "responseText": "Timber",
                    "responseOrder": 3,
                    "responseScore": 0
                  }, {
                    "_id": {
                      "$oid": "5b7110fe3bf5340014e5269a"
                    },
                    "responseCode": "UPSQ18r4",
                    "responseText": "Concrete",
                    "responseOrder": 4,
                    "responseScore": 0
                  }, {
                    "_id": {
                      "$oid": "5b7110fe3bf5340014e52699"
                    },
                    "responseCode": "UPSQ18r5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 0
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b7111d73bf5340014e526a9"
                  },
                  "analysisTypes": ["renovated-house", "new-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the condition of the pool sunning area",
                  "questionCode": "UPSQ19",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 12,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105a73bf5340014e52638",
                  "dependentResponseId": "5b7105a73bf5340014e5263a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b7111d73bf5340014e526ae"
                    },
                    "responseCode": "UPSQ19r1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 3
                  }, {
                    "_id": {
                      "$oid": "5b7111d73bf5340014e526ad"
                    },
                    "responseCode": "UPSQ19r2",
                    "responseText": "Good condition",
                    "responseOrder": 2,
                    "responseScore": 2
                  }, {
                    "_id": {
                      "$oid": "5b7111d73bf5340014e526ac"
                    },
                    "responseCode": "UPSQ19r3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 1
                  }, {
                    "_id": {
                      "$oid": "5b7111d73bf5340014e526ab"
                    },
                    "responseCode": "UPSQ19r4",
                    "responseText": "Needs some work",
                    "responseOrder": 4,
                    "responseScore": 0
                  }, {
                    "_id": {
                      "$oid": "5b7111d73bf5340014e526aa"
                    },
                    "responseCode": "UPSQ19r5",
                    "responseText": "Needs complete replacement",
                    "responseOrder": 5,
                    "responseScore": 0
                  }, {
                    "_id": {
                      "$oid": "5b7111f33bf5340014e526b0"
                    },
                    "responseCode": "UPSQ19r6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 1
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b7112923bf5340014e526bc"
                  },
                  "analysisTypes": ["knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is it an all weather tennis court",
                  "questionCode": "UPSQ8",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 14,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105e73bf5340014e5263b",
                  "dependentResponseId": "5b7105e73bf5340014e5263d",
                  "responses": [{
                    "_id": {
                      "$oid": "5b7112923bf5340014e526be"
                    },
                    "responseCode": "UPSQ8r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Tennis court is an all weather, synthetic finish, maintenance is required with cleaning and sand replacement on a yearly basis. "
                  }, {
                    "_id": {
                      "$oid": "5b7112923bf5340014e526bd"
                    },
                    "responseCode": "UPSQ8r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 15,
                    "responseCommentary": "Concrete & Clay courts are not all weather. Maintenance for clay is difficult and expensive. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b7113333bf5340014e526bf"
                  },
                  "analysisTypes": ["knockdown-rebuild", "new-house", "post-new-renovated", "renovated-house", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the tennis court have lights?",
                  "questionCode": "UPSQ9",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 15,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105e73bf5340014e5263b",
                  "dependentResponseId": "5b7105e73bf5340014e5263d",
                  "responses": [{
                    "_id": {
                      "$oid": "5b7113333bf5340014e526c1"
                    },
                    "responseCode": "UPSQ9r1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Lights are a huge bonus as getting development approval is very difficult. Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b7113333bf5340014e526c0"
                    },
                    "responseCode": "UPSQ9r2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The tennis court does not have lights and get development approval can not be achieved. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b7114073bf5340014e526c7"
                  },
                  "analysisTypes": ["knockdown-rebuild", "new-house", "renovated-house", "renovated", "post-new-renovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "How big is the granny flat",
                  "questionCode": "UPSQ10",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 17,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7106413bf5340014e5263e",
                  "dependentResponseId": "5b7106413bf5340014e52640",
                  "responses": [{
                    "_id": {
                      "$oid": "5b7114073bf5340014e526ca"
                    },
                    "responseCode": "UPSQ10r1",
                    "responseText": ">75m^2",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "The property has a large granny flat, the rent potential is excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b7114073bf5340014e526c9"
                    },
                    "responseCode": "UPSQ10r2",
                    "responseText": "31-75m^2",
                    "responseOrder": 2,
                    "responseScore": 15,
                    "responseCommentary": "The property has an average sized granny flat, the rent potential is ok. "
                  }, {
                    "_id": {
                      "$oid": "5b7114073bf5340014e526c8"
                    },
                    "responseCode": "UPSQ10r3",
                    "responseText": "<30m^2",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "The property has a small sized granny flat, the rent potential is poor."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70dff636d9f70014dc9d79"
                  },
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Are any of the neighbours ground floors more than 2m higher than your private open spaces?",
                  "questionCode": "PERQ14",
                  "questionModule": "land",
                  "questionSection": "performance",
                  "questionCategory": "performance",
                  "questionPageOrder": 6,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70dff636d9f70014dc9d7b"
                    },
                    "responseCode": "PERQ14r1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "The property lacks overlooking windows - good privacy. Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70dff636d9f70014dc9d7a"
                    },
                    "responseCode": "PERQ14r2",
                    "responseText": "Yes",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The property is overlooked by window access - consider privacy issues. Not Good. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b77623b0c75290014ee2aae"
                  },
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is there more than 1 Pedestrian Access? ",
                  "questionCode": "PERQ4",
                  "questionModule": "land",
                  "questionSection": "performance",
                  "questionCategory": "performance",
                  "questionPageOrder": 4,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b77623b0c75290014ee2ab0"
                    },
                    "responseCode": "PERQ4R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 5,
                    "responseCommentary": "The property has a second Pedestrian access point. Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b77623b0c75290014ee2aaf"
                    },
                    "responseCode": "PERQ4R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The property has Pedestrian access point. Good. \n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b95e9925de5160015738e93"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the covering of the Outdoor Entertaining Area?",
                  "questionCode": "DLQ57",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "architecture",
                  "questionPageOrder": 11,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b849a4a2978bb001484ba75",
                  "dependentResponseId": "5b849a4a2978bb001484ba77",
                  "responses": [{
                    "_id": {
                      "$oid": "5b95e9925de5160015738e97"
                    },
                    "responseCode": "DLQ57R1",
                    "responseText": "Fully Integrated with House Structure",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Outdoor Entertaining Area - Has a built in roof - Excellent.\n"
                  }, {
                    "_id": {
                      "$oid": "5b95e9925de5160015738e96"
                    },
                    "responseCode": "DLQ57R2",
                    "responseText": "Pergola Style Cover",
                    "responseOrder": 2,
                    "responseScore": 10,
                    "responseCommentary": "Outdoor Entertaining Area - Has a Pergola style roof, cheaper construction - consider rain, heat and general weather problems - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b95e9925de5160015738e95"
                    },
                    "responseCode": "DLQ57R3",
                    "responseText": "Not Covered",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Outdoor Entertaining Area - Is not covered - Consider rain, heat and general weather problems - OK."
                  }, {
                    "_id": {
                      "$oid": "5b95e9925de5160015738e94"
                    },
                    "responseCode": "DLQ57R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 10,
                    "responseCommentary": "Outdoor Entertaining Area - Unknown cover - Data Inaccuracy. \n"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b88ad578579db0014409cee"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the main aspect of the Outdoor Entertaining Area ?",
                  "questionCode": "DLQ55",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "architecture",
                  "questionPageOrder": 30,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b849a4a2978bb001484ba75",
                  "dependentResponseId": "5b849a4a2978bb001484ba77",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88ae7b8579db0014409cf8"
                    },
                    "responseCode": "DLQ54R1",
                    "responseText": "North",
                    "responseOrder": 1,
                    "responseScore": 8,
                    "responseCommentary": "Outdoor Entertaining Area: North Aspect - Excellent.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88afa58579db0014409d05"
                    },
                    "responseCode": "DLQ54R3",
                    "responseText": "East",
                    "responseOrder": 3,
                    "responseScore": 4,
                    "responseCommentary": "Outdoor Entertaining Area: East Aspect - Good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88afa58579db0014409d04"
                    },
                    "responseCode": "DLQ54R8",
                    "responseText": "South",
                    "responseOrder": 8,
                    "responseScore": 0,
                    "responseCommentary": "Outdoor Entertaining Area: South Aspect - Consider minimal sun during winter as well as cold and damp living conditions - Not good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88afa58579db0014409d03"
                    },
                    "responseCode": "DLQ54R5",
                    "responseText": "West",
                    "responseOrder": 5,
                    "responseScore": 2,
                    "responseCommentary": "Outdoor Entertaining Area: West Aspect - Consider screening as afternoon sun is extreme - Not good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88afa58579db0014409d02"
                    },
                    "responseCode": "DLQ54R9",
                    "responseText": "Unknown",
                    "responseOrder": 9,
                    "responseScore": 4,
                    "responseCommentary": "Outdoor Entertaining Area: Unknown aspect - Data Inaccuracy\n"
                  }, {
                    "_id": {
                      "$oid": "5b98a6e6b0892300151dc5e7"
                    },
                    "responseCode": "DLQ54R2",
                    "responseText": "North-East",
                    "responseOrder": 2,
                    "responseScore": 6,
                    "responseCommentary": "Outdoor Entertaining Area: North-East Aspect - Excellent.\n"
                  }, {
                    "_id": {
                      "$oid": "5b98a6e6b0892300151dc5e6"
                    },
                    "responseCode": "DLQ54R4",
                    "responseText": "North-West",
                    "responseOrder": 4,
                    "responseScore": 4,
                    "responseCommentary": "Outdoor Entertaining Area: North-West Aspect - Good."
                  }, {
                    "_id": {
                      "$oid": "5b98a6e6b0892300151dc5e5"
                    },
                    "responseCode": "DLQ54R6",
                    "responseText": "South-East",
                    "responseOrder": 6,
                    "responseScore": 0,
                    "responseCommentary": "Outdoor Entertaining Area: South-East Aspect - Consider minimal sun during winter as well as cold and damp living conditions - Not good."
                  }, {
                    "_id": {
                      "$oid": "5b98a6e6b0892300151dc5e4"
                    },
                    "responseCode": "DLQ54R7",
                    "responseText": "South-West",
                    "responseOrder": 7,
                    "responseScore": 0,
                    "responseCommentary": "Outdoor Entertaining Area: South-West Aspect - Consider minimal sun during winter as well as cold and damp living conditions - Not good.\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b9e1afecc75a50015a324c7"
                  },
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the Property have outside/opposite one of it boundaries on the Verge an Electrical Transformer (Big Green Box) ?",
                  "questionCode": "PERQ17",
                  "questionModule": "land",
                  "questionSection": "performance",
                  "questionCategory": "performance",
                  "questionPageOrder": 17,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b9e1afecc75a50015a324c8"
                    },
                    "responseCode": "PERQ17R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Street transformer - YES - Located on or outside the boundary is Electrical Street transformer. consider possible side effects and price devaluation. Not Good"
                  }, {
                    "_id": {
                      "$oid": "5b9e2139049b6b00150fdf51"
                    },
                    "responseCode": "PERQ17R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 10,
                    "responseCommentary": "Street transformer - NO  Located on or outside the boundary."
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b9e21d5049b6b00150fdf55"
                  },
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is the land located on a Road T Intersection ?",
                  "questionCode": "PERQ18",
                  "questionModule": "land",
                  "questionSection": "performance",
                  "questionCategory": "performance",
                  "questionPageOrder": 18,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b9e21d5049b6b00150fdf56"
                    },
                    "responseCode": "PERQ18R1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "T Intersection - No"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b9e22542a86ba00154a8b5f"
                  },
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is the land located on T Intersection ?",
                  "questionCode": "PERQ19",
                  "questionModule": "land",
                  "questionSection": "performance",
                  "questionCategory": "performance",
                  "questionPageOrder": 0,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b9e22542a86ba00154a8b60"
                    },
                    "responseCode": "PERQ19R1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "T Intersection - No"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b70aa208651870014addd91"
                  },
                  "questionCategory": "planning",
                  "questionModule": "land",
                  "questionPageOrder": 2,
                  "questionSection": "planning",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70aa208651870014addd93"
                    },
                    "responseCode": "PLAQ2R1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "The boards sewer is not located on the property - Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70aa208651870014addd92"
                    },
                    "responseCode": "PLAQ2R2",
                    "responseText": "Yes",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The boards sewer is located on the property -  restrictions are associated with the location boards sewer. Not Good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b947688427b890015a106bf"
                    },
                    "responseCode": "PLAQ2R2",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Boards Sewer: Location Unknown Data Inaccuracy\n"
                  }],
                  "text": "Is the Boards Sewer Located on the Property?",
                  "questionCode": "PLAQ2",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": [{
                    "_id": "5b70b7a38651870014addeed",
                    "code": "on-site",
                    "text": "On-Site"
                  }, "contract-sewer-diagram"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70ae058651870014addda4"
                  },
                  "questionCategory": "planning",
                  "questionModule": "land",
                  "questionPageOrder": 5,
                  "questionSection": "planning",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70ae058651870014addda6"
                    },
                    "responseCode": "PLAQ5R1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "The property is not located in a draft or heritage conservation area -  Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b70ae058651870014addda5"
                    },
                    "responseCode": "PLAQ5R2",
                    "responseText": "Yes",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The property is in a draft or heritage conservation area -  Development has restrictions, rules and regulations. Not Good. \n\n"
                  }],
                  "text": "Is the Property in a Conservation Area? ",
                  "questionCode": "PLAQ5",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": [{
                    "_id": "5b70b7d68651870014addf12",
                    "code": "on-site",
                    "text": "On-Site"
                  }, "contract-planning-certificate"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b70b7858651870014added4"
                  },
                  "questionCategory": "planning",
                  "questionModule": "land",
                  "questionPageOrder": 6,
                  "questionSection": "planning",
                  "responses": [{
                    "_id": {
                      "$oid": "5b70b7858651870014added6"
                    },
                    "responseCode": "PLAQ6r1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "The property is not located in a bushfire zone -  Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b70b7858651870014added5"
                    },
                    "responseCode": "PLAQ6r2",
                    "responseText": "Yes",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "The property is in a bushfire zone - Development has specific rules and regulations, increasing costs to building and insurance. Not Good. \n"
                  }],
                  "text": "Is the Property Bushfire Prone Land?",
                  "questionCode": "PLAQ6",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": [{
                    "_id": "5b70b9cb8651870014addf2a",
                    "code": "on-site",
                    "text": "On-Site"
                  }, "contract-planning-certificate"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b6f57eb0f59760014643e80"
                  },
                  "questionCategory": "topography",
                  "questionModule": "land",
                  "questionPageOrder": 7,
                  "questionSection": "topography",
                  "responses": [{
                    "_id": {
                      "$oid": "5b6f57eb0f59760014643e84"
                    },
                    "responseCode": "TOPQ6R1",
                    "responseText": "North",
                    "responseOrder": 1,
                    "responseScore": 125,
                    "responseCommentary": "The property has a North to rear aspect – In winter the angle of the sun is low and high in the summer, The North aspect is the best to take advantage of this solar access and range, providing warmth and light in winter and coolness with shade in summer. Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b6f57eb0f59760014643e83"
                    },
                    "responseCode": "TOPQ6R3",
                    "responseText": "East",
                    "responseOrder": 3,
                    "responseScore": 30,
                    "responseCommentary": "The property has an East to rear aspect – in winter morning sun will bring light and warmth. In Summer, the early morning solar access brings light with the heat of the afternoon sheltered, although evenings come early. Good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b6f57eb0f59760014643e82"
                    },
                    "responseCode": "TOPQ6R5",
                    "responseText": "West",
                    "responseOrder": 5,
                    "responseScore": 20,
                    "responseCommentary": "The property has a West to rear aspect – with no morning sun and only the hot afternoon sun, good tree cover or blinds and awnings will be required on windows and living areas facing west. Not Good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b6f57eb0f59760014643e81"
                    },
                    "responseCode": "TOPQ6R8",
                    "responseText": "South",
                    "responseOrder": 8,
                    "responseScore": 10,
                    "responseCommentary": "The property has a South to rear aspect – the winter sun is entirely removed from this aspect, limited solar access means coldness, dampness and light impacts which will affect living conditions. Bad.\n"
                  }, {
                    "_id": {
                      "$oid": "5b98a4e4b0892300151dc5d6"
                    },
                    "responseCode": "TOPQ6R7",
                    "responseText": "South-West",
                    "responseOrder": 7,
                    "responseScore": 15,
                    "responseCommentary": "The property has a South-West to rear aspect – the winter sun is entirely removed except for later afternoon sun, limited solar access means coldness, dampness and light impacts which will affect living conditions. Bad."
                  }, {
                    "_id": {
                      "$oid": "5b98a4e4b0892300151dc5d5"
                    },
                    "responseCode": "TOPQ6R6",
                    "responseText": "South-East",
                    "responseOrder": 6,
                    "responseScore": 15,
                    "responseCommentary": "The property has a South-East to rear aspect – the winter sun is entirely removed except for earlier morning sun, limited solar access means coldness, dampness and light impacts which will affect living conditions. Bad."
                  }, {
                    "_id": {
                      "$oid": "5b98a4e4b0892300151dc5d4"
                    },
                    "responseCode": "TOPQ6R2",
                    "responseText": "North-East",
                    "responseOrder": 2,
                    "responseScore": 90,
                    "responseCommentary": "The property has a North-East to rear aspect – In winter the angle of the sun is low and high in the summer. The North aspect is the best to take advantage of this solar access and range, providing warmth and light in winter and coolness with shade in summer. Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b98a4e4b0892300151dc5d3"
                    },
                    "responseCode": "TOPQ6R4",
                    "responseText": "North-West",
                    "responseOrder": 4,
                    "responseScore": 30,
                    "responseCommentary": "The property has a North-West to rear aspect – A North aspect is the best to take advantage of this solar access and range, providing warmth and light in winter and coolness with shade in summer. The North-West aspect tends to exacerbate the afternoon and limit the early morning sun. "
                  }],
                  "text": "What Aspect is the Rear of the Property ? ",
                  "questionCode": "TOPQ7",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site", "contract-survey", "contract-title-search"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b809434d28bce001404d0ce"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is it difficult to get through the front gates/boundary and/or into any of the car spaces in garage/carport?",
                  "questionCode": "DESQ53",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 8,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b809434d28bce001404d0d1"
                    },
                    "responseCode": "desq53r1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Driveway Access - Through the front gates into the garage is Good\n"
                  }, {
                    "_id": {
                      "$oid": "5b809434d28bce001404d0d0"
                    },
                    "responseCode": "desq53r2",
                    "responseText": "Yes",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Driveway Access - Difficulties have been flagged entering gates or into the garage, consider damage to cars property and people. Not good\n"
                  }, {
                    "_id": {
                      "$oid": "5b809434d28bce001404d0cf"
                    },
                    "responseCode": "desq53r3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "Driveway Access - Unknown  -  Data Inaccuracy. \n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b5eca8a4ecb5a0014e2cb06"
                  },
                  "questionCategory": "street-traffic-parking",
                  "questionModule": "location",
                  "questionPageOrder": 1,
                  "questionSection": "street-traffic-parking",
                  "responses": [{
                    "_id": {
                      "$oid": "5b5eca8a4ecb5a0014e2cb07"
                    },
                    "responseCode": "TRAQ1R1",
                    "responseText": "Low",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "No Traffic congestion during peak times. "
                  }, {
                    "_id": {
                      "$oid": "5b5eca8a4ecb5a0014e2cb08"
                    },
                    "responseCode": "TRAQ1R3",
                    "responseText": "Medium",
                    "responseOrder": 3,
                    "responseScore": 3,
                    "responseCommentary": "Moderate Traffic congestion during peak times. "
                  }, {
                    "_id": {
                      "$oid": "5b5eca8a4ecb5a0014e2cb09"
                    },
                    "responseCode": "TRAQ1R5",
                    "responseText": "High",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "High Traffic congestion during peak times. "
                  }, {
                    "_id": {
                      "$oid": "5b9795590351390015895899"
                    },
                    "responseCode": "TRAQ1R2",
                    "responseText": "Low-Medium",
                    "responseOrder": 2,
                    "responseScore": 6,
                    "responseCommentary": "Low to Moderate Traffic congestion during peak times. "
                  }, {
                    "_id": {
                      "$oid": "5b9795590351390015895898"
                    },
                    "responseCode": "TRAQ1R4",
                    "responseText": "Medium - High",
                    "responseOrder": 4,
                    "responseScore": 2,
                    "responseCommentary": "Medium - High Traffic congestion during peak times. "
                  }],
                  "text": "What is the level of traffic during peak periods ?",
                  "questionCode": "TRAQ1",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b5818281e574500148a5e89"
                  },
                  "questionCategory": "street-aesthetics",
                  "questionModule": "location",
                  "questionPageOrder": 2,
                  "questionSection": "street-aesthetics",
                  "responses": [{
                    "_id": {
                      "$oid": "5b5818281e574500148a5e8b"
                    },
                    "responseCode": "AESQ2R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "The street has a planned consistent tree species on at least one side - Nice"
                  }, {
                    "_id": {
                      "$oid": "5b5818281e574500148a5e8a"
                    },
                    "responseCode": "AESQ2R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 2,
                    "responseCommentary": "The street has no planned consistent tree species - OK"
                  }],
                  "text": "Does the street have a consistent, planned tree species?",
                  "questionCode": "AESQ2",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": [{
                    "_id": "5b6b78553e8c8200144f467e",
                    "code": "on-site",
                    "text": "On-Site"
                  }],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": ""
                },
                {
                  "_id": {
                    "$oid": "5b5818b71e574500148a5e8c"
                  },
                  "questionCategory": "street-aesthetics",
                  "questionModule": "location",
                  "questionPageOrder": 3,
                  "questionSection": "street-aesthetics",
                  "responses": [{
                    "_id": {
                      "$oid": "5b5818b71e574500148a5e8e"
                    },
                    "responseCode": "AESQ3R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "The street has constant mature large trees on at least one side - Nice\n"
                  }, {
                    "_id": {
                      "$oid": "5b5818b71e574500148a5e8d"
                    },
                    "responseCode": "AESQ3R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 2,
                    "responseCommentary": "The street has no constant mature large trees. - OK\n"
                  }],
                  "text": "On one side of the street, do 80% of the surrounding properties have a tree greater than 15m (the height of a power pole) on the verge or just inside the fence?",
                  "questionCode": "AESQ3",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "post-new-renovated", "renovated-house", "new-house", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": ""
                },
                {
                  "_id": {
                    "$oid": "5b57a7251e574500148a5b23"
                  },
                  "questionCategory": "street-traffic-parking",
                  "questionModule": "location",
                  "questionPageOrder": 4,
                  "questionSection": "street-traffic-parking",
                  "responses": [{
                    "_id": {
                      "$oid": "5b57a7251e574500148a5b25"
                    },
                    "responseCode": "TRAQ4r2",
                    "responseText": "Medium",
                    "responseOrder": 2,
                    "responseScore": 2,
                    "responseCommentary": "Possible parking problems during peak periods. "
                  }, {
                    "_id": {
                      "$oid": "5b57a7251e574500148a5b26"
                    },
                    "responseCode": "TRAQ4r1",
                    "responseText": "Low",
                    "responseOrder": 1,
                    "responseScore": 8,
                    "responseCommentary": "Good parking during peak periods. "
                  }, {
                    "_id": {
                      "$oid": "5b57a7251e574500148a5b24"
                    },
                    "responseCode": "TRAQ4r3",
                    "responseText": "High",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Parking is an issue during peak periods. "
                  }],
                  "text": "How much parking congestion during peak periods",
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "__v": 0,
                  "dependentResponseId": "",
                  "questionCode": "TRAQ4",
                  "adjustmentQuestion": false,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "detailedSurveyQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b58193c1e574500148a5e8f"
                  },
                  "questionCategory": "street-aesthetics",
                  "questionModule": "location",
                  "questionPageOrder": 4,
                  "questionSection": "street-aesthetics",
                  "responses": [{
                    "_id": {
                      "$oid": "5b58193c1e574500148a5e91"
                    },
                    "responseCode": "AESQ4R1",
                    "responseText": "Non-Native (Deciduous)",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "The majority of trees in the streetscape are deciduous. This is a better option as it allows many colours throughout the year and allows light in the winter months due to loss of leaves - Overall very good"
                  }, {
                    "_id": {
                      "$oid": "5b6b902bc43dc40014e005d6"
                    },
                    "responseCode": "AESQ4Rr3",
                    "responseText": "None",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "The streetscape has no trees. - Low street appeal"
                  }, {
                    "_id": {
                      "$oid": "5b58193c1e574500148a5e90"
                    },
                    "responseCode": "AESQ4R2",
                    "responseText": "Native",
                    "responseOrder": 2,
                    "responseScore": 2,
                    "responseCommentary": "The streetscape is dominated by native trees. Large natives are a problem as they they drop leaves, limbs, sap and don't allow light through. Consider damage to cars - OK"
                  }, {
                    "_id": {
                      "$oid": "5b95aa815de51600157383ce"
                    },
                    "responseCode": "AESQ4R4",
                    "responseText": "Mixed",
                    "responseOrder": 4,
                    "responseScore": 7,
                    "responseCommentary": "The streetscape has a mixture of natives and non-natives. Allows colour, light whilst still encompassing the local, native environment - Good"
                  }],
                  "text": "Are the majority of trees native or non-native in the street?",
                  "questionCode": "AESQ4",
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": false,
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "dependentResponseId": "",
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b835500c47e4d00140794e5"
                  },
                  "analysisTypes": ["knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the condition of the granny flat?",
                  "questionCode": "UPSQ15",
                  "questionModule": "land",
                  "questionSection": "bonus",
                  "questionCategory": "bonus",
                  "questionPageOrder": 19,
                  "detailedSurveyQuestion": false,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7106413bf5340014e5263e",
                  "dependentResponseId": "5b7106413bf5340014e52640",
                  "responses": [{
                    "_id": {
                      "$oid": "5b835500c47e4d00140794ea"
                    },
                    "responseCode": "UPSQ15R1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Granny Flat - New.  Statuary Structural warranty is 6 years, 2 years non structural or manufacturers period . Excellent   \n"
                  }, {
                    "_id": {
                      "$oid": "5b835500c47e4d00140794e9"
                    },
                    "responseCode": "upsq15r2",
                    "responseText": "Good Condition",
                    "responseOrder": 2,
                    "responseScore": 8,
                    "responseCommentary": "Granny Flat - Condition is good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b835500c47e4d00140794e8"
                    },
                    "responseCode": "UPSQ15r3",
                    "responseText": "Needs some Renovating",
                    "responseOrder": 3,
                    "responseScore": 6,
                    "responseCommentary": "Granny Flat - Needs some work. \n"
                  }, {
                    "_id": {
                      "$oid": "5b835500c47e4d00140794e7"
                    },
                    "responseCode": "UPSQ15R4",
                    "responseText": "Needs complete Renovation",
                    "responseOrder": 4,
                    "responseScore": 6,
                    "responseCommentary": "Granny Flat - Needs to be renovated.  Allow $18,000-$25,000 per bathroom, $15,000 -$25000 per bathroom, $1800/m2 for other areas\n"
                  }, {
                    "_id": {
                      "$oid": "5b835500c47e4d00140794e6"
                    },
                    "responseCode": "UPSQ15R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 5,
                    "responseCommentary": "Granny Flat -  Unknown Condition -  Data Inaccuracy. \n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b848ea42978bb001484ba69"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Kitchen",
                  "questionCode": "DLQ10",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 22,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b848ea42978bb001484ba6b"
                    },
                    "responseCode": "DLQ10R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Kitchen - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b848ea42978bb001484ba6a"
                    },
                    "responseCode": "DLQ10R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Kitchen - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84992d2978bb001484ba6f"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Meals/Dining Area",
                  "questionCode": "DLQ12",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 26,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84992d2978bb001484ba71"
                    },
                    "responseCode": "DLQ12R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Meal Area - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b84992d2978bb001484ba70"
                    },
                    "responseCode": "DLQ12R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Meal Area - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b8499a22978bb001484ba72"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Family/Living Room",
                  "questionCode": "DLQ13",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 27,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8499a22978bb001484ba74"
                    },
                    "responseCode": "DLQ13R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Family Room - YES"
                  }, {
                    "_id": {
                      "$oid": "5b8499a22978bb001484ba73"
                    },
                    "responseCode": "DLQ13R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Family Room - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b849a4a2978bb001484ba75"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Outdoor Entertaining Area",
                  "questionCode": "DLQ14",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 29,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b849a4a2978bb001484ba77"
                    },
                    "responseCode": "DLQ14R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Outdoor Entertaining Area - YES"
                  }, {
                    "_id": {
                      "$oid": "5b849a4a2978bb001484ba76"
                    },
                    "responseCode": "DLQ14R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": -10,
                    "responseCommentary": "Outdoor Entertaining Area - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b849b202978bb001484ba78"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "How many rooms have access to a balcony, larger than 8m2, (Do not include area of the Kitchen/Family)?",
                  "questionCode": "INQ02",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 52,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b849b202978bb001484ba7a"
                    },
                    "responseCode": "INQ02R1",
                    "responseText": "1",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Balconies - YES -  1 room lead to a balcony and is Larger than 8m2, positive health & outdoor interaction - Good\n"
                  }, {
                    "_id": {
                      "$oid": "5b849b202978bb001484ba79"
                    },
                    "responseCode": "INQ02R2",
                    "responseText": "2",
                    "responseOrder": 2,
                    "responseScore": 20,
                    "responseCommentary": "Balconies - YES -  2 rooms lead to a balcony and is Larger than 8m2, positive health & outdoor interaction - Good"
                  }, {
                    "_id": {
                      "$oid": "5b84acaf2978bb001484ba81"
                    },
                    "responseCode": "INQ02R3",
                    "responseText": "3",
                    "responseOrder": 3,
                    "responseScore": 30,
                    "responseCommentary": "Balconies - YES -  3 rooms lead to a balcony and is Larger than 8m2, positive health & outdoor interaction - Good"
                  }, {
                    "_id": {
                      "$oid": "5b84ace72978bb001484ba88"
                    },
                    "responseCode": "INQ02R4",
                    "responseText": "4",
                    "responseOrder": 4,
                    "responseScore": 40,
                    "responseCommentary": "Balconies - YES -  4 rooms lead to a balcony and is Larger than 8m2, positive health & outdoor interaction - Good"
                  }, {
                    "_id": {
                      "$oid": "5b852a0998937e00148e0ba1"
                    },
                    "responseCode": "INQ02R5",
                    "responseText": "None",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Balconies - NO -  No rooms lead to a balcony that is Larger than 8m2. - OK"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b84d67b2978bb001484ba90"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Powder Room (Main Guest Toilet/Toilet Only)",
                  "questionCode": "INQ03",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "architecture",
                  "questionPageOrder": 32.4,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84d67b2978bb001484ba92"
                    },
                    "responseCode": "INQ03R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Powder Room - Yes - Good design feature, toilet for guests - Excellent\n"
                  }, {
                    "_id": {
                      "$oid": "5b84d67b2978bb001484ba91"
                    },
                    "responseCode": "INQ03R1",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Powder Room - NO - Good floor plans have a separate toilet for Guest use, A room to make an impression, kept generally clean due to toilet usage only.  Not Good\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84dd992978bb001484ba98"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Main Bathroom 1",
                  "questionCode": "DLQ17",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 32.5,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84dd992978bb001484ba9a"
                    },
                    "responseCode": "DLQ17R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 3,
                    "responseCommentary": "Main Bathroom - YES"
                  }, {
                    "_id": {
                      "$oid": "5b84dd992978bb001484ba99"
                    },
                    "responseCode": "DLQ17R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Main Bathroom - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84df282978bb001484ba9b"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bathroom 2",
                  "questionCode": "DLQ18",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 33,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84dd992978bb001484ba98",
                  "dependentResponseId": "5b84dd992978bb001484ba9a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84df282978bb001484ba9d"
                    },
                    "responseCode": "DLQ18R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Bathroom 2 - YES"
                  }, {
                    "_id": {
                      "$oid": "5b84df282978bb001484ba9c"
                    },
                    "responseCode": "DLQ18R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Bathroom 2 - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84e0712978bb001484ba9e"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bathroom 3",
                  "questionCode": "DLQ19",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 34,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84df282978bb001484ba9b",
                  "dependentResponseId": "5b84df282978bb001484ba9d",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84e0712978bb001484baa0"
                    },
                    "responseCode": "DLQ19R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Bathroom 3 - YES"
                  }, {
                    "_id": {
                      "$oid": "5b84e0712978bb001484ba9f"
                    },
                    "responseCode": "DLQ19R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Bathroom 3 - No"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84e1542978bb001484baa1"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Master Ensuite ",
                  "questionCode": "INQ04",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 38,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84e1542978bb001484baa3"
                    },
                    "responseCode": "INQ04R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 15,
                    "responseCommentary": "Master Ensuite - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b84e1542978bb001484baa2"
                    },
                    "responseCode": "INQ04R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Master Ensuite - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84e6432978bb001484baa4"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 2 Ensuite ",
                  "questionCode": "INQ05",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 41,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84f78e2978bb001484babd",
                  "dependentResponseId": "5b84f78e2978bb001484babf",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84e6432978bb001484baa6"
                    },
                    "responseCode": "INQ05R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Ensuite 2 - YES"
                  }, {
                    "_id": {
                      "$oid": "5b84e6432978bb001484baa5"
                    },
                    "responseCode": "INQ05R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Ensuite 2 - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84ea832978bb001484baa7"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 3 Ensuite ",
                  "questionCode": "INQ06",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 44,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84fecd2978bb001484bad6",
                  "dependentResponseId": "5b84fecd2978bb001484bad8",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84ea832978bb001484baa8"
                    },
                    "responseCode": "INQ06R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Ensuite 3 - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b84eb042978bb001484baaa"
                    },
                    "responseCode": "INQ06R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Ensuite 3 - No"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84ee412978bb001484bab8"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Separate Toilet 1 (WC)",
                  "questionCode": "DLQ23",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 35,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84ee412978bb001484bab9"
                    },
                    "responseCode": "DLQ23R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 1,
                    "responseCommentary": "Separate Toilet - YES"
                  }, {
                    "_id": {
                      "$oid": "5b85245825ac1800144a0fd9"
                    },
                    "responseCode": "DLQ23R1",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Separate Toilet - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84f44a2978bb001484baba"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Separate Toilet 2 (WC)",
                  "questionCode": "DLQ24",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 36,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84ee412978bb001484bab8",
                  "dependentResponseId": "5b84ee412978bb001484bab9",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84f44a2978bb001484babc"
                    },
                    "responseCode": "DLQ24R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 1,
                    "responseCommentary": "Separate Toilet 2 - YES"
                  }, {
                    "_id": {
                      "$oid": "5b84f44a2978bb001484babb"
                    },
                    "responseCode": "DLQ24R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Separate Toilet 2 - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84f78e2978bb001484babd"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Master Bedroom (Bed 1)",
                  "questionCode": "DLQ25",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 37,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84f78e2978bb001484babf"
                    },
                    "responseCode": "DLQ25R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Master Bedroom - YES"
                  }, {
                    "_id": {
                      "$oid": "5b84f78e2978bb001484babe"
                    },
                    "responseCode": "DLQ25R1",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Master Bedroom - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84f8812978bb001484bac0"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Master Walk in Wardrobe ",
                  "questionCode": "INQ07",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 39,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84f8812978bb001484bac2"
                    },
                    "responseCode": "INQ07R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 15,
                    "responseCommentary": "Master Walk in Wardrobe - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b84f8812978bb001484bac1"
                    },
                    "responseCode": "INQ07R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Master Walk in Wardrobe - No"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84fb9d2978bb001484bac3"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 2 Walk in Wardrobe ",
                  "questionCode": "INQ08",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 42,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84fe2b2978bb001484bace",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84fb9d2978bb001484bac5"
                    },
                    "responseCode": "INQ08R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Walk in Wardrobe - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b84fb9d2978bb001484bac4"
                    },
                    "responseCode": "INQ08R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Walk in Wardrobe - No"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84fd922978bb001484bacb"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Guest Bedroom",
                  "questionCode": "DLQ28",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 48,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84fd922978bb001484bacd"
                    },
                    "responseCode": "DLQ28R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Guest Bedroom - YES"
                  }, {
                    "_id": {
                      "$oid": "5b84fd922978bb001484bacc"
                    },
                    "responseCode": "DLQ28R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Guest Bedroom - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84fe2b2978bb001484bace"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 2",
                  "questionCode": "DLQ29",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 40,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84f78e2978bb001484babd",
                  "dependentResponseId": "5b84f78e2978bb001484babf",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84fe2b2978bb001484bad0"
                    },
                    "responseCode": "DLQ29R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 5,
                    "responseCommentary": "Bed 2 - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b84fe2b2978bb001484bacf"
                    },
                    "responseCode": "DLQ28R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Bed 2 - No"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84fecd2978bb001484bad6"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 3",
                  "questionCode": "DLQ30",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 43,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84fe2b2978bb001484bace",
                  "dependentResponseId": "5b84fe2b2978bb001484bad0",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84fecd2978bb001484bad8"
                    },
                    "responseCode": "DLQ30R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 5,
                    "responseCommentary": "Bed 3 - YES"
                  }, {
                    "_id": {
                      "$oid": "5b84fecd2978bb001484bad7"
                    },
                    "responseCode": "DLQ30R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Bed 3 - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b84ffe92978bb001484bad9"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 4",
                  "questionCode": "DLQ31",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 45,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84fecd2978bb001484bad6",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b84ffe92978bb001484badb"
                    },
                    "responseCode": "DLQ31R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 5,
                    "responseCommentary": "Bed 4 - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b84ffe92978bb001484bada"
                    },
                    "responseCode": "DLQ31R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Bed 4 - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b8500d02978bb001484badc"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Studio/Teen Retreat",
                  "questionCode": "DLQ32",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 53,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8500d02978bb001484bade"
                    },
                    "responseCode": "DLQ32R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Studio - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b8500d02978bb001484badd"
                    },
                    "responseCode": "DLQ32R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Studio - NO "
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b8501862978bb001484badf"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Other Room 1",
                  "questionCode": "DLQ33",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 50,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8501862978bb001484bae0"
                    },
                    "responseCode": "DLQ33R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Other Room 1 - YES"
                  }, {
                    "_id": {
                      "$oid": "5b8501d22978bb001484bae2"
                    },
                    "responseCode": "DLQ33R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Other Room 1 - No "
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b851eca25ac1800144a0fa8"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "unrenovated", "post-new-renovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Ground Floor",
                  "questionCode": "DLQ34",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 2,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b851eca25ac1800144a0fa9"
                    },
                    "responseCode": "DR34R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Ground Floor - Yes"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b851f7025ac1800144a0faa"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "1st Floor",
                  "questionCode": "DLQ35",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 3.1,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b851eca25ac1800144a0fa8",
                  "dependentResponseId": "5b851eca25ac1800144a0fa9",
                  "responses": [{
                    "_id": {
                      "$oid": "5b851f7025ac1800144a0fab"
                    },
                    "responseCode": "DLQ35R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "1st Floor - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b851fde25ac1800144a0fb0"
                    },
                    "responseCode": "DLQ35R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "1st Floor - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b85211525ac1800144a0fb7"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "3rd Floor",
                  "questionCode": "DLQ37",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 3.3,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b85205025ac1800144a0fb4",
                  "dependentResponseId": "5b85205025ac1800144a0fb6",
                  "responses": [{
                    "_id": {
                      "$oid": "5b85211525ac1800144a0fb9"
                    },
                    "responseCode": "DLQ37R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": -15,
                    "responseCommentary": "3rd Floor - Yes"
                  }, {
                    "_id": {
                      "$oid": "5b85211525ac1800144a0fb8"
                    },
                    "responseCode": "DL37QR1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "3rd Floor - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b2f27391a3c7a09e059dc33"
                  },
                  "dependentQuestionTrue": [],
                  "responses": [{
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199b4"
                    },
                    "responseCode": "SURQ2r1",
                    "responseText": "Grand",
                    "responseOrder": 1,
                    "responseScore": 30,
                    "responseCommentary": "A high number of Grand homes, Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199b5"
                    },
                    "responseCode": "SURQ2r2",
                    "responseText": "Big",
                    "responseOrder": 2,
                    "responseScore": 25,
                    "responseCommentary": "Big homes. Very Good\n"
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199b6"
                    },
                    "responseCode": "SURQ2r3",
                    "responseText": "Established",
                    "responseOrder": 3,
                    "responseScore": 20,
                    "responseCommentary": "Homes are established, a stable environment. Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199b7"
                    },
                    "responseCode": "SURQ2r4",
                    "responseText": "Mixed",
                    "responseOrder": 4,
                    "responseScore": 15,
                    "responseCommentary": "Houses are mixed, understand core features in assessment for potential. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247200b8"
                    },
                    "responseCode": "SURQ2r5",
                    "responseText": "Underdeveloped",
                    "responseOrder": 5,
                    "responseScore": 9,
                    "responseCommentary": "Homes are  underdeveloped, understand core features in assessment for potential. "
                  }, {
                    "_id": {
                      "$oid": "5b21c8f5a1adf000247199b9"
                    },
                    "responseCode": "SURQ2r6",
                    "responseText": "Poor",
                    "responseOrder": 6,
                    "responseScore": 6,
                    "responseCommentary": "Homes are Poor, Careful consideration understand core features in assessment for potential. "
                  }],
                  "questionCode": "SURQ2",
                  "text": "Which description best suits the surrounding homes?",
                  "questionSection": "street-surrounding-real-estate",
                  "questionCategory": "street-surrounding-real-estate",
                  "questionModule": "location",
                  "questionPageOrder": 2,
                  "dependentResponseId": "",
                  "adjustmentQuestion": false,
                  "detailedSurveyQuestion": true,
                  "analysisTypes": [{
                    "_id": "5b67deb885358b00147ab23a",
                    "text": "New"
                  }, "knockdown-rebuild", "vacant-land", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "__v": 0,
                  "applicableSuburbs": [],
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b85c68298937e00148e0d3d"
                  },
                  "analysisTypes": ["knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "When was the original house built ?",
                  "questionCode": "DLQ38",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "architecture",
                  "questionPageOrder": 2,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b85c68298937e00148e0d43"
                    },
                    "responseCode": "DLQ38R1",
                    "responseText": "Less than 7 years ago.",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Built 7 years ago (New)"
                  }, {
                    "_id": {
                      "$oid": "5b85c68298937e00148e0d42"
                    },
                    "responseCode": "DLQ38R2",
                    "responseText": "2000-2010",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Built in the noughties"
                  }, {
                    "_id": {
                      "$oid": "5b85c68298937e00148e0d41"
                    },
                    "responseCode": "DLQ38R3",
                    "responseText": "1990-2000",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Built in the 90's"
                  }, {
                    "_id": {
                      "$oid": "5b85c68298937e00148e0d40"
                    },
                    "responseCode": "DLQ38R4",
                    "responseText": "1980-1990",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Built in the 80's"
                  }, {
                    "_id": {
                      "$oid": "5b85c68298937e00148e0d3f"
                    },
                    "responseCode": "DLQ38R5",
                    "responseText": "1970-1980",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Built in the 70's"
                  }, {
                    "_id": {
                      "$oid": "5b85c68298937e00148e0d3e"
                    },
                    "responseCode": "DLQ38R6",
                    "responseText": "1960-1970",
                    "responseOrder": 6,
                    "responseScore": 0,
                    "responseCommentary": "built in the 60's"
                  }, {
                    "_id": {
                      "$oid": "5b85cd1498937e00148e0e0a"
                    },
                    "responseCode": "DLQ38R7",
                    "responseText": "1930-1960",
                    "responseOrder": 7,
                    "responseScore": 0,
                    "responseCommentary": "Built Early to mid 19th century."
                  }, {
                    "_id": {
                      "$oid": "5b85cdaa98937e00148e0e19"
                    },
                    "responseCode": "DLQ38R8",
                    "responseText": "1900-1930",
                    "responseOrder": 8,
                    "responseScore": 0,
                    "responseCommentary": "Built - Turn of the 19th century"
                  }, {
                    "_id": {
                      "$oid": "5b85cedc98937e00148e0e50"
                    },
                    "responseCode": "DLQ38R9",
                    "responseText": "Pre 1900",
                    "responseOrder": 9,
                    "responseScore": 0,
                    "responseCommentary": "Built in 18th century."
                  }, {
                    "_id": {
                      "$oid": "5b8decde71eaa10014f14cec"
                    },
                    "responseCode": "DLQ38R10",
                    "responseText": "Unknown",
                    "responseOrder": 10,
                    "responseScore": 0,
                    "responseCommentary": "Built -  Unknown Data Inaccuracy"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b85eb2298937e00148e0f0f"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What is the build quality of the original structure?",
                  "questionCode": "QCQ01",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "architecture",
                  "questionPageOrder": 41,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b85eb2298937e00148e0f13"
                    },
                    "responseCode": "QC01R1",
                    "responseText": "Project builder - Basic Build Quality (In it's time)",
                    "responseOrder": 1,
                    "responseScore": 125,
                    "responseCommentary": "Build Quality - Basic (Project Build)"
                  }, {
                    "_id": {
                      "$oid": "5b85eb2298937e00148e0f12"
                    },
                    "responseCode": "QCQ39R2",
                    "responseText": "Designer Project Builder - Good Build Quality (In it's time)",
                    "responseOrder": 2,
                    "responseScore": 180,
                    "responseCommentary": "Build Quality - Good Quality (Designer project Build)"
                  }, {
                    "_id": {
                      "$oid": "5b85eb2298937e00148e0f11"
                    },
                    "responseCode": "QCQ39R3",
                    "responseText": "Custom Architecturally Designed - High Build Quality (In it's time)",
                    "responseOrder": 3,
                    "responseScore": 220,
                    "responseCommentary": "Build Quality - High (Architectural Build ) "
                  }, {
                    "_id": {
                      "$oid": "5b85eb2298937e00148e0f10"
                    },
                    "responseCode": "QCQ39R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 110,
                    "responseCommentary": "Build Quality - Unknown - Data Inaccuracy"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b85ee6798937e00148e0f14"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site", "floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Additional Off-Street Car Parking (excluding Garage & Carport)",
                  "questionCode": "DLQ40",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 11,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b85ee6798937e00148e0f16"
                    },
                    "responseCode": "DLQ01R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 5,
                    "responseCommentary": "Off Street Car Parking - YES"
                  }, {
                    "_id": {
                      "$oid": "5b85ee6798937e00148e0f15"
                    },
                    "responseCode": "DLQ01R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Off Street Car Parking - NO"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b86047c98937e00148e10e8"
                  },
                  "analysisTypes": ["new-house", "knockdown-rebuild", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What is the architectural style of the house ?",
                  "questionCode": "DLQ41",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "architecture",
                  "questionPageOrder": 1,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b86047c98937e00148e10eb"
                    },
                    "responseCode": "DLQ41R2",
                    "responseText": "Modern/Contemporary",
                    "responseOrder": 7,
                    "responseScore": 0,
                    "responseCommentary": "Architectural Style - Modern/Contemporary\n"
                  }, {
                    "_id": {
                      "$oid": "5b86047c98937e00148e10ea"
                    },
                    "responseCode": "DLQ41R1",
                    "responseText": "Contemporary Styles 2000 onwards",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Architectural Style - Contemporary Styles 2000 onwards\n"
                  }, {
                    "_id": {
                      "$oid": "5b86047c98937e00148e10e9"
                    },
                    "responseCode": "DLQ41R3",
                    "responseText": "Mock Federation",
                    "responseOrder": 8,
                    "responseScore": 0,
                    "responseCommentary": "Architectural Style - Mock Federation\n"
                  }, {
                    "_id": {
                      "$oid": "5b860d7f98937e00148e114c"
                    },
                    "responseCode": "DLQ41R4",
                    "responseText": "Dutch Colonial",
                    "responseOrder": 9,
                    "responseScore": 0,
                    "responseCommentary": "Architectural Style - Colonial\n"
                  }, {
                    "_id": {
                      "$oid": "5b860d7f98937e00148e114b"
                    },
                    "responseCode": "DLQ41R5",
                    "responseText": "Late twentieth century 1960-2000",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Architectural Style - Late twentieth Century 1960-2000\n"
                  }, {
                    "_id": {
                      "$oid": "5b860d7f98937e00148e114a"
                    },
                    "responseCode": "DLQ41R6",
                    "responseText": "Post War Period 1940-1960",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Architectural Style - Post War Face brickwork home.\n\n"
                  }, {
                    "_id": {
                      "$oid": "5b860d7f98937e00148e1149"
                    },
                    "responseCode": "DLQ41R7",
                    "responseText": "Inter - War Period 1915 - 1940",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Architectural Style - Inter - War Period 1915 - 1940  \n"
                  }, {
                    "_id": {
                      "$oid": "5b860d7f98937e00148e1148"
                    },
                    "responseCode": "DLQ41R8",
                    "responseText": "Federation Period 1890-1915",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Architectural Style - Federation Period 1890-1915\n"
                  }, {
                    "_id": {
                      "$oid": "5b860d7f98937e00148e1147"
                    },
                    "responseCode": "DLQ41R9",
                    "responseText": "Victorian Period 1840 -1890",
                    "responseOrder": 6,
                    "responseScore": 0,
                    "responseCommentary": "Architectural Style - Victorian Period 1840 -1890\n\n "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b861d0c98937e00148e11d8"
                  },
                  "analysisTypes": ["knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What is the total Floor area of the house including verandahs (excluding Garages/Granny Flats)",
                  "questionCode": "DLQ42",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 1,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8624e598937e00148e12ee"
                    },
                    "responseCode": "DLQ42R1",
                    "responseText": ">500m2",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Total Floor Area - >500M2"
                  }, {
                    "_id": {
                      "$oid": "5b8624e598937e00148e12ed"
                    },
                    "responseCode": "DLQ42R2",
                    "responseText": "401-500m2",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Total Floor Area - 401-500m2"
                  }, {
                    "_id": {
                      "$oid": "5b8624e598937e00148e12ec"
                    },
                    "responseCode": "DLQ42R3",
                    "responseText": "351-400m2",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Total Floor Area - 351-400m2\n"
                  }, {
                    "_id": {
                      "$oid": "5b8624e598937e00148e12eb"
                    },
                    "responseCode": "DLQ42R4",
                    "responseText": "301-350m2",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Total Floor Area - 301-350m2"
                  }, {
                    "_id": {
                      "$oid": "5b8624e598937e00148e12ea"
                    },
                    "responseCode": "DLQ42R5",
                    "responseText": "251-300m2",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Total Floor Area - 251-300m2\n"
                  }, {
                    "_id": {
                      "$oid": "5b8624e598937e00148e12e9"
                    },
                    "responseCode": "DLQ42R6",
                    "responseText": "200-250m2",
                    "responseOrder": 6,
                    "responseScore": 0,
                    "responseCommentary": "Total Floor Area - 200-250m2"
                  }, {
                    "_id": {
                      "$oid": "5b8626bd98937e00148e1367"
                    },
                    "responseCode": "DLQ42R7",
                    "responseText": "140-200m2",
                    "responseOrder": 7,
                    "responseScore": 0,
                    "responseCommentary": "Total Floor Area - 140-200m2"
                  }, {
                    "_id": {
                      "$oid": "5b8626bd98937e00148e1366"
                    },
                    "responseCode": "DLQ42R8",
                    "responseText": "<140m2",
                    "responseOrder": 8,
                    "responseScore": 0,
                    "responseCommentary": "Total Floor Area - <140m2"
                  }, {
                    "_id": {
                      "$oid": "5b8626bd98937e00148e1365"
                    },
                    "responseCode": "DLQ42R9",
                    "responseText": "Unknown",
                    "responseOrder": 9,
                    "responseScore": 0,
                    "responseCommentary": "Total Floor Area - Unknown Data Inaccuracy"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b862fe298937e00148e1470"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What is the total Floor area of the Studio/Teen Retreat including  verandahs ",
                  "questionCode": "DESQ43",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 54,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8500d02978bb001484badc",
                  "dependentResponseId": "5b8500d02978bb001484bade",
                  "responses": [{
                    "_id": {
                      "$oid": "5b862fe298937e00148e1471"
                    },
                    "responseCode": "DESQ43R1",
                    "responseText": ">36m2",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Total Floor Area - >36M2"
                  }, {
                    "_id": {
                      "$oid": "5b86341698937e00148e1478"
                    },
                    "responseCode": "DESQ43R2",
                    "responseText": "20-36m2",
                    "responseOrder": 2,
                    "responseScore": 2,
                    "responseCommentary": "Total Floor Area - 20-36m2"
                  }, {
                    "_id": {
                      "$oid": "5b86341698937e00148e1477"
                    },
                    "responseCode": "DESQ43R3",
                    "responseText": "<20m2",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Total Floor Area - <20m2"
                  }, {
                    "_id": {
                      "$oid": "5b86341698937e00148e1476"
                    },
                    "responseCode": "DESQ43R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 1,
                    "responseCommentary": "Total Floor Area - Unknown\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b86378698937e00148e147e"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Is there External Access in the Laundry?",
                  "questionCode": "DLQ44",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 20,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b848dd92978bb001484ba66",
                  "dependentResponseId": "5b848dd92978bb001484ba68",
                  "responses": [{
                    "_id": {
                      "$oid": "5b86381298937e00148e1481"
                    },
                    "responseCode": "DLQ44R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Laundry External Access - YES - Excellent.\n"
                  }, {
                    "_id": {
                      "$oid": "5b86381298937e00148e1480"
                    },
                    "responseCode": "DLQ44R2",
                    "responseText": "No ",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Laundry External Access - NO - Not good.\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b86417198937e00148e1604"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What Type of a Garage ?",
                  "questionCode": "DLQ46",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 7,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b836e7bc47e4d00140795a2",
                  "dependentResponseId": "5b836e7bc47e4d00140795a4",
                  "responses": [{
                    "_id": {
                      "$oid": "5b86417198937e00148e1608"
                    },
                    "responseCode": "DLQ46R1",
                    "responseText": "Basement/Underneath Structure",
                    "responseOrder": 1,
                    "responseScore": 25,
                    "responseCommentary": "Garage - Basement/Underneath Structure -consider pumping and potential flooding and water egress. Good\n"
                  }, {
                    "_id": {
                      "$oid": "5b86417198937e00148e1607"
                    },
                    "responseCode": "DLQ46R2",
                    "responseText": "Attached",
                    "responseOrder": 2,
                    "responseScore": 30,
                    "responseCommentary": "Garage - Attached, considering good internal access, safety, security and aesthetically pleasing - Excellent"
                  }, {
                    "_id": {
                      "$oid": "5b86417198937e00148e1606"
                    },
                    "responseCode": "DLQ46R3",
                    "responseText": "Separate",
                    "responseOrder": 3,
                    "responseScore": 20,
                    "responseCommentary": "Garage - Separate, consider getting wet from garage to house, security and position on the land. - Good\n"
                  }, {
                    "_id": {
                      "$oid": "5b86417198937e00148e1605"
                    },
                    "responseCode": "DLQ46R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 15,
                    "responseCommentary": "Garage - Unknown - Data Inaccuracy\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b863cb998937e00148e14ec"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Do you have to access the Laundry externally?",
                  "questionCode": "DLQ45",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 21,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b86378698937e00148e147e",
                  "dependentResponseId": "5b86381298937e00148e1481",
                  "responses": [{
                    "_id": {
                      "$oid": "5b863cb998937e00148e14ee"
                    },
                    "responseCode": "DLQ45R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Laundry Accessed Only Externally - YES :  Consider Inconvenience, weather, wet socks, dirt and mud entering house - Not Good\n"
                  }, {
                    "_id": {
                      "$oid": "5b863cb998937e00148e14ed"
                    },
                    "responseCode": "DLQ45R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 8,
                    "responseCommentary": "Laundry Accessed Only Externally - NO : Excellent\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b8654cb98937e00148e1656"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "How many car spaces in the Garage? ",
                  "questionCode": "DLQ47",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 8,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b836e7bc47e4d00140795a2",
                  "dependentResponseId": "5b836e7bc47e4d00140795a4",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8654cb98937e00148e165b"
                    },
                    "responseCode": "DLQ47R1",
                    "responseText": "1",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Garage - Spaces 1\n"
                  }, {
                    "_id": {
                      "$oid": "5b8654cb98937e00148e165a"
                    },
                    "responseCode": "DLQ47R2",
                    "responseText": "2",
                    "responseOrder": 2,
                    "responseScore": 4,
                    "responseCommentary": "Garage - Spaces 2\n"
                  }, {
                    "_id": {
                      "$oid": "5b8654cb98937e00148e1659"
                    },
                    "responseCode": "DLQ47R3",
                    "responseText": "3",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Garage - Spaces 3\n"
                  }, {
                    "_id": {
                      "$oid": "5b8654cb98937e00148e1658"
                    },
                    "responseCode": "DLQ47R4",
                    "responseText": "4 or more",
                    "responseOrder": 4,
                    "responseScore": 6,
                    "responseCommentary": "Garage - Spaces 4 or more\n"
                  }, {
                    "_id": {
                      "$oid": "5b8654cb98937e00148e1657"
                    },
                    "responseCode": "DLQ47R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 3,
                    "responseCommentary": "Garage - Spaces Unknown - Data inaccuracy\n\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b86578c98937e00148e1667"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "How many car spaces in the Carport?",
                  "questionCode": "DLQ48",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 10,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8489da2978bb001484ba59",
                  "dependentResponseId": "5b8489da2978bb001484ba5b",
                  "responses": [{
                    "_id": {
                      "$oid": "5b86578c98937e00148e166c"
                    },
                    "responseCode": "DLQ48R1",
                    "responseText": "1",
                    "responseOrder": 1,
                    "responseScore": 1,
                    "responseCommentary": "Carport - Spaces 1\n"
                  }, {
                    "_id": {
                      "$oid": "5b86578c98937e00148e166b"
                    },
                    "responseCode": "DLQ48R2",
                    "responseText": "2",
                    "responseOrder": 2,
                    "responseScore": 2,
                    "responseCommentary": "Carport - Spaces 2\n"
                  }, {
                    "_id": {
                      "$oid": "5b86578c98937e00148e166a"
                    },
                    "responseCode": "DLQ48R3",
                    "responseText": "3",
                    "responseOrder": 3,
                    "responseScore": 3,
                    "responseCommentary": "Carport - Spaces 3\n"
                  }, {
                    "_id": {
                      "$oid": "5b86578c98937e00148e1669"
                    },
                    "responseCode": "DLQ48R4",
                    "responseText": "4 or more",
                    "responseOrder": 4,
                    "responseScore": 4,
                    "responseCommentary": "Garage - Spaces 4 or more\n"
                  }, {
                    "_id": {
                      "$oid": "5b86578c98937e00148e1668"
                    },
                    "responseCode": "DLQ48R5",
                    "responseText": "Unknown ",
                    "responseOrder": 5,
                    "responseScore": 3,
                    "responseCommentary": "Carport - Spaces Unknown - Data inaccuracy\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b8659f998937e00148e1678"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "How many Additional Off-Street car spaces (not including garage/carport)",
                  "questionCode": "DLQ49",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 12,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b85ee6798937e00148e0f14",
                  "dependentResponseId": "5b85ee6798937e00148e0f16",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8659f998937e00148e167d"
                    },
                    "responseCode": "DLQ49R1",
                    "responseText": "1",
                    "responseOrder": 1,
                    "responseScore": 1,
                    "responseCommentary": "Off Street Additional Car Parking Spaces - 1"
                  }, {
                    "_id": {
                      "$oid": "5b8659f998937e00148e167c"
                    },
                    "responseCode": "DLQ49R2",
                    "responseText": "2",
                    "responseOrder": 2,
                    "responseScore": 2,
                    "responseCommentary": "Off Street Additional Car Parking Spaces - 2"
                  }, {
                    "_id": {
                      "$oid": "5b8659f998937e00148e167b"
                    },
                    "responseCode": "DLQ49R3",
                    "responseText": "3",
                    "responseOrder": 3,
                    "responseScore": 3,
                    "responseCommentary": "Off Street Additional Car Parking Spaces - 3"
                  }, {
                    "_id": {
                      "$oid": "5b8659f998937e00148e167a"
                    },
                    "responseCode": "DLQ49R4",
                    "responseText": "4 plus",
                    "responseOrder": 4,
                    "responseScore": 4,
                    "responseCommentary": "Off Street Additional Car Parking Spaces - 4 plus"
                  }, {
                    "_id": {
                      "$oid": "5b8659f998937e00148e1679"
                    },
                    "responseCode": "DLQ49R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 2,
                    "responseCommentary": "Off Street Additional Car Parking Spaces - Unknown Data Inaccuracy"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b886bb38579db0014409b32"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Does the Kitchen open to a combined area like a Family Room/Meals Area?",
                  "questionCode": "DLQ43",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 23,
                  "summaryQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b848ea42978bb001484ba69",
                  "dependentResponseId": "5b848ea42978bb001484ba6b",
                  "responses": [{
                    "_id": {
                      "$oid": "5b886bb38579db0014409b33"
                    },
                    "responseCode": "DLQ43R1",
                    "responseText": "Yes ",
                    "responseOrder": 1,
                    "responseScore": 50,
                    "responseCommentary": "Kitchen/pantry/family/meals - YES"
                  }, {
                    "_id": {
                      "$oid": "5b8f3a685fe1750014668692"
                    },
                    "responseCode": "DLQ43R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Kitchen/pantry/family/meals - NO"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8873868579db0014409b3f"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What is the size of the Outdoor Entertaining Area?",
                  "questionCode": "DLQ51",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 30,
                  "summaryQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b849a4a2978bb001484ba75",
                  "dependentResponseId": "5b849a4a2978bb001484ba77",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8873868579db0014409b45"
                    },
                    "responseCode": "DLQ51R1",
                    "responseText": ">25m2 and >3.9m wide",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Outdoor Entertaining Area: Floor plan is large >25m2 and is greater than 3.9m wide- Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b8873868579db0014409b44"
                    },
                    "responseCode": "DLQ51R2",
                    "responseText": ">25m2 and <3.9m wide",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Outdoor Entertaining Area: Floorplan is large >25m2 although is less than 3.9m wide - consider furnishing, functionality and general weather problems - OK. \n"
                  }, {
                    "_id": {
                      "$oid": "5b8873868579db0014409b43"
                    },
                    "responseCode": "DLQ51R3",
                    "responseText": "16-25m2 and >3.9m wide",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "Outdoor Entertaining Area: Floorplan is a good size 16-25m2 and is greater than 3.9m wide - Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b8873868579db0014409b42"
                    },
                    "responseCode": "DLQ51R4",
                    "responseText": "16-25m2 and <3.9m wide",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Outdoor Entertaining Area: Floorplan is a good size 16-25m2, although is less than 3.9m wide - consider furnishing, functionality and general weather problems - ok. \n"
                  }, {
                    "_id": {
                      "$oid": "5b8873868579db0014409b41"
                    },
                    "responseCode": "DLQ51R5",
                    "responseText": "<16m2 and >3.9m wide",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Outdoor Entertaining Area: Floorplan is small >16m2 and is greater than 3.9m wide - consider furnishing, functionality and general weather problems - small. \n"
                  }, {
                    "_id": {
                      "$oid": "5b8873868579db0014409b40"
                    },
                    "responseCode": "DLQ51R6",
                    "responseText": "<16m2 and <3.9m wide",
                    "responseOrder": 6,
                    "responseScore": 0,
                    "responseCommentary": "Outdoor Entertaining Area: Floorplan is small >16m2  and is less than 3.9m wide - consider furnishing, functionality and general weather problems - Not Good. \n"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b889a748579db0014409cdc"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the ceiling height on the Ground Floor?",
                  "questionCode": "DLQ52",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "architecture",
                  "questionPageOrder": 3,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b851eca25ac1800144a0fa8",
                  "dependentResponseId": "5b851eca25ac1800144a0fa9",
                  "responses": [{
                    "_id": {
                      "$oid": "5b889a748579db0014409cde"
                    },
                    "responseCode": "DLQ52R1",
                    "responseText": "High, more than or equal to 2.5m",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Ceiling Height: Ground Floor - Is More than 2.5m high. Provides Volume and expanse, higher quality and building costs - Excellent.\n"
                  }, {
                    "_id": {
                      "$oid": "5b889a748579db0014409cdd"
                    },
                    "responseCode": "DLQ52R2",
                    "responseText": "Low, less than 2.5m",
                    "responseOrder": 2,
                    "responseScore": 12,
                    "responseCommentary": "Ceiling Height: Ground Floor - Is Low, less than 2.5m, Cheaper building costs, less Volume and expanse  - Ok.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88a2458579db0014409ce2"
                    },
                    "responseCode": "DLQ52r3",
                    "responseText": "Low with Partially raked, less than 2.5m",
                    "responseOrder": 3,
                    "responseScore": 13,
                    "responseCommentary": "Ceiling Height: Ground Floor - Is Raked with flat areas Less than 2.5m high. Can Lacks Volume and expanse. - Good. \n\n"
                  }, {
                    "_id": {
                      "$oid": "5b88a2458579db0014409ce1"
                    },
                    "responseCode": "DLq43R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 10,
                    "responseCommentary": "Ceiling Height: Ground Floor -Unknown - Data Inaccuracy.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88a2458579db0014409ce0"
                    },
                    "responseCode": "DLQ43R4",
                    "responseText": "High with Partially raked, more than or equal to 2.5m",
                    "responseOrder": 4,
                    "responseScore": 20,
                    "responseCommentary": "Ceiling Height: Ground Floor - Is Raked with flat areas More than 2.5m high. Provides Volume and expanse, higher quality and building costs - Excellent. \n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b88a57b8579db0014409cea"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Describe the natural light of the house?",
                  "questionCode": "DLQ54",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 8,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88a57b8579db0014409ced"
                    },
                    "responseCode": "DLQ54R1",
                    "responseText": "High - Bright",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Natural light: Bright - Good solar access . Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b88a57b8579db0014409cec"
                    },
                    "responseCode": "DLQ54R2",
                    "responseText": "Medium - Average",
                    "responseOrder": 2,
                    "responseScore": 10,
                    "responseCommentary": "Natural Light: Average. Ok.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88a57b8579db0014409ceb"
                    },
                    "responseCode": "DLQ54R3",
                    "responseText": "Low - Dark",
                    "responseOrder": 3,
                    "responseScore": 7,
                    "responseCommentary": "Natural light: Low and feels dark consider health and dampness issues. Not good. \n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b88af878579db0014409cfa"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the ceiling height on the First Floor?",
                  "questionCode": "DLQ56",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "architecture",
                  "questionPageOrder": 4,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b851f7025ac1800144a0faa",
                  "dependentResponseId": "5b851f7025ac1800144a0fab",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88af878579db0014409d00"
                    },
                    "responseCode": "DL56R1",
                    "responseText": "High, more than or equal to 2.5m",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Ceiling Height: 1st Floor - Is More than 2.5m high. Provides Volume and expanse, higher quality and building costs - Excellent.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88af878579db0014409cff"
                    },
                    "responseCode": "DL56R3",
                    "responseText": "High with Partially raked, more than 2.5m",
                    "responseOrder": 3,
                    "responseScore": 20,
                    "responseCommentary": "Ceiling Height: 1st Floor - Is Raked with flat areas More than 2.5m high. Provides Volume and expanse, higher quality and building costs - Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b88af878579db0014409cfe"
                    },
                    "responseCode": "DL56R4",
                    "responseText": "Low with Partially raked, less than 2.5m",
                    "responseOrder": 4,
                    "responseScore": 10,
                    "responseCommentary": "Ceiling Height: 1st Floor - Is Raked with flat areas Less than 2.5m high. Can Lacks Volume and expanse. - Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b88af878579db0014409cfd"
                    },
                    "responseCode": "DL56R2",
                    "responseText": "Low, less than 2.5m",
                    "responseOrder": 2,
                    "responseScore": 10,
                    "responseCommentary": "Ceiling Height: 1st Floor - Is Low, less than 2.5m, Cheaper building costs, less Volume and expanse  - Ok.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88af878579db0014409cfb"
                    },
                    "responseCode": "DL56R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 10,
                    "responseCommentary": "Ceiling Height: 1st Floor -Unknown - Data Inaccuracy.\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b88b0b08579db0014409d17"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Considering light, volume, space and finishes how aesthetically pleasing is the Foyer entrance ?",
                  "questionCode": "DLQ58",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "architecture",
                  "questionPageOrder": 4,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b83704ec47e4d00140795a5",
                  "dependentResponseId": "5b83704ec47e4d00140795a7",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88b1368579db0014409d1f"
                    },
                    "responseCode": "DLQ58R1",
                    "responseText": "Excellent",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Foyer Entrance - Considering light, volume,space and finishes it has been rated as  - Excellent.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88b2438579db0014409d2d"
                    },
                    "responseCode": "DLQ58R1",
                    "responseText": "Good",
                    "responseOrder": 2,
                    "responseScore": 14,
                    "responseCommentary": "Foyer Entrance - Considering light, volume,space and finishes it has been rated as  - Good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88b2438579db0014409d2c"
                    },
                    "responseCode": "DLQ58R3",
                    "responseText": "Average ",
                    "responseOrder": 3,
                    "responseScore": 8,
                    "responseCommentary": "Foyer Entrance - Considering light, volume,space and finishes it has been rated as  - Average.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88b2438579db0014409d2b"
                    },
                    "responseCode": "DLQ58R4",
                    "responseText": "Not Good",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Foyer Entrance - Considering light, volume,space and finishes it has been rated as  - Not good.\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b88b3f78579db0014409d40"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "From the kitchen, is the view of the pool unobstructed?",
                  "questionCode": "DLQ59",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 7,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7105a73bf5340014e52638",
                  "dependentResponseId": "5b7105a73bf5340014e5263a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88b3f78579db0014409d43"
                    },
                    "responseCode": "DLQ59R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Kitchen Pool Viewing - YES - You can see people swimming from the kitchen - Good safety attributes - Excellent.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88b3f78579db0014409d42"
                    },
                    "responseCode": "DLQ59R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Kitchen Pool Viewing - NO - You can't see people swimming from the kitchen - Bad safety attributes - Bad.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88b3f78579db0014409d41"
                    },
                    "responseCode": "DLQ59R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Kitchen Pool Viewing: Unknown if you can see people swimming from the kitchen - Data Inaccuracy.\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b88b4e28579db0014409d44"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan", "on-site"],
                  "applicableSuburbs": [],
                  "text": "Does this area off the Kitchen lead to a Balcony/Terrace/Outdoor Entertaining Area?",
                  "questionCode": "DLQ60",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "architecture",
                  "questionPageOrder": 25,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b886bb38579db0014409b32",
                  "dependentResponseId": "5b886bb38579db0014409b33",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88b4e28579db0014409d47"
                    },
                    "responseCode": "DL60R1",
                    "responseText": "Yes ",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Family Room:  (area off kitchen) leads to an outdoor area - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b88b4e28579db0014409d46"
                    },
                    "responseCode": "DL60R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Family Room: (area off Kitchen)  does not lead to an outdoor area - Not Good."
                  }, {
                    "_id": {
                      "$oid": "5b88b4e28579db0014409d45"
                    },
                    "responseCode": "DL60R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Family Room: (area off Kitchen) Unknown if the family area leads to an outdoor area - Data Inaccuracy. \n"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b88b68d8579db0014409d48"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the Outdoor Entertaining Area flow out to a Lawn?",
                  "questionCode": "DLQ61",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 31,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b849a4a2978bb001484ba75",
                  "dependentResponseId": "5b849a4a2978bb001484ba77",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88b68d8579db0014409d4d"
                    },
                    "responseCode": "DLQ61R1",
                    "responseText": "Yes, <4 steps",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Outdoor Entertaining Area: leads to a lawn with minimal steps - Excellent.\n\n"
                  }, {
                    "_id": {
                      "$oid": "5b88b68d8579db0014409d4c"
                    },
                    "responseCode": "DLQ61R2",
                    "responseText": "Yes, 4-10 steps",
                    "responseOrder": 2,
                    "responseScore": 10,
                    "responseCommentary": "Outdoor Entertaining Area: leads to a lawn with moderate steps - OK.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88b68d8579db0014409d4b"
                    },
                    "responseCode": "DLQ61R3",
                    "responseText": "Yes, >10 steps",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Outdoor Entertaining Area: leads to a lawn with more a lot of steps - Consider physical requirement - Not good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88b68d8579db0014409d4a"
                    },
                    "responseCode": "DLQ61R4",
                    "responseText": "No",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Outdoor Entertaining Area: NO lawn off area- Not Good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88b68d8579db0014409d49"
                    },
                    "responseCode": "DLQ61R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Outdoor Entertaining Area: Unknown if leads to a lawn - Data Inaccuracy. \n\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b88b8ae8579db0014409d4e"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan", "on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the Focus/Orientation of the Main Living/Entertaining areas of the house?",
                  "questionCode": "DLQ62",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 28,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b848ea42978bb001484ba69",
                  "dependentResponseId": "5b848ea42978bb001484ba6b",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88b8ae8579db0014409d53"
                    },
                    "responseCode": "DL62R1",
                    "responseText": "Traditional Rear of Property",
                    "responseOrder": 1,
                    "responseScore": 40,
                    "responseCommentary": "Orientation of Main Living areas - Rear of the property\n"
                  }, {
                    "_id": {
                      "$oid": "5b88b8ae8579db0014409d52"
                    },
                    "responseCode": "DL62R2",
                    "responseText": "Orientation of Main Living areas - Side of the property",
                    "responseOrder": 2,
                    "responseScore": 30,
                    "responseCommentary": "Side of Property\n"
                  }, {
                    "_id": {
                      "$oid": "5b88b8ae8579db0014409d51"
                    },
                    "responseCode": "DL62R3",
                    "responseText": "Street and Private",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Orientation of Main Living areas - Street and Private \n"
                  }, {
                    "_id": {
                      "$oid": "5b88b8ae8579db0014409d50"
                    },
                    "responseCode": "DL62R4",
                    "responseText": "Street and exposed",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Orientation of Main Living areas - Street and Open\n"
                  }, {
                    "_id": {
                      "$oid": "5b88b8ae8579db0014409d4f"
                    },
                    "responseCode": "DQ62R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 12.5,
                    "responseCommentary": "Orientation of Main Living areas - Unknown -  Data Inaccuracy. \n"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b88b9028579db0014409d54"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the roof have any box gutters?",
                  "questionCode": "DLQ63",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "roof-gutters",
                  "questionPageOrder": 2,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88b9028579db0014409d57"
                    },
                    "responseCode": "DLQ63R1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Roofing: NO Box gutters - Excellent. \n"
                  }, {
                    "_id": {
                      "$oid": "5b88b9028579db0014409d56"
                    },
                    "responseCode": "DLQ63R2",
                    "responseText": "Yes",
                    "responseOrder": 2,
                    "responseScore": 2,
                    "responseCommentary": "Roofing: Yes Box gutters - Consider blockages, overflow, leaking problems within the house. Not good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b88b9028579db0014409d55"
                    },
                    "responseCode": "DLQ63R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Roofing: Unknown Box gutters - Data Inaccuracy. \n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b88bb6f8579db0014409d63"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Are all the ground floor windows lockable?",
                  "questionCode": "DLQ65",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "security",
                  "questionPageOrder": 10,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88bb6f8579db0014409d65"
                    },
                    "responseCode": "DLQ65R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Windows Ground floor:  Yes lockable - Excellent.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88bb6f8579db0014409d64"
                    },
                    "responseCode": "DLQ65R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Windows Ground floor: NOT lockable - Not Good.\n\n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b88c5528579db0014409d68"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "How would you rate the storage of the house? Consider built-ins, garage and any external storage.",
                  "questionCode": "DLQ66",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "storage",
                  "questionPageOrder": 11,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88c5528579db0014409d6d"
                    },
                    "responseCode": "DLQ66R1",
                    "responseText": "Excellent",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Storage:  Excellent storage facilities. Excellent.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88c5528579db0014409d6c"
                    },
                    "responseCode": "DLQ66R2",
                    "responseText": "Good",
                    "responseOrder": 2,
                    "responseScore": 7,
                    "responseCommentary": "Storage: Good storage facilities. Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b88c5528579db0014409d6b"
                    },
                    "responseCode": "DLQ66R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Storage: Average storage facilities. Ok. \n"
                  }, {
                    "_id": {
                      "$oid": "5b88c5528579db0014409d6a"
                    },
                    "responseCode": "DLQ66R4",
                    "responseText": "Low ",
                    "responseOrder": 4,
                    "responseScore": 2,
                    "responseCommentary": "Storage: Low storage facilities internally and externally. Not Good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b88c5528579db0014409d69"
                    },
                    "responseCode": "DLQ66R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 6,
                    "responseCommentary": "Storage: Unknown. Data Inaccuracy. \n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b88c7598579db0014409d6e"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the Storage of the Kitchen ",
                  "questionCode": "DLQ67",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "storage",
                  "questionPageOrder": 5,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b848ea42978bb001484ba69",
                  "dependentResponseId": "5b848ea42978bb001484ba6b",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88c7598579db0014409d73"
                    },
                    "responseCode": "DLQ67R1",
                    "responseText": "Excellent",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Kitchen Storage: Large - Excellent\n"
                  }, {
                    "_id": {
                      "$oid": "5b88c7598579db0014409d72"
                    },
                    "responseCode": "DLQ67R2",
                    "responseText": "Good",
                    "responseOrder": 2,
                    "responseScore": 7,
                    "responseCommentary": "Kitchen Storage: Above average - Very good \n"
                  }, {
                    "_id": {
                      "$oid": "5b88c7598579db0014409d71"
                    },
                    "responseCode": "DLQ67R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Kitchen Storage: Medium - Good.  \n"
                  }, {
                    "_id": {
                      "$oid": "5b88c7598579db0014409d70"
                    },
                    "responseCode": "DLQ67R4",
                    "responseText": "Low",
                    "responseOrder": 4,
                    "responseScore": 2,
                    "responseCommentary": "Kitchen Storage: Small - Not Good.  \n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b88caec8579db0014409d7d"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the Bench Space of the Kitchen",
                  "questionCode": "DLQ68",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "storage",
                  "questionPageOrder": 6,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b848ea42978bb001484ba69",
                  "dependentResponseId": "5b848ea42978bb001484ba6b",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88caec8579db0014409d81"
                    },
                    "responseCode": "DLQ68R1",
                    "responseText": "Excellent",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Kitchen Bench Space: Large - Excellent  \n"
                  }, {
                    "_id": {
                      "$oid": "5b88caec8579db0014409d80"
                    },
                    "responseCode": "DLQ68R2",
                    "responseText": "Good",
                    "responseOrder": 2,
                    "responseScore": 7,
                    "responseCommentary": "Kitchen Bench Space: Above average - Very Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b88caec8579db0014409d7f"
                    },
                    "responseCode": "DLQ68R2",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Kitchen Bench Space: Medium - OK  \n"
                  }, {
                    "_id": {
                      "$oid": "5b88caec8579db0014409d7e"
                    },
                    "responseCode": "DLQ68R4",
                    "responseText": "Low",
                    "responseOrder": 4,
                    "responseScore": 2,
                    "responseCommentary": "Kitchen Bench Space: Small - Not Good  \n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b88ccc88579db0014409d82"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What are the window frames made of?",
                  "questionCode": "DLQ69R1",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "windows-doors",
                  "questionPageOrder": 9,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b88ccc88579db0014409d87"
                    },
                    "responseCode": "DLQ69R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 3,
                    "responseCommentary": "External Windows: Frames are timber - Consider maintenance & painting every 5 years - Ok. \n"
                  }, {
                    "_id": {
                      "$oid": "5b88ccc88579db0014409d86"
                    },
                    "responseCode": "DLQ69R2",
                    "responseText": "Aluminium/Metal",
                    "responseOrder": 2,
                    "responseScore": 5,
                    "responseCommentary": "External Windows: Frames are aluminium - Low maintenance - Excellent. \n\n\n"
                  }, {
                    "_id": {
                      "$oid": "5b88ccc88579db0014409d85"
                    },
                    "responseCode": "DLQ69R3",
                    "responseText": "Timber and Aluminium/Metal",
                    "responseOrder": 3,
                    "responseScore": 4,
                    "responseCommentary": "External Windows: Frames are a combination of aluminium and timber - Consider maintenance & painting every 5 years - Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b88ccc88579db0014409d84"
                    },
                    "responseCode": "DLQ69R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 4,
                    "responseCommentary": "External Windows: Frames are unknown - Data Inaccuracy. \n"
                  }, {
                    "_id": {
                      "$oid": "5b88ccc88579db0014409d83"
                    },
                    "responseCode": "DLQ69R5",
                    "responseText": "Install/Renew",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "External Windows: Frames are to be renewed - Allow $600 per m^2 - Ok. \n"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67b0652d140014ddd0d4"
                  },
                  "analysisTypes": ["new-house", "post-new-renovated", "renovated-house", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is the entrance covered ?",
                  "questionCode": "EXQ70",
                  "questionModule": "house",
                  "questionSection": "external",
                  "questionCategory": "architecture",
                  "questionPageOrder": 52,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67b0652d140014ddd0d7"
                    },
                    "responseCode": "EXQ70R1",
                    "responseText": "Yes & Covered space >4m2",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "External Entrance - Covered and good in size providing protection from the weather - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b0652d140014ddd0d6"
                    },
                    "responseCode": "EXQ70R2",
                    "responseText": "Yes & Covered space <4m2",
                    "responseOrder": 2,
                    "responseScore": 2,
                    "responseCommentary": "External Entrance - Covered although small - consider water entry, geust and storage issues due to weather - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b0652d140014ddd0d5"
                    },
                    "responseCode": "EXQ70R3",
                    "responseText": "No Purpose built entrance cover, standard eaves detail only",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "External Entrance - NO Covered entrance structure - consider water entry, geust and storage issues due to weather - Not good. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67b1652d140014ddd0d8"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the front of the home have any stone work/special wall cladding?",
                  "questionCode": "EXQ71",
                  "questionModule": "house",
                  "questionSection": "external",
                  "questionCategory": "architecture",
                  "questionPageOrder": 53,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67b1652d140014ddd0db"
                    },
                    "responseCode": "EXQ71R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "External Stonework: and/or special cladding is installed to the front of house - sign of expense and quality - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b1652d140014ddd0da"
                    },
                    "responseCode": "EXQ71R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "External Stonework: NO and/or special cladding installed to the front of house - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b1652d140014ddd0d9"
                    },
                    "responseCode": "EXQ71R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "External Stonework: Unknown if stonework or special cladding is installed to the front of the house - Data Inaccuracy.   "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67b2652d140014ddd0dc"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Do the majority of the windows at the front of the house have mouldings?",
                  "questionCode": "EXQ72",
                  "questionModule": "house",
                  "questionSection": "external",
                  "questionCategory": "architecture",
                  "questionPageOrder": 54,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67b2652d140014ddd0df"
                    },
                    "responseCode": "EXQ72R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "External Windows: Includes Architrave mouldings surrounding the majority of windows at the front of the house - sign of expense and quality - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67b2652d140014ddd0de"
                    },
                    "responseCode": "EXQ72R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "External Windows:  NO mouldings on the majority at the front of the house - ok."
                  }, {
                    "_id": {
                      "$oid": "5b8a67b2652d140014ddd0dd"
                    },
                    "responseCode": "EXQ72R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "External Windows:  Moulding detail is unknown - Data Inaccuracy.  "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67b3652d140014ddd0e0"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the front of the home have external screening/shutters?",
                  "questionCode": "EXQ73",
                  "questionModule": "house",
                  "questionSection": "external",
                  "questionCategory": "architecture",
                  "questionPageOrder": 55,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67b3652d140014ddd0e3"
                    },
                    "responseCode": "EXQ73R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "External Architectural Detail: by means of screening and/or shutters to the front of house - sign of expense and quality - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b3652d140014ddd0e2"
                    },
                    "responseCode": "EXQ73R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 5,
                    "responseCommentary": "External Architectural Detail: NO by means of screening and/or shutters on the front of the house  - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b3652d140014ddd0e1"
                    },
                    "responseCode": "EXQ73R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "External Architectural Detail: Unknown by means of screening and/or shutter  - Data Inaccuracy.  "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67b4652d140014ddd0e4"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the eaves/soffit of the building ?",
                  "questionCode": "EXQ74",
                  "questionModule": "house",
                  "questionSection": "external",
                  "questionCategory": "architecture",
                  "questionPageOrder": 56,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67b4652d140014ddd0e8"
                    },
                    "responseCode": "EXQ74R1",
                    "responseText": "Detailed",
                    "responseOrder": 1,
                    "responseScore": 8,
                    "responseCommentary": "External Eaves/soffit:  Are detailed, sign of expense & quality - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b4652d140014ddd0e7"
                    },
                    "responseCode": "EXQ74R2",
                    "responseText": "Standard",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "External Eave/soffit: Standard detail & Soffit - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b4652d140014ddd0e6"
                    },
                    "responseCode": "EXQ74R3",
                    "responseText": "None",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "External Eave/soffit: NO eave or soffit consider no protection against the weather - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b4652d140014ddd0e5"
                    },
                    "responseCode": "EXQ74R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 4,
                    "responseCommentary": "External Eave/soffit: Unknown detail - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67b5652d140014ddd0e9"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the external wall finish/cladding of the ground floor?",
                  "questionCode": "EXQ75",
                  "questionModule": "house",
                  "questionSection": "external",
                  "questionCategory": "wall-floor-finishes",
                  "questionPageOrder": 57,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b851eca25ac1800144a0fa8",
                  "dependentResponseId": "5b851eca25ac1800144a0fa9",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67b5652d140014ddd0f2"
                    },
                    "responseCode": "EXQ75R1",
                    "responseText": "Brick-Facework",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "External Cladding: Ground Floor - Brick facework - Consider potential cracking and mould build up on southern aspects - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b5652d140014ddd0f1"
                    },
                    "responseCode": "EXQ75R2",
                    "responseText": "Brick-Painted",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: Ground Floor - Painted brick - Consider painting every 10 years and possible paint peeling - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b5652d140014ddd0f0"
                    },
                    "responseCode": "EXQ75R3",
                    "responseText": "Brick-Bagged and Painted",
                    "responseOrder": 3,
                    "responseScore": 3,
                    "responseCommentary": "External Cladding: Ground Floor - Bagged & painted brick - Consider painting every 10 years, as well as the potential for salt bleeding - Ok."
                  }, {
                    "_id": {
                      "$oid": "5b8a67b5652d140014ddd0ef"
                    },
                    "responseCode": "EXQ75R4",
                    "responseText": "Render- Acrylic and Coloured",
                    "responseOrder": 4,
                    "responseScore": 10,
                    "responseCommentary": "External Cladding: Ground Floor - Acrylic & coloured render - This is a premium product with low maintenance and flexibility - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b5652d140014ddd0ee"
                    },
                    "responseCode": "EXQ75R5",
                    "responseText": "Render- Cement and Painted",
                    "responseOrder": 5,
                    "responseScore": 8,
                    "responseCommentary": "External Cladding: Ground Floor - Cement & painted render - Consider painting every 10 years, as well as the potential for cracking - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b5652d140014ddd0ed"
                    },
                    "responseCode": "EXQ75R6",
                    "responseText": "Timber",
                    "responseOrder": 6,
                    "responseScore": 7,
                    "responseCommentary": "External Cladding: Ground Floor - Timber - Consider maintenance & painting every 6 years - Good.  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b5652d140014ddd0ec"
                    },
                    "responseCode": "EXQ75R7",
                    "responseText": "Metal",
                    "responseOrder": 7,
                    "responseScore": 7,
                    "responseCommentary": "External Cladding: Ground Floor - Metal - Consider the potential for rusting in salty conditions, however, low maintenance is required - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b5652d140014ddd0eb"
                    },
                    "responseCode": "EXQ75R8",
                    "responseText": "Composite",
                    "responseOrder": 8,
                    "responseScore": 5,
                    "responseCommentary": "External Cladding: Ground Floor - Composite material - Consider checking the warranty on the product - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b5652d140014ddd0ea"
                    },
                    "responseCode": "EXQ75R9",
                    "responseText": "Unknown",
                    "responseOrder": 9,
                    "responseScore": 5,
                    "responseCommentary": "External Cladding: Ground Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67b6652d140014ddd0f3"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the external wall finish/cladding of the 1st Floor?",
                  "questionCode": "EXQ76",
                  "questionModule": "house",
                  "questionSection": "external",
                  "questionCategory": "wall-floor-finishes",
                  "questionPageOrder": 58,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b851f7025ac1800144a0faa",
                  "dependentResponseId": "5b851f7025ac1800144a0fab",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67b6652d140014ddd0fc"
                    },
                    "responseCode": "EXQ76R1",
                    "responseText": "Brick-Facework",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "External Cladding: 1st Floor - Brick facework - Consider potential cracking and mould build up on southern aspects - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b6652d140014ddd0fb"
                    },
                    "responseCode": "EXQ76R2",
                    "responseText": "Brick-Painted",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: 1st Floor - Painted brick - Consider painting every 10 years and possible paint peeling - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b6652d140014ddd0fa"
                    },
                    "responseCode": "EXQ76R3",
                    "responseText": "Brick-Bagged and Painted",
                    "responseOrder": 3,
                    "responseScore": 3,
                    "responseCommentary": "External Cladding: 1st Floor - Bagged & painted brick - Consider painting every 10 years, as well as the potential for salt bleeding - Ok."
                  }, {
                    "_id": {
                      "$oid": "5b8a67b6652d140014ddd0f9"
                    },
                    "responseCode": "EXQ76R4",
                    "responseText": "Render- Acrylic and Coloured",
                    "responseOrder": 4,
                    "responseScore": 10,
                    "responseCommentary": "External Cladding: 1st Floor - Acrylic & coloured render - This is a premium product with low maintenance and flexibility - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b6652d140014ddd0f8"
                    },
                    "responseCode": "EXQ76R5",
                    "responseText": "Render- Cement and Painted",
                    "responseOrder": 5,
                    "responseScore": 8,
                    "responseCommentary": "External Cladding: 1st Floor - Cement & painted render - Consider painting every 10 years, as well as the potential for cracking - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b6652d140014ddd0f7"
                    },
                    "responseCode": "EXQ76R6",
                    "responseText": "Timber",
                    "responseOrder": 6,
                    "responseScore": 7,
                    "responseCommentary": "External Cladding: 1st Floor - Timber - Consider maintenance & painting every 6 years - Good.  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b6652d140014ddd0f6"
                    },
                    "responseCode": "EXQ76R7",
                    "responseText": "Metal",
                    "responseOrder": 7,
                    "responseScore": 7,
                    "responseCommentary": "External Cladding: 1st Floor - Metal - Consider the potential for rusting in salty conditions, however, low maintenance is required - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b6652d140014ddd0f5"
                    },
                    "responseCode": "EXQ76R8",
                    "responseText": "Composite",
                    "responseOrder": 8,
                    "responseScore": 5,
                    "responseCommentary": "External Cladding: 1st Floor - Composite material - Consider checking the warranty on the product - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b6652d140014ddd0f4"
                    },
                    "responseCode": "EXQ76R9",
                    "responseText": "Unknown",
                    "responseOrder": 10,
                    "responseScore": 5,
                    "responseCommentary": "External Cladding: 1st Floor - Unknown - Data Inaccuracy. "
                  }, {
                    "_id": {
                      "$oid": "5b9603ee5de5160015739e1c"
                    },
                    "responseCode": "EXQ76",
                    "responseText": "Roof Material",
                    "responseOrder": 9,
                    "responseScore": 5,
                    "responseCommentary": "External Cladding: 1st Floor - Roof Material - Good"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67b7652d140014ddd0fd"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the external wall finish/cladding of the 2nd Floor?",
                  "questionCode": "EXQ77",
                  "questionModule": "house",
                  "questionSection": "external",
                  "questionCategory": "wall-floor-finishes",
                  "questionPageOrder": 59,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b85205025ac1800144a0fb4",
                  "dependentResponseId": "5b85205025ac1800144a0fb6",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67b7652d140014ddd106"
                    },
                    "responseCode": "EXQ77R1",
                    "responseText": "Brick-Facework",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: 2nd Floor - Brick facework - Consider potential cracking and mould build up on southern aspects - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b7652d140014ddd105"
                    },
                    "responseCode": "EXQ77R2",
                    "responseText": "Brick-Painted",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: 2nd Floor - Painted brick - Consider painting every 10 years and possible paint peeling - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b7652d140014ddd104"
                    },
                    "responseCode": "EXQ77R3",
                    "responseText": "Brick-Bagged and Painted",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: 2nd Floor - Bagged & painted brick - Consider painting every 10 years, as well as the potential for salt bleeding - Ok."
                  }, {
                    "_id": {
                      "$oid": "5b8a67b7652d140014ddd103"
                    },
                    "responseCode": "EXQ77R4",
                    "responseText": "Render- Acrylic and Coloured",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: 2nd Floor - Acrylic & coloured render - This is a premium product with low maintenance and flexibility - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b7652d140014ddd102"
                    },
                    "responseCode": "EXQ77R5",
                    "responseText": "Render- Cement and Painted",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: 2nd Floor - Cement & painted render - Consider painting every 10 years, as well as the potential for cracking - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b7652d140014ddd101"
                    },
                    "responseCode": "EXQ77R6",
                    "responseText": "Timber",
                    "responseOrder": 6,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: 2nd Floor - Timber - Consider maintenance & painting every 6 years - Good.  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b7652d140014ddd100"
                    },
                    "responseCode": "EXQ77R7",
                    "responseText": "Metal",
                    "responseOrder": 7,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: 2nd Floor - Metal - Consider the potential for rusting in salty conditions, however, low maintenance is required - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b7652d140014ddd0ff"
                    },
                    "responseCode": "EXQ77R8",
                    "responseText": "Composite",
                    "responseOrder": 8,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: 2nd Floor - Composite material - Consider checking the warranty on the product - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b7652d140014ddd0fe"
                    },
                    "responseCode": "EXQ77R9",
                    "responseText": "Unknown",
                    "responseOrder": 9,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: 2nd Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67b8652d140014ddd107"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the external wall finish/cladding of the Lower 1 Floor?",
                  "questionCode": "EXQ78",
                  "questionModule": "house",
                  "questionSection": "external",
                  "questionCategory": "wall-floor-finishes",
                  "questionPageOrder": 60,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f63ae5fe17500146695be",
                  "dependentResponseId": "5b8f63ae5fe17500146695c0",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67b8652d140014ddd110"
                    },
                    "responseCode": "EXQ78R1",
                    "responseText": "Brick-Facework",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: Lower 1 Floor - Brick facework - Consider potential cracking and mould build up on southern aspects - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b8652d140014ddd10f"
                    },
                    "responseCode": "EXQ78R2",
                    "responseText": "Brick-Painted",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: Lower 1 Floor - Painted brick - Consider painting every 10 years and possible paint peeling - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b8652d140014ddd10e"
                    },
                    "responseCode": "EXQ78R3",
                    "responseText": "Brick-Bagged and Painted",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: Lower 1 Floor - Bagged & painted brick - Consider painting every 10 years, as well as the potential for salt bleeding - Ok."
                  }, {
                    "_id": {
                      "$oid": "5b8a67b8652d140014ddd10d"
                    },
                    "responseCode": "EXQ78R4",
                    "responseText": "Render- Acrylic and Coloured",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: Lower 1 Floor - Acrylic & coloured render - This is a premium product with low maintenance and flexibility - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b8652d140014ddd10c"
                    },
                    "responseCode": "EXQ78R5",
                    "responseText": "Render- Cement and Painted",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: Lower 1 Floor - Cement & painted render - Consider painting every 10 years, as well as the potential for cracking - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b8652d140014ddd10b"
                    },
                    "responseCode": "EXQ78R6",
                    "responseText": "Timber",
                    "responseOrder": 6,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: Lower 1 Floor - Timber - Consider maintenance & painting every 6 years - Good.  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b8652d140014ddd10a"
                    },
                    "responseCode": "EXQ78R7",
                    "responseText": "Metal",
                    "responseOrder": 7,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: Lower 1 Floor - Metal - Consider the potential for rusting in salty conditions, however, low maintenance is required - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b8652d140014ddd109"
                    },
                    "responseCode": "EXQ78R8",
                    "responseText": "Composite",
                    "responseOrder": 8,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: Lower 1 Floor - Composite material - Consider checking the warranty on the product - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67b8652d140014ddd108"
                    },
                    "responseCode": "EXQ78R9",
                    "responseText": "Unknown",
                    "responseOrder": 9,
                    "responseScore": 0,
                    "responseCommentary": "External Cladding: Lower 1 Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67b9652d140014ddd111"
                  },
                  "analysisTypes": [],
                  "bestSource": [],
                  "applicableSuburbs": [],
                  "text": "UNUSED - What is the air-conditioning system? ",
                  "questionCode": "INQ79",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "air-conditioning",
                  "questionPageOrder": 61,
                  "adjustmentQuestion": false,
                  "dependentMode": "exclude",
                  "dependentQuestionId": "5b851eca25ac1800144a0fa8",
                  "dependentResponseId": "5b851eca25ac1800144a0fa9",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67b9652d140014ddd117"
                    },
                    "responseCode": "INQ79R1",
                    "responseText": "Ducted",
                    "responseOrder": 1,
                    "responseScore": 35,
                    "responseCommentary": "Air Conditioning System: Ducted - Very good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67b9652d140014ddd116"
                    },
                    "responseCode": "INQ79R2",
                    "responseText": "Ducted/Individual Room Controllers",
                    "responseOrder": 2,
                    "responseScore": 30,
                    "responseCommentary": "Air Conditioning System: Ducted and controlled from individual rooms - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67b9652d140014ddd115"
                    },
                    "responseCode": "INQ79R3",
                    "responseText": "Split",
                    "responseOrder": 3,
                    "responseScore": 15,
                    "responseCommentary": "Air Conditioning System: Split - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67b9652d140014ddd114"
                    },
                    "responseCode": "INQ79R4",
                    "responseText": "Central Heating",
                    "responseOrder": 4,
                    "responseScore": 20,
                    "responseCommentary": "Central Heated: Ducted Floor heating - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67b9652d140014ddd113"
                    },
                    "responseCode": "INQ79R5",
                    "responseText": "None",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Air-Conditioning System: NO - Not good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67b9652d140014ddd112"
                    },
                    "responseCode": "INQ79R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 18,
                    "responseCommentary": "Air Conditioning System: Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false,
                  "isDeactivated": true
                },
                {
                  "_id": {
                    "$oid": "5b8a67ba652d140014ddd118"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is the main area of the house (family room) air-conditioned?",
                  "questionCode": "INQ80",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "air-conditioning",
                  "questionPageOrder": 2,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67ba652d140014ddd11d"
                    },
                    "responseCode": "INQ80R1",
                    "responseText": "Yes - Ducted",
                    "responseOrder": 1,
                    "responseScore": 30,
                    "responseCommentary": "Air Conditioning System - YES - Ducted in Family room - Excellent"
                  }, {
                    "_id": {
                      "$oid": "5b8a67ba652d140014ddd11c"
                    },
                    "responseCode": "INQ80R2",
                    "responseText": "Yes - Split",
                    "responseOrder": 2,
                    "responseScore": 20,
                    "responseCommentary": "Air Conditioning System - YES -  Split system in Family room - Good"
                  }, {
                    "_id": {
                      "$oid": "5b8a67ba652d140014ddd11b"
                    },
                    "responseCode": "INQ80R3",
                    "responseText": "Yes - Central Heating",
                    "responseOrder": 3,
                    "responseScore": 18,
                    "responseCommentary": "Air Conditioning System - YES - Central heating underfloor in Family room - Excellent"
                  }, {
                    "_id": {
                      "$oid": "5b8a67ba652d140014ddd11a"
                    },
                    "responseCode": "INQ80R4",
                    "responseText": "No",
                    "responseOrder": 4,
                    "responseScore": 2,
                    "responseCommentary": "Air Conditioning System - NO - Not good"
                  }, {
                    "_id": {
                      "$oid": "5b8a67ba652d140014ddd119"
                    },
                    "responseCode": "INQ80R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 16,
                    "responseCommentary": "Air Conditioning System - Unknown -  Data Inaccuracy"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67bc652d140014ddd122"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What Type of BBQ  is There ?",
                  "questionCode": "INQ82",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "appliances",
                  "questionPageOrder": 16,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67bc652d140014ddd126"
                    },
                    "responseCode": "INQ82R1",
                    "responseText": "Free Standing ",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "BBQ: NO Free standing, not included in house unless stated in contract. - OK."
                  }, {
                    "_id": {
                      "$oid": "5b8a67bc652d140014ddd125"
                    },
                    "responseCode": "INQ82R2",
                    "responseText": "Fully Integrated ",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "BBQ: Fully integrated  - Very good"
                  }, {
                    "_id": {
                      "$oid": "5b8a67bc652d140014ddd124"
                    },
                    "responseCode": "INQ82R3",
                    "responseText": "No BBQ",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "BBQ: NO - Not good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67bc652d140014ddd123"
                    },
                    "responseCode": "INQ82R4",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 7,
                    "responseCommentary": "BBQ: Unknown - Data Inaccuracy."
                  }, {
                    "_id": {
                      "$oid": "5b8e063671eaa10014f14f67"
                    },
                    "responseCode": "INQ82R3",
                    "responseText": "Fully intergrated with kitchen",
                    "responseOrder": 4,
                    "responseScore": 15,
                    "responseCommentary": "BBQ - Fully integrated BBQ with Fridge - Excellant"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67bd652d140014ddd127"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "unrenovated", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the house have a fireplace?",
                  "questionCode": "INQ83",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "architecture",
                  "questionPageOrder": 3,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67bd652d140014ddd12b"
                    },
                    "responseCode": "INQ83R1",
                    "responseText": "Yes, Gas",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Fire Place: Yes Gas - Clean and Effecient form of heating - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67bd652d140014ddd12a"
                    },
                    "responseCode": "INQ83R2",
                    "responseText": "Yes, Wood",
                    "responseOrder": 2,
                    "responseScore": 8,
                    "responseCommentary": "Fire Place: Yes Wood - Consider safety, Cleanliness  and health  - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67bd652d140014ddd129"
                    },
                    "responseCode": "INQ83R3",
                    "responseText": "No",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Fire Place: NO"
                  }, {
                    "_id": {
                      "$oid": "5b8a67bd652d140014ddd128"
                    },
                    "responseCode": "INQ83R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 5,
                    "responseCommentary": "Fire Place: Unknown - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67c5652d140014ddd148"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What best descibes the lighting in the house ?",
                  "questionCode": "INQ91",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "electrical",
                  "questionPageOrder": 5,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67c5652d140014ddd14e"
                    },
                    "responseCode": "INQ91R1",
                    "responseText": "Multiple LED's",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": " Lighting - YES - Multiple LED's - Excellent"
                  }, {
                    "_id": {
                      "$oid": "5b8a67c5652d140014ddd14d"
                    },
                    "responseCode": "INQ91R2",
                    "responseText": "Single LED's",
                    "responseOrder": 2,
                    "responseScore": 5,
                    "responseCommentary": "Lighting - YES - Single LED's - OK"
                  }, {
                    "_id": {
                      "$oid": "5b8a67c5652d140014ddd14c"
                    },
                    "responseCode": "INQ91R3",
                    "responseText": "Mulitiple Halogens",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Lighting - NO - Multiple Halogens only - OK"
                  }, {
                    "_id": {
                      "$oid": "5b8a67c5652d140014ddd14b"
                    },
                    "responseCode": "INQ91R4",
                    "responseText": "Incandescent lights ",
                    "responseOrder": 4,
                    "responseScore": 2,
                    "responseCommentary": "Lighting - NO - Incandescents only. Consider changing due electricity costs - Not good"
                  }, {
                    "_id": {
                      "$oid": "5b8a67c5652d140014ddd14a"
                    },
                    "responseCode": "INQ91R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 5,
                    "responseCommentary": "Lighting - Unknown -  Data Inaccuracy. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67c5652d140014ddd149"
                    },
                    "responseCode": "INQ91R6",
                    "responseText": "Install/Renew",
                    "responseOrder": 6,
                    "responseScore": 2,
                    "responseCommentary": "Lighting - NO - Needs to be installed/renewed. Downlights $90/light"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67c6652d140014ddd14f"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the Finish of the Kitchen  Benchtop",
                  "questionCode": "INQ92",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "kitchen-fittings",
                  "questionPageOrder": 7,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67c6652d140014ddd155"
                    },
                    "responseCode": "INQ92R1",
                    "responseText": "Stone",
                    "responseOrder": 1,
                    "responseScore": 15,
                    "responseCommentary": "Kitchen Benchtop - YES - Stone.  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67c6652d140014ddd154"
                    },
                    "responseCode": "INQ92R2",
                    "responseText": "Caesarstone",
                    "responseOrder": 2,
                    "responseScore": 15,
                    "responseCommentary": "Kitchen Benchtop - YES - Caesartone.  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67c6652d140014ddd153"
                    },
                    "responseCode": "INQ92R3",
                    "responseText": "Timber ",
                    "responseOrder": 3,
                    "responseScore": 7.5,
                    "responseCommentary": "Kitchen Benchtop - YES - Timber.  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67c6652d140014ddd152"
                    },
                    "responseCode": "INQ92R4",
                    "responseText": "Stainless Steel ",
                    "responseOrder": 4,
                    "responseScore": 15,
                    "responseCommentary": "Kitchen Benchtop - YES - Stainless steel.  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67c6652d140014ddd151"
                    },
                    "responseCode": "INQ92R5",
                    "responseText": "Formica",
                    "responseOrder": 5,
                    "responseScore": 7.5,
                    "responseCommentary": "Kitchen Benchtop - YES - Formica.  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67c6652d140014ddd150"
                    },
                    "responseCode": "INQ92R6",
                    "responseText": "Other ",
                    "responseOrder": 6,
                    "responseScore": 7.5,
                    "responseCommentary": "Kitchen Benchtop - YES - Other.  "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67c7652d140014ddd156"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the hot water system?",
                  "questionCode": "INQ93",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "plumbing",
                  "questionPageOrder": 19,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67c7652d140014ddd15b"
                    },
                    "responseCode": "INQ93R1",
                    "responseText": "Gas",
                    "responseOrder": 1,
                    "responseScore": 3,
                    "responseCommentary": "Hot Water - YES - Gas - Cheaper form of energy for heating - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c7652d140014ddd15a"
                    },
                    "responseCode": "INQ93R2",
                    "responseText": "Instantaneous Gas",
                    "responseOrder": 2,
                    "responseScore": 5,
                    "responseCommentary": "Hot Water - YES - Gas Instantaneous - Efficient and never runs out, heated as used - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c7652d140014ddd159"
                    },
                    "responseCode": "INQ93R3",
                    "responseText": "Solar Boosted Gas",
                    "responseOrder": 3,
                    "responseScore": 4,
                    "responseCommentary": "Hot Water - YES - Gas Solar boosted - Energy effeciat heating - Very Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67c7652d140014ddd158"
                    },
                    "responseCode": "INQ93R4",
                    "responseText": "Electricity",
                    "responseOrder": 4,
                    "responseScore": 2,
                    "responseCommentary": "Hot Water - NO - Electricity only - expensive form of energy to create hotwater - Ok."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c7652d140014ddd157"
                    },
                    "responseCode": "INQ93R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 2.5,
                    "responseCommentary": "Hot Water - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67c8652d140014ddd15c"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the type of alarm system installed?",
                  "questionCode": "INQ94",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "security",
                  "questionPageOrder": 11,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67c8652d140014ddd161"
                    },
                    "responseCode": "INQ94R1",
                    "responseText": "Back to base",
                    "responseOrder": 1,
                    "responseScore": 5,
                    "responseCommentary": "Alarm - YES - Back to base alarm system - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c8652d140014ddd160"
                    },
                    "responseCode": "INQ94R2",
                    "responseText": "Monitored",
                    "responseOrder": 2,
                    "responseScore": 4,
                    "responseCommentary": "Alarm - YES - Monitored alarm system - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c8652d140014ddd15f"
                    },
                    "responseCode": "INQ94R3",
                    "responseText": "Local",
                    "responseOrder": 3,
                    "responseScore": 3,
                    "responseCommentary": "Alarm - YES - Local alarm system - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c8652d140014ddd15e"
                    },
                    "responseCode": "INQ94R4",
                    "responseText": "None",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Alarm - NO - Not Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c8652d140014ddd15d"
                    },
                    "responseCode": "INQ94R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 3.5,
                    "responseCommentary": "Alarm - Unknown - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67cb652d140014ddd170"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the house have a dog door?",
                  "questionCode": "INQ97",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "windows-doors",
                  "questionPageOrder": 8,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67cb652d140014ddd173"
                    },
                    "responseCode": "INQ97R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Dog Door: Yes - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67cb652d140014ddd172"
                    },
                    "responseCode": "INQ97R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Dog Door: No - Ok."
                  }, {
                    "_id": {
                      "$oid": "5b8a67cb652d140014ddd171"
                    },
                    "responseCode": "INQ97R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 1,
                    "responseCommentary": "Dog Door: Unknown - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67cc652d140014ddd174"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What type of internal door's are used?",
                  "questionCode": "INQ98",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "windows-doors",
                  "questionPageOrder": 10,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67cc652d140014ddd178"
                    },
                    "responseCode": "INQ98R1",
                    "responseText": "Solid",
                    "responseOrder": 1,
                    "responseScore": 5,
                    "responseCommentary": "Doors Internal - YES - Solid Core - Good acoustic and durability and qualities - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67cc652d140014ddd177"
                    },
                    "responseCode": "INQ98R2",
                    "responseText": "Original Character ",
                    "responseOrder": 2,
                    "responseScore": 4,
                    "responseCommentary": "Doors Internal - YES - Original character - Astheticaly pleaseing ,durability qualities - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67cc652d140014ddd176"
                    },
                    "responseCode": "INQ98R3",
                    "responseText": "Hollow core",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Doors Internal - NO - Hollow Core only - Low quality, durability and acoustic qualities - Ok."
                  }, {
                    "_id": {
                      "$oid": "5b8a67cc652d140014ddd175"
                    },
                    "responseCode": "INQ98R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 2.5,
                    "responseCommentary": "Doors Internal: Unknown composition - Data Inaccuracy"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67cd652d140014ddd179"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Externally, Is there more than one Window that does not have a head across the top of the window?",
                  "questionCode": "QCQ99",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "architecture",
                  "questionPageOrder": 5,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67cd652d140014ddd17c"
                    },
                    "responseCode": "QCQ99R1",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 15,
                    "responseCommentary": "External Windows: Have a head above the window indication of good quality - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67cd652d140014ddd17b"
                    },
                    "responseCode": "QCQ99R2",
                    "responseText": "Yes",
                    "responseOrder": 2,
                    "responseScore": 5,
                    "responseCommentary": "External Windows: Have no heads above the windows indication of low quality - Not good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67cd652d140014ddd17a"
                    },
                    "responseCode": "QCQ99R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "External Windows: Unknown if the windows has a  head above the windows -Data Inaccuracy.  "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67cf652d140014ddd180"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the condition of the kitchen appliances?",
                  "questionCode": "QCQ101",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "",
                  "questionPageOrder": 11,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b848ea42978bb001484ba69",
                  "dependentResponseId": "5b848ea42978bb001484ba6b",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67cf652d140014ddd186"
                    },
                    "responseCode": "QCQ101R1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Kitchen Appliances - New"
                  }, {
                    "_id": {
                      "$oid": "5b8a67cf652d140014ddd185"
                    },
                    "responseCode": "QCQ101R2",
                    "responseText": "Good condition",
                    "responseOrder": 2,
                    "responseScore": 16,
                    "responseCommentary": "Kitchen Appliances - Good condition"
                  }, {
                    "_id": {
                      "$oid": "5b8a67cf652d140014ddd184"
                    },
                    "responseCode": "QCQ101R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "Kitchen Appliances - OK"
                  }, {
                    "_id": {
                      "$oid": "5b8a67cf652d140014ddd183"
                    },
                    "responseCode": "QCQ101R4",
                    "responseText": "Needs some Replacements",
                    "responseOrder": 4,
                    "responseScore": 8,
                    "responseCommentary": "Kitchen Appliances - Need some replaced"
                  }, {
                    "_id": {
                      "$oid": "5b8a67cf652d140014ddd182"
                    },
                    "responseCode": "QCQ101R5",
                    "responseText": "Needs complete Replacement",
                    "responseOrder": 5,
                    "responseScore": 3,
                    "responseCommentary": "Kitchen Appliances - Need to be replaced -Average cost replacement $15000-$40000"
                  }, {
                    "_id": {
                      "$oid": "5b8a67cf652d140014ddd181"
                    },
                    "responseCode": "QCQ101R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 10,
                    "responseCommentary": "Kitchen - Appliances are unknown -  Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67d0652d140014ddd187"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the condition of the Kitchen cupboards & benchtop?",
                  "questionCode": "QCQ102",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "renovate",
                  "questionPageOrder": 10,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b848ea42978bb001484ba69",
                  "dependentResponseId": "5b848ea42978bb001484ba6b",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67d0652d140014ddd18d"
                    },
                    "responseCode": "QCQ102R1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Kitchen Cupbords & benchtop:  New -consider checking  length of warrenty and manufacture. Excellent"
                  }, {
                    "_id": {
                      "$oid": "5b8a67d0652d140014ddd18c"
                    },
                    "responseCode": "QCQ102R2",
                    "responseText": "Good condition",
                    "responseOrder": 2,
                    "responseScore": 12,
                    "responseCommentary": "Kitchen Cupbords & Benchtop: Good condition."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d0652d140014ddd18b"
                    },
                    "responseCode": "QCQ102R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "Kitchen Cupbords & Benchtop: OK"
                  }, {
                    "_id": {
                      "$oid": "5b8a67d0652d140014ddd18a"
                    },
                    "responseCode": "QCQ102R4",
                    "responseText": "Needs some work",
                    "responseOrder": 4,
                    "responseScore": 8,
                    "responseCommentary": "Kitchen Cupbords & benchtop: Need Some work."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d0652d140014ddd189"
                    },
                    "responseCode": "QCQ102R5",
                    "responseText": "Needs complete replacement",
                    "responseOrder": 5,
                    "responseScore": 7,
                    "responseCommentary": "Kitchen Cupboard & Bench Top - Need to be replaced -Average cost replacement $15000-$40000"
                  }, {
                    "_id": {
                      "$oid": "5b8a67d0652d140014ddd188"
                    },
                    "responseCode": "QCQ102R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 10,
                    "responseCommentary": "Kitchen Cupboards & Benchtop - Unknown condition-  Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67d1652d140014ddd18e"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the condition of the Laundry cupboards & benchtop?",
                  "questionCode": "QCQ103",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "renovate",
                  "questionPageOrder": 12,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b848dd92978bb001484ba66",
                  "dependentResponseId": "5b848dd92978bb001484ba68",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67d1652d140014ddd194"
                    },
                    "responseCode": "QCQ103R1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Laundry: Cupboards & benchtop are New. - Excellent "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d1652d140014ddd193"
                    },
                    "responseCode": "QCQ103R2",
                    "responseText": "Good condition",
                    "responseOrder": 2,
                    "responseScore": 8,
                    "responseCommentary": "Laundry: Cupboards & benchtop are in good condition"
                  }, {
                    "_id": {
                      "$oid": "5b8a67d1652d140014ddd192"
                    },
                    "responseCode": "QCQ103R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 6,
                    "responseCommentary": "Laundry: Cupboards & benchtop are OK"
                  }, {
                    "_id": {
                      "$oid": "5b8a67d1652d140014ddd191"
                    },
                    "responseCode": "QCQ103R4",
                    "responseText": "Needs some work",
                    "responseOrder": 4,
                    "responseScore": 3,
                    "responseCommentary": "Laundry: Cupboards & benchtop need some work. Tradesman per day plus materials  can be $1000."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d1652d140014ddd190"
                    },
                    "responseCode": "QCQ103R5",
                    "responseText": "Needs complete replacement",
                    "responseOrder": 5,
                    "responseScore": 1,
                    "responseCommentary": "Laundry: Cupboards & bench Top need to be replaced - Allow $4000-$8000"
                  }, {
                    "_id": {
                      "$oid": "5b8a67d1652d140014ddd18f"
                    },
                    "responseCode": "QCQ103R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 5,
                    "responseCommentary": "Laundry: Cupboards & benchtop are Unknown -  Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67d2652d140014ddd195"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the condition of the Powder Room?",
                  "questionCode": "INQ104",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "renovate",
                  "questionPageOrder": 13,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84d67b2978bb001484ba90",
                  "dependentResponseId": "5b84d67b2978bb001484ba92",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67d2652d140014ddd19b"
                    },
                    "responseCode": "INQ104R1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 15,
                    "responseCommentary": "Powder Room: New. Statutory waterproofing warranty is 6 years . Excellent "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d2652d140014ddd19a"
                    },
                    "responseCode": "INQ104R2",
                    "responseText": "Good condition",
                    "responseOrder": 2,
                    "responseScore": 11,
                    "responseCommentary": "Powder Room: Good condition."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d2652d140014ddd199"
                    },
                    "responseCode": "INQ104R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 8,
                    "responseCommentary": "Powder Room: Average Condition although functionable. OK "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d2652d140014ddd198"
                    },
                    "responseCode": "INQ104R4",
                    "responseText": "Needs some Renovating",
                    "responseOrder": 4,
                    "responseScore": 7,
                    "responseCommentary": "Powder Room: Needs some work."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d2652d140014ddd197"
                    },
                    "responseCode": "INQ104R5",
                    "responseText": "Needs complete Renovation",
                    "responseOrder": 5,
                    "responseScore": 4,
                    "responseCommentary": "Powder Room: Needs to be renovated.  Allow $5,000-$7,000   "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d2652d140014ddd196"
                    },
                    "responseCode": "INQ104R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 6,
                    "responseCommentary": "Powder Room: Unknown Condition -  Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67d3652d140014ddd19c"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the condition of the Master Ensuite?",
                  "questionCode": "QCQ105",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "renovate",
                  "questionPageOrder": 18,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84e1542978bb001484baa1",
                  "dependentResponseId": "5b84e1542978bb001484baa3",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67d3652d140014ddd1a2"
                    },
                    "responseCode": "QCQ105R1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 30,
                    "responseCommentary": "Master Ensuite - New.  Staturay waterproofing warrenty is 6 years . Excellent "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d3652d140014ddd1a1"
                    },
                    "responseCode": "QCQ105R2",
                    "responseText": "Good condition",
                    "responseOrder": 2,
                    "responseScore": 24,
                    "responseCommentary": "Master Ensuite - Good Condition. Waterproofing can be an issue after 6-7 years of age. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d3652d140014ddd1a0"
                    },
                    "responseCode": "QCQ105R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 17,
                    "responseCommentary": "Master Ensuite - Average Condition, although functionable, check waterproofing as unleft water isues can cause consequential damage. OK "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d3652d140014ddd19f"
                    },
                    "responseCode": "QCQ105R4",
                    "responseText": "Needs some Renovating",
                    "responseOrder": 4,
                    "responseScore": 15,
                    "responseCommentary": "Master Ensuite - Needs some work,  address any water as unleft water isues can cause consequential damage. OK"
                  }, {
                    "_id": {
                      "$oid": "5b8a67d3652d140014ddd19e"
                    },
                    "responseCode": "QCQ105R5",
                    "responseText": "Needs complete Renovation",
                    "responseOrder": 5,
                    "responseScore": 10,
                    "responseCommentary": "Master Ensuite - Needs to be renovated.  Allow $22,000-$42,000 per bathroom"
                  }, {
                    "_id": {
                      "$oid": "5b8a67d3652d140014ddd19d"
                    },
                    "responseCode": "QCQ105R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 15,
                    "responseCommentary": "Master Ensuite - Unknown Condition -  Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67d4652d140014ddd1a3"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the condition of the Main Bathroom ?",
                  "questionCode": "QCQ106",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "renovate",
                  "questionPageOrder": 14,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84dd992978bb001484ba98",
                  "dependentResponseId": "5b84dd992978bb001484ba9a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67d4652d140014ddd1a9"
                    },
                    "responseCode": "QCQ106R1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 40,
                    "responseCommentary": "Main Bathroom - New.  Staturay waterproofing warrenty is 6 years . Excellent   "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d4652d140014ddd1a8"
                    },
                    "responseCode": "QCQ106R2",
                    "responseText": "Good condition",
                    "responseOrder": 2,
                    "responseScore": 35,
                    "responseCommentary": "Main Bathroom - Good Condition."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d4652d140014ddd1a7"
                    },
                    "responseCode": "QCQ106R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 30,
                    "responseCommentary": "Main Bathroom - Average Condition although functionable. OK"
                  }, {
                    "_id": {
                      "$oid": "5b8a67d4652d140014ddd1a6"
                    },
                    "responseCode": "QCQ106R4",
                    "responseText": "Needs some Renovating",
                    "responseOrder": 4,
                    "responseScore": 20,
                    "responseCommentary": "Main Bathroom -Needs some work. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d4652d140014ddd1a5"
                    },
                    "responseCode": "QCQ106R5",
                    "responseText": "Needs complete Renovation",
                    "responseOrder": 5,
                    "responseScore": 5,
                    "responseCommentary": "Main Bathroom - Needs to be renovated.  Allow $22,000-$42,000 per bathroom "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d4652d140014ddd1a4"
                    },
                    "responseCode": "QCQ106R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 20,
                    "responseCommentary": "Mainh Bathroom - Unknown Condition -  Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67d5652d140014ddd1aa"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the condition of the Ensuite 2 ?",
                  "questionCode": "QCQ107",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "renovate",
                  "questionPageOrder": 19,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84e6432978bb001484baa4",
                  "dependentResponseId": "5b84e6432978bb001484baa6",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67d5652d140014ddd1b0"
                    },
                    "responseCode": "QCQ107R1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 30,
                    "responseCommentary": "Ensuite - New.  Staturay waterproofing warrenty is 6 years . Excellent "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d5652d140014ddd1af"
                    },
                    "responseCode": "QCQ107R2",
                    "responseText": "Good condition",
                    "responseOrder": 2,
                    "responseScore": 22,
                    "responseCommentary": "Ensuite - Good condition."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d5652d140014ddd1ae"
                    },
                    "responseCode": "QCQ107R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 15,
                    "responseCommentary": "Ensuite - Average  condition, although functionable. OK "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d5652d140014ddd1ad"
                    },
                    "responseCode": "QCQ107R4",
                    "responseText": "Needs some Renovating",
                    "responseOrder": 4,
                    "responseScore": 10,
                    "responseCommentary": "Ensuite - Needs some work. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d5652d140014ddd1ac"
                    },
                    "responseCode": "QCQ107R5",
                    "responseText": "Needs complete Renovation",
                    "responseOrder": 5,
                    "responseScore": 5,
                    "responseCommentary": "Ensuite - Needs to be renovated.  Allow $22,000-$42,000 per bathroom  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d5652d140014ddd1ab"
                    },
                    "responseCode": "QCQ107R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 15,
                    "responseCommentary": "Ensuite - Unknown conditioin -  Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67d7652d140014ddd1b8"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the condition of the floor tiles in the family room/main area?",
                  "questionCode": "QCQ109",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "renovate",
                  "questionPageOrder": 8,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f5a4c5fe1750014669098",
                  "dependentResponseId": "5b8f5a4c5fe175001466909c",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67d7652d140014ddd1be"
                    },
                    "responseCode": "QCQ109R1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 30,
                    "responseCommentary": "Family Room Tiles: (area off kitchen) - New - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d7652d140014ddd1bd"
                    },
                    "responseCode": "QCQ109R2",
                    "responseText": "Good condition",
                    "responseOrder": 2,
                    "responseScore": 22,
                    "responseCommentary": "Family Room Tiles: (area off kitchen) - Good condition - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d7652d140014ddd1bc"
                    },
                    "responseCode": "QCQ109R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 16,
                    "responseCommentary": "Family Room Tiles: (area off kitchen) - Average condition."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d7652d140014ddd1bb"
                    },
                    "responseCode": "QCQ109R4",
                    "responseText": "Needs some work",
                    "responseOrder": 4,
                    "responseScore": 14,
                    "responseCommentary": "Family Room Tiles: (area off kitchen) - Needs some tiles replaced or re grouted. (Costs can range from $75h)"
                  }, {
                    "_id": {
                      "$oid": "5b8a67d7652d140014ddd1ba"
                    },
                    "responseCode": "QCQ109R5",
                    "responseText": "Needs complete replacement",
                    "responseOrder": 5,
                    "responseScore": 10,
                    "responseCommentary": "Family Room Tiles: (area off kitchen) - Floor tiles need to  be renewed -   (stone - $150 -$200m2/ceramic tiles - $100-$150/m2)."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d7652d140014ddd1b9"
                    },
                    "responseCode": "QCQ109R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 15,
                    "responseCommentary": "Family Room Tiles: (area off kitchen) - Unknown condition  - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67d8652d140014ddd1bf"
                  },
                  "analysisTypes": [],
                  "bestSource": [],
                  "applicableSuburbs": [],
                  "text": "UNUSED - What is the condition of the granny flat?",
                  "questionCode": "QCQ110",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "renovate",
                  "questionPageOrder": 92,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b7106413bf5340014e5263e",
                  "dependentResponseId": "5b7106413bf5340014e52640",
                  "responses": [],
                  "__v": 0,
                  "summaryQuestion": false,
                  "isDeactivated": true
                },
                {
                  "_id": {
                    "$oid": "5b8a67d9652d140014ddd1c6"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the condition of the Studio/Teen Retreat?",
                  "questionCode": "QCQ111",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "renovate",
                  "questionPageOrder": 20,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8500d02978bb001484badc",
                  "dependentResponseId": "5b8500d02978bb001484bade",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67d9652d140014ddd1cc"
                    },
                    "responseCode": "QCQ111R1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Studio/Cabnana - New.  Staturay Structual warrenty is 6 years, 2 years non strcutual or manufacturers period . Excellent   "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d9652d140014ddd1cb"
                    },
                    "responseCode": "QCQ111R2",
                    "responseText": "Good condition",
                    "responseOrder": 2,
                    "responseScore": 15,
                    "responseCommentary": "Studio/Cabnana - Good Condition."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d9652d140014ddd1ca"
                    },
                    "responseCode": "QCQ111R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "Studio/Cabnana - Average Condition, although functionable. OK"
                  }, {
                    "_id": {
                      "$oid": "5b8a67d9652d140014ddd1c9"
                    },
                    "responseCode": "QCQ111R4",
                    "responseText": "Needs some Renovating",
                    "responseOrder": 4,
                    "responseScore": 8,
                    "responseCommentary": "Studio/Cabnana - Needs some work. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67d9652d140014ddd1c8"
                    },
                    "responseCode": "QCQ111R5",
                    "responseText": "Needs complete Renovation",
                    "responseOrder": 5,
                    "responseScore": 4,
                    "responseCommentary": "Studio/Cabnana - Needs to be renovated.  Allow $18,000-$25,000 per bathroom, $15,000 -$25000 per bathroom $1800/m2 for other areas"
                  }, {
                    "_id": {
                      "$oid": "5b8a67d9652d140014ddd1c7"
                    },
                    "responseCode": "QCQ111R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 10,
                    "responseCommentary": "Studio/Cabnana -  Unknown Condition -  Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67dc652d140014ddd1d5"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the condition of the carpet?",
                  "questionCode": "QCQ114",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "renovate",
                  "questionPageOrder": 16,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67dc652d140014ddd1db"
                    },
                    "responseCode": "QCQ114R1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Carpet - New. Consider stains and overall durability. Excellent   "
                  }, {
                    "_id": {
                      "$oid": "5b8a67dc652d140014ddd1da"
                    },
                    "responseCode": "QCQ114R2",
                    "responseText": "Good condition",
                    "responseOrder": 2,
                    "responseScore": 12,
                    "responseCommentary": "Carpet - Good Condition. Consider stains and overall durability."
                  }, {
                    "_id": {
                      "$oid": "5b8a67dc652d140014ddd1d9"
                    },
                    "responseCode": "QCQ114R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "Carpet - Average Condition, although functionable - Consider stains and overall durability. OK"
                  }, {
                    "_id": {
                      "$oid": "5b8a67dc652d140014ddd1d8"
                    },
                    "responseCode": "QCQ114R4",
                    "responseText": "Needs Replacing",
                    "responseOrder": 4,
                    "responseScore": 8,
                    "responseCommentary": "Carpet - Needs Replacing. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67dc652d140014ddd1d7"
                    },
                    "responseCode": "QCQ114R5",
                    "responseText": "No Carpet",
                    "responseOrder": 5,
                    "responseScore": 4,
                    "responseCommentary": "Carpet - No Carpet. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67dc652d140014ddd1d6"
                    },
                    "responseCode": "QCQ114R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 10,
                    "responseCommentary": "Carpet - Unknown condition of Carpet.  -  Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67dd652d140014ddd1dc"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the condition of the gutters and/or downpipes?",
                  "questionCode": "QCQ115",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "roof-gutters",
                  "questionPageOrder": 2,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67dd652d140014ddd1e2"
                    },
                    "responseCode": "QCQ115R1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 5,
                    "responseCommentary": "Gutters: And/or downpipes are new - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67dd652d140014ddd1e1"
                    },
                    "responseCode": "QCQ115R2",
                    "responseText": "Good condition",
                    "responseOrder": 2,
                    "responseScore": 4,
                    "responseCommentary": "Gutters: And/or downpipes are in good condition - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67dd652d140014ddd1e0"
                    },
                    "responseCode": "QCQ115R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 3,
                    "responseCommentary": "Gutters: And/or downpipes are in average condition - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67dd652d140014ddd1df"
                    },
                    "responseCode": "QCQ115R4",
                    "responseText": "Needs some Maintenance",
                    "responseOrder": 4,
                    "responseScore": 2,
                    "responseCommentary": "Gutters: And/or downpipes need some work. Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67dd652d140014ddd1de"
                    },
                    "responseCode": "QCQ115R5",
                    "responseText": "Need Renewing",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Gutters: And/or downpipes need replacing - Allow gutters $50 per lineal m and Down pipes $50 per lineal m - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67dd652d140014ddd1dd"
                    },
                    "responseCode": "QCQ115R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 2.5,
                    "responseCommentary": "Gutters: And/or downpipes, condition unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67de652d140014ddd1e3"
                  },
                  "analysisTypes": ["unrenovated"],
                  "bestSource": [],
                  "applicableSuburbs": [],
                  "text": "How old is the roofing material?",
                  "questionCode": "QCQ116",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "roof-gutters",
                  "questionPageOrder": 1,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67de652d140014ddd1e7"
                    },
                    "responseCode": "QCQ116R1",
                    "responseText": "<25 Years",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Roofing: Material is under 25 years - Consider minor maintenance to loose or cracked tiles - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67de652d140014ddd1e6"
                    },
                    "responseCode": "QCQ116R2",
                    "responseText": ">25 Years",
                    "responseOrder": 2,
                    "responseScore": 5,
                    "responseCommentary": "Roofing: Material is over 25 years - Consider a roof renovation - $80-100 per/m2 or a re-coat of $45-65/m2 - Not Good.  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67de652d140014ddd1e5"
                    },
                    "responseCode": "QCQ116R3",
                    "responseText": ">25 years but has been refurbished",
                    "responseOrder": 3,
                    "responseScore": 15,
                    "responseCommentary": "Roofing: Material is over 25 years - Although the roof has been refurbished. Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67de652d140014ddd1e4"
                    },
                    "responseCode": "QCQ116R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 10,
                    "responseCommentary": "Roofing: Unknown age is unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67df652d140014ddd1e8"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is the external finish of the front of the house the same across the side and the back?",
                  "questionCode": "QCQ117",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "wall-floor-finishes",
                  "questionPageOrder": 3,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67df652d140014ddd1eb"
                    },
                    "responseCode": "QCQ117R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "External Finish: The front of house is uniform with the back of house - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67df652d140014ddd1ea"
                    },
                    "responseCode": "QCQ117R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "External Finish: The front of house is not the samne as the rear of house Not uniform - This indicates cheap construction - Not Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67df652d140014ddd1e9"
                    },
                    "responseCode": "QCQ117R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "External Finish: Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67e0652d140014ddd1ec"
                  },
                  "analysisTypes": ["new-house"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What type of plasterboard is used?",
                  "questionCode": "QCQ118",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "wall-floor-finishes",
                  "questionPageOrder": 24,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67e0652d140014ddd1ef"
                    },
                    "responseCode": "QCQ118R1",
                    "responseText": "Standard plasterboard",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Plasterboard : Standard 10mm/13mm to code - OK."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e0652d140014ddd1ee"
                    },
                    "responseCode": "QCQ118R2",
                    "responseText": "Standard & Acoustic (sound stop/sound screen) Plasterboard",
                    "responseOrder": 2,
                    "responseScore": 7,
                    "responseCommentary": "Plasterboard:  Standard & Acoustic type (sound stop/sound screen) - Note the noise & strength qualities - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e0652d140014ddd1ed"
                    },
                    "responseCode": "QCQ118R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 3.5,
                    "responseCommentary": "Pasterboard: Unknown Type - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67e1652d140014ddd1f0"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Are the floors of the wet areas (e.g. in a bathroom or laundry) the same height as the floor outside the door?",
                  "questionCode": "QCQ119",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "wall-floor-finishes",
                  "questionPageOrder": 13,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67e1652d140014ddd1f3"
                    },
                    "responseCode": "QCQ119R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 15,
                    "responseCommentary": "Bathroom Floor height: Is the same height as the adjoining floor at the door - Good Quality Construction - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e1652d140014ddd1f2"
                    },
                    "responseCode": "QCQ119R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Bathroom Floor height: Is higher than the adjoining floor at the door - Cheap construction consider tripping and saftey - OK."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e1652d140014ddd1f1"
                    },
                    "responseCode": "QCQ119R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 7.5,
                    "responseCommentary": "Bathroom Flor height: Unknown if the Floor height is not higher than the adjoining floor at the door - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67e2652d140014ddd1f4"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Find a bathroom where there is a tiled external corner/s, what is the joining method?",
                  "questionCode": "QCQ120",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "wall-floor-finishes",
                  "questionPageOrder": 14,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67e2652d140014ddd1fe"
                    },
                    "responseCode": "QCQ120R1",
                    "responseText": "Mitred cut",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Bathroom Tile Joining method:  External corners are joined by a mitred cut - Quality workmanship - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e2652d140014ddd1fd"
                    },
                    "responseCode": "QCQ120R2",
                    "responseText": "Butt Joint",
                    "responseOrder": 2,
                    "responseScore": 6,
                    "responseCommentary": "Bathroom Tile Joining method: External corners are joined by butting the tiles togeather consider seeing unglassed side of tile - Ok "
                  }, {
                    "_id": {
                      "$oid": "5b8a67e2652d140014ddd1fc"
                    },
                    "responseCode": "QCQ120R3",
                    "responseText": "Joined with Plastic strip",
                    "responseOrder": 3,
                    "responseScore": 6,
                    "responseCommentary": "Bathroom Tile Joining method: Eexternal corners are joined by a plastic strip - Cheap workmanship - OK."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e2652d140014ddd1fb"
                    },
                    "responseCode": "QCQ120R4",
                    "responseText": "Joined with Metal strip",
                    "responseOrder": 4,
                    "responseScore": 6,
                    "responseCommentary": "Bathroom Tile Joining method: External corners are joined by a metal strip - Cheap workmanship - OK."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e2652d140014ddd1fa"
                    },
                    "responseCode": "QCQ120R5",
                    "responseText": "No external corners",
                    "responseOrder": 5,
                    "responseScore": 5,
                    "responseCommentary": "Bathroom Tile Joining method: NO External corners."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e2652d140014ddd1f9"
                    },
                    "responseCode": "QCQ120R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 5,
                    "responseCommentary": "Bathroom Tile Joining method: Unknown how mitres are joined at external corners - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67e3652d140014ddd1ff"
                  },
                  "analysisTypes": ["new-house"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the type of glass used on the majority of the Windows?",
                  "questionCode": "QCQ122",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "windows-doors",
                  "questionPageOrder": 24,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67e3652d140014ddd203"
                    },
                    "responseCode": "QCQ122R1",
                    "responseText": "Laminated",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Window Glass: Laminated - Note Solar, Acoustic, Thermal & safety qualities - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e3652d140014ddd202"
                    },
                    "responseCode": "QCQ122R2",
                    "responseText": "Safety",
                    "responseOrder": 2,
                    "responseScore": 8,
                    "responseCommentary": "Window Glass: Safety glass - Note the safety qualities - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e3652d140014ddd201"
                    },
                    "responseCode": "QCQ122R3",
                    "responseText": "Standard",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Window Glass: Float glass - Consider safety - Not good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e3652d140014ddd200"
                    },
                    "responseCode": "QCQ122R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 5,
                    "responseCommentary": "Window Glass: Unknown Type - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67e4652d140014ddd204"
                  },
                  "analysisTypes": ["renovated-house", "new-house", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is the front door a pivot door?",
                  "questionCode": "QCQ123",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "windows-doors",
                  "questionPageOrder": 1,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67e4652d140014ddd207"
                    },
                    "responseCode": "QCQ123R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 15,
                    "responseCommentary": "Door Front: Pivot Door System - Smooth action, Quality and expensive. - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e4652d140014ddd206"
                    },
                    "responseCode": "QCQ123R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 7,
                    "responseCommentary": "Door Front: Hinged Door system -Tradional cheaper form of construction - Ok."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e4652d140014ddd205"
                    },
                    "responseCode": "QCQ123R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 7,
                    "responseCommentary": "Door Front: Unknown Door type - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67e5652d140014ddd208"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the height of the majority of the internal door/s?",
                  "questionCode": "QCQ124",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "windows-doors",
                  "questionPageOrder": 9,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67e5652d140014ddd20b"
                    },
                    "responseCode": "QCQ124R1",
                    "responseText": "Higher than standard - Above 2.1m",
                    "responseOrder": 2,
                    "responseScore": 5,
                    "responseCommentary": "Door Height Internal: Higher than standard hieght of 2.1m - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e5652d140014ddd20a"
                    },
                    "responseCode": "QCQ124R2",
                    "responseText": "Standard Height - Below 2.1m",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Door Height Internal: Standard hieght below 2.1m - OK."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e5652d140014ddd209"
                    },
                    "responseCode": "QCQ124R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 2.5,
                    "responseCommentary": "Door Height Internal: Unknown - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67e6652d140014ddd20c"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What type of doors lead to the outdoor entertaining area ?",
                  "questionCode": "QCQ125",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "windows-doors",
                  "questionPageOrder": 17,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b849a4a2978bb001484ba75",
                  "dependentResponseId": "5b849a4a2978bb001484ba77",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67e6652d140014ddd211"
                    },
                    "responseCode": "QCQ125R1",
                    "responseText": "Bifold",
                    "responseOrder": 1,
                    "responseScore": 15,
                    "responseCommentary": "Family Room: (area off Kitchen) Has bifold doors opening  to the outdoor area - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e6652d140014ddd210"
                    },
                    "responseCode": "QCQ125R2",
                    "responseText": "Sliding doors",
                    "responseOrder": 2,
                    "responseScore": 10,
                    "responseCommentary": "Family Room: (area off Kitchen) Has Sliding doors opening  to the outdoor area - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e6652d140014ddd20f"
                    },
                    "responseCode": "QCQ125R3",
                    "responseText": "French doors",
                    "responseOrder": 3,
                    "responseScore": 8,
                    "responseCommentary": "Family Room: (area off Kitchen) Has French doors opening  to the outdoor area - OK"
                  }, {
                    "_id": {
                      "$oid": "5b8a67e6652d140014ddd20e"
                    },
                    "responseCode": "QCQ125R4",
                    "responseText": "No multiple doors",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Family Room: (area off Kitchen) NO doors opening  to the outdoor area - Not good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67e6652d140014ddd20d"
                    },
                    "responseCode": "QCQ125R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 7.5,
                    "responseCommentary": "Family Room: (area off Kitchen) Unknown if there is an opening to the outdoor - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67e7652d140014ddd212"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the roofing material? ",
                  "questionCode": "STQ126",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "roof-gutters",
                  "questionPageOrder": 1,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67e7652d140014ddd218"
                    },
                    "responseCode": "STQ126R1",
                    "responseText": "Concrete Roof Tiles Standard",
                    "responseOrder": 1,
                    "responseScore": 40,
                    "responseCommentary": "Roofing: Roof tiles: Concrete. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67e7652d140014ddd217"
                    },
                    "responseCode": "STQ126R2",
                    "responseText": "Terracotta Roof Tiles Standard",
                    "responseOrder": 2,
                    "responseScore": 50,
                    "responseCommentary": "Roofing: Roof tiles: Terracotta. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67e7652d140014ddd216"
                    },
                    "responseCode": "STQ126R3",
                    "responseText": "Metal Roof Standard",
                    "responseOrder": 3,
                    "responseScore": 40,
                    "responseCommentary": "Roofing: Metal Roof. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67e7652d140014ddd215"
                    },
                    "responseCode": "STQ126R4",
                    "responseText": "Architectural Non Standard (e.g. slate, composite slate, metal non-standard)",
                    "responseOrder": 4,
                    "responseScore": 75,
                    "responseCommentary": "Roofing: Roof tiles: Slate/composite Material is non standard Quality and Expense - Excellent"
                  }, {
                    "_id": {
                      "$oid": "5b8a67e7652d140014ddd214"
                    },
                    "responseCode": "STQ126R5",
                    "responseText": "Other",
                    "responseOrder": 5,
                    "responseScore": 35,
                    "responseCommentary": "Roofing: Material is not listed. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67e7652d140014ddd213"
                    },
                    "responseCode": "STQ126R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 35,
                    "responseCommentary": "Roofing: Material is unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67e8652d140014ddd219"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site", "real-estate-agent"],
                  "applicableSuburbs": [],
                  "text": "What is the floor construction on the Ground Floor?",
                  "questionCode": "STQ127",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 3,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b851eca25ac1800144a0fa8",
                  "dependentResponseId": "5b851eca25ac1800144a0fa9",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67e8652d140014ddd21d"
                    },
                    "responseCode": "STQ127R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Floor Structure: Ground Floor - Timber - Consider potential noise, dirt & air gaps, water issues and termites - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67e8652d140014ddd21c"
                    },
                    "responseCode": "STQ127R2",
                    "responseText": "Concrete",
                    "responseOrder": 2,
                    "responseScore": 40,
                    "responseCommentary": "Floor Structure: Ground Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67e8652d140014ddd21b"
                    },
                    "responseCode": "STQ127R3",
                    "responseText": "Timber & Concrete",
                    "responseOrder": 3,
                    "responseScore": 30,
                    "responseCommentary": "Floor Structure: Ground Floor - Combination of timber and concrete - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67e8652d140014ddd21a"
                    },
                    "responseCode": "STQ127R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 20,
                    "responseCommentary": "Floor Structure: Ground Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67e9652d140014ddd21e"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "unrenovated", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the floor construction on the 1st Floor?",
                  "questionCode": "STQ128",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 4,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b851f7025ac1800144a0faa",
                  "dependentResponseId": "5b851f7025ac1800144a0fab",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67e9652d140014ddd223"
                    },
                    "responseCode": "STQ128R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 22,
                    "responseCommentary": "Floor Structure: 1st Floor - Timber - Consider potential noise, dirt & air gaps, water issues and termites - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67e9652d140014ddd222"
                    },
                    "responseCode": "STQ128R2",
                    "responseText": "Concrete",
                    "responseOrder": 2,
                    "responseScore": 40,
                    "responseCommentary": "Floor Structure: 1st Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67e9652d140014ddd221"
                    },
                    "responseCode": "STQ128R3",
                    "responseText": "Timber & Concrete",
                    "responseOrder": 3,
                    "responseScore": 30,
                    "responseCommentary": "Floor Structure: 1st Floor - Combination of timber and concrete - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67e9652d140014ddd21f"
                    },
                    "responseCode": "STQ128R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 20,
                    "responseCommentary": "Floor Structure: 1st Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67ea652d140014ddd224"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the floor construction on the 2nd Floor?",
                  "questionCode": "STQ129",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 5,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b85205025ac1800144a0fb4",
                  "dependentResponseId": "5b85205025ac1800144a0fb6",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67ea652d140014ddd229"
                    },
                    "responseCode": "STQ129R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: 2nd Floor - Timber - Consider potential noise, dirt & air gaps, water issues and termites - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ea652d140014ddd228"
                    },
                    "responseCode": "STQ129R2",
                    "responseText": "Concrete",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: 2nd Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ea652d140014ddd227"
                    },
                    "responseCode": "STQ129R3",
                    "responseText": "Timber & Concrete",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: 2nd Floor - Combination of timber and concrete - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ea652d140014ddd225"
                    },
                    "responseCode": "STQ129R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: 2nd Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67f0652d140014ddd246"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the internal wall construction on the Ground Floor? ",
                  "questionCode": "STQ134",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 17,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b851eca25ac1800144a0fa8",
                  "dependentResponseId": "5b851eca25ac1800144a0fa9",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67f0652d140014ddd24b"
                    },
                    "responseCode": "STQ134R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 15,
                    "responseCommentary": "Internal Wall Structure:  Ground Floor - Timber - Consider building integrity, noise, insulation and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f0652d140014ddd24a"
                    },
                    "responseCode": "STQ134R2",
                    "responseText": "Brick",
                    "responseOrder": 2,
                    "responseScore": 30,
                    "responseCommentary": "Internal Wall Structure:  Ground Floor - Brick - Quality, structure, acoustic and thermal qualities- Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f0652d140014ddd249"
                    },
                    "responseCode": "STQ134R3",
                    "responseText": "Concrete ",
                    "responseOrder": 3,
                    "responseScore": 30,
                    "responseCommentary": "Internal Wall Structure:  Ground Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f0652d140014ddd248"
                    },
                    "responseCode": "STQ134R4",
                    "responseText": "Mixture of Timber and Brick ",
                    "responseOrder": 4,
                    "responseScore": 22,
                    "responseCommentary": "Internal Wall Structure:  Ground Floor - Combination of brick and timber -  Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f0652d140014ddd247"
                    },
                    "responseCode": "STQ134R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 15,
                    "responseCommentary": "Internal Wall Structure:  Ground Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67f1652d140014ddd24c"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the internal wall construction on the 1st Floor? ",
                  "questionCode": "STQ135",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 18,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b851f7025ac1800144a0faa",
                  "dependentResponseId": "5b851f7025ac1800144a0fab",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67f1652d140014ddd251"
                    },
                    "responseCode": "STQ135R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Internal Wall Structure:  1st Floor - Timber - Consider building integrity, noise, insulation and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f1652d140014ddd250"
                    },
                    "responseCode": "STQ135R2",
                    "responseText": "Brick",
                    "responseOrder": 2,
                    "responseScore": 40,
                    "responseCommentary": "Internal Wall Structure:  1st Floor - Brick - Quality, structure, acoustic and thermal qualities- Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f1652d140014ddd24f"
                    },
                    "responseCode": "STQ135R3",
                    "responseText": "Concrete ",
                    "responseOrder": 3,
                    "responseScore": 40,
                    "responseCommentary": "Internal Wall Structure:  1st Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f1652d140014ddd24e"
                    },
                    "responseCode": "STQ135R4",
                    "responseText": "Mixture of Timber and Brick ",
                    "responseOrder": 4,
                    "responseScore": 30,
                    "responseCommentary": "Internal Wall Structure:  1st Floor - Combination of brick and timber -  Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f1652d140014ddd24d"
                    },
                    "responseCode": "STQ135R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 20,
                    "responseCommentary": "Internal Wall Structure:  1st Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67f2652d140014ddd252"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the internal wall construction on the 2nd Floor? ",
                  "questionCode": "STQ136",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 19,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b85205025ac1800144a0fb4",
                  "dependentResponseId": "5b85205025ac1800144a0fb6",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67f2652d140014ddd257"
                    },
                    "responseCode": "STQ136R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  2nd Floor - Timber - Consider building integrity, noise, insulation and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f2652d140014ddd256"
                    },
                    "responseCode": "STQ136R2",
                    "responseText": "Brick",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  2nd Floor - Brick - Quality, structure, acoustic and thermal qualities- Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f2652d140014ddd255"
                    },
                    "responseCode": "STQ136R3",
                    "responseText": "Concrete ",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  2nd Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f2652d140014ddd254"
                    },
                    "responseCode": "STQ136R4",
                    "responseText": "Mixture of Timber and Brick ",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  2nd Floor - Combination of brick and timber -  Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f2652d140014ddd253"
                    },
                    "responseCode": "STQ136R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  2nd Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67f3652d140014ddd258"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "unrenovated", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the internal wall construction on the 3rd Floor? ",
                  "questionCode": "STQ137",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 20,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b85211525ac1800144a0fb7",
                  "dependentResponseId": "5b85211525ac1800144a0fb9",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67f3652d140014ddd25d"
                    },
                    "responseCode": "STQ137R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  3rd Floor - Timber - Consider building integrity, noise, insulation and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f3652d140014ddd25c"
                    },
                    "responseCode": "STQ137R2",
                    "responseText": "Brick",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  3rd Floor - Brick - Quality, structure, acoustic and thermal qualities- Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f3652d140014ddd25b"
                    },
                    "responseCode": "STQ137R3",
                    "responseText": "Concrete ",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  3rd Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f3652d140014ddd25a"
                    },
                    "responseCode": "STQ137R4",
                    "responseText": "Mixture of Timber and Brick ",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  3rd Floor - Combination of brick and timber -  Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67f3652d140014ddd259"
                    },
                    "responseCode": "STQ137R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  3rd Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8b47e4ced1700014c56996"
                  },
                  "analysisTypes": ["knockdown-rebuild", "new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site", "floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Describe the Rear Garden ?",
                  "questionCode": "IMPQ17",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 14,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8b4a2aced1700014c5699c"
                    },
                    "responseCode": "IMPQ17R1",
                    "responseText": "None",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Rear Garden - NO - In a family area this is not positive and can impact the value of the property - Not Good "
                  }, {
                    "_id": {
                      "$oid": "5b8b4a2aced1700014c5699b"
                    },
                    "responseCode": "IMPQ17R2",
                    "responseText": "Garden",
                    "responseOrder": 2,
                    "responseScore": 20,
                    "responseCommentary": "Rear Garden: Garden Only - no usable grassed lawn is not a positive outcome and can have valuation impacts  - Not Good"
                  }, {
                    "_id": {
                      "$oid": "5b8b4a2aced1700014c5699a"
                    },
                    "responseCode": "IMPQ17R3",
                    "responseText": "Garden & Lawn",
                    "responseOrder": 3,
                    "responseScore": 40,
                    "responseCommentary": "Rear Garden - Lawn & Garden"
                  }, {
                    "_id": {
                      "$oid": "5b8b4a2aced1700014c56999"
                    },
                    "responseCode": "IMPQ17R4",
                    "responseText": "Garden & Courtyard/Paved area",
                    "responseOrder": 4,
                    "responseScore": 20,
                    "responseCommentary": "Rear Garden - Garen & Courtyard/Paved area"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8c74536e6d100014242b59"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site", "floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Describe the Rear Lawn Area ?",
                  "questionCode": "IMPQ18",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 15,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8b47e4ced1700014c56996",
                  "dependentResponseId": "5b8b4a2aced1700014c5699a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8c74536e6d100014242b5f"
                    },
                    "responseCode": "IMPQ18R1",
                    "responseText": "<30m2",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Lawn - Area very small and unusable for any sporting activity - Not Good"
                  }, {
                    "_id": {
                      "$oid": "5b8c74536e6d100014242b5e"
                    },
                    "responseCode": "IMPQ18R2",
                    "responseText": "30 - 60m2",
                    "responseOrder": 2,
                    "responseScore": 18
                  }, {
                    "_id": {
                      "$oid": "5b8c74536e6d100014242b5d"
                    },
                    "responseCode": "IMPQ18R3",
                    "responseText": "Lawn 60-150m2 flat-gentle slope",
                    "responseOrder": 3,
                    "responseScore": 35
                  }, {
                    "_id": {
                      "$oid": "5b8c74536e6d100014242b5c"
                    },
                    "responseCode": "IMPQ18R4",
                    "responseText": "Lawn 50-150m2 sloped                                      ",
                    "responseOrder": 4,
                    "responseScore": 25
                  }, {
                    "_id": {
                      "$oid": "5b8c74536e6d100014242b5b"
                    },
                    "responseCode": "IMPQ18R5",
                    "responseText": "Lawn >150m2 flat-gentle slope     ",
                    "responseOrder": 5,
                    "responseScore": 50
                  }, {
                    "_id": {
                      "$oid": "5b8c74536e6d100014242b5a"
                    },
                    "responseCode": "IMPQ18R6",
                    "responseText": "Lawn >150m2 sloped",
                    "responseOrder": 6,
                    "responseScore": 45
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8a67bb652d140014ddd11e"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Are the majority of Kitchen appliances from Miele, Gaggenau or Neff?",
                  "questionCode": "INQ81",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "appliances",
                  "questionPageOrder": 6,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67bb652d140014ddd121"
                    },
                    "responseCode": "INQ81R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 25,
                    "responseCommentary": "Kitchen Appliances - YES - Quality European Brands - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67bb652d140014ddd120"
                    },
                    "responseCode": "INQ81R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Kitchen Applinaces: The majority of appliance are average Brands - OK."
                  }, {
                    "_id": {
                      "$oid": "5b8a67bb652d140014ddd11f"
                    },
                    "responseCode": "INQ81R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 18,
                    "responseCommentary": "Kitchen Appliances: Unknown: Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8c89286e6d100014242c9b"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan", "on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the Rear Courtyard ?",
                  "questionCode": "IMPQ19",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 16,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8b47e4ced1700014c56996",
                  "dependentResponseId": "5b8b4a2aced1700014c56999",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8c89286e6d100014242c9c"
                    },
                    "responseCode": "IMPQ19R1",
                    "responseText": "<10m2",
                    "responseOrder": 1,
                    "responseScore": 10
                  }, {
                    "_id": {
                      "$oid": "5b8c8e6f6e6d100014242d38"
                    },
                    "responseCode": "IMPQ19R1",
                    "responseText": "10-25m2                                                  ",
                    "responseOrder": 2,
                    "responseScore": 15
                  }, {
                    "_id": {
                      "$oid": "5b8c8e6f6e6d100014242d37"
                    },
                    "responseCode": "IMPQ19R3",
                    "responseText": "25-50m2                                    ",
                    "responseOrder": 3,
                    "responseScore": 20
                  }, {
                    "_id": {
                      "$oid": "5b8c8e6f6e6d100014242d36"
                    },
                    "responseCode": "IMPQ19R4",
                    "responseText": ">50m2                                             ",
                    "responseOrder": 4,
                    "responseScore": 20
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8a67be652d140014ddd12c"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is there solar power?",
                  "questionCode": "INQ84",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "electrical",
                  "questionPageOrder": 17,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67be652d140014ddd12f"
                    },
                    "responseCode": "INQ84R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Solar Panels: Yes - Cost saving on energy- Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67be652d140014ddd12e"
                    },
                    "responseCode": "INQ84R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Solar Panels: NO - OK."
                  }, {
                    "_id": {
                      "$oid": "5b8a67be652d140014ddd12d"
                    },
                    "responseCode": "INQ84R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Solare Panels: Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67bf652d140014ddd130"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Is there a Solar backup battery? (e.g. Tesla Battery)",
                  "questionCode": "INQ85",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "electrical",
                  "questionPageOrder": 18,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67bf652d140014ddd133"
                    },
                    "responseCode": "INQ85R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Solar Back Up Battery: Yes - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67bf652d140014ddd132"
                    },
                    "responseCode": "INQ85R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Solar Back Up Battery: NO - OK."
                  }, {
                    "_id": {
                      "$oid": "5b8a67bf652d140014ddd131"
                    },
                    "responseCode": "INQ85R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Solar Back Up Battery: Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67c0652d140014ddd134"
                  },
                  "analysisTypes": [],
                  "bestSource": [],
                  "applicableSuburbs": [],
                  "text": "UNUSED - Are the majority of the lights LED's?",
                  "questionCode": "INQ86",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "electrical",
                  "questionPageOrder": 68,
                  "adjustmentQuestion": false,
                  "dependentMode": "exclude",
                  "dependentQuestionId": "5b851eca25ac1800144a0fa8",
                  "dependentResponseId": "5b851eca25ac1800144a0fa9",
                  "responses": [],
                  "__v": 0,
                  "summaryQuestion": false,
                  "isDeactivated": true
                },
                {
                  "_id": {
                    "$oid": "5b8a67c1652d140014ddd138"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Are the lights under the control of home automation? (e.g. CBUS App)",
                  "questionCode": "INQ87",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "electrical",
                  "questionPageOrder": 69,
                  "adjustmentQuestion": true,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67c1652d140014ddd13b"
                    },
                    "responseCode": "INQ87R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Home Automation: Yes - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c1652d140014ddd13a"
                    },
                    "responseCode": "INQ87R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Home Automation: NO - Ok."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c1652d140014ddd139"
                    },
                    "responseCode": "INQ87R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 10,
                    "responseCommentary": "Home Automation: Unknown - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67c2652d140014ddd13c"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the house have a ducted vacuum system?",
                  "questionCode": "INQ88",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "electrical",
                  "questionPageOrder": 14,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67c2652d140014ddd13f"
                    },
                    "responseCode": "INQ88R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 4,
                    "responseCommentary": "Ducted Vacuum System: Yes - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c2652d140014ddd13e"
                    },
                    "responseCode": "INQ88R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Ducted Vacuum System: NO - OK."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c2652d140014ddd13d"
                    },
                    "responseCode": "INQ88R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 2,
                    "responseCommentary": "Ducted Vacuum System: Unknown - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67c3652d140014ddd140"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the house have an integrated music system?",
                  "questionCode": "INQ89",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "electrical",
                  "questionPageOrder": 9,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67c3652d140014ddd143"
                    },
                    "responseCode": "INQ89R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Intergrated music system: Yes - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c3652d140014ddd142"
                    },
                    "responseCode": "INQ89R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Integrated music system: No - ok."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c3652d140014ddd141"
                    },
                    "responseCode": "INQ89R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 5,
                    "responseCommentary": "Intergrated music system: Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67c4652d140014ddd144"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Are there Wi-Fi boosters throughout the house?",
                  "questionCode": "INQ90",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "electrical",
                  "questionPageOrder": 10,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67c4652d140014ddd147"
                    },
                    "responseCode": "INQ90R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 8,
                    "responseCommentary": "WIFI booster/s system: Yes - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c4652d140014ddd146"
                    },
                    "responseCode": "INQ90R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "WIFI booster/s system: NO - OK."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c4652d140014ddd145"
                    },
                    "responseCode": "INQ90R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 4,
                    "responseCommentary": "WIFI booster/s system: Unknown - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67c9652d140014ddd162"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Are there security cameras?",
                  "questionCode": "INQ95",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "security",
                  "questionPageOrder": 12,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67c9652d140014ddd165"
                    },
                    "responseCode": "INQ95R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 7,
                    "responseCommentary": "Security cameras: Yes - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c9652d140014ddd164"
                    },
                    "responseCode": "INQ95R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Security Cameras: NO - Ok."
                  }, {
                    "_id": {
                      "$oid": "5b8a67c9652d140014ddd163"
                    },
                    "responseCode": "INQ95R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 3.5,
                    "responseCommentary": "Security Cameras: Unknown -  Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8cab346e6d100014243367"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["contract-survey", "on-site", "floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Describe the Front Garden ?",
                  "questionCode": "IMPQ20   ",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 3,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8cab346e6d10001424336b"
                    },
                    "responseCode": "IMPQ20R1",
                    "responseText": "None",
                    "responseOrder": 1,
                    "responseScore": 0
                  }, {
                    "_id": {
                      "$oid": "5b8cab346e6d10001424336a"
                    },
                    "responseCode": "IMPQ20R2",
                    "responseText": "Garden",
                    "responseOrder": 2,
                    "responseScore": 5
                  }, {
                    "_id": {
                      "$oid": "5b8cab346e6d100014243369"
                    },
                    "responseCode": "IMPQ20R3",
                    "responseText": "Garden & Lawn",
                    "responseOrder": 3,
                    "responseScore": 10
                  }, {
                    "_id": {
                      "$oid": "5b8cab346e6d100014243368"
                    },
                    "responseCode": "IMPQ20R4",
                    "responseText": "Garden & Courtyard/Paved area",
                    "responseOrder": 4,
                    "responseScore": 5
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8a67ce652d140014ddd17d"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the main bathroom have a linear drain?",
                  "questionCode": "QCQ100",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "bathroom-kitchen-fittings",
                  "questionPageOrder": 15,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84dd992978bb001484ba98",
                  "dependentResponseId": "5b84dd992978bb001484ba9a",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67ce652d140014ddd17f"
                    },
                    "responseCode": "QCQ100R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 5,
                    "responseCommentary": "Main Bathroom Linear Drain - Yes Qualitry and expensive a sign of money being spent. Excellent"
                  }, {
                    "_id": {
                      "$oid": "5b8a67ce652d140014ddd17e"
                    },
                    "responseCode": "QCQ100R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Main Bathroom Linear Drain - NO Standard drainage cheaper construction. OK"
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8cad486e6d100014243400"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan", "on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the Front Lawn area?",
                  "questionCode": "IMPQ21",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 4,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8cab346e6d100014243367",
                  "dependentResponseId": "5b8cab346e6d100014243369",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8cad486e6d100014243405"
                    },
                    "responseCode": "IMPQ21R1 ",
                    "responseText": "<30m2                                                        ",
                    "responseOrder": 1,
                    "responseScore": 5
                  }, {
                    "_id": {
                      "$oid": "5b8cad486e6d100014243404"
                    },
                    "responseCode": "IMPQ21R2",
                    "responseText": "30-65m2                                                       ",
                    "responseOrder": 2,
                    "responseScore": 10
                  }, {
                    "_id": {
                      "$oid": "5b8cad486e6d100014243403"
                    },
                    "responseCode": "IMPQ21R3",
                    "responseText": "Lawn 65-150m2 flat-gentle slope",
                    "responseOrder": 3,
                    "responseScore": 13
                  }, {
                    "_id": {
                      "$oid": "5b8cad486e6d100014243402"
                    },
                    "responseCode": "IMPQ21R4",
                    "responseText": "Lawn 65-150m2 sloped                                      ",
                    "responseOrder": 4,
                    "responseScore": 10
                  }, {
                    "_id": {
                      "$oid": "5b8cad486e6d100014243401"
                    },
                    "responseCode": "IMPQ20R5",
                    "responseText": "Lawn >150m2 flat-gentle slope",
                    "responseOrder": 5,
                    "responseScore": 15
                  }, {
                    "_id": {
                      "$oid": "5b8cb64750a87c0014322f1a"
                    },
                    "responseCode": "IMPQ20R6",
                    "responseText": "Lawn >150m2 sloped                                      ",
                    "responseOrder": 6,
                    "responseScore": 12
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8a67d6652d140014ddd1b1"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the condition of the timber floorboards in the family room/main area?",
                  "questionCode": "QCQ108",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "renovate",
                  "questionPageOrder": 7,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f5a4c5fe1750014669098",
                  "dependentResponseId": "5b8f5a4c5fe175001466909d",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67d6652d140014ddd1b7"
                    },
                    "responseCode": "QCQ108R1",
                    "responseText": "New",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Family Room Floorboards: (area off kitchen) - New - consider warranty deatils  - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d6652d140014ddd1b6"
                    },
                    "responseCode": "QCQ108R2",
                    "responseText": "Good condition",
                    "responseOrder": 2,
                    "responseScore": 16,
                    "responseCommentary": "Family Room Floorboards: (area off kitchen) - Good condition - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d6652d140014ddd1b5"
                    },
                    "responseCode": "QCQ108R3",
                    "responseText": "Average",
                    "responseOrder": 3,
                    "responseScore": 11,
                    "responseCommentary": "Family Room Floorboards: (area off kitchen) - Average condition."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d6652d140014ddd1b4"
                    },
                    "responseCode": "QCQ108R4",
                    "responseText": "Needs re-sanding and re-polishing",
                    "responseOrder": 4,
                    "responseScore": 10,
                    "responseCommentary": "Family Room Floorboards: (area off kitchen) - Needs re-sanding and re-polishing. (Costs can range from $55-75m2)"
                  }, {
                    "_id": {
                      "$oid": "5b8a67d6652d140014ddd1b3"
                    },
                    "responseCode": "QCQ108R5",
                    "responseText": "Needs complete replacement",
                    "responseOrder": 5,
                    "responseScore": 6,
                    "responseCommentary": "Family Room Floorboards: (area off kitchen) - Floor covering is to be renewed -(timber - $100-$200m2 depending on quality and coulour).  (stone - $150 -$200m2/ceramic tiles - $100-$150/m2/timber - $100-$200m2)."
                  }, {
                    "_id": {
                      "$oid": "5b8a67d6652d140014ddd1b2"
                    },
                    "responseCode": "QCQ108R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 10,
                    "responseCommentary": "Family Room Floorboards: (area off kitchen) - Unknown condition  - Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8caf1950a87c0014322e40"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan", "on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the Front Courtyard ?",
                  "questionCode": "IMPQ22",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 5,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8cab346e6d100014243367",
                  "dependentResponseId": "5b8cab346e6d100014243368",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8caf1950a87c0014322e44"
                    },
                    "responseCode": "IMPQ22R1",
                    "responseText": "<10m2                                                     ",
                    "responseOrder": 1,
                    "responseScore": 5
                  }, {
                    "_id": {
                      "$oid": "5b8caf1950a87c0014322e43"
                    },
                    "responseCode": "IMPQ22R2",
                    "responseText": "10-25m2                                                  ",
                    "responseOrder": 2,
                    "responseScore": 7
                  }, {
                    "_id": {
                      "$oid": "5b8caf1950a87c0014322e42"
                    },
                    "responseCode": "IMPQ22R3",
                    "responseText": "25-50m2                                    ",
                    "responseOrder": 3,
                    "responseScore": 10
                  }, {
                    "_id": {
                      "$oid": "5b8caf1950a87c0014322e41"
                    },
                    "responseCode": "IMPQ22R4",
                    "responseText": ">50m2",
                    "responseOrder": 4,
                    "responseScore": 10
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8a67da652d140014ddd1cd"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the interior of the house need repainting?",
                  "questionCode": "QCQ112",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "renovate",
                  "questionPageOrder": 15,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67da652d140014ddd1d0"
                    },
                    "responseCode": "QCQ112R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 15,
                    "responseCommentary": "Internal Painting - Needs painting. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67da652d140014ddd1cf"
                    },
                    "responseCode": "QCQ112R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 40,
                    "responseCommentary": "Internal Painting - NO painting needed."
                  }, {
                    "_id": {
                      "$oid": "5b8a67da652d140014ddd1ce"
                    },
                    "responseCode": "QCQ112R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 27.5,
                    "responseCommentary": "Internal Painting - Unknown if painting is needed."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67db652d140014ddd1d1"
                  },
                  "analysisTypes": ["renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Does the exterior of the house need repainting?",
                  "questionCode": "QCQ113",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "renovate",
                  "questionPageOrder": 4,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67db652d140014ddd1d4"
                    },
                    "responseCode": "QCQ113R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 15,
                    "responseCommentary": "External Painting - Needs painting. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67db652d140014ddd1d3"
                    },
                    "responseCode": "QCQ113R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 40,
                    "responseCommentary": "External Painting - NO painting needed."
                  }, {
                    "_id": {
                      "$oid": "5b8a67db652d140014ddd1d2"
                    },
                    "responseCode": "QCQ113R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 27.5,
                    "responseCommentary": "External Painting - Unknown if painting is needed."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8cb41850a87c0014322ec7"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan", "on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the Side Garden ?",
                  "questionCode": "IMPQ23 ",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 11,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8cb41850a87c0014322ecb"
                    },
                    "responseCode": "IMPQ23R1",
                    "responseText": "None",
                    "responseOrder": 1,
                    "responseScore": 0
                  }, {
                    "_id": {
                      "$oid": "5b8cb41850a87c0014322eca"
                    },
                    "responseCode": "IMPQ23R2",
                    "responseText": "Garden Only",
                    "responseOrder": 2,
                    "responseScore": 5
                  }, {
                    "_id": {
                      "$oid": "5b8cb41850a87c0014322ec9"
                    },
                    "responseCode": "IMPQ23R3",
                    "responseText": "Garden & Lawn ",
                    "responseOrder": 3,
                    "responseScore": 10
                  }, {
                    "_id": {
                      "$oid": "5b8cb41850a87c0014322ec8"
                    },
                    "responseCode": "IMPQ23R4",
                    "responseText": "Garden & Courtyard ",
                    "responseOrder": 4,
                    "responseScore": 5
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8cb5e350a87c0014322f03"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan", "off-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the Side Lawn Area ?",
                  "questionCode": "IMPQ24",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 12,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8cb41850a87c0014322ec7",
                  "dependentResponseId": "5b8cb41850a87c0014322ec9",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8cb5e350a87c0014322f04"
                    },
                    "responseCode": "IMPQ24R1 ",
                    "responseText": "<25m2                                                        ",
                    "responseOrder": 1,
                    "responseScore": 5
                  }, {
                    "_id": {
                      "$oid": "5b8cb73550a87c0014322f30"
                    },
                    "responseCode": "IMPQ24R2",
                    "responseText": "25-50m2                                                       ",
                    "responseOrder": 2,
                    "responseScore": 10
                  }, {
                    "_id": {
                      "$oid": "5b8cb73550a87c0014322f2f"
                    },
                    "responseCode": "IMPQ24R3",
                    "responseText": "Lawn 50-150m2 flat-gentle slope                      ",
                    "responseOrder": 3,
                    "responseScore": 13
                  }, {
                    "_id": {
                      "$oid": "5b8cb73550a87c0014322f2e"
                    },
                    "responseCode": "IMPQ24R4",
                    "responseText": "Lawn 50-150m2 sloped                                      ",
                    "responseOrder": 4,
                    "responseScore": 15
                  }, {
                    "_id": {
                      "$oid": "5b95fa665de5160015739af1"
                    },
                    "responseCode": "IMPQ24R5",
                    "responseText": "Lawn >150m2 flat-gentle slope",
                    "responseOrder": 5,
                    "responseScore": 80
                  }, {
                    "_id": {
                      "$oid": "5b95fa665de5160015739af0"
                    },
                    "responseCode": "IMPQ24R6",
                    "responseText": "Lawn >150m2 sloped",
                    "responseOrder": 6,
                    "responseScore": 70
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8cb79a50a87c0014322f48"
                  },
                  "analysisTypes": ["new-house"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "How is the house insulated?",
                  "questionCode": "QCQ121",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "wall-floor-finishes",
                  "questionPageOrder": 24,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8cb79a50a87c0014322f4c"
                    },
                    "responseCode": "QCQ121R1",
                    "responseText": "Acoustic/Thermal Batts",
                    "responseOrder": 1,
                    "responseScore": 5,
                    "responseCommentary": "Internal Wall & Ceiling Insulation: Acoustic and Thermal - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8cb79a50a87c0014322f4b"
                    },
                    "responseCode": "QCQ121R2",
                    "responseText": "Thermal Only Batts",
                    "responseOrder": 2,
                    "responseScore": 3,
                    "responseCommentary": "Internal Wall & Ceiling Insulation: Thermal - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8cb79a50a87c0014322f4a"
                    },
                    "responseCode": "QCQ121R3",
                    "responseText": "None",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall & Ceiling Insulation: NO insulation - Not Good."
                  }, {
                    "_id": {
                      "$oid": "5b8cb79a50a87c0014322f49"
                    },
                    "responseCode": "QCQ121R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 2.5,
                    "responseCommentary": "Internal Wall & Ceiling Insulation: Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8cb91f50a87c0014322f78"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan", "on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the Side Courtyard ?",
                  "questionCode": "IMPQ25",
                  "questionModule": "land",
                  "questionSection": "improvements",
                  "questionCategory": "improvements",
                  "questionPageOrder": 13,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8cb41850a87c0014322ec7",
                  "dependentResponseId": "5b8cb41850a87c0014322ec8",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8cb91f50a87c0014322f7c"
                    },
                    "responseCode": "IMPQ25R1",
                    "responseText": "<10m2                                                     ",
                    "responseOrder": 1,
                    "responseScore": 5
                  }, {
                    "_id": {
                      "$oid": "5b8cb91f50a87c0014322f7b"
                    },
                    "responseCode": "IMPQ25R2",
                    "responseText": "10-25m2                                                  ",
                    "responseOrder": 2,
                    "responseScore": 7
                  }, {
                    "_id": {
                      "$oid": "5b8cb91f50a87c0014322f7a"
                    },
                    "responseCode": "IMPQ25R3",
                    "responseText": ">25m2                                    ",
                    "responseOrder": 3,
                    "responseScore": 10
                  }, {
                    "_id": {
                      "$oid": "5b8cb91f50a87c0014322f79"
                    },
                    "responseCode": "IMPQ25R4",
                    "responseText": ">50m2                                             ",
                    "responseOrder": 4,
                    "responseScore": 10
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8cbf9f50a87c0014322fd8"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the floor construction on the 3rd Floor? ",
                  "questionCode": "STQ138",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 6,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b85211525ac1800144a0fb7",
                  "dependentResponseId": "5b85211525ac1800144a0fb9",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8cbf9f50a87c0014322fdc"
                    },
                    "responseCode": "STQ138R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: 3rd Floor - Timber - Consider potential noise, termites and general  - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8cbf9f50a87c0014322fdb"
                    },
                    "responseCode": "STQ138R2",
                    "responseText": "Concrete",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: 3rd Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8cbf9f50a87c0014322fda"
                    },
                    "responseCode": "STQ138R3",
                    "responseText": "Timber & Concrete",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: 3rd Floor - Combination of timber and concrete - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8cbf9f50a87c0014322fd9"
                    },
                    "responseCode": "STQ138R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: 3rd Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67ec652d140014ddd22a"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the external wall construction on the Ground Floor? ",
                  "questionCode": "STQ130",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 10,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b851eca25ac1800144a0fa8",
                  "dependentResponseId": "5b851eca25ac1800144a0fa9",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67ec652d140014ddd230"
                    },
                    "responseCode": "STQ130R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "External Wall: Ground Floor - Structure -Timber - Consider building integrity, noise and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ec652d140014ddd22f"
                    },
                    "responseCode": "STQ130R2",
                    "responseText": "Full Brick ",
                    "responseOrder": 2,
                    "responseScore": 40,
                    "responseCommentary": "External Wall Structure: Ground Floor - Full brick - Quality, structure, acoustic and thermal qualities - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ec652d140014ddd22e"
                    },
                    "responseCode": "STQ130R3",
                    "responseText": "Brick Veneer",
                    "responseOrder": 3,
                    "responseScore": 25,
                    "responseCommentary": "External Wall Structure: Ground Floor - Brick veneer - Consider building integrity - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ec652d140014ddd22d"
                    },
                    "responseCode": "STQ130R4",
                    "responseText": "Concrete",
                    "responseOrder": 4,
                    "responseScore": 40,
                    "responseCommentary": "External Wall Structure: Ground Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ec652d140014ddd22c"
                    },
                    "responseCode": "STQ130R5",
                    "responseText": "Mixture of Full Brick, Brick Veneer & Timber",
                    "responseOrder": 5,
                    "responseScore": 30,
                    "responseCommentary": "External Wall Structure: Ground Floor - Mixture of Full Brick, Brick Veneer & Timber - Consider checking the warranty on the product - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ec652d140014ddd22b"
                    },
                    "responseCode": "STQ130R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 20,
                    "responseCommentary": "External Wall Structure: Unknown - Data Inaccuracy.  "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67ed652d140014ddd231"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the external wall construction on the 1st Floor? ",
                  "questionCode": "STQ131",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 11,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b851f7025ac1800144a0faa",
                  "dependentResponseId": "5b851f7025ac1800144a0fab",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67ed652d140014ddd237"
                    },
                    "responseCode": "STQ131R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "External Wall Structure: 1st Floor - Timber - Consider building integrity, noise and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ed652d140014ddd236"
                    },
                    "responseCode": "STQ131R2",
                    "responseText": "Full Brick ",
                    "responseOrder": 2,
                    "responseScore": 40,
                    "responseCommentary": "External Wall Structure: 1st Floor - Full brick  - Quality, structure, acoustic and thermal qualities - Excellent.  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ed652d140014ddd235"
                    },
                    "responseCode": "STQ131R3",
                    "responseText": "Brick Veneer",
                    "responseOrder": 3,
                    "responseScore": 30,
                    "responseCommentary": "External Wall Structure: 1st Floor - Brick veneer - Consider building integrity - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ed652d140014ddd234"
                    },
                    "responseCode": "STQ131R4",
                    "responseText": "Concrete",
                    "responseOrder": 4,
                    "responseScore": 40,
                    "responseCommentary": "External Wall Structure: 1st Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ed652d140014ddd233"
                    },
                    "responseCode": "STQ131R5",
                    "responseText": "Mixture of Full Brick, Brick Veneer & Timber",
                    "responseOrder": 5,
                    "responseScore": 35,
                    "responseCommentary": "External Wall Structure: 1st Floor - Mixture of Full Brick, Brick Veneer & Timber - Consider checking the warranty on the product - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ed652d140014ddd232"
                    },
                    "responseCode": "STQ131R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 20,
                    "responseCommentary": "External Wall Structure: 1st Floor - Unknown - Data Inaccuracy.  "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67ee652d140014ddd238"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the external wall construction on the 2nd Floor? ",
                  "questionCode": "STQ132",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 12,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b85205025ac1800144a0fb4",
                  "dependentResponseId": "5b85205025ac1800144a0fb6",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67ee652d140014ddd23e"
                    },
                    "responseCode": "STQ132R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: 2nd Floor - Timber - Consider building integrity, noise and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ee652d140014ddd23d"
                    },
                    "responseCode": "STQ132R2",
                    "responseText": "Full Brick ",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: 2nd Floor - Full brick  - Quality, structure, acoustic and thermal qualities- Excellent.  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ee652d140014ddd23c"
                    },
                    "responseCode": "STQ132R3",
                    "responseText": "Brick Veneer",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: 2nd Floor - Brick veneer - Consider building integrity - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ee652d140014ddd23b"
                    },
                    "responseCode": "STQ132R4",
                    "responseText": "Concrete",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: 2nd Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ee652d140014ddd23a"
                    },
                    "responseCode": "STQ132R5",
                    "responseText": "Mixture of Full Brick, Brick Veneer & Timber",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: 2nd Floor - Mixture of Full Brick, Brick Veneer & Timber - Consider checking the warranty on the product - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ee652d140014ddd239"
                    },
                    "responseCode": "STQ132R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: 2nd Floor - Unknown - Data Inaccuracy.  "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8a67ef652d140014ddd23f"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the external wall construction on the 3rd Floor? ",
                  "questionCode": "STQ133",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 13,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b85211525ac1800144a0fb7",
                  "dependentResponseId": "5b85211525ac1800144a0fb9",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a67ef652d140014ddd245"
                    },
                    "responseCode": "STQ133R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: 3rd Floor - Timber - Consider building integrity, noise and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ef652d140014ddd244"
                    },
                    "responseCode": "STQ133R2",
                    "responseText": "Full Brick ",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: 3rd Floor - Full brick - Quality, structure, acoustic and thermal qualities- Excellent.  "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ef652d140014ddd243"
                    },
                    "responseCode": "STQ133R3",
                    "responseText": "Brick Veneer",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: 3rd Floor - Brick veneer - Consider building integrity - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ef652d140014ddd242"
                    },
                    "responseCode": "STQ133R4",
                    "responseText": "Concrete",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: 3rd Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ef652d140014ddd241"
                    },
                    "responseCode": "STQ133R5",
                    "responseText": "Mixture of Full Brick, Brick Veneer & Timber",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: 3rd Floor - Mixture of Full Brick, Brick Veneer & Timber - Consider checking the warranty on the product - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8a67ef652d140014ddd240"
                    },
                    "responseCode": "STQ133R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: 3rd Floor - Unknown - Data Inaccuracy.  "
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8cc0c250a87c0014323023"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated", "vacant-land", "knockdown-rebuild"],
                  "bestSource": ["google-maps", "on-site"],
                  "applicableSuburbs": [],
                  "text": "Is there a park within 100M of the proeprty ?",
                  "questionCode": "SUR07",
                  "questionModule": "location",
                  "questionSection": "street-surrounding-real-estate",
                  "questionCategory": "street-surrounding-real-estate",
                  "questionPageOrder": 7,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8cc0c250a87c0014323025"
                    },
                    "responseCode": "SURQ07R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 3,
                    "responseCommentary": "The property is within 100m of a park. Positives are it provides health and well-being benefits. Negatives are it can attract certain people who may use the area for other activities that can be in odd and inconvenient hours presenting security concerns. Overall positive"
                  }, {
                    "_id": {
                      "$oid": "5b8cc0c250a87c0014323024"
                    },
                    "responseCode": "SURQ07R1",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Park - Not within 100m of park"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b848f5d2978bb001484ba6c"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Kitchen Pantry",
                  "questionCode": "INQ1",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 25,
                  "detailedSurveyQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b848f5d2978bb001484ba6e"
                    },
                    "responseCode": "INQ1r1",
                    "responseText": "Walk In (Room)",
                    "responseOrder": 1,
                    "responseScore": 15,
                    "responseCommentary": "Pantry - YES - Walk in (Room) style -  Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b848f5d2978bb001484ba6d"
                    },
                    "responseCode": "INQ1R2",
                    "responseText": "Step in ",
                    "responseOrder": 2,
                    "responseScore": 7,
                    "responseCommentary": "Pantry - YES - Step in style - Good. \n"
                  }, {
                    "_id": {
                      "$oid": "5b8f0dbe5fe1750014667f1e"
                    },
                    "responseCode": "INQ1R3",
                    "responseText": "No",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Pantry - NO - Not good"
                  }],
                  "__v": 0,
                  "summaryQuestion": true
                },
                {
                  "_id": {
                    "$oid": "5b8f114f5fe1750014667f24"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 5",
                  "questionCode": "DLQ69",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 46,
                  "summaryQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84ffe92978bb001484bad9",
                  "dependentResponseId": "5b84ffe92978bb001484badb",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f11505fe1750014667f26"
                    },
                    "responseCode": "DLQ69R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Bed 5 - YES"
                  }, {
                    "_id": {
                      "$oid": "5b8f11505fe1750014667f25"
                    },
                    "responseCode": "DLQ69R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Bed 5 - NO"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f12205fe1750014667f3b"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 6",
                  "questionCode": "DLQ70",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 47,
                  "summaryQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f114f5fe1750014667f24",
                  "dependentResponseId": "5b8f11505fe1750014667f26",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f12205fe1750014667f3d"
                    },
                    "responseCode": "DLQ70",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Bed 6 - YES"
                  }, {
                    "_id": {
                      "$oid": "5b8f12205fe1750014667f3c"
                    },
                    "responseCode": "DLQ70R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Bed 6 - No"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f38ca5fe1750014668680"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What is the combined size of this area (e.g. Family Room/Meals Area/Kitchen) ?",
                  "questionCode": "DLQ71",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 24,
                  "summaryQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b886bb38579db0014409b32",
                  "dependentResponseId": "5b886bb38579db0014409b33",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f38ca5fe1750014668683"
                    },
                    "responseCode": "DLQ70R1",
                    "responseText": "> 60 m2",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Kitchen/pantry/family/meals: Combined  area is >60m2, This is the minimum size needed for a large family home to perform well - Excellent"
                  }, {
                    "_id": {
                      "$oid": "5b8f38ca5fe1750014668682"
                    },
                    "responseCode": "DLQ70R2",
                    "responseText": "< 60 m2",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Kitchen/pantry/family/meals: Combined area is <60m2 - Consider designed and functionality issues with an area this size. Not good."
                  }, {
                    "_id": {
                      "$oid": "5b8f38ca5fe1750014668681"
                    },
                    "responseCode": "DLQ70R3",
                    "responseText": "Unknown",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Kitchen/pantry/family/meals: Unknown area - Data Inaccuracy."
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8a3db3652d140014ddcdfa"
                  },
                  "analysisTypes": ["vacant-land", "knockdown-rebuild", "new-house", "renovated-house", "unrenovated", "post-new-renovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Describe the parking outside the house - consider terrain, safety and narrowness of street?",
                  "questionCode": "TRAQ14",
                  "questionModule": "location",
                  "questionSection": "street-traffic-parking",
                  "questionCategory": "street-traffic-parking",
                  "questionPageOrder": 6,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8a3db3652d140014ddcdfc"
                    },
                    "responseCode": "TRAQ14R1",
                    "responseText": "Cannot Park",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Parking is difficult on the street, consider other options , This due to access and traffic conditions. Also consider additional, potential development costs."
                  }, {
                    "_id": {
                      "$oid": "5b8a3db3652d140014ddcdfb"
                    },
                    "responseCode": "TRAQ14R3",
                    "responseText": "Good",
                    "responseOrder": 2,
                    "responseScore": 20,
                    "responseCommentary": "Parking on the street is good"
                  }, {
                    "_id": {
                      "$oid": "5b906753b3bd2800147db7d9"
                    },
                    "responseCode": "TRAQ14R2",
                    "responseText": "Difficult",
                    "responseOrder": 1,
                    "responseScore": 4,
                    "responseCommentary": "Parking - Street parking is difficult, consider safety of guests and family members. Also consider additional, potential development costs. Not Good."
                  }, {
                    "_id": {
                      "$oid": "5b95a2f2fcd59b0015ac96df"
                    },
                    "responseCode": "TRAQ14R4",
                    "responseText": "Limited Parking",
                    "responseOrder": 4,
                    "responseScore": 4,
                    "responseCommentary": "Parking - Available spaces are limited, consider inconvenience and safety of guests and family members. Also consider additional, potential development costs. Not Good"
                  }, {
                    "_id": {
                      "$oid": "5b96e88a5de516001573a1b1"
                    },
                    "responseCode": "TRAQ14r4",
                    "responseText": "Uneven Verge Parking",
                    "responseOrder": 5,
                    "responseScore": 10,
                    "responseCommentary": "Parking - Terrain is uneven, consider impact to verge/grass, mess created during wet periods and safety and inconvenience for the elderly or disabled."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8f5a4c5fe1750014669098"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the floor covering, in the main house area i.e. the family room? ",
                  "questionCode": "QC111",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "wall-floor-finishes",
                  "questionPageOrder": 6,
                  "adjustmentQuestion": false,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f5a4c5fe175001466909e"
                    },
                    "responseCode": "QC111R1",
                    "responseText": "Carpet",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Floor covering: Main area is carpet - Consider stains and overall durability - OK."
                  }, {
                    "_id": {
                      "$oid": "5b8f5a4c5fe175001466909d"
                    },
                    "responseCode": "QC111R2",
                    "responseText": "Timber",
                    "responseOrder": 2,
                    "responseScore": 20,
                    "responseCommentary": "Floor covering: Main area is timber - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8f5a4c5fe175001466909c"
                    },
                    "responseCode": "QC111R3",
                    "responseText": "Tiles",
                    "responseOrder": 3,
                    "responseScore": 20,
                    "responseCommentary": "Floor covering: Main area is tiles - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8f5a4c5fe175001466909b"
                    },
                    "responseCode": "QC111R4",
                    "responseText": "Other",
                    "responseOrder": 4,
                    "responseScore": 20,
                    "responseCommentary": "Floor covering: Main area is other - consider markings water & durability - OK."
                  }, {
                    "_id": {
                      "$oid": "5b8f5a4c5fe1750014669099"
                    },
                    "responseCode": "QC111R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 10,
                    "responseCommentary": "Floor covering: Unknown -  Data Inaccuracy."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8f5bb55fe175001466925e"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the type of timber floor covering in the main house area i.e. Family Room? ",
                  "questionCode": "QC112",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "wall-floor-finishes",
                  "questionPageOrder": 7,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f5a4c5fe1750014669098",
                  "dependentResponseId": "5b8f5a4c5fe175001466909d",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f5bb55fe1750014669261"
                    },
                    "responseCode": "QC112R1",
                    "responseText": "Stained Oak with a Grey Tinge",
                    "responseOrder": 1,
                    "responseScore": 5,
                    "responseCommentary": "Floor covering: Main area is quality floating timber - Stained oak with a grey tinge Consider markings, water & durability - Good."
                  }, {
                    "_id": {
                      "$oid": "5b8f5bb55fe1750014669260"
                    },
                    "responseCode": "QC112R2",
                    "responseText": "Nailed Strip Flooring",
                    "responseOrder": 2,
                    "responseScore": 5,
                    "responseCommentary": "Floor covering: Main area is quality Traditional Nailed strip flooring - Consider air gaps, dirt gathering in joins and swelling - Good"
                  }, {
                    "_id": {
                      "$oid": "5b8f5bb55fe175001466925f"
                    },
                    "responseCode": "QC112R3",
                    "responseText": "Other",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Floor covering: Main area is low quality floating timber - Consider markings, water, durability and warranty on the product - Not Good."
                  }, {
                    "_id": {
                      "$oid": "5b90dec509f2900014d82b7e"
                    },
                    "responseCode": "QC112R4",
                    "responseText": "Bamboo flooring",
                    "responseOrder": 4,
                    "responseScore": 5,
                    "responseCommentary": "Floor covering: Main area is Bamboo floating timber - Hard durable flooring, consider markings, water & durability - Good.\n"
                  }, {
                    "_id": {
                      "$oid": "5b90dec509f2900014d82b7d"
                    },
                    "responseCode": "QC112R4",
                    "responseText": "Wide board Timber floor",
                    "responseOrder": 5,
                    "responseScore": 5,
                    "responseCommentary": "Floor covering: Main area is a Wide Board floating timber - Hard durable flooring, consider markings, water & durability - Good."
                  }],
                  "__v": 0,
                  "summaryQuestion": false
                },
                {
                  "_id": {
                    "$oid": "5b8f5cf75fe1750014669493"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the type of tiles in the main house area i.e. the family room? ",
                  "questionCode": "QC113",
                  "questionModule": "house",
                  "questionSection": "quality-condition",
                  "questionCategory": "wall-floor-finishes",
                  "questionPageOrder": 8,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f5a4c5fe1750014669098",
                  "dependentResponseId": "5b8f5a4c5fe175001466909c",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f5cf75fe1750014669495"
                    },
                    "responseCode": "QC113R1",
                    "responseText": "Stone",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Floor covering: Main area is stone - Note the aesthetics and general quality - Excellent."
                  }, {
                    "_id": {
                      "$oid": "5b8f5cf75fe1750014669494"
                    },
                    "responseCode": "QC113R2",
                    "responseText": "Ceramic",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Floor covering: Main area is tiles - Consider density and temperature effects - Ok. "
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f63ae5fe17500146695be"
                  },
                  "analysisTypes": ["renovated-house", "new-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Lower 1 Floor",
                  "questionCode": "DLQ72",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 4.1,
                  "summaryQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b851eca25ac1800144a0fa8",
                  "dependentResponseId": "5b851eca25ac1800144a0fa9",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f63ae5fe17500146695c0"
                    },
                    "responseCode": "DLQ72R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Lower 1 Floor - YES"
                  }, {
                    "_id": {
                      "$oid": "5b8f63ae5fe17500146695bf"
                    },
                    "responseCode": "DLQ72R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Lower 1 Floor - NO"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f64175fe17500146695c6"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Lower 2 Floor",
                  "questionCode": "DLQ73",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 4.2,
                  "summaryQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f63ae5fe17500146695be",
                  "dependentResponseId": "5b8f63ae5fe17500146695c0",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f64175fe17500146695c8"
                    },
                    "responseCode": "DLQ73R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Lower 2 Floor - YES"
                  }, {
                    "_id": {
                      "$oid": "5b8f64175fe17500146695c7"
                    },
                    "responseCode": "DLQ73R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Lower 2 Floor - NO"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f64675fe17500146695c9"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Lower 3 Floor ",
                  "questionCode": "DLQ74",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 4.3,
                  "summaryQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f64175fe17500146695c6",
                  "dependentResponseId": "5b8f64175fe17500146695c8",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f64675fe17500146695cb"
                    },
                    "responseCode": "DLQ74R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Lower 3 Floor - YES"
                  }, {
                    "_id": {
                      "$oid": "5b8f64675fe17500146695ca"
                    },
                    "responseCode": "DLQ74R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Lower 3 Floor - NO"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f65ed5fe17500146695d5"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the floor construction on the Lower 1 Floor?",
                  "questionCode": "STQ139",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 7,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f63ae5fe17500146695be",
                  "dependentResponseId": "5b8f63ae5fe17500146695c0",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f65ed5fe17500146695d9"
                    },
                    "responseCode": "STQ139R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "Floor Structure: Lower 1 Floor - Timber - Consider potential noise, dirt & air gaps, water issues and termites - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8f65ed5fe17500146695d8"
                    },
                    "responseCode": "STQ139R2",
                    "responseText": "Concrete",
                    "responseOrder": 2,
                    "responseScore": 40,
                    "responseCommentary": "Floor Structure: Lower 1 Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f65ed5fe17500146695d7"
                    },
                    "responseCode": "STQ139R3",
                    "responseText": "Timber & Concrete",
                    "responseOrder": 3,
                    "responseScore": 30,
                    "responseCommentary": "Floor Structure: Lower 1 Floor - Combination of timber and concrete - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8f65ed5fe17500146695d6"
                    },
                    "responseCode": "STQ139R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 20,
                    "responseCommentary": "Floor Structure: Lower 1 Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f677e5fe1750014669625"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "What is the floor construction on the Lower 2 Floor?",
                  "questionCode": "STQ140",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 8,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f64175fe17500146695c6",
                  "dependentResponseId": "5b8f64175fe17500146695c8",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f677e5fe1750014669629"
                    },
                    "responseCode": "STQ140R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: Lower 2 Floor - Timber - Consider potential noise, dirt & air gaps, water issues and termites - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8f677e5fe1750014669628"
                    },
                    "responseCode": "STQ140R2",
                    "responseText": "Concrete",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: Lower 2 Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f677e5fe1750014669627"
                    },
                    "responseCode": "STQ140R3",
                    "responseText": "Timber & Concrete",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: Lower 2 Floor - Combination of timber and concrete - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8f677e5fe1750014669626"
                    },
                    "responseCode": "STQ140R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: Lower 2 Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f68925fe1750014669642"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What is the floor construction on the Lower 3 Floor? ",
                  "questionCode": "STQ141",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 9,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f64675fe17500146695c9",
                  "dependentResponseId": "5b8f64675fe17500146695cb",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f68925fe1750014669646"
                    },
                    "responseCode": "STQ141R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: Lower 3 Floor - Timber - Consider potential noise, termites and general  - Ok. "
                  }, {
                    "_id": {
                      "$oid": "5b8f68925fe1750014669645"
                    },
                    "responseCode": "STQ141R2",
                    "responseText": "Concrete",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: Lower 3 Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f68925fe1750014669644"
                    },
                    "responseCode": "STQ141R3",
                    "responseText": "Timber & Concrete",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: Lower 3 Floor - Combination of timber and concrete - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8f68925fe1750014669643"
                    },
                    "responseCode": "STQ141R4",
                    "responseText": "Unknown",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Floor Structure: Lower 3 Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f696c5fe1750014669647"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What is the external wall construction on the Lower 1 Floor? ",
                  "questionCode": "STQ142",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 14,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f63ae5fe17500146695be",
                  "dependentResponseId": "5b8f63ae5fe17500146695c0",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f696c5fe175001466964d"
                    },
                    "responseCode": "STQ142R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 20,
                    "responseCommentary": "External Wall Structure: Lower 1 Floor - Timber - Consider building integrity, noise and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8f696c5fe175001466964c"
                    },
                    "responseCode": "STQ142R2",
                    "responseText": "Full Brick",
                    "responseOrder": 2,
                    "responseScore": 40,
                    "responseCommentary": "External Wall Structure: Lower 1 Floor - Full brick  - Quality, structure, acoustic and thermal qualities - Excellent.  "
                  }, {
                    "_id": {
                      "$oid": "5b8f696c5fe175001466964b"
                    },
                    "responseCode": "STQ142R3",
                    "responseText": "Brick Veneer",
                    "responseOrder": 3,
                    "responseScore": 25,
                    "responseCommentary": "External Wall Structure: Lower 1 Floor - Brick veneer - Consider building integrity - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8f696c5fe175001466964a"
                    },
                    "responseCode": "STQ142R4",
                    "responseText": "Concrete",
                    "responseOrder": 4,
                    "responseScore": 40,
                    "responseCommentary": "External Wall Structure: 1st Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f696c5fe1750014669649"
                    },
                    "responseCode": "STQ142R5",
                    "responseText": "Mixture of Full Brick, Brick Veneer & Timber",
                    "responseOrder": 5,
                    "responseScore": 30,
                    "responseCommentary": "External Wall Structure: Lower 1 Floor - Mixture of Full Brick, Brick Veneer & Timber - Consider checking the warranty on the product - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8f696c5fe1750014669648"
                    },
                    "responseCode": "STQ142R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 20,
                    "responseCommentary": "External Wall Structure: 1st Floor - Unknown - Data Inaccuracy.  "
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f6a395fe175001466964e"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What is the external wall construction on the Lower 2 Floor? ",
                  "questionCode": "STQ143",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "wall-floor-structural",
                  "questionPageOrder": 15,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f64175fe17500146695c6",
                  "dependentResponseId": "5b8f64175fe17500146695c8",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f6a395fe1750014669654"
                    },
                    "responseCode": "STQ143R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: Lower 2 Floor - Timber - Consider building integrity, noise and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6a395fe1750014669653"
                    },
                    "responseCode": "STQ143R2",
                    "responseText": "Full Brick",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: Lower 2 Floor - Full brick  - Quality, structure, acoustic and thermal qualities- Excellent.  "
                  }, {
                    "_id": {
                      "$oid": "5b8f6a395fe1750014669652"
                    },
                    "responseCode": "STQ143R3",
                    "responseText": "Brick Veneer",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: Lower 2 Floor - Brick veneer - Consider building integrity - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6a395fe1750014669651"
                    },
                    "responseCode": "STQ143R5",
                    "responseText": "Mixture of Full Brick, Brick Veneer & Timber",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: Lower 2 Floor - Mixture of Full Brick, Brick Veneer & Timber - Consider checking the warranty on the product - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6a395fe1750014669650"
                    },
                    "responseCode": "STQ143R4",
                    "responseText": "Concrete",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: 2nd Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6a395fe175001466964f"
                    },
                    "responseCode": "STQ143R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: Lower 2 Floor - Unknown - Data Inaccuracy.  "
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f6af15fe1750014669655"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What is the external wall construction on the Lower 3 Floor? ",
                  "questionCode": "STQ144",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 16,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f64675fe17500146695c9",
                  "dependentResponseId": "5b8f64675fe17500146695cb",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f6af15fe175001466965b"
                    },
                    "responseCode": "STQ144R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: Lower 3 Floor - Timber - Consider building integrity, noise and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6af15fe175001466965a"
                    },
                    "responseCode": "STQ144R2",
                    "responseText": "Full Brick",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: Lower 3 Floor - Full brick  - Quality, structure, acoustic and thermal qualities- Excellent.  "
                  }, {
                    "_id": {
                      "$oid": "5b8f6af15fe1750014669659"
                    },
                    "responseCode": "STQ144R3",
                    "responseText": "Brick Veneer",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: Lower 3 Floor - Brick veneer - Consider building integrity - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6af15fe1750014669658"
                    },
                    "responseCode": "STQ144R4",
                    "responseText": "Concrete",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: Lower 3 Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6af15fe1750014669657"
                    },
                    "responseCode": "STQ144R5",
                    "responseText": "Mixture of Full Brick, Brick Veneer & Timber",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: Lower 3 Floor - Mixture of Full Brick, Brick Veneer & Timber - Consider checking the warranty on the product - Good. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6af15fe1750014669656"
                    },
                    "responseCode": "STQ144R6",
                    "responseText": "Unknown",
                    "responseOrder": 6,
                    "responseScore": 0,
                    "responseCommentary": "External Wall Structure: Lower 3 Floor - Unknown - Data Inaccuracy.  "
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f6bb25fe175001466965c"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What is the internal wall construction on the Lower 1 Floor? ",
                  "questionCode": "STQ145",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 21,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f63ae5fe17500146695be",
                  "dependentResponseId": "5b8f63ae5fe17500146695c0",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f6bb25fe1750014669661"
                    },
                    "responseCode": "STQ145R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 25,
                    "responseCommentary": "Internal Wall Structure:  Lower 1 Floor - Timber - Consider building integrity, noise, insulation and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6bb25fe1750014669660"
                    },
                    "responseCode": "STQ145R2",
                    "responseText": "Brick",
                    "responseOrder": 2,
                    "responseScore": 40,
                    "responseCommentary": "Internal Wall Structure:  Lower 1 Floor - Brick - Quality, structure, acoustic and thermal qualities- Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6bb25fe175001466965f"
                    },
                    "responseCode": "STQ145R3",
                    "responseText": "Concrete",
                    "responseOrder": 3,
                    "responseScore": 40,
                    "responseCommentary": "Internal Wall Structure:  Lower 1 Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6bb25fe175001466965e"
                    },
                    "responseCode": "STQ145R4",
                    "responseText": "Mixture of Timber and Brick ",
                    "responseOrder": 4,
                    "responseScore": 30,
                    "responseCommentary": "Internal Wall Structure:  Lower 1 Floor - Combination of brick and timber -  Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6bb25fe175001466965d"
                    },
                    "responseCode": "STQ145R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 20,
                    "responseCommentary": "Internal Wall Structure:  Lower 1 Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f6cda5fe1750014669662"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What is the internal wall construction on the Lower 2 Floor? ",
                  "questionCode": "STQ146",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 22,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f64175fe17500146695c6",
                  "dependentResponseId": "5b8f64175fe17500146695c8",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f6cda5fe1750014669667"
                    },
                    "responseCode": "STQ146R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  Lower 2 Floor - Timber - Consider building integrity, noise, insulation and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6cda5fe1750014669666"
                    },
                    "responseCode": "STQ146R2",
                    "responseText": "Brick",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  Lower Floor - Brick - Quality, structure, acoustic and thermal qualities- Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6cda5fe1750014669665"
                    },
                    "responseCode": "STQ146R3",
                    "responseText": "Concrete",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  Lower 2 Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6cda5fe1750014669664"
                    },
                    "responseCode": "STQ146R4",
                    "responseText": "Mixture of Timber and Brick ",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  Lower 2 Floor - Combination of brick and timber -  Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6cda5fe1750014669663"
                    },
                    "responseCode": "STQ146R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  Lower 2 Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b8f6da25fe175001466969c"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "What is the internal wall construction on the Lower 3 Floor? ",
                  "questionCode": "STQ147",
                  "questionModule": "house",
                  "questionSection": "structure",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 23,
                  "summaryQuestion": false,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f64675fe17500146695c9",
                  "dependentResponseId": "5b8f64675fe17500146695cb",
                  "responses": [{
                    "_id": {
                      "$oid": "5b8f6da25fe17500146696a1"
                    },
                    "responseCode": "STQ147R1",
                    "responseText": "Timber",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  Lower 3 Floor - Timber - Consider building integrity, noise, insulation and termite maintenance - OK. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6da25fe17500146696a0"
                    },
                    "responseCode": "STQ147R2",
                    "responseText": "Brick",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  Lower 2 Floor - Brick - Quality, structure, acoustic and thermal qualities- Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6da25fe175001466969f"
                    },
                    "responseCode": "STQ147R3",
                    "responseText": "Concrete",
                    "responseOrder": 3,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  Lower 3 Floor - Concrete - Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6da25fe175001466969e"
                    },
                    "responseCode": "STQ147R4",
                    "responseText": "Mixture of Timber and Brick ",
                    "responseOrder": 4,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  Lower 3 Floor - Combination of brick and timber -  Excellent. "
                  }, {
                    "_id": {
                      "$oid": "5b8f6da25fe175001466969d"
                    },
                    "responseCode": "STQ147R5",
                    "responseText": "Unknown",
                    "responseOrder": 5,
                    "responseScore": 0,
                    "responseCommentary": "Internal Wall Structure:  Lower 3 Floor - Unknown - Data Inaccuracy. "
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b94736e427b890015a10674"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 4 Ensuite ",
                  "questionCode": "INQ09",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 45,
                  "summaryQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84ffe92978bb001484bad9",
                  "dependentResponseId": "5b84ffe92978bb001484badb",
                  "responses": [{
                    "_id": {
                      "$oid": "5b94736e427b890015a10676"
                    },
                    "responseCode": "INQ09R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Ensuite 4 -YES"
                  }, {
                    "_id": {
                      "$oid": "5b94736e427b890015a10675"
                    },
                    "responseCode": "INQ09R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Ensuite 4 - NO"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b96005a5de5160015739cd8"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["on-site"],
                  "applicableSuburbs": [],
                  "text": "Cellar",
                  "questionCode": "DLQ75",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 49,
                  "summaryQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "",
                  "dependentQuestionId": "",
                  "dependentResponseId": "",
                  "responses": [{
                    "_id": {
                      "$oid": "5b96005a5de5160015739cda"
                    },
                    "responseCode": "DLQ75R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 1,
                    "responseCommentary": "Cellar - YES"
                  }, {
                    "_id": {
                      "$oid": "5b96005a5de5160015739cd9"
                    },
                    "responseCode": "DLQ75R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Cellar - NO"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b9600ce5de5160015739cdb"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Other Room 2",
                  "questionCode": "DLQ76",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 51,
                  "summaryQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8501862978bb001484badf",
                  "dependentResponseId": "5b8501862978bb001484bae0",
                  "responses": [{
                    "_id": {
                      "$oid": "5b9600ce5de5160015739cdd"
                    },
                    "responseCode": "DLQ76R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Other Room 2 - YES"
                  }, {
                    "_id": {
                      "$oid": "5b9600ce5de5160015739cdc"
                    },
                    "responseCode": "DLQ76R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Other Room 2 - NO"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b9601475de5160015739cde"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Other Room 3",
                  "questionCode": "DLQ77",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 52,
                  "summaryQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b9600ce5de5160015739cdb",
                  "dependentResponseId": "5b9600ce5de5160015739cdd",
                  "responses": [{
                    "_id": {
                      "$oid": "5b9601475de5160015739ce0"
                    },
                    "responseCode": "DLQ77R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 2,
                    "responseCommentary": "Other Room 3 - YES"
                  }, {
                    "_id": {
                      "$oid": "5b9601475de5160015739cdf"
                    },
                    "responseCode": "DLQ77R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Other Room 3 - NO"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b98bc49b0892300151dd2bf"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Toilet/Shower in Laundry",
                  "questionCode": "DLQ79",
                  "questionModule": "house",
                  "questionSection": "design-liveability",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 32.3,
                  "summaryQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b848dd92978bb001484ba66",
                  "dependentResponseId": "5b848dd92978bb001484ba68",
                  "responses": [{
                    "_id": {
                      "$oid": "5b98bc49b0892300151dd2c1"
                    },
                    "responseCode": "DLQ79R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Toilet/Shower in Laundry - YES "
                  }, {
                    "_id": {
                      "$oid": "5b98bc49b0892300151dd2c0"
                    },
                    "responseCode": "DLQ79R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Toilet/Shower in Laundry - No"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b998b59b0892300151dd53a"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Guest Bedroom Ensuite",
                  "questionCode": "INQ29",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 48,
                  "summaryQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84fd922978bb001484bacb",
                  "dependentResponseId": "5b84fd922978bb001484bacd",
                  "responses": [{
                    "_id": {
                      "$oid": "5b998b59b0892300151dd53c"
                    },
                    "responseCode": "INQ29R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Guest Bedroom Ensuite - YES"
                  }, {
                    "_id": {
                      "$oid": "5b998b59b0892300151dd53b"
                    },
                    "responseCode": "INQ29R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Guest Bedroom Ensuite 2 - YES"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b999631b0892300151dd542"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 3 Walk in Wardrobe ",
                  "questionCode": "INQ30",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 43,
                  "summaryQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84fecd2978bb001484bad6",
                  "dependentResponseId": "5b84fecd2978bb001484bad8",
                  "responses": [{
                    "_id": {
                      "$oid": "5b999631b0892300151dd544"
                    },
                    "responseCode": "INQ30R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Walk in Wardrobe - Bed 3 Yes"
                  }, {
                    "_id": {
                      "$oid": "5b999631b0892300151dd543"
                    },
                    "responseCode": "INQ30R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Walk in Wardrobe - Bed 3 No"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b99970db0892300151dd545"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 4 Walk in Wardrobe ",
                  "questionCode": "INQ31",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 45,
                  "summaryQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84ffe92978bb001484bad9",
                  "dependentResponseId": "5b84ffe92978bb001484badb",
                  "responses": [{
                    "_id": {
                      "$oid": "5b99970db0892300151dd547"
                    },
                    "responseCode": "INQ31R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Walk in Wardrobe - Bed 4 Yes"
                  }, {
                    "_id": {
                      "$oid": "5b99970db0892300151dd546"
                    },
                    "responseCode": "INQ31R1",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Walk in Wardrobe - Bed 4 NO"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b99981fb0892300151dd548"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 5 Ensuite  ",
                  "questionCode": "INQ33",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 46,
                  "summaryQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f114f5fe1750014667f24",
                  "dependentResponseId": "5b8f11505fe1750014667f26",
                  "responses": [{
                    "_id": {
                      "$oid": "5b99981fb0892300151dd54a"
                    },
                    "responseCode": "INQ33R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Ensuite Bed 4 - YES"
                  }, {
                    "_id": {
                      "$oid": "5b99981fb0892300151dd549"
                    },
                    "responseCode": "INQ33R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Ensuite Bed 5 - NO"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b999924b0892300151dd550"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 6 Ensuite  ",
                  "questionCode": "INQ34",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 47,
                  "summaryQuestion": true,
                  "adjustmentQuestion": true,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f12205fe1750014667f3b",
                  "dependentResponseId": "5b8f12205fe1750014667f3d",
                  "responses": [{
                    "_id": {
                      "$oid": "5b999924b0892300151dd552"
                    },
                    "responseCode": "INQ34R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 10,
                    "responseCommentary": "Ensuite Bed 6 - YES"
                  }, {
                    "_id": {
                      "$oid": "5b999924b0892300151dd551"
                    },
                    "responseCode": "INQ34R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Ensuite Bed 6 - NO"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b999c33b0892300151dd585"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 5 Walk in Wardrobe ",
                  "questionCode": "INQ35",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 46,
                  "summaryQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f114f5fe1750014667f24",
                  "dependentResponseId": "5b8f11505fe1750014667f26",
                  "responses": [{
                    "_id": {
                      "$oid": "5b999c33b0892300151dd587"
                    },
                    "responseCode": "INQ35R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Walk in Wardrobe - Bed 5 Yes"
                  }, {
                    "_id": {
                      "$oid": "5b999c33b0892300151dd586"
                    },
                    "responseCode": "INQ35R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Walk in Wardrobe - Bed 5 NO"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b999cfab0892300151dd588"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Bed 6 Walk in Wardrobe ",
                  "questionCode": "INQ36",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 47,
                  "summaryQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b8f12205fe1750014667f3b",
                  "dependentResponseId": "5b8f12205fe1750014667f3d",
                  "responses": [{
                    "_id": {
                      "$oid": "5b999cfab0892300151dd58a"
                    },
                    "responseCode": "INQ36R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Walk in Wardrobe - Bed 6 YES"
                  }, {
                    "_id": {
                      "$oid": "5b999cfab0892300151dd589"
                    },
                    "responseCode": "UNQ36R2",
                    "responseText": "No",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Walk in Wardrobe - Bed 6 No"
                  }],
                  "__v": 0
                },
                {
                  "_id": {
                    "$oid": "5b99a544b0892300151dd605"
                  },
                  "analysisTypes": ["new-house", "renovated-house", "post-new-renovated", "unrenovated"],
                  "bestSource": ["floor-plan"],
                  "applicableSuburbs": [],
                  "text": "Guest Bedroom  Walk in Wardrobe ",
                  "questionCode": "INQ37",
                  "questionModule": "house",
                  "questionSection": "inclusions",
                  "questionCategory": "floor-plan",
                  "questionPageOrder": 48,
                  "summaryQuestion": true,
                  "adjustmentQuestion": false,
                  "dependentMode": "include",
                  "dependentQuestionId": "5b84fd922978bb001484bacb",
                  "dependentResponseId": "5b84fd922978bb001484bacd",
                  "responses": [{
                    "_id": {
                      "$oid": "5b99a544b0892300151dd607"
                    },
                    "responseCode": "INQ37R1",
                    "responseText": "Yes",
                    "responseOrder": 1,
                    "responseScore": 0,
                    "responseCommentary": "Walk in Wardrobe - Guest Bedroom YES"
                  }, {
                    "_id": {
                      "$oid": "5b99a544b0892300151dd606"
                    },
                    "responseCode": "INQ37R2",
                    "responseText": "No",
                    "responseOrder": 2,
                    "responseScore": 0,
                    "responseCommentary": "Walk in Wardrobe - Guest Bedroom NO"
                  }],
                  "__v": 0
                }
              ]

              Question.collection.insertMany(json2mongo(jsonQuestions)).then((questions) => {
                // console.log('------------------------------------------------ Questions -------------------------------------------------\n', questions)
                // console.log('\n------------------------------------------------ End Questions -------------------------------------------------')

                var property = new Property(json2mongo({
                  "_id": {
                    "$oid": "5b57a49d1e574500148a5ae8"
                  },
                  "geometry": {
                    "location": {
                      "lat": -33.72398700000001,
                      "lng": 151.13486899999998
                    }
                  },
                  "address_components": [{
                      "long_name": "101",
                      "short_name": "101",
                      "types": [
                        "street_number"
                      ]
                    },
                    {
                      "long_name": "Testing Street",
                      "short_name": "Testing St",
                      "types": [
                        "route"
                      ]
                    },
                    {
                      "long_name": "Turramurra",
                      "short_name": "Turramurra",
                      "types": [
                        "locality",
                        "political"
                      ]
                    },
                    {
                      "long_name": "Ku-Ring-Gai Council",
                      "short_name": "Ku-Ring-Gai",
                      "types": [
                        "administrative_area_level_2",
                        "political"
                      ]
                    },
                    {
                      "long_name": "New South Wales",
                      "short_name": "NSW",
                      "types": [
                        "administrative_area_level_1",
                        "political"
                      ]
                    },
                    {
                      "long_name": "Australia",
                      "short_name": "AU",
                      "types": [
                        "country",
                        "political"
                      ]
                    },
                    {
                      "long_name": "2074",
                      "short_name": "2074",
                      "types": [
                        "postal_code"
                      ]
                    }
                  ],
                  "services": [],
                  "types": [
                    "street_address"
                  ],
                  "formatted_address": "101 Testing St, Turramurra NSW 2074, Australia",
                  "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png",
                  "id": "1868586f804a07122553380c9514a5c164a1f885",
                  "name": "101 Testing St",
                  "place_id": "TESTING",
                  "reference": "TESTING",
                  "scope": "GOOGLE",
                  "url": "https://maps.google.com/?q=101+Testing+St,+Turramurra+NSW+2074,+Australia&ftid=0x6b12a7e1258baf69:0x64402474039b79f6",
                  "utc_offset": 600,
                  "vicinity": "Turramurra",
                  "createdAt": {
                    "$date": "2018-07-24T22:13:49.269Z"
                  },
                  "updatedAt": {
                    "$date": "2018-07-24T22:13:49.269Z"
                  },
                  "__v": 0
                }))
                property.save().then((property) => {
                  // console.log('======================== Property ========================\n', property)
                  // console.log('\n======================== End Property ========================')

                  var survey = new Survey(json2mongo({
                    "_id": {
                      "$oid": "5b57a4be1e574500148a5ae8"
                    },
                    "userId": {
                      "$oid": userId
                    },
                    "propertyId": {
                      "$oid": "5b57a49d1e574500148a5ae8"
                    },
                    "surveyStatus": "published",
                    "responses": [{
                        "_id": {
                          "$oid": "5b57a4be1e574500148a5aeb"
                        },
                        "questionId": {
                          "$oid": "5b2f27391a3c7a09e059dc33"
                        },
                        "responseId": "5b21c8f5a1adf000247199b7",
                        "responseScore": 10,
                        "responseMax": 20,
                        "questionModule": "location",
                        "questionSection": "street-surrounding-real-estate",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b57a4be1e574500148a5aea"
                        },
                        "questionId": {
                          "$oid": "5b2f2a461a3c7a09e059dc34"
                        },
                        "responseId": "5b21c8f5a1adf000247199a3",
                        "responseScore": 6,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionSection": "street-surrounding-real-estate",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b57a4be1e574500148a5ae9"
                        },
                        "questionId": {
                          "$oid": "5b2f2fb81a3c7a09e059dc36"
                        },
                        "responseId": "5b21c8f5a1adf000247199a6",
                        "responseScore": 7,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionSection": "street-surrounding-real-estate",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b57a5081e574500148a5aec"
                        },
                        "questionId": {
                          "$oid": "5b21c8f5a1adf000247199c8"
                        },
                        "responseId": "locq1r3",
                        "responseScore": 7,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionCategory": "street-aesthetics"
                      },
                      {
                        "_id": {
                          "$oid": "5b57a5081e574500148a5aed"
                        },
                        "questionId": {
                          "$oid": "5b21c92aa1adf000247199cc"
                        },
                        "responseId": "5b21c92aa1adf000247199ce",
                        "responseScore": 5,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionSection": "street-aesthetics",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b57a5201e574500148a5aee"
                        },
                        "questionId": {
                          "$oid": "5b2f2d0d1a3c7a09e059dc35"
                        },
                        "responseId": "5b21c8f5a1adf000247199c4",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "location",
                        "questionSection": "street-traffic-parking",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b57a5201e574500148a5aef"
                        },
                        "questionId": {
                          "$oid": "5b2f45e81a3c7a09e059dc3a"
                        },
                        "responseId": "5b21c8f5a1adf000247200a1",
                        "responseScore": 8,
                        "responseMax": 8,
                        "questionModule": "location",
                        "questionSection": "street-traffic-parking",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b57a5201e574500148a5af0"
                        },
                        "questionId": {
                          "$oid": "5b2f49321a3c7a09e059dc3e"
                        },
                        "responseId": "5b21c8f5a1adf000247200b3",
                        "responseScore": 8,
                        "responseMax": 8,
                        "questionModule": "location",
                        "questionSection": "street-traffic-parking",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b57a5201e574500148a5af1"
                        },
                        "questionId": {
                          "$oid": "5b2f4a571a3c7a09e059dc3f"
                        },
                        "responseId": "locq13r1",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionCategory": "street-traffic-parking"
                      },
                      {
                        "_id": {
                          "$oid": "5b57a5201e574500148a5af2"
                        },
                        "questionId": {
                          "$oid": "5b2f4b9c1a3c7a09e059dc40"
                        },
                        "responseId": "5b21c8f5a1adf000247200c2",
                        "responseScore": 0,
                        "responseMax": 8,
                        "questionModule": "location",
                        "questionSection": "street-traffic-parking",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b57a5201e574500148a5af3"
                        },
                        "questionId": {
                          "$oid": "5b2f59561a3c7a09e059dc41"
                        },
                        "responseId": "5b21c8f5a1adf000247200c4",
                        "responseScore": 0,
                        "responseMax": 8,
                        "questionModule": "location",
                        "questionSection": "street-traffic-parking",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b57a5201e574500148a5af4"
                        },
                        "questionId": {
                          "$oid": "5b2f331d1a3c7a09e059dc37"
                        },
                        "responseId": "locq7r1",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionCategory": "street-traffic-parking"
                      },
                      {
                        "_id": {
                          "$oid": "5b57a5201e574500148a5af5"
                        },
                        "questionId": {
                          "$oid": "5b2f34e91a3c7a09e059dc39"
                        },
                        "responseId": "5b21c8f5a1adf000247199e1",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionSection": "street-traffic-parking",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b57a5201e574500148a5af6"
                        },
                        "questionId": {
                          "$oid": "5b2f480c1a3c7a09e059dc3c"
                        },
                        "responseId": "5b21c8f5a1adf000247200a6",
                        "responseScore": 8,
                        "responseMax": 8,
                        "questionModule": "location",
                        "questionSection": "street-traffic-parking",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b57a5201e574500148a5af7"
                        },
                        "questionId": {
                          "$oid": "5b2f59f81a3c7a09e059dc42"
                        },
                        "responseId": "5b21c8f5a1adf000247200c5",
                        "responseScore": 15,
                        "responseMax": 15,
                        "questionModule": "location",
                        "questionSection": "street-traffic-parking",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b57a5201e574500148a5af8"
                        },
                        "questionId": {
                          "$oid": "5b2f48b61a3c7a09e059dc3d"
                        },
                        "responseId": "5b21c8f5a1adf000247200a9",
                        "responseScore": 8,
                        "responseMax": 8,
                        "questionModule": "location",
                        "questionSection": "street-traffic-parking",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b57a8921e574500148a5b2e"
                        },
                        "questionId": {
                          "$oid": "5b57a7251e574500148a5b23"
                        },
                        "responseId": "5b57a7251e574500148a5b26",
                        "responseScore": 8,
                        "responseMax": 8,
                        "questionModule": "location",
                        "questionSection": "street-traffic-parking",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b5819f51e574500148a5e95"
                        },
                        "questionId": {
                          "$oid": "5b5818281e574500148a5e89"
                        },
                        "responseId": "5b5818281e574500148a5e8a",
                        "responseScore": 2,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionSection": "street-aesthetics",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b5819f51e574500148a5e96"
                        },
                        "questionId": {
                          "$oid": "5b5818b71e574500148a5e8c"
                        },
                        "responseId": "5b5818b71e574500148a5e8e",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionSection": "street-aesthetics",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b5819f51e574500148a5e97"
                        },
                        "questionId": {
                          "$oid": "5b58193c1e574500148a5e8f"
                        },
                        "responseId": "5b58193c1e574500148a5e90",
                        "responseScore": 2,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionSection": "street-aesthetics",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b5eac414ecb5a0014e2cab7"
                        },
                        "questionId": {
                          "$oid": "5b5eab794ecb5a0014e2caa2"
                        },
                        "responseId": "5b21c8f5a1adf000247200b8",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionSection": "street-traffic-parking",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b60f267afdcb5001477f130"
                        },
                        "questionId": {
                          "$oid": "5b5eca8a4ecb5a0014e2cb06"
                        },
                        "responseId": "5b5eca8a4ecb5a0014e2cb07",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionSection": "street-traffic-parking",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b6162476cf0490014224abf"
                        },
                        "questionId": {
                          "$oid": "5b60f1d3afdcb5001477f11c"
                        },
                        "responseId": "5b60f1d3afdcb5001477f123",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionSection": "street-surrounding-real-estate",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b6162476cf0490014224ac0"
                        },
                        "questionId": {
                          "$oid": "5b60eb0fafdcb5001477f10b"
                        },
                        "responseId": "5b60eb0fafdcb5001477f10c",
                        "responseScore": 3,
                        "responseMax": 12,
                        "questionModule": "location",
                        "questionSection": "street-surrounding-real-estate",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119393bf5340014e527dc"
                        },
                        "questionId": {
                          "$oid": "5b6a48abdc87d000145e6a2d"
                        },
                        "responseId": "5b6a48abdc87d000145e6a2f",
                        "responseScore": 5,
                        "responseMax": 20,
                        "questionModule": "land",
                        "questionSection": "topography",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119393bf5340014e527dd"
                        },
                        "questionId": {
                          "$oid": "5b6f4bb90f59760014643e50"
                        },
                        "responseId": "5b6f4bb90f59760014643e51",
                        "responseScore": 25,
                        "responseMax": 25,
                        "questionModule": "land",
                        "questionSection": "topography",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119393bf5340014e527de"
                        },
                        "questionId": {
                          "$oid": "5b6f50ef0f59760014643e68"
                        },
                        "responseId": "5b6f50ef0f59760014643e6c",
                        "responseScore": 50,
                        "responseMax": 50,
                        "questionModule": "land",
                        "questionSection": "topography",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119393bf5340014e527df"
                        },
                        "questionId": {
                          "$oid": "5b6f51fc0f59760014643e6e"
                        },
                        "responseId": "5b6f51fc0f59760014643e6f",
                        "responseScore": 5,
                        "responseMax": 20,
                        "questionModule": "land",
                        "questionSection": "topography",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119393bf5340014e527e0"
                        },
                        "questionId": {
                          "$oid": "5b6f54d40f59760014643e73"
                        },
                        "responseId": "5b6f54d40f59760014643e77",
                        "responseScore": 40,
                        "responseMax": 40,
                        "questionModule": "land",
                        "questionSection": "topography",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119393bf5340014e527e1"
                        },
                        "questionId": {
                          "$oid": "5b6f56b50f59760014643e7a"
                        },
                        "responseId": "5b6f56b50f59760014643e7d",
                        "responseScore": 30,
                        "responseMax": 30,
                        "questionModule": "land",
                        "questionSection": "topography",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119393bf5340014e527e2"
                        },
                        "questionId": {
                          "$oid": "5b6f57eb0f59760014643e80"
                        },
                        "responseId": "5b6f57eb0f59760014643e82",
                        "responseScore": 20,
                        "responseMax": 100,
                        "questionModule": "land",
                        "questionSection": "topography",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119a23bf5340014e528f4"
                        },
                        "questionId": {
                          "$oid": "5b70a915ca33f4001499e8a7"
                        },
                        "responseId": "5b70a915ca33f4001499e8ac",
                        "responseScore": 40,
                        "responseMax": 40,
                        "questionModule": "land",
                        "questionSection": "planning",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119a23bf5340014e528f5"
                        },
                        "questionId": {
                          "$oid": "5b70aa208651870014addd91"
                        },
                        "responseId": "5b70aa208651870014addd93",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "planning",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119a23bf5340014e528f6"
                        },
                        "questionId": {
                          "$oid": "5b70ab138651870014addd95"
                        },
                        "responseId": "5b70ab138651870014addd97",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "land",
                        "questionSection": "planning",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119a23bf5340014e528f7"
                        },
                        "questionId": {
                          "$oid": "5b70ac848651870014addda0"
                        },
                        "responseId": "5b70ac848651870014addda2",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "land",
                        "questionSection": "planning",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119a23bf5340014e528f8"
                        },
                        "questionId": {
                          "$oid": "5b70ae058651870014addda4"
                        },
                        "responseId": "5b70ae058651870014addda6",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "planning",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119a23bf5340014e528f9"
                        },
                        "questionId": {
                          "$oid": "5b70b7858651870014added4"
                        },
                        "responseId": "5b70b7858651870014added6",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "planning",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b7119a23bf5340014e528fa"
                        },
                        "questionId": {
                          "$oid": "5b70b9bd8651870014addf21"
                        },
                        "responseId": "5b70b9bd8651870014addf24",
                        "responseScore": 20,
                        "responseMax": 30,
                        "questionModule": "land",
                        "questionSection": "planning",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e52980"
                        },
                        "questionId": {
                          "$oid": "5b70bac08651870014addf30"
                        },
                        "responseId": "5b70bac08651870014addf33",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e52981"
                        },
                        "questionId": {
                          "$oid": "5b70bba78651870014addf3e"
                        },
                        "responseId": "5b70bba78651870014addf41",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e52982"
                        },
                        "questionId": {
                          "$oid": "5b70bc368651870014addf43"
                        },
                        "responseId": "5b70bc368651870014addf44",
                        "responseScore": 0,
                        "responseMax": 5,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e52983"
                        },
                        "questionId": {
                          "$oid": "5b70bccf8651870014addf47"
                        },
                        "responseId": "5b70bccf8651870014addf48",
                        "responseScore": 0,
                        "responseMax": 5,
                        "questionModule": "land",
                        "questionCategory": "performance"
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e52984"
                        },
                        "questionId": {
                          "$oid": "5b70bdd98651870014addf4b"
                        },
                        "responseId": "5b70bdd98651870014addf4f",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e52985"
                        },
                        "questionId": {
                          "$oid": "5b70c2ce8651870014addf51"
                        },
                        "responseId": "5b70c2ce8651870014addf59",
                        "responseScore": 40,
                        "responseMax": 40,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e52986"
                        },
                        "questionId": {
                          "$oid": "5b70c4f58651870014addf5b"
                        },
                        "responseId": "5b70c4f58651870014addf5f",
                        "responseScore": 25,
                        "responseMax": 25,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e52987"
                        },
                        "questionId": {
                          "$oid": "5b70c6038651870014addf61"
                        },
                        "responseId": "5b70c6038651870014addf64",
                        "responseScore": 10,
                        "responseMax": 20,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e52988"
                        },
                        "questionId": {
                          "$oid": "5b70c6da8651870014addf67"
                        },
                        "responseId": "5b70c6da8651870014addf6a",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e52989"
                        },
                        "questionId": {
                          "$oid": "5b70c77f8651870014addf6c"
                        },
                        "responseId": "5b70c77f8651870014addf6f",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e5298a"
                        },
                        "questionId": {
                          "$oid": "5b70c86f8651870014addf71"
                        },
                        "responseId": "5b70c86f8651870014addf74",
                        "responseScore": 6,
                        "responseMax": 30,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e5298b"
                        },
                        "questionId": {
                          "$oid": "5b70ca758651870014addf7f"
                        },
                        "responseId": "5b70ca758651870014addf82",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e5298c"
                        },
                        "questionId": {
                          "$oid": "5b70dff636d9f70014dc9d79"
                        },
                        "responseId": "5b70dff636d9f70014dc9d7b",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e5298d"
                        },
                        "questionId": {
                          "$oid": "5b70e40e36d9f70014dc9d81"
                        },
                        "responseId": "5b70e40e36d9f70014dc9d83",
                        "responseScore": 10,
                        "responseMax": 45,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711b573bf5340014e5298e"
                        },
                        "questionId": {
                          "$oid": "5b70e4b936d9f70014dc9d87"
                        },
                        "responseId": "5b70e4b936d9f70014dc9d89",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a14"
                        },
                        "questionId": {
                          "$oid": "5b70e72436d9f70014dc9d8f"
                        },
                        "responseId": "5b70e72436d9f70014dc9d90",
                        "responseScore": 0,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a15"
                        },
                        "questionId": {
                          "$oid": "5b70e88b36d9f70014dc9d94"
                        },
                        "responseId": "5b70e88b36d9f70014dc9d99",
                        "responseScore": 25,
                        "responseMax": 25,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a16"
                        },
                        "questionId": {
                          "$oid": "5b70eb1436d9f70014dc9da3"
                        },
                        "responseId": "5b70eb1436d9f70014dc9da6",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a17"
                        },
                        "questionId": {
                          "$oid": "5b70eba336d9f70014dc9e32"
                        },
                        "responseId": "5b70eba336d9f70014dc9e36",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a18"
                        },
                        "questionId": {
                          "$oid": "5b70ec8d36d9f70014dc9e37"
                        },
                        "responseId": "5b70ec8d36d9f70014dc9e39",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a19"
                        },
                        "questionId": {
                          "$oid": "5b70ed4f36d9f70014dc9e42"
                        },
                        "responseId": "5b70ed4f36d9f70014dc9e45",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a1a"
                        },
                        "questionId": {
                          "$oid": "5b70effc36d9f70014dc9e46"
                        },
                        "responseId": "5b70effc36d9f70014dc9e4b",
                        "responseScore": 3,
                        "responseMax": 3,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a1b"
                        },
                        "questionId": {
                          "$oid": "5b70f08436d9f70014dc9e4d"
                        },
                        "responseId": "5b70f08436d9f70014dc9e4f",
                        "responseScore": 3,
                        "responseMax": 3,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a1c"
                        },
                        "questionId": {
                          "$oid": "5b70f24936d9f70014dc9e50"
                        },
                        "responseId": "5b70f24936d9f70014dc9e56",
                        "responseScore": 5,
                        "responseMax": 5,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a1d"
                        },
                        "questionId": {
                          "$oid": "5b70f36a36d9f70014dc9e62"
                        },
                        "responseId": "5b70f36a36d9f70014dc9e65",
                        "responseScore": 2,
                        "responseMax": 2,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a1e"
                        },
                        "questionId": {
                          "$oid": "5b70f40436d9f70014dc9e6d"
                        },
                        "responseId": "5b70f40436d9f70014dc9e6f",
                        "responseScore": 2,
                        "responseMax": 2,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a1f"
                        },
                        "questionId": {
                          "$oid": "5b70f4cf36d9f70014dc9e75"
                        },
                        "responseId": "5b70f4cf36d9f70014dc9e78",
                        "responseScore": 2,
                        "responseMax": 2,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a20"
                        },
                        "questionId": {
                          "$oid": "5b70f72636d9f70014dc9e79"
                        },
                        "responseId": "5b70f72636d9f70014dc9e7f",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a21"
                        },
                        "questionId": {
                          "$oid": "5b70f87b36d9f70014dc9e90"
                        },
                        "responseId": "5b70f87b36d9f70014dc9e95",
                        "responseScore": 7,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c0c3bf5340014e52a22"
                        },
                        "questionId": {
                          "$oid": "5b70f95236d9f70014dc9e98"
                        },
                        "responseId": "5b70f95236d9f70014dc9e9d",
                        "responseScore": 12,
                        "responseMax": 12,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52aa8"
                        },
                        "questionId": {
                          "$oid": "5b7104413bf5340014e52631"
                        },
                        "responseId": "5b7104413bf5340014e52633",
                        "responseScore": -5,
                        "responseMax": 48,
                        "questionModule": "land",
                        "questionSection": "",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52aa9"
                        },
                        "questionId": {
                          "$oid": "5b7105a73bf5340014e52638"
                        },
                        "responseId": "5b7105a73bf5340014e5263a",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "land",
                        "questionSection": "bonus",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52aaa"
                        },
                        "questionId": {
                          "$oid": "5b7105e73bf5340014e5263b"
                        },
                        "responseId": "5b7105e73bf5340014e5263c",
                        "responseScore": 0,
                        "responseMax": 40,
                        "questionModule": "land",
                        "questionSection": "bonus",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52aab"
                        },
                        "questionId": {
                          "$oid": "5b7106413bf5340014e5263e"
                        },
                        "responseId": "5b7106413bf5340014e5263f",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "land",
                        "questionSection": "bonus",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52aac"
                        },
                        "questionId": {
                          "$oid": "5b7106a03bf5340014e52641"
                        },
                        "responseId": "5b7106a03bf5340014e52643",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "land",
                        "questionSection": "bonus",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52aad"
                        },
                        "questionId": {
                          "$oid": "5b7108cd3bf5340014e52644"
                        },
                        "responseId": "5b7108cd3bf5340014e52646",
                        "responseScore": 3,
                        "responseMax": 3,
                        "questionModule": "land",
                        "questionSection": "",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52aae"
                        },
                        "questionId": {
                          "$oid": "5b7109723bf5340014e52647"
                        },
                        "responseId": "5b7109723bf5340014e52648",
                        "responseScore": 0,
                        "responseMax": 2,
                        "questionModule": "land",
                        "questionSection": "",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52aaf"
                        },
                        "questionId": {
                          "$oid": "5b7109da3bf5340014e5264b"
                        },
                        "responseId": "5b7109da3bf5340014e5264d",
                        "responseScore": 3,
                        "responseMax": 3,
                        "questionModule": "land",
                        "questionSection": "",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52ab0"
                        },
                        "questionId": {
                          "$oid": "5b710b013bf5340014e5264e"
                        },
                        "responseId": "5b710b013bf5340014e52650",
                        "responseScore": 2,
                        "responseMax": 2,
                        "questionModule": "land",
                        "questionSection": "",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52ab1"
                        },
                        "questionId": {
                          "$oid": "5b710b8a3bf5340014e52651"
                        },
                        "responseId": "5b710b8a3bf5340014e52655",
                        "responseScore": 4,
                        "responseMax": 4,
                        "questionModule": "land",
                        "questionSection": "",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52ab2"
                        },
                        "questionId": {
                          "$oid": "5b710cb73bf5340014e52656"
                        },
                        "responseId": "5b710cb73bf5340014e52659",
                        "responseScore": 4,
                        "responseMax": 4,
                        "questionModule": "land",
                        "questionSection": "",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52ab3"
                        },
                        "questionId": {
                          "$oid": "5b710dad3bf5340014e52661"
                        },
                        "responseId": "5b710dad3bf5340014e52666",
                        "responseScore": 2,
                        "responseMax": 3,
                        "questionModule": "land",
                        "questionSection": "",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52ab4"
                        },
                        "questionId": {
                          "$oid": "5b710ff03bf5340014e52668"
                        },
                        "responseId": "5b710ff03bf5340014e52671",
                        "responseScore": 3,
                        "responseMax": 3,
                        "questionModule": "land",
                        "questionSection": "",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52ab5"
                        },
                        "questionId": {
                          "$oid": "5b7110fe3bf5340014e52698"
                        },
                        "responseId": "5b7110fe3bf5340014e5269c",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "land",
                        "questionSection": "",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b711c573bf5340014e52ab6"
                        },
                        "questionId": {
                          "$oid": "5b7111d73bf5340014e526a9"
                        },
                        "responseId": "5b7111d73bf5340014e526ae",
                        "responseScore": 3,
                        "responseMax": 3,
                        "questionModule": "land",
                        "questionSection": "",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b711c9c3bf5340014e52b3c"
                        },
                        "questionId": {
                          "$oid": "5b70c9bf8651870014addf78"
                        },
                        "responseId": "5b70c9bf8651870014addf7b",
                        "responseScore": 7,
                        "responseMax": 11,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b79ed3372e146001443bcca"
                        },
                        "questionId": {
                          "$oid": "5b77623b0c75290014ee2aae"
                        },
                        "responseId": "5b77623b0c75290014ee2aaf",
                        "responseScore": 0,
                        "responseMax": 5,
                        "questionModule": "land",
                        "questionSection": "performance",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fba"
                        },
                        "questionId": {
                          "$oid": "5b836e7bc47e4d00140795a2"
                        },
                        "responseId": "5b836e7bc47e4d00140795a4",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fbb"
                        },
                        "questionId": {
                          "$oid": "5b83704ec47e4d00140795a5"
                        },
                        "responseId": "5b83704ec47e4d00140795a7",
                        "responseScore": 25,
                        "responseMax": 25,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fbc"
                        },
                        "questionId": {
                          "$oid": "5b8374a1c47e4d0014079604"
                        },
                        "responseId": "5b8374a1c47e4d0014079605",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fbd"
                        },
                        "questionId": {
                          "$oid": "5b8375e8c47e4d0014079607"
                        },
                        "responseId": "5b8375e8c47e4d0014079608",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fbe"
                        },
                        "questionId": {
                          "$oid": "5b83770dc47e4d001407960a"
                        },
                        "responseId": "5b83770dc47e4d001407960b",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fbf"
                        },
                        "questionId": {
                          "$oid": "5b848bee2978bb001484ba5c"
                        },
                        "responseId": "5b848bee2978bb001484ba5d",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fc0"
                        },
                        "questionId": {
                          "$oid": "5b848c792978bb001484ba5f"
                        },
                        "responseId": "5b848c792978bb001484ba60",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fc1"
                        },
                        "questionId": {
                          "$oid": "5b848dd92978bb001484ba66"
                        },
                        "responseId": "5b848dd92978bb001484ba68",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fc2"
                        },
                        "questionId": {
                          "$oid": "5b848ea42978bb001484ba69"
                        },
                        "responseId": "5b848ea42978bb001484ba6b",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fc3"
                        },
                        "questionId": {
                          "$oid": "5b848f5d2978bb001484ba6c"
                        },
                        "responseId": "5b848f5d2978bb001484ba6e",
                        "responseScore": 15,
                        "responseMax": 15,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fc4"
                        },
                        "questionId": {
                          "$oid": "5b84992d2978bb001484ba6f"
                        },
                        "responseId": "5b84992d2978bb001484ba71",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fc5"
                        },
                        "questionId": {
                          "$oid": "5b8499a22978bb001484ba72"
                        },
                        "responseId": "5b8499a22978bb001484ba74",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fc6"
                        },
                        "questionId": {
                          "$oid": "5b849a4a2978bb001484ba75"
                        },
                        "responseId": "5b849a4a2978bb001484ba77",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fc7"
                        },
                        "questionId": {
                          "$oid": "5b84d67b2978bb001484ba90"
                        },
                        "responseId": "5b84d67b2978bb001484ba92",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fc8"
                        },
                        "questionId": {
                          "$oid": "5b84dd992978bb001484ba98"
                        },
                        "responseId": "5b84dd992978bb001484ba9a",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fc9"
                        },
                        "questionId": {
                          "$oid": "5b84df282978bb001484ba9b"
                        },
                        "responseId": "5b84df282978bb001484ba9c",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fca"
                        },
                        "questionId": {
                          "$oid": "5b84e1542978bb001484baa1"
                        },
                        "responseId": "5b84e1542978bb001484baa3",
                        "responseScore": 15,
                        "responseMax": 15,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fcb"
                        },
                        "questionId": {
                          "$oid": "5b84e6432978bb001484baa4"
                        },
                        "responseId": "5b84e6432978bb001484baa6",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fcc"
                        },
                        "questionId": {
                          "$oid": "5b84f78e2978bb001484babd"
                        },
                        "responseId": "5b84f78e2978bb001484babf",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fcd"
                        },
                        "questionId": {
                          "$oid": "5b84f8812978bb001484bac0"
                        },
                        "responseId": "5b84f8812978bb001484bac2",
                        "responseScore": 15,
                        "responseMax": 15,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fce"
                        },
                        "questionId": {
                          "$oid": "5b84fb9d2978bb001484bac3"
                        },
                        "responseId": "5b84fb9d2978bb001484bac5",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fcf"
                        },
                        "questionId": {
                          "$oid": "5b84fd922978bb001484bacb"
                        },
                        "responseId": "5b84fd922978bb001484bacc",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fd0"
                        },
                        "questionId": {
                          "$oid": "5b84fe2b2978bb001484bace"
                        },
                        "responseId": "5b84fe2b2978bb001484bad0",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fd1"
                        },
                        "questionId": {
                          "$oid": "5b84fecd2978bb001484bad6"
                        },
                        "responseId": "5b84fecd2978bb001484bad8",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fd2"
                        },
                        "questionId": {
                          "$oid": "5b8500d02978bb001484badc"
                        },
                        "responseId": "5b8500d02978bb001484bade",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fd3"
                        },
                        "questionId": {
                          "$oid": "5b8501862978bb001484badf"
                        },
                        "responseId": "5b8501d22978bb001484bae2",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fd4"
                        },
                        "questionId": {
                          "$oid": "5b84ffe92978bb001484bad9"
                        },
                        "responseId": "5b84ffe92978bb001484bada",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fd5"
                        },
                        "questionId": {
                          "$oid": "5b851eca25ac1800144a0fa8"
                        },
                        "responseId": "5b851eca25ac1800144a0fa9",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fd6"
                        },
                        "questionId": {
                          "$oid": "5b851f7025ac1800144a0faa"
                        },
                        "responseId": "5b851f7025ac1800144a0fab",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8523be25ac1800144a0fd7"
                        },
                        "questionId": {
                          "$oid": "5b85205025ac1800144a0fb4"
                        },
                        "responseId": "5b85205025ac1800144a0fb5",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b85260b25ac1800144a0fe7"
                        },
                        "questionId": {
                          "$oid": "5b84ea832978bb001484baa7"
                        },
                        "responseId": "5b84eb042978bb001484baaa",
                        "responseScore": 0,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b85260b25ac1800144a0fe8"
                        },
                        "questionId": {
                          "$oid": "5b84ee412978bb001484bab8"
                        },
                        "responseId": "5b84ee412978bb001484bab9",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b85260b25ac1800144a0fe9"
                        },
                        "questionId": {
                          "$oid": "5b84f44a2978bb001484baba"
                        },
                        "responseId": "5b84f44a2978bb001484babb",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b852b4198937e00148e0bb6"
                        },
                        "questionId": {
                          "$oid": "5b849b202978bb001484ba78"
                        },
                        "responseId": "5b849b202978bb001484ba7a",
                        "responseScore": 10,
                        "responseMax": 40,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b866c0198937e00148e167e"
                        },
                        "questionId": {
                          "$oid": "5b85ee6798937e00148e0f14"
                        },
                        "responseId": "5b85ee6798937e00148e0f15",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b866c0198937e00148e167f"
                        },
                        "questionId": {
                          "$oid": "5b85c68298937e00148e0d3d"
                        },
                        "responseId": "5b85c68298937e00148e0d3f",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b866c0198937e00148e1680"
                        },
                        "questionId": {
                          "$oid": "5b86047c98937e00148e10e8"
                        },
                        "responseId": "5b86047c98937e00148e10eb",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b866c0198937e00148e1681"
                        },
                        "questionId": {
                          "$oid": "5b861d0c98937e00148e11d8"
                        },
                        "responseId": "5b8624e598937e00148e12ea",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b866c0198937e00148e1682"
                        },
                        "questionId": {
                          "$oid": "5b862fe298937e00148e1470"
                        },
                        "responseId": "5b86341698937e00148e1478",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b866c0198937e00148e1683"
                        },
                        "questionId": {
                          "$oid": "5b86378698937e00148e147e"
                        },
                        "responseId": "5b86381298937e00148e1481",
                        "responseScore": 5,
                        "responseMax": 5,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b866c0198937e00148e1684"
                        },
                        "questionId": {
                          "$oid": "5b863cb998937e00148e14ec"
                        },
                        "responseId": "5b863cb998937e00148e14ed",
                        "responseScore": 3,
                        "responseMax": 3,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b866c0198937e00148e1685"
                        },
                        "questionId": {
                          "$oid": "5b86417198937e00148e1604"
                        },
                        "responseId": "5b86417198937e00148e1606",
                        "responseScore": 50,
                        "responseMax": 75,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b866c0198937e00148e1686"
                        },
                        "questionId": {
                          "$oid": "5b8654cb98937e00148e1656"
                        },
                        "responseId": "5b8654cb98937e00148e165a",
                        "responseScore": 20,
                        "responseMax": 30,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b866d8b98937e00148e16ac"
                        },
                        "questionId": {
                          "$oid": "5b85eb2298937e00148e0f0f"
                        },
                        "responseId": "5b85eb2298937e00148e0f11",
                        "responseScore": 250,
                        "responseMax": 250,
                        "questionModule": "house,land",
                        "questionSection": "",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b866de898937e00148e1736"
                        },
                        "questionId": {
                          "$oid": "5b809434d28bce001404d0ce"
                        },
                        "responseId": "5b809434d28bce001404d0d1",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b86718698937e00148e17f7"
                        },
                        "questionId": {
                          "$oid": "5b85afd998937e00148e0d00"
                        },
                        "responseId": "5b85afd998937e00148e0d02",
                        "responseScore": 8,
                        "responseMax": 17,
                        "questionModule": "location",
                        "questionSection": "street-aesthetics",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8874588579db0014409b46"
                        },
                        "questionId": {
                          "$oid": "5b886bb38579db0014409b32"
                        },
                        "responseId": "5b886bb38579db0014409b33",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8874588579db0014409b47"
                        },
                        "questionId": {
                          "$oid": "5b8873868579db0014409b3f"
                        },
                        "responseId": "5b8873868579db0014409b43",
                        "responseScore": 30,
                        "responseMax": 30,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8c63526e6d100014242a76"
                        },
                        "questionId": {
                          "$oid": "5b88a57b8579db0014409cea"
                        },
                        "responseId": "5b88a57b8579db0014409ced",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce14550a87c00143235a1"
                        },
                        "questionId": {
                          "$oid": "5b8cab346e6d100014243367"
                        },
                        "responseId": "5b8cab346e6d100014243369",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce14550a87c00143235a2"
                        },
                        "questionId": {
                          "$oid": "5b8cad486e6d100014243400"
                        },
                        "responseId": "5b8cad486e6d100014243403",
                        "responseScore": 13,
                        "responseMax": 15,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce14550a87c00143235a3"
                        },
                        "questionId": {
                          "$oid": "5b8cb41850a87c0014322ec7"
                        },
                        "responseId": "5b8cb41850a87c0014322ec9",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce14550a87c00143235a4"
                        },
                        "questionId": {
                          "$oid": "5b8cb5e350a87c0014322f03"
                        },
                        "responseId": "5b8cb73550a87c0014322f2f",
                        "responseScore": 13,
                        "responseMax": 15,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce14550a87c00143235a5"
                        },
                        "questionId": {
                          "$oid": "5b8b47e4ced1700014c56996"
                        },
                        "responseId": "5b8b4a2aced1700014c56999",
                        "responseScore": 20,
                        "responseMax": 40,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce14550a87c00143235a6"
                        },
                        "questionId": {
                          "$oid": "5b8c89286e6d100014242c9b"
                        },
                        "responseId": "5b8c8e6f6e6d100014242d37",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "land",
                        "questionSection": "improvements",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235b7"
                        },
                        "questionId": {
                          "$oid": "5b889a748579db0014409cdc"
                        },
                        "responseId": "5b889a748579db0014409cde",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235b8"
                        },
                        "questionId": {
                          "$oid": "5b88af878579db0014409cfa"
                        },
                        "responseId": "5b88af878579db0014409d00",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235b9"
                        },
                        "questionId": {
                          "$oid": "5b88ad578579db0014409cee"
                        },
                        "responseId": "5b88ae7b8579db0014409cf8",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235ba"
                        },
                        "questionId": {
                          "$oid": "5b88b0b08579db0014409d17"
                        },
                        "responseId": "5b88b1368579db0014409d1f",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235bb"
                        },
                        "questionId": {
                          "$oid": "5b88b3f78579db0014409d40"
                        },
                        "responseId": "5b88b3f78579db0014409d43",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235bc"
                        },
                        "questionId": {
                          "$oid": "5b88b4e28579db0014409d44"
                        },
                        "responseId": "5b88b4e28579db0014409d47",
                        "responseScore": 25,
                        "responseMax": 25,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235bd"
                        },
                        "questionId": {
                          "$oid": "5b88b68d8579db0014409d48"
                        },
                        "responseId": "5b88b68d8579db0014409d4d",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235be"
                        },
                        "questionId": {
                          "$oid": "5b88b8ae8579db0014409d4e"
                        },
                        "responseId": "5b88b8ae8579db0014409d53",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235bf"
                        },
                        "questionId": {
                          "$oid": "5b88b9028579db0014409d54"
                        },
                        "responseId": "5b88b9028579db0014409d57",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "structure",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235c0"
                        },
                        "questionId": {
                          "$oid": "5b88bb6f8579db0014409d63"
                        },
                        "responseId": "5b88bb6f8579db0014409d65",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235c1"
                        },
                        "questionId": {
                          "$oid": "5b88c5528579db0014409d68"
                        },
                        "responseId": "5b88c5528579db0014409d6c",
                        "responseScore": 7,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235c2"
                        },
                        "questionId": {
                          "$oid": "5b88c7598579db0014409d6e"
                        },
                        "responseId": "5b88c7598579db0014409d73",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235c3"
                        },
                        "questionId": {
                          "$oid": "5b88caec8579db0014409d7d"
                        },
                        "responseId": "5b88caec8579db0014409d81",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce22750a87c00143235c4"
                        },
                        "questionId": {
                          "$oid": "5b88ccc88579db0014409d82"
                        },
                        "responseId": "5b88ccc88579db0014409d86",
                        "responseScore": 5,
                        "responseMax": 5,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce24c50a87c00143235eb"
                        },
                        "questionId": {
                          "$oid": "5b8a67e7652d140014ddd212"
                        },
                        "responseId": "5b8a67e7652d140014ddd216",
                        "responseScore": 40,
                        "responseMax": 75,
                        "questionModule": "house",
                        "questionSection": "structure",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce24c50a87c00143235ec"
                        },
                        "questionId": {
                          "$oid": "5b8a67e8652d140014ddd219"
                        },
                        "responseId": "5b8a67e8652d140014ddd21c",
                        "responseScore": 50,
                        "responseMax": 50,
                        "questionModule": "house",
                        "questionSection": "structure",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce24c50a87c00143235ed"
                        },
                        "questionId": {
                          "$oid": "5b8a67e9652d140014ddd21e"
                        },
                        "responseId": "5b8a67e9652d140014ddd222",
                        "responseScore": 50,
                        "responseMax": 50,
                        "questionModule": "house",
                        "questionSection": "structure",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce24c50a87c00143235ee"
                        },
                        "questionId": {
                          "$oid": "5b8a67ec652d140014ddd22a"
                        },
                        "responseId": "5b8a67ec652d140014ddd22f",
                        "responseScore": 50,
                        "responseMax": 50,
                        "questionModule": "house",
                        "questionSection": "structure",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce24c50a87c00143235ef"
                        },
                        "questionId": {
                          "$oid": "5b8a67ed652d140014ddd231"
                        },
                        "responseId": "5b8a67ed652d140014ddd237",
                        "responseScore": 25,
                        "responseMax": 50,
                        "questionModule": "house",
                        "questionSection": "structure",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce24c50a87c00143235f0"
                        },
                        "questionId": {
                          "$oid": "5b8a67f0652d140014ddd246"
                        },
                        "responseId": "5b8a67f0652d140014ddd248",
                        "responseScore": 40,
                        "responseMax": 50,
                        "questionModule": "house",
                        "questionSection": "structure",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce24c50a87c00143235f1"
                        },
                        "questionId": {
                          "$oid": "5b8a67f1652d140014ddd24c"
                        },
                        "responseId": "5b8a67f1652d140014ddd24e",
                        "responseScore": 40,
                        "responseMax": 50,
                        "questionModule": "house",
                        "questionSection": "structure",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c00143235f9"
                        },
                        "questionId": {
                          "$oid": "5b8a67cd652d140014ddd179"
                        },
                        "responseId": "5b8a67cd652d140014ddd17c",
                        "responseScore": 15,
                        "responseMax": 15,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c00143235fa"
                        },
                        "questionId": {
                          "$oid": "5b8a67ce652d140014ddd17d"
                        },
                        "responseId": "5b8a67ce652d140014ddd17f",
                        "responseScore": 5,
                        "responseMax": 5,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c00143235fb"
                        },
                        "questionId": {
                          "$oid": "5b8a67cf652d140014ddd180"
                        },
                        "responseId": "5b8a67cf652d140014ddd186",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c00143235fc"
                        },
                        "questionId": {
                          "$oid": "5b8a67d0652d140014ddd187"
                        },
                        "responseId": "5b8a67d0652d140014ddd18d",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c00143235fd"
                        },
                        "questionId": {
                          "$oid": "5b8a67d1652d140014ddd18e"
                        },
                        "responseId": "5b8a67d1652d140014ddd194",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c00143235fe"
                        },
                        "questionId": {
                          "$oid": "5b8a67d2652d140014ddd195"
                        },
                        "responseId": "5b8a67d2652d140014ddd19b",
                        "responseScore": 15,
                        "responseMax": 15,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c00143235ff"
                        },
                        "questionId": {
                          "$oid": "5b8a67d3652d140014ddd19c"
                        },
                        "responseId": "5b8a67d3652d140014ddd1a2",
                        "responseScore": 30,
                        "responseMax": 30,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c0014323600"
                        },
                        "questionId": {
                          "$oid": "5b8a67d4652d140014ddd1a3"
                        },
                        "responseId": "5b8a67d4652d140014ddd1a9",
                        "responseScore": 40,
                        "responseMax": 40,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c0014323601"
                        },
                        "questionId": {
                          "$oid": "5b8a67d5652d140014ddd1aa"
                        },
                        "responseId": "5b8a67d5652d140014ddd1b0",
                        "responseScore": 30,
                        "responseMax": 30,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c0014323602"
                        },
                        "questionId": {
                          "$oid": "5b8a67d6652d140014ddd1b1"
                        },
                        "responseId": "5b8a67d6652d140014ddd1b2",
                        "responseScore": 10,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c0014323603"
                        },
                        "questionId": {
                          "$oid": "5b8a67d7652d140014ddd1b8"
                        },
                        "responseId": "5b8a67d7652d140014ddd1be",
                        "responseScore": 30,
                        "responseMax": 30,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c0014323604"
                        },
                        "questionId": {
                          "$oid": "5b8a67d8652d140014ddd1bf"
                        },
                        "responseId": "5b8a67d8652d140014ddd1c0",
                        "responseScore": 6,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c0014323605"
                        },
                        "questionId": {
                          "$oid": "5b8a67d9652d140014ddd1c6"
                        },
                        "responseId": "5b8a67d9652d140014ddd1cc",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce51f50a87c0014323606"
                        },
                        "questionId": {
                          "$oid": "5b8a67da652d140014ddd1cd"
                        },
                        "responseId": "5b8a67da652d140014ddd1cf",
                        "responseScore": 40,
                        "responseMax": 40,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce73f50a87c0014323613"
                        },
                        "questionId": {
                          "$oid": "5b8a67c1652d140014ddd138"
                        },
                        "responseId": "5b8a67c1652d140014ddd13a",
                        "responseScore": 0,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": true
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce88450a87c0014323622"
                        },
                        "questionId": {
                          "$oid": "5b8a67db652d140014ddd1d1"
                        },
                        "responseId": "5b8a67db652d140014ddd1d3",
                        "responseScore": 40,
                        "responseMax": 40,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce88450a87c0014323623"
                        },
                        "questionId": {
                          "$oid": "5b8a67dc652d140014ddd1d5"
                        },
                        "responseId": "5b8a67dc652d140014ddd1db",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce88450a87c0014323624"
                        },
                        "questionId": {
                          "$oid": "5b8a67dd652d140014ddd1dc"
                        },
                        "responseId": "5b8a67dd652d140014ddd1e2",
                        "responseScore": 5,
                        "responseMax": 5,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce88450a87c0014323625"
                        },
                        "questionId": {
                          "$oid": "5b8a67df652d140014ddd1e8"
                        },
                        "responseId": "5b8a67df652d140014ddd1eb",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce88450a87c0014323626"
                        },
                        "questionId": {
                          "$oid": "5b8a67e1652d140014ddd1f0"
                        },
                        "responseId": "5b8a67e1652d140014ddd1f3",
                        "responseScore": 15,
                        "responseMax": 15,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce88450a87c0014323627"
                        },
                        "questionId": {
                          "$oid": "5b8a67e2652d140014ddd1f4"
                        },
                        "responseId": "5b8a67e2652d140014ddd1fe",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce88450a87c0014323628"
                        },
                        "questionId": {
                          "$oid": "5b8a67e4652d140014ddd204"
                        },
                        "responseId": "5b8a67e4652d140014ddd207",
                        "responseScore": 15,
                        "responseMax": 15,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce88450a87c0014323629"
                        },
                        "questionId": {
                          "$oid": "5b8a67e5652d140014ddd208"
                        },
                        "responseId": "5b8a67e5652d140014ddd20b",
                        "responseScore": 5,
                        "responseMax": 5,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce88450a87c001432362a"
                        },
                        "questionId": {
                          "$oid": "5b8a67e6652d140014ddd20c"
                        },
                        "responseId": "5b8a67e6652d140014ddd211",
                        "responseScore": 15,
                        "responseMax": 15,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c0014323639"
                        },
                        "questionId": {
                          "$oid": "5b8a67ba652d140014ddd118"
                        },
                        "responseId": "5b8a67ba652d140014ddd11d",
                        "responseScore": 30,
                        "responseMax": 30,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c001432363a"
                        },
                        "questionId": {
                          "$oid": "5b8a67bb652d140014ddd11e"
                        },
                        "responseId": "5b8a67bb652d140014ddd121",
                        "responseScore": 25,
                        "responseMax": 25,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c001432363b"
                        },
                        "questionId": {
                          "$oid": "5b8a67bc652d140014ddd122"
                        },
                        "responseId": "5b8a67bc652d140014ddd125",
                        "responseScore": 10,
                        "responseMax": 15,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c001432363c"
                        },
                        "questionId": {
                          "$oid": "5b8a67bd652d140014ddd127"
                        },
                        "responseId": "5b8a67bd652d140014ddd129",
                        "responseScore": 0,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c001432363d"
                        },
                        "questionId": {
                          "$oid": "5b8a67be652d140014ddd12c"
                        },
                        "responseId": "5b8a67be652d140014ddd12e",
                        "responseScore": 0,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c001432363e"
                        },
                        "questionId": {
                          "$oid": "5b8a67bf652d140014ddd130"
                        },
                        "responseId": "5b8a67bf652d140014ddd132",
                        "responseScore": 0,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c001432363f"
                        },
                        "questionId": {
                          "$oid": "5b8a67c2652d140014ddd13c"
                        },
                        "responseId": "5b8a67c2652d140014ddd13e",
                        "responseScore": 0,
                        "responseMax": 4,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c0014323640"
                        },
                        "questionId": {
                          "$oid": "5b8a67c3652d140014ddd140"
                        },
                        "responseId": "5b8a67c3652d140014ddd143",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c0014323641"
                        },
                        "questionId": {
                          "$oid": "5b8a67c4652d140014ddd144"
                        },
                        "responseId": "5b8a67c4652d140014ddd147",
                        "responseScore": 8,
                        "responseMax": 8,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c0014323642"
                        },
                        "questionId": {
                          "$oid": "5b8a67c5652d140014ddd148"
                        },
                        "responseId": "5b8a67c5652d140014ddd14e",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c0014323643"
                        },
                        "questionId": {
                          "$oid": "5b8a67c6652d140014ddd14f"
                        },
                        "responseId": "5b8a67c6652d140014ddd154",
                        "responseScore": 15,
                        "responseMax": 15,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c0014323644"
                        },
                        "questionId": {
                          "$oid": "5b8a67c7652d140014ddd156"
                        },
                        "responseId": "5b8a67c7652d140014ddd15a",
                        "responseScore": 5,
                        "responseMax": 5,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c0014323645"
                        },
                        "questionId": {
                          "$oid": "5b8a67c8652d140014ddd15c"
                        },
                        "responseId": "5b8a67c8652d140014ddd15f",
                        "responseScore": 3,
                        "responseMax": 5,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c0014323646"
                        },
                        "questionId": {
                          "$oid": "5b8a67c9652d140014ddd162"
                        },
                        "responseId": "5b8a67c9652d140014ddd164",
                        "responseScore": 0,
                        "responseMax": 7,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c0014323647"
                        },
                        "questionId": {
                          "$oid": "5b8a67ca652d140014ddd166"
                        },
                        "responseId": "5b8a67ca652d140014ddd16b",
                        "responseScore": 30,
                        "responseMax": 30,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c0014323648"
                        },
                        "questionId": {
                          "$oid": "5b8a67cb652d140014ddd170"
                        },
                        "responseId": "5b8a67cb652d140014ddd173",
                        "responseScore": 2,
                        "responseMax": 2,
                        "questionModule": "house",
                        "questionSection": "inclusions",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce93d50a87c0014323649"
                        },
                        "questionId": {
                          "$oid": "5b8a67cc652d140014ddd174"
                        },
                        "responseId": "5b8a67cc652d140014ddd178",
                        "responseScore": 5,
                        "responseMax": 5,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce96b50a87c0014323653"
                        },
                        "questionId": {
                          "$oid": "5b8a67b0652d140014ddd0d4"
                        },
                        "responseId": "5b8a67b0652d140014ddd0d7",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "external",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce96b50a87c0014323654"
                        },
                        "questionId": {
                          "$oid": "5b8a67b1652d140014ddd0d8"
                        },
                        "responseId": "5b8a67b1652d140014ddd0db",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "external",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce96b50a87c0014323655"
                        },
                        "questionId": {
                          "$oid": "5b8a67b2652d140014ddd0dc"
                        },
                        "responseId": "5b8a67b2652d140014ddd0de",
                        "responseScore": 0,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "external",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce96b50a87c0014323656"
                        },
                        "questionId": {
                          "$oid": "5b8a67b3652d140014ddd0e0"
                        },
                        "responseId": "5b8a67b3652d140014ddd0e3",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "external",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce96b50a87c0014323657"
                        },
                        "questionId": {
                          "$oid": "5b8a67b4652d140014ddd0e4"
                        },
                        "responseId": "5b8a67b4652d140014ddd0e7",
                        "responseScore": 0,
                        "responseMax": 8,
                        "questionModule": "house",
                        "questionSection": "external",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce96b50a87c0014323658"
                        },
                        "questionId": {
                          "$oid": "5b8a67b5652d140014ddd0e9"
                        },
                        "responseId": "5b8a67b5652d140014ddd0ef",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "external",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8ce96b50a87c0014323659"
                        },
                        "questionId": {
                          "$oid": "5b8a67b6652d140014ddd0f3"
                        },
                        "responseId": "5b8a67b6652d140014ddd0f6",
                        "responseScore": 7,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "external",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8dc6fb71eaa10014f14ca5"
                        },
                        "questionId": {
                          "$oid": "5b8a67de652d140014ddd1e3"
                        },
                        "responseId": "5b8a67de652d140014ddd1e7",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8f47f95fe1750014668db5"
                        },
                        "questionId": {
                          "$oid": "5b8f38ca5fe1750014668680"
                        },
                        "responseId": "5b8f38ca5fe1750014668683",
                        "responseScore": 30,
                        "responseMax": 30,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8f49e25fe1750014668e04"
                        },
                        "questionId": {
                          "$oid": "5b8cc0c250a87c0014323023"
                        },
                        "responseId": "5b8cc0c250a87c0014323024",
                        "responseScore": 0,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionSection": "street-surrounding-real-estate",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b8f4a795fe1750014668e5a"
                        },
                        "questionId": {
                          "$oid": "5b8a3db3652d140014ddcdfa"
                        },
                        "responseId": "5b8a3db3652d140014ddcdfb",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "location",
                        "questionSection": "street-traffic-parking",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b91dd328e84230014f7cbe2"
                        },
                        "questionId": {
                          "$oid": "5b8f63ae5fe17500146695be"
                        },
                        "responseId": "5b8f63ae5fe17500146695bf",
                        "responseScore": 0,
                        "responseMax": 0,
                        "questionModule": "house",
                        "questionSection": "design-liveability",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b91de418e84230014f7cc2e"
                        },
                        "questionId": {
                          "$oid": "5b8f5a4c5fe1750014669098"
                        },
                        "responseId": "5b8f5a4c5fe175001466909c",
                        "responseScore": 20,
                        "responseMax": 20,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b91de418e84230014f7cc2f"
                        },
                        "questionId": {
                          "$oid": "5b8f5cf75fe1750014669493"
                        },
                        "responseId": "5b8f5cf75fe1750014669495",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b95cbbe5de51600157389f2"
                        },
                        "questionId": {
                          "$oid": "5b8a67e0652d140014ddd1ec"
                        },
                        "responseId": "5b8a67e0652d140014ddd1ee",
                        "responseScore": 7,
                        "responseMax": 7,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b95cbbe5de51600157389f3"
                        },
                        "questionId": {
                          "$oid": "5b8a67e3652d140014ddd1ff"
                        },
                        "responseId": "5b8a67e3652d140014ddd203",
                        "responseScore": 10,
                        "responseMax": 10,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      },
                      {
                        "_id": {
                          "$oid": "5b95cbbe5de51600157389f4"
                        },
                        "questionId": {
                          "$oid": "5b8cb79a50a87c0014322f48"
                        },
                        "responseId": "5b8cb79a50a87c0014322f4c",
                        "responseScore": 5,
                        "responseMax": 5,
                        "questionModule": "house",
                        "questionSection": "quality-condition",
                        "adjustmentQuestion": false
                      }
                    ],
                    "__v": 189,
                    "analysisType": "renovated-house"
                  }))
                  survey.save().then((survey) => {
                    // console.log('======================== Survey ========================\n', survey)
                    // console.log('\n======================== End Survey ========================')
                    done()
                  })
                });
              })
            })
        })
    }
  })

  after((done) => {
    mockgoose.helper.reset().then(() => {
      done()
    })
  })

  it('Should be return survery scores', function (done) {
    chai.request(server)
      .post('/api/properties/5b57a49d1e574500148a5ae8/survey/score')
      .set('Authorization', 'bearer ' + token)
      .send({
        modules: [{
            module: 'location'
          },
          {
            module: 'land'
          },
          {
            module: 'house'
          }
        ]
      })
      .then(function (res) {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.a('object')
        expect(res.body).to.have.property('modules')
         console.log('================================= Score =================================\n')
         res.body.modules.forEach(element => {
          console.log('--------- ' + element.module + ': ', element.score)
         });
         console.log('\n================================= End Score =================================')
        done()
      })
  })
})
