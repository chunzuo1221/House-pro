const Promise = require('bluebird');
const SurveyAnswer = require('../models/SurveyAnswer');
const Question = require('../models/Question');
const Property = require('../models/Property');
const ScoringRule = require('../models/ScoringRule');
const QuestionClassification = require('../models/QuestionClassification');
const SuburbController = require('./suburb');
const {
  responseMongooseCreate,
  responseMongooseSimple
} = require('./api.utils');
const {
  getAddressComponentValue,
  calculateLevelScore,
  calculatePositionScore,
  calculateLandScore,
  calculateAccessServiceScore
} = require('../util');
const ordinal = require("ordinal-js");
const logger = require('./logger');
const lget = require('lodash.get');

const createQuestion = (req, res) => {
  Question.find({
    questionCode: req.body.questionCode
  }).exec((err, data) => {
    if (!data || data.length === 0) {
      const question = new Question(req.body);
      responseMongooseCreate(question.save(), req, res);
    } else {
      return res.status(400).json({
        message: 'The requested question code already exists.'
      });
    }
  });
};

const updateQuestion = (req, res) => {
  const {
    questionId
  } = req.params;
  Question.find({
    questionCode: req.body.questionCode
  }).exec((err, models) => {
    const length = models.length;
    if (length > 1 || (length === 1 && models[0]._id.toString() !== questionId)) {
      return res.status(400).json({
        message: 'Error : The requested question code already exists.'
      });
    }
    const promise = Question.findByIdAndUpdate(questionId, req.body, {
      upsert: true
    });
    responseMongooseSimple(promise.exec(), req, res);
  });
};

const getQuestions = (req, res) => {
  const filters = {};

  if (req.query.module) {
    if (req.query.module.includes(',')) {
      const moduleParams = req.query.module.split(',');
      filters.$and = [{ $or: [{questionModule: moduleParams[0]}, {questionModule: moduleParams[1]}] }];
    } else {
      filters.questionModule = req.query.module;
    }
  }
  let { section, category, analysisType, propertyType, propertyWithViews, summaryQuestion, adjustmentQuestion, isDeactivated, pageNumber, pageSize, sort } = req.query;
  if (section && section.length) {
    filters.questionSection = section;
  }
  if (category && category.length) {
    filters.questionCategory = category;
  }
  if (analysisType && analysisType.length) {
    !filters.$and && (filters.$and = []);
    filters.$and.push({ $or: [{ analysisTypes: { $in: [analysisType] } }, { analysisTypes: null }, { analysisTypes: []}] });
  }
  if (propertyType && propertyType.length) {
    !filters.$and && (filters.$and = []);
    filters.$and.push({ $or: [{ propertyTypes: { $in: [propertyType] } }, { propertyType: null }, { propertyType: []}] });
  }
  if (typeof propertyWithViews !== 'undefined') {
    if (propertyWithViews === 'true') {
      filters.propertyWithViews = true;
    } else {
      !filters.$and && (filters.$and = []);
      filters.$and.push({ $or: [{propertyWithViews: null}, {propertyWithViews: false}] });
    }
  }

  if ((summaryQuestion && summaryQuestion.length) && (adjustmentQuestion && adjustmentQuestion.length)) {
    if (!filters.$and) {
      filters.$and = [];
    }
    if (summaryQuestion === 'true' && adjustmentQuestion === 'true') {
      filters.$and.push({ $or: [{summaryQuestion: true}, {adjustmentQuestion: true}] });
    } else if (summaryQuestion === 'true' && adjustmentQuestion === 'false') {
      filters.$and.push({ $or: [{summaryQuestion: true}] });
    } else if (summaryQuestion === 'false' && adjustmentQuestion === 'true') {
      filters.$and.push({ $or: [{adjustmentQuestion: true}] });
    } else {
      filters.$and.push({ $or: [{adjustmentQuestion: null}, {adjustmentQuestion: false}] });
      filters.$and.push({ $or: [{summaryQuestion: null}, {summaryQuestion: false}] });
    }
  }

  if (isDeactivated === 'true') {
    filters.isDeactivated = true;
  } else if (isDeactivated === 'false') {
    !filters.$and && (filters.$and = []);
    filters.$and.push({ $or: [{isDeactivated: false}, {isDeactivated: {$exists: false}}] });
  }

  Promise.all([
    Question.countDocuments(filters),
    Promise.resolve().then(() => {
      let query = Question.find(filters);
      if (pageNumber && pageSize) {
        let pageIndex = parseInt(pageNumber) - 1;
        pageIndex = pageIndex >= 0 ? pageIndex : 0;
        pageSize = parseInt(pageSize);
        pageSize = pageSize > 0 ? pageSize : 10;
        query = query.skip(pageIndex * pageSize).limit(pageSize);
      }
      if (sort) {
        query = query.sort(sort);
      }
      return query
    })
  ])
    .spread((total, rows) => {
      res.json({ total, rows });
    })
    .catch(error => {
      res.status(500).json({error});
    });
};

