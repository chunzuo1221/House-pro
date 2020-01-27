const mongoose = require('mongoose');

const PropertyTypesSchema = new mongoose.Schema({
  name: String,
  types: [{
    code: String,
    text: String,
    explain: String
  }]
});

const PropertyTypes = mongoose.model('PropertyTypes', PropertyTypesSchema, 'referencedata');

module.exports = PropertyTypes;
