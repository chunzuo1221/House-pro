const apiUtils = require('./api.utils')
const ContentFragment = require('../models/ContentFragment')

const saveFragment = (req, res) => {
  ContentFragment.find(req.body).exec((err, data) => {
    if (err) {
      return res.status(500).json(err)
    } else if (!data || data.length === 0) {
      const fragment = new ContentFragment(req.body)
      apiUtils.responseMongooseCreate(fragment.save(), req, res)
    } else {
      return res.status(400).json({
        message: 'The requested content fragment already exists.'
      })
    }
  })
}

exports.getContentFragments = (req, res) => {
  apiUtils.responseMongooseFind(ContentFragment.find(req.query || {}).exec(), req, res)
}

exports.updateContentFragment = (req, res) => {
  const { _id } = req.body
  if (_id) {
    const promise = ContentFragment.findByIdAndUpdate(_id, req.body)
    apiUtils.responseMongooseSimple(promise.exec(), req, res)
  } else {
    delete req.body._id
    saveFragment(req, res)
  }
}

exports.deleteContentFragment = (req, res) => {
  const { id } = req.params
  const promise = ContentFragment.deleteOne({ _id: id })
  apiUtils.responseMongooseSimple(promise.exec(), req, res)
}