const searchByText = (req, res) => {
  const filters = {$or: [{isDeactivated: false}, {isDeactivated: {$exists: false}}]};
  filters.text = {$regex: new RegExp(req.query.text, 'i')};
  const promise = Question.find(filters).sort('text').lean();
  responseMongooseSimple(promise.exec(), req, res);
};

const getQuestionById = (req, res) => {
  responseMongooseSimple(Question.findById(req.params.questionId).exec(), req, res);
};

const getSurveyLevelScores = (propertyId, request, renew) => {
  return Promise.resolve().then(() => {
    const query = { surveyStatus: 'published', propertyId }
    return SurveyAnswer
      .findOne(query)
      .populate({
        path: 'responses.questionId',
        select: '_id responses questionModule questionSection questionCategory analysisTypes propertyTypes adjustmentQuestion propertyWithViews'
      })
      .then(surveyAnswer => {
        if (!surveyAnswer) {
          return null
        }
        return Promise
          .resolve()
          .then(() => {
            let responses = surveyAnswer.responses
            responses = responses.filter(a => a.questionId)
            if (renew) {
              const updatedAnswers = []
              responses.forEach(a => {
                const response = a.questionId.responses.find(r => r._id.toString() === a.responseId);
                if (response) {
                  const responseMax = a.questionId.responses.reduce((maxScore, itr) => Math.max(maxScore, itr.responseScore), 0)
                  updatedAnswers.push({
                    questionId: a.questionId._id,
                    responseId: response._id.toString(),
                    responseScore: response.responseScore,
                    responseMax,
                    questionModule: a.questionId.questionModule,
                    questionSection: a.questionId.questionSection,
                    questionCategory: a.questionId.questionCategory,
                    adjustmentQuestion: a.questionId.adjustmentQuestion
                  })
                }
              })
              surveyAnswer.responses = updatedAnswers
              surveyAnswer.markModified('responses')
              return Promise.resolve()
                .then(() => surveyAnswer.save())
                .then(surveyAnswer => {
                  return SurveyAnswer
                    .findById(surveyAnswer._id)
                    .populate({
                      path: 'responses.questionId',
                      select: '_id questionModule questionSection analysisTypes propertyTypes adjustmentQuestion propertyWithViews'
                    })
                    .lean()
                })
                .then(surveyAnswer => {
                  return surveyAnswer.responses
                })
            }
            return responses
          })
          .then(responses => {
            let answers = responses.filter(a => a.questionId)
            const analysisType = request.analysisType
            const propertyType = request.propertyType
            const propertyWithViews = request.propertyWithViews
            if (analysisType && analysisType.length) {
              answers = answers.filter(a => {
                if (!a.questionId.analysisTypes || !a.questionId.analysisTypes.length) {
                  return true
                }
                return a.questionId.analysisTypes.includes(analysisType)
              })
            }
            if (propertyType && propertyType.length) {
              answers = answers.filter(a => {
                if (!a.questionId.propertyTypes || !a.questionId.propertyTypes.length) {
                  return true
                }
                return a.questionId.propertyTypes.includes(propertyType)
              });
            }
            // if propertyWithViews query is false, then except the questions that the propertyWithViews flag is set false or null from scoring
            if (!propertyWithViews) {
              answers = answers.filter(a => !a.questionId.propertyWithViews)
            }
            answers = answers.filter(a => request.modules.some(m => m.module === a.questionModule))
            const modules = request.modules.map(m => {
              const answers1 = answers.filter(a => a.questionId.questionModule === m.module)
              const level1 = {
                module: m.module,
                score: calculateLevelScore(answers1, true)
              }
              if (m.sections) {
                const sections = m.sections.map(s => {
                  const answers2 = answers1.filter(a => a.questionId.questionSection === s.section)
                  const level2 = {
                    section: s.section,
                    score: calculateLevelScore(answers2, false)
                  }
                  return level2
                });
                level1.sections = sections
              }
              return level1
            });
            return {
              analysisType,
              propertyType,
              modules,
              propertyWithViews,
              score: calculateLevelScore(answers, false)
            }
          })
      })
  })
}

