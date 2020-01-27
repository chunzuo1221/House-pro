const mongoose = require('mongoose');

const AnalysisTypesSchema = new mongoose.Schema({
  name: String,
  types: [{
    code: String,
    text: String,
    explain: String
  }]
});

const AnalysisTypes = mongoose.model('AnalysisTypes', AnalysisTypesSchema, 'referencedata');

module.exports = AnalysisTypes;
