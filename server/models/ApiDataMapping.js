const mongoose = require('mongoose');

const ApiDataMappingSchema = new mongoose.Schema({
  name: String,
  dataproviders: [
    {
      providerId: String,
      mapping: [
        {
          map: String,
          source: String,
          options: String
        }
      ],
    }
  ]
});

const ApiDataMapping = mongoose.model('ApiDataMapping', ApiDataMappingSchema, 'referencedata');

module.exports = ApiDataMapping;
