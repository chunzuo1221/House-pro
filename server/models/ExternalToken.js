const mongoose = require('mongoose')

const externalTokenSchema = new mongoose.Schema({
  providerId: String,
  apiClients: [{
    /**
     * scope: The data scope where the app client can access
     */
    scope: String,
    /**
     * accessToken: The value which will be used as the bearer token to authorise requests
     */
    accessToken: String,
    /**
     * updatedAt: Time updated accessToken
     */
    updatedAt: Date,
    /**
     * expiresIn: The lifetime in seconds of the token
     */
    expiresIn: Number
  }]
}, { timestamps: true })

const ExternalToken = mongoose.model('ExternalToken', externalTokenSchema)

module.exports = ExternalToken