const assessSurveyAnswers = (req, res) => {
  const renew = typeof req.query.renew !== 'undefined';
  getSurveyLevelScores(req.params.propertyId, req.body, renew)
    .then(results => {
      if (!results) {
        res.status(404).json({
          error: {
            message: 'No survey data.'
          }
        });
      } else {
        res.status(200).json(results);
      }
    })
    .catch(error => {
      logger.error(error);
      res.status(500).json(error);
    });
};

/**
 * Classify survey answers for the land and house module
 * @param {*} surveyAnswers 
 * @param {*} classification 
 */
function classifySurveyAnswers(surveyAnswers, classification) {
  if (!surveyAnswers || !surveyAnswers.length) {
    return null
  }
  let surveyAnswer = surveyAnswers.find(o => o.surveyStatus === 'published')
  if (!surveyAnswer) {
    // if there is no 'published' one, use the first survey found
    surveyAnswer = surveyAnswers.find(o => (o.responses && o.responses.length))
  }
  if (!surveyAnswer || !surveyAnswer.responses || !surveyAnswer.responses.length) {
    return null
  }
  // classify answers and calculate level scores
  let responses = surveyAnswer.responses.filter(a => a.questionId)
  const analysisType = surveyAnswer.analysisType
  if (analysisType && analysisType.length) {
    responses = responses.filter(a => {
      if (a.questionId.analysisTypes && a.questionId.analysisTypes.length) {
        return a.questionId.analysisTypes.includes(analysisType)
      }
      return true
    })
  }
  if (!responses.length) {
    return null
  }
  // exclude scoring for location module as it's different from the land or house module.
  let modules = classification.modules.filter(m => m.code !== 'location').map(m => {
    const moduleAnswers = responses.filter(a => a.questionId.questionModule === m.code)
    const moduleScore = {
      code: m.code,
      text: m.text,
      score: calculateLevelScore(moduleAnswers, false)
    }
    if (m.sections) {
      const sections = m.sections.map(s => {
        const sectionAnswers = moduleAnswers.filter(a => a.questionId.questionSection === s.code)
        const sectionScore = {
          code: s.code,
          text: s.text,
          score: calculateLevelScore(sectionAnswers, false)
        }
        return sectionScore
      }).filter(s => s.code !== 'bonus')
      moduleScore.sections = sections
    }
    return moduleScore
  })
  modules = modules.filter(m => m.score.value > 0)
  if (!modules.length) {
    return null
  }
  return {
    modules,
    analysisType,
    score: calculateLevelScore(responses, false),
    clonedFrom: surveyAnswer.clonedFrom
  }
}

const getSuburbScores = (req, res) => {
  let postCode = '';
  if (req.query) {
    postCode = req.params.postCode;
  }
  const propertyQuery = postCode ? {'address_components.types': 'postal_code', 'address_components.short_name': postCode} : {};
  Promise.props({
    properties: Property.find(propertyQuery).lean(),
    questionClassification: QuestionClassification.findOne({ name: 'Question Classifications' }).lean()
  })
    .then(({properties, questionClassification}) => {
      return Promise.map(
        properties,
        (property) => {
          return Promise.props({
            surveyAnswers: SurveyAnswer
              .find({propertyId: property._id})
              .populate({path: 'responses.questionId', select: 'questionModule questionSection questionCategory analysisTypes adjustmentQuestion'}).lean(),
            scores: evaluatePropertyLocation(property._id, postCode, true)
          })
            .then(({surveyAnswers, scores}) => {
              return {
                ...property,
                locationScores: scores,
                surveyScores: classifySurveyAnswers(surveyAnswers, questionClassification)
              }
            })
        },
        {
          concurrency: 25
        }
      ).then(results => {
        res.status(200).json(results);
      })
    })
    .catch(logger.error)
};

