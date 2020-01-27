const mongoose = require('mongoose');

const ScoringRuleSchema = new mongoose.Schema({
  categoryName: String,
  categoryCode: String,
  typeName: String,
  typeCode: String,
  subTypeName: String,
  subTypeCode: String,
  calculationMethodName: String,
  calculationMethodCode: String,
  postCode: String,
  uuid: String
});

const ScoringRule = mongoose.model('ScoringRule', ScoringRuleSchema);

module.exports = ScoringRule;
