const apiUtils = require('./api.utils');
const ServiceClassification = require('../models/ServiceClassification');
const QuestionClassification = require('../models/QuestionClassification');
const AnalysisTypes = require('../models/AnalysisTypes');
const ScoringRuleServiceClassification = require('../models/ScoringRuleServiceClassification');
const CalculationMethods = require('../models/CalculationMethods');
const ReportContentTypes = require('../models/ReportContentTypes');
const PropertyTypes = require('../models/PropertyTypes');

exports.getServiceClassification = (req, res) => {
  const query = {
    name: 'Service Classifications'
  };
  apiUtils.responseMongooseSimple(ServiceClassification.findOne(query).exec(), req, res);
};

exports.getQuestionClassification = (req, res) => {
  const query = {
    name: 'Question Classifications'
  };
  apiUtils.responseMongooseSimple(QuestionClassification.findOne(query).exec(), req, res);
};

exports.getScoringRuleServiceClassification = (req, res) => {
  const query = {
    name: 'Scoring Rule Service Classifications'
  };
  apiUtils.responseMongooseSimple(ScoringRuleServiceClassification.findOne(query).exec(), req, res);
};

exports.getCalculationMethods = (req, res) => {
  const query = {
    name: 'Calculation Methods'
  };
  apiUtils.responseMongooseSimple(CalculationMethods.findOne(query).exec(), req, res);
};

exports.getAnalysisTypes = (req, res) => {
  const query = {
    name: 'Analysis Types'
  };
  apiUtils.responseMongooseSimple(AnalysisTypes.findOne(query).exec(), req, res);
};

exports.getReportContentTypes = (req, res) => {
  const query = {
    name: 'Report Content Types'
  };
  apiUtils.responseMongooseSimple(ReportContentTypes.findOne(query).exec(), req, res);
}

exports.getPropertyTypes = (req, res) => {
  const query = {
    name: 'Property Types'
  };
  apiUtils.responseMongooseSimple(PropertyTypes.findOne(query).exec(), req, res);
}
