const mongoose = require('mongoose');

const ServiceProximityAssessmentSchema = new mongoose.Schema({
  userId: String,
  propertyId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Property'
  },
  suburbId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Suburb'
  },
  assessmentDateTime: Date,
  services: [{
    name: String,
    googlePlaceId: String,
    serviceCategory: String,
    serviceType: String,
    serviceSubType: String,
    keywords: String,
    proximityRuleCode: String,
    servicePenalty: Number,
    suburbServiceId: String,
    travels: [{
      matchedTravelMode: String,
      travelDistance: Number,
      travelTime: Number,
      score: Number,
      maxScore: Number
    }],
    location: {
      lat: Number,
      lng: Number
    }
  }],
  clonedFrom: String
});

const ServiceProximityAssessment = mongoose.model('ServiceProximityAssessment', ServiceProximityAssessmentSchema);

module.exports = ServiceProximityAssessment;
