const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  address_components: [],
  geometry: {
    location: {
      lat: Number,
      lng: Number
    },
    viewport: {
      northeast: {
        lat: Number,
        lng: Number
      },
      southwest: {
        lat: Number,
        lng: Number
      }
    }
  },
  formatted_address: String,
  place_id: String,
  icon: String,
  id: String,
  name: String,
  services: [],
  reference: String,
  scope: String,
  types: [String],
  url: String,
  utc_offset: Number,
  vicinity: String,
  externalData: mongoose.Schema.Types.Mixed,
  propertyImages: [],
  locked: Boolean,
  onMarket: Boolean,
  adImageURL: String,
  landReportIntroduction: String,
  houseReportIntroduction: String
}, { timestamps: true });


const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
