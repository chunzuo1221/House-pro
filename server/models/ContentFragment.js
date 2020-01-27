const mongoose = require('mongoose');

const ContentFragmentSchema = new mongoose.Schema({
  moduleCode: String,
  reportContentType: String,
  contentFragment: String,
  upperBound: Number,
});

const ContentFragment = mongoose.model('ContentFragment', ContentFragmentSchema);

module.exports = ContentFragment;
