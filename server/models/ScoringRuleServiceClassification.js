const mongoose = require('mongoose');

const ScoringRuleServiceClassificationSchema = new mongoose.Schema({
  name: String,
  serviceCategories: [{
    code: String,
    text: String,
    scoringRollup: String,
    serviceTypes: [{
      code: String,
      text: String,
      travelTime: String,
      serviceSubTypes: [{
        code: String,
        text: String
      }]
    }]
  }]
});

const ScoringRuleServiceClassification = mongoose.model('ScoringRuleServiceClassification', ScoringRuleServiceClassificationSchema, 'referencedata');

module.exports = ScoringRuleServiceClassification;
