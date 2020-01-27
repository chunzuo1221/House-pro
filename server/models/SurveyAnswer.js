const mongoose = require('mongoose');

const SurveyAnswerSchema = new mongoose.Schema({
  userId: String,
  surveyor: String,
  propertyId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Property'
  },
  analysisType: String,
  propertyType: String,
  propertyWithViews: { type: Boolean, default: false },
  clonedFrom: String,
  surveyStatus: String,
  responses: [
    {
      questionId: {type: mongoose.Schema.Types.ObjectId, ref: 'Question'},
      responseId: String,
      responseScore: Number,
      responseMax: Number,
      questionModule: String,
      questionSection: String,
      questionCategory: String,
      adjustmentQuestion: Boolean
    }
  ]
});

const SurveyAnswer = mongoose.model('SurveyAnswer', SurveyAnswerSchema);

module.exports = SurveyAnswer;
