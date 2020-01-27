const mongoose = require('mongoose');

const QuestionClassificationSchema = new mongoose.Schema({
  name: String,
  modules: [
    {
      text: String,
      code: String,
      sections: [
        {
          text: String,
          code: String,
          categories: [
            {
              text: String,
              code: String
            }
          ]
        }
      ]
    }
  ]
});

const QuestionClassification = mongoose.model('QuestionClassification', QuestionClassificationSchema, 'referencedata');

module.exports = QuestionClassification;
