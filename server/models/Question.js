const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  isDeactivated: Boolean,
  questionCode: String,
  text: String,
  shortText: String,
  questionSection: String,
  questionCategory: String,
  questionModule: String,
  questionPageOrder: Number,
  reportOrder: Number,
  adjustmentQuestion: Boolean,
  summaryQuestion: Boolean,
  analysisTypes: [],
  propertyTypes: [],
  bestSource: [],
  dependentMode: String,
  dependentQuestionId: String,
  dependentResponseId: String,
  applicableSuburbs: [],
  displayInReport: { type: Boolean, default: false },
  propertyWithViews: { type: Boolean, default: false },
  keyFeature: { type: Boolean, default: false },
  responses: [
    {
      responseCode: String,
      responseScore: Number,
      responseOrder: Number,
      responseText: String,
      responseCommentary: String
    }
  ]
});


const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
