const mongoose = require('mongoose');

const CalculationMethodsSchema = new mongoose.Schema({
  name: String,
  methods: [{
    name: String,
    code: String,
    text: String,
    number: Number
  }]
});

const CalculationMethods = mongoose.model('CalculationMethods', CalculationMethodsSchema, 'referencedata');

module.exports = CalculationMethods;
