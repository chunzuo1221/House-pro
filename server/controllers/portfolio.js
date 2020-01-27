const Promise = require('bluebird');
const Portfolio = require('../models/Portfolio');
const Property = require('../models/Property');
const SurveyAnswer = require('../models/SurveyAnswer');
const QuestionClassification = require('../models/QuestionClassification');
const {evaluatePropertyLocation, classifySurveyAnswers} = require('./survey');
const {createProperty} = require('./property');
const {getAddressComponentValue} = require('../util');
const logger = require('./logger');

const collectAllScores = (properties) => {
  if (properties.length) {
    return QuestionClassification
      .findOne({ name: 'Question Classifications' }).lean()
      .then(questionClassification => {
        return Promise.map(
          properties,
          (property) => {
            const postCode = getAddressComponentValue(property.address_components, 'postal_code')
            return Promise.props({
              surveyAnswers: SurveyAnswer
                .find({propertyId: property._id})
                .populate({path: 'responses.questionId', select: 'questionModule questionSection questionCategory analysisTypes adjustmentQuestion'}).lean(),
              scores: evaluatePropertyLocation(property._id, postCode)
            })
              .then(({surveyAnswers, scores}) => {
                return {
                  ...property,
                  scores,
                  surveyScores: classifySurveyAnswers(surveyAnswers, questionClassification)
                }
              })
          }
        )
      })
  }
  return Promise.resolve(properties)
}

const getPortfolio = (req, res) => {
  const query = {
    userId: req.user.sub
  }
  Portfolio.findOne(query).populate({
    path: 'properties.propertyId',
    select: '_id address_components externalData formatted_address geometry name place_id propertyImages rankings scores services'
  }).lean()
    .then(results => {
      if (results) {
        let properties = results.properties.filter(o => o.propertyId).map(o => {
          property = o.propertyId
          property.isArchived = o.isArchived
          return property
        })
        if (req.query.isArchived === 'true') {
          properties = properties.filter(p => p.isArchived === true)
        } else {
          properties = properties.filter(p => p.isArchived !== true)
        }
        collectAllScores(properties)
          .then(properties => {
            const portfolio = {
              _id: results._id,
              properties
            }
            res.status(200).json(portfolio)
          })
      } else {
        res.status(200).json(null)
      }
    })
    .catch(err => {
      logger.error(err)
      res.status(500)
    })
};

const addPortfolioProperty = async (req, res) => {
  const userId = req.user.sub;
  Property.findOne({formatted_address: req.body.formatted_address})
    .then(property => {
      if (!property) {
        return createProperty(req.body)
      }
      return property
    })
    .then(property => {
      Portfolio.findOne({ userId })
        .then(portfolio => {
          if (!portfolio) {
            const model = new Portfolio({
              userId,
              properties: [{
                propertyId: property._id
              }]
            })
            return model.save()
          }
          return portfolio
        })
        .then(portfolio => {
          const filtered = portfolio.properties.filter(o => o.propertyId.toString() === property._id.toString())
          if (filtered.length === 0) {
            const model = new Portfolio({
              _id: portfolio._id,
              userId,
              properties: [
                ...portfolio.properties,
                {
                  propertyId: property._id
                }
              ]
            })
            return Portfolio.findByIdAndUpdate(portfolio._id, model, { new: true, upsert: true })
          }
          return portfolio
        })
        .then(() => {
          Portfolio.findOne({ userId }).populate({
            path: 'properties.propertyId',
            select: '_id address_components externalData formatted_address geometry name place_id propertyImages rankings scores services'
          }).lean()
            .then(results => {
              if (results) {
                let properties = results.properties.filter(o => o.propertyId).map(o => o.propertyId)
                collectAllScores(properties)
                  .then(properties => {
                    const portfolio = {
                      _id: results._id,
                      properties
                    }
                    res.status(200).json(portfolio)
                  })
              } else {
                res.status(404).json(null);
              }
            })
        })
    })
    .catch(err => {
      logger.error(err)
      res.sendStatus(500)
    })
};

const archivePortfolioProperty = async (req, res) => {
  const archived = req.body.archived
  const propertyId = req.params.propertyId
  Portfolio.findOne({userId: req.user.sub})
  .then(result => {
    let property = result.properties.find(p => p.propertyId._id.equals(propertyId))
    if (property) {
      property.isArchived = archived
      Portfolio.findByIdAndUpdate(result._id, result, {upsert: true}).then(success => {
        return res.status(200).json(success)
      })
    }
  })
  .catch(err => {
    logger.error(err)
    res.status(500)
  })
};

module.exports = {
  getPortfolio,
  addPortfolioProperty,
  archivePortfolioProperty
}
