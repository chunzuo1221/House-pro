const mongoose = require('mongoose');

const SuburbSchema = new mongoose.Schema({
  postCode: String,
  name: String,
  services: [{
    lookupType: String,
    name: String,
    googlePlaceId: String,
    location: {
      lat: Number,
      lng: Number
    },
    serviceCategory: String,
    serviceType: String,
    serviceSubType: String,
    keywords: String,
    proximityRuleId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'ProximityRule'
    },
    trips: [],
    bonuses: [],
    isActive: { type: Boolean, default: true }
  }],
  dataProviders: [{
    name: String,
    description: String,
    resolveExtIDUrl: String,
    getExtPropertyDetailsUrl: String,
    processExternalResponseUrl: String
  }],
  mappings: [{
    source: String,
    options: String
  }],
  overviewDescription: String
});

const Suburb = mongoose.model('Suburb', SuburbSchema);

module.exports = Suburb;