const calculateComparativeRankings = (propertyId, postCode) => {
  return Promise.resolve()
    .then(() => {
      if (postCode) {
        return postCode
      }
      return Property.findById(propertyId).lean().then(property => {
        return getAddressComponentValue(property.address_components, 'postal_code')
      })
    })
    .then(postCode => {
      return SurveyAnswer.find({surveyStatus: 'published'})
        .populate({
          path: 'propertyId',
          select: '_id address_components',
          match: {
            'address_components.types': 'postal_code',
            'address_components.short_name': `${postCode}`
          }
        })
        .populate({
          path: 'responses.questionId',
          select: '_id adjustmentQuestion questionModule questionSection'
        }).lean()
        .then(surveys => {
          if (surveys) {
            surveys = surveys.filter(o => o.propertyId)
          }
          if (!surveys || !surveys.length) {
            return null
          }
          return QuestionClassification.findOne({name: 'Question Classifications'}).lean()
            .then(questionClassification => {
              return Promise.map(
                surveys,
                survey => {
                  return evaluatePropertyLocation(survey.propertyId._id, postCode, true)
                    .then(locationScores => {
                      const surveyScores = classifySurveyAnswers([survey], questionClassification)
                      const landModule = lget(surveyScores, 'modules', []).find(o => o.code === 'land')
                      const houseModule = lget(surveyScores, 'modules', []).find(o => o.code === 'house')
                      return {
                        propertyId: survey.propertyId._id.toString(),
                        location: +lget(locationScores, 'overall.value', 0),
                        land: +lget(landModule, 'score.value', 0),
                        house: +lget(houseModule, 'score.value', 0)
                      }
                    })
                },
                {
                  concurrency: 50
                }
              ).then(surveys => {
                const calculate = (moduleName) => {
                  surveys.sort((a, b) => +b[moduleName] - +a[moduleName]);
                  const seat = surveys.findIndex(survey => survey.propertyId === propertyId) + 1;
                  const percentage = Math.round((seat / surveys.length) * 100);
                  const total = surveys.length;
                  return {
                    seat,
                    total,
                    percentage
                  }
                }
                return {
                  location: calculate('location'),
                  land: calculate('land'),
                  house: calculate('house')
                }
              })
            })
        })
    })
}

/**
 * Evaluate the location of property synthetically
 * @param {string} propertyId the property ID
 * @param {string} postCode the postal code of property (possible to retrieve this from propertyId but we will require this for the performance)
 */
function evaluatePropertyLocation (propertyId, postCode, isReadOnly = false) {
  if (!propertyId || !postCode) {
    return Promise.reject(new Error('Not provided property id and postal code'));
  }
  return Promise.props({
    surveyAnswer: SurveyAnswer.findOne({propertyId, surveyStatus: 'published'}).populate('responses.questionId'),
    proximityAssessment: SuburbController.assessSuburbServices(propertyId, false, isReadOnly),
    scoringRule: ScoringRule.find({postCode}),
  }).then(({surveyAnswer, proximityAssessment, scoringRule}) => {
    const result = {
      position: {
        score: {value: 0, max: 10},
        sections: []
      },
      land: {
        score: {value: 0, max: 10},
        sections: []
      },
      accessservice: {
        score: {value: 0, max: 10},
        services: []
      },
      overall: {value: 0, max: 10}
    };
    let totalPositionScore = 0
    let totalPositionMax = 0
    if (surveyAnswer) {
      let scoreData = calculatePositionScore(surveyAnswer);
      result.position.score = {
        value: scoreData.score.value,
        max: scoreData.score.max
      }
      result.position.sections = scoreData.sections
      if (scoreData.score.totalPositionScore) {
        totalPositionScore = scoreData.score.totalPositionScore
      }
      if (scoreData.score.totalPositionMax) {
        totalPositionMax = scoreData.score.totalPositionMax
      }
      scoreData = calculateLandScore(surveyAnswer);
      result.land.score = {
        value: scoreData.score.value,
        max: scoreData.score.max
      }
      result.land.sections = scoreData.sections
    }
    let accessServiceScore = 0
    let accessServiceMax = 0
    let bonus = 0
    if (proximityAssessment) {
      const {score, services} = calculateAccessServiceScore(proximityAssessment, scoringRule)
      bonus = score.bonus
      result.accessservice.score = {
        value: score.value,
        max: score.max
      }
      result.accessservice.services = services
      if (score.accessServiceScore) {
        accessServiceScore = score.accessServiceScore
      }
      if (score.accessServiceMax) {
        accessServiceMax = score.accessServiceMax
      }
    }
    overall = Math.round(((totalPositionScore + accessServiceScore) / (totalPositionMax + accessServiceMax)) * 100 + bonus) / 10
    // https://housepro.atlassian.net/browse/HOUS-570
    const value = overall - lget(proximityAssessment, 'services', []).map(o => (o.servicePenalty || 0)).reduce((s, i) => s + i, 0)
    result.overall = {
      value,
      max: 10
    }
    return result
  })
}

