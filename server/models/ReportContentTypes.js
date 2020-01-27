const mongoose = require('mongoose');

const ReportContentTypesSchema = new mongoose.Schema({
  name: String,
  types: [{
    code: String,
    text: String
  }]
});

const ReportContentTypes = mongoose.model('ReportContentTypes', ReportContentTypesSchema, 'referencedata');

module.exports = ReportContentTypes;
