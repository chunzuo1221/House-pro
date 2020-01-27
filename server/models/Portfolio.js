const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: String,
  properties: [{
    propertyId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Property'
    },
    isArchived: Boolean,
    status: String
  }]
}, { timestamps: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
