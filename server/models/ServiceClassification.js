const mongoose = require('mongoose');

const ServiceClassificationSchema = new mongoose.Schema({
  name: String,
  serviceCategories: [{
    code: String,
    text: String,
    scoringRollup: String,
    serviceTypes: [{
      code: String,
      text: String,
      travelTime: String
    }],
    serviceSubTypes: [{
      code: String,
      text: String
    }]
  }]
});

const ServiceClassification = mongoose.model('ServiceClassification', ServiceClassificationSchema, 'referencedata');

module.exports = ServiceClassification;
