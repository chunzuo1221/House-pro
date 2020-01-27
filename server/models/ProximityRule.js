const mongoose = require('mongoose');

const ProximityRuleSchema = new mongoose.Schema({
  name: String,
  code: String,
  measures: [{
    travelMode: String,
    upperBound: Number,
    units: String,
    score: Number,
    order: Number
  }]
});

const ProximityRule = mongoose.model('ProximityRule', ProximityRuleSchema);

module.exports = ProximityRule;