const getRankingParagraph = async (req, res) => {
  const { propertyId } = req.params
  try {
    const results = await calculateComparativeRankings(propertyId)
    if (!results) {
      return res.sendStatus(404)
    }
    const { location } = results
    const {percentage, total} = location
    const percentile = ordinal.toOrdinal(percentage)
    res.json({
      percentile,
      total,
      template: 'Compared to other similar properties in the suburb this property is ranked in the ' +
        '<span class="highlight">{percentile}</span> percentile for location based on ' +
        '<span class="highlight">{total}</span> properties that we have assessed in ' +
        '<span class="highlight">{name}</span>'
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

/**
 * get survey responses filtered by queries
 */
const getSurveyAnswer = async (req, res) => {
  try {
    const query = { surveyStatus: 'published', propertyId: req.params.propertyId };
    const surveyModel = await SurveyAnswer.findOne(query).populate('responses.questionId');
    if (!surveyModel) {
      res.json([]);
      return;
    }
    const { modules, section, adjustmentQuestion, summaryQuestion } = req.query;
    let answers = surveyModel.responses;
    answers = answers.filter(a => a.questionId);
    if (surveyModel.analysisType) {
      answers = answers.filter(a => {
        if (!a.questionId.analysisTypes || !a.questionId.analysisTypes.length) {
          return true;
        }
        return a.questionId.analysisTypes.includes(surveyModel.analysisType);
      })
    }
    if (surveyModel.propertyType) {
      answers = answers.filter(a => {
        if (!a.questionId.propertyTypes || !a.questionId.propertyTypes.length) {
          return true;
        }
        return a.questionId.propertyTypes.includes(surveyModel.propertyType);
      })
    }
    if (modules && modules.length) {
      answers = answers.filter(a => modules.includes(a.questionId.questionModule));
    }
    if (section) {
      answers = answers.filter(a => a.questionId.questionSection === section);
    }
    if (adjustmentQuestion) {
      answers = answers.filter(a => a.questionId.adjustmentQuestion === (adjustmentQuestion === 'true'));
    }
    if (summaryQuestion) {
      answers = answers.filter(a => a.questionId.summaryQuestion === (summaryQuestion === 'true'));
    }
    answers = answers.filter(a => !!a.questionId.propertyWithViews === !!surveyModel.propertyWithViews);
    answers = answers.map(a => {
      const response = a.questionId.responses.find(res => res._id.equals(a.responseId));
      return {
        _id: a._id,
        questionId: a.questionId._id,
        questionCode: a.questionId.questionCode,
        questionModule: a.questionId.questionModule,
        questionSection: a.questionId.questionSection,
        questionCategory: a.questionId.questionCategory,
        displayInReport: a.questionId.displayInReport,
        questionText: a.questionId.text,
        reportOrder: a.questionId.reportOrder,
        keyFeature: a.questionId.keyFeature,
        responseId: a.responseId,
        responseCode: lget(response, 'responseCode', null),
        responseScore: a.responseScore,
        responseMax: a.responseMax,
        responseText: lget(response, 'responseText', null),
        responseCommentary: lget(response, 'responseCommentary', null)
      }
    });
    const response = {
      _id: surveyModel._id,
      userId: surveyModel.userId,
      propertyId: surveyModel.propertyId,
      responses: answers,
      analysisType: surveyModel.analysisType,
      clonedFrom: surveyModel.clonedFrom,
      propertyWithViews: surveyModel.propertyWithViews,
      propertyType: surveyModel.propertyType
    };
    res.json(response);
  } catch (error) {
    res.sendStatus(500);
  }
};

/**
 * get survey answers by propertyId
 */
const getSurveyAnswers = async (req, res) => {
  try {
    const query = { propertyId: req.params.propertyId };
    const surveyModel = await SurveyAnswer.find(query);
    if (!surveyModel) {
      res.json([]);
      return;
    }
    let responses = [];
    surveyModel.forEach((model) => {
      let response = {};
      response._id = model._id;
      response.surveyor = model.surveyor;
      response.location = model.responses.filter(answer => answer.questionModule === 'location').length;
      response.land = model.responses.filter(answer => answer.questionModule === 'land').length;
      response.house = model.responses.filter(answer => answer.questionModule === 'house').length;
      response.surveyStatus = model.surveyStatus;
      responses.push(response);
    });
    res.json(responses);
  } catch (error) {
    res.sendStatus(500);
  }
};

const getRemainedQuestionsCount = async (req, res) => {
  const propertyQuery = {
    surveyStatus: 'published',
    propertyId: req.params.propertyId
  };
  try {
    const answer = await SurveyAnswer.findOne(propertyQuery);
    const answers = answer ? answer.responses : [];
    const filters = {};
    let moduleParams = [];
    if (req.query.modules) {
      if (req.query.modules.includes(',')) {
        moduleParams = req.query.modules.split(',');
        filters.$and = [{$or: moduleParams.map(m => ({questionModule: m}))}];
      } else {
        filters.questionModule = req.query.modules;
      }
    }
    if (req.query.summaryQuestion) {
      filters.summaryQuestion = req.query.summaryQuestion === 'true'
    }
    !filters.$and && (filters.$and = []);
    filters.$and.push({ $or: [{dependentQuestionId: ''}, {dependentQuestionId: {$exists: false}}] });
    filters.$and.push({ $or: [{isDeactivated: false}, {isDeactivated: {$exists: false}}] });
    const summaryQuestions = await Question.find(filters);
    if (summaryQuestions && summaryQuestions.length > 0) {
      if (moduleParams.length) {
        const responses = moduleParams.map(m => {
          const questions = summaryQuestions.filter(q => q.questionModule === m);
          let remainedCount = 0;
          let totalCount = 0;
          questions.forEach(q => {
            const isAnswered = answers.some(a => a.questionId && a.questionId.equals(q._id))
            if (!isAnswered) {
              remainedCount ++;
            }
            totalCount ++;
          })
          return {module: m, remainedCount, totalCount};
        });
        res.json(responses);
      } else {
        let remainedCount = 0;
        let totalCount = 0;
        summaryQuestions.forEach((question) => {
          const isAnswered = answers.some((response) => {
            return response.questionId && response.questionId.equals(question._id)
          })
          if (!isAnswered) {
            remainedCount ++;
          }
          totalCount ++;
        })
        res.json([{
          remainedCount,
          totalCount
        }]);
      }
    } else {
      res.json([{ remainedCount: 0, totalCount: 0 }]);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

/**
 * We have to update existing responses or add new responses into survey answer model.
 * The endpoint expect _id(model id) and _id for each response to update existing responses.
 * The _id must be omitted for the new model or new response.
 */
const upsertSurveyAnswer = (req, res) => {
  const data = {
    userId: req.user.sub,
    surveyor: req.user.email,
    propertyId: req.params.propertyId,
    analysisType: req.body.analysisType,
    propertyType: req.body.propertyType,
    propertyWithViews: req.body.propertyWithViews,
    responses: req.body.responses
  };
  let promise = null;
  if (req.body._id) {
    promise = SurveyAnswer.findById(req.body._id).then((surveyModel) => {
      const existsResponses = req.body.responses.filter(r => r._id);
      const newResponses = req.body.responses.filter(r => !r._id);
      surveyModel.responses.forEach((response, index) => {
        const updatedResponse = existsResponses.find(r => r._id === response._id.toString());
        if (updatedResponse) {
          surveyModel.responses[index] = Object.assign({}, updatedResponse);
        }
      });
      newResponses.forEach(r => surveyModel.responses.push(r));
      surveyModel.markModified('responses');
      surveyModel.analysisType = req.body.analysisType
      surveyModel.markModified('analysisType');
      surveyModel.propertyType = req.body.propertyType
      surveyModel.markModified('propertyType')
      surveyModel.propertyWithViews = req.body.propertyWithViews
      surveyModel.markModified('propertyWithViews')
      surveyModel.clonedFrom = undefined
      return surveyModel.save();
    });
  } else {
    data.surveyStatus = 'published';
    promise = (new SurveyAnswer(data)).save();
  }
  responseMongooseSimple(promise, req, res);
};

const publishAnswer = async (req, res) => {
  const surveyId = req.params.surveyId
  const {surveyStatus, propertyId} = req.body
  logger.log('surveyId:', surveyId)
  logger.log('surveyStatus:', surveyStatus)
  logger.log('propertyId:', propertyId)
  SurveyAnswer.find({propertyId})
    .populate({path: 'propertyId', select: 'address_components'}).lean()
    .populate({path: 'responses.questionId', select: 'questionModule questionSection questionCategory analysisTypes adjustmentQuestion'}).lean()
    .then(surveyAnswers => {
      const postCode = getAddressComponentValue(surveyAnswers[0].propertyId.address_components, 'postal_code')
      if (surveyStatus) {
        const surveyIds = []
        surveyAnswers.forEach((answer) => {
          if (answer._id.equals(surveyId)) {
            answer.surveyStatus = 'published'
          } else {
            answer.surveyStatus = null
            surveyIds.push(answer._id)
          }
        })
        const filter = {_id: {$in: surveyIds}}
        SurveyAnswer.updateMany(filter, {$set: {surveyStatus: null}})
          .then(() => {
            return SurveyAnswer.findByIdAndUpdate(surveyId, {surveyStatus: 'published'})
          })
          .then(() => {
            Promise.props({
              property: Property.findById(propertyId).lean(),
              questionClassification: QuestionClassification.findOne({name: 'Question Classifications'}).lean(),
              scores: evaluatePropertyLocation(propertyId, postCode, true)
            })
              .then(({property, questionClassification, scores}) => {
                res.status(200).json({
                  ...property,
                  locationScores: scores,
                  surveyScores: classifySurveyAnswers(surveyAnswers, questionClassification)
                })
              })
          })
      } else {
        SurveyAnswer.findByIdAndUpdate(surveyId, {surveyStatus: null})
          .then(() => {
            Promise.props({
              property: Property.findById(propertyId).lean(),
              questionClassification: QuestionClassification.findOne({name: 'Question Classifications'}).lean(),
              scores: evaluatePropertyLocation(propertyId, postCode, true)
            })
              .then(({property, questionClassification, scores}) => {
                surveyAnswers.forEach((answer) => {
                  if (answer._id.equals(surveyId)) {
                    answer.surveyStatus = null
                  }
                })
                res.status(200).json({
                  ...property,
                  locationScores: scores,
                  surveyScores: classifySurveyAnswers(surveyAnswers, questionClassification)
                })
              })
          })
      }
    })
}

module.exports = {
  createQuestion,
  updateQuestion,
  getQuestions,
  searchByText,
  getQuestionById,
  getSurveyLevelScores,
  assessSurveyAnswers,
  getSuburbScores,
  getRankingParagraph,
  getSurveyAnswer,
  getSurveyAnswers,
  getRemainedQuestionsCount,
  upsertSurveyAnswer,
  publishAnswer,
  evaluatePropertyLocation,
  calculateComparativeRankings,
  classifySurveyAnswers
}
