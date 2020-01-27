/**
 * Module dependencies.
 */
const express = require('express')
const compression = require('compression')
const session = require('express-session')
const bodyParser = require('body-parser')
const logger = require('./controllers/logger')
const chalk = require('chalk')
const errorHandler = require('errorhandler')
const lusca = require('lusca')
const dotenv = require('dotenv')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const path = require('path')
const mongoose = require('mongoose')
const Mockgoose = require('mockgoose').Mockgoose
const mockgoose = new Mockgoose(mongoose)
const passport = require('passport')
const expressValidator = require('express-validator')
const multer = require('multer')
const cors = require('cors')
const Promise = require('bluebird')
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const fs = require('fs')

Promise.promisifyAll(mongoose)
Promise.promisifyAll(fs)

const upload = multer({
  dest: path.join(__dirname, 'uploads')
})

/**
 * Load environment letiables from .env file, where API keys and passwords are configured.
 */
dotenv.load({
  path: '.env'
})

/**
 * Controllers (route handlers).
 */
const propertyController = require('./controllers/property')
const surveyAnswerController = require('./controllers/survey')
const suburbController = require('./controllers/suburb')
const referenceController = require('./controllers/reference')
const portfolioController = require('./controllers/portfolio')
const contentFragmentController = require('./controllers/contentfragment')

/**
 * API keys and Passport configuration.
 */

const passportConfig = require('./config/passport')

/**
 * Create Express server.
 */
const app = express()

/**
 * Connect to MongoDB.
 */
let mongodbUri

/**
 * If MONGODB_URI is defined in heroku app setting, read it
 * else read it from .env file
 */
if (process.env.MONGODB_URI) {
  mongodbUri = process.env.MONGODB_URI
} else if (process.env.NODE_ENV === 'development') {
  mongodbUri = process.env.MONGODB_URI_TEST
} else {
  switch (process.env.HOST_ENV) {
    case 'test':
      mongodbUri = process.env.MONGODB_URI_TEST
      break;
    case 'stage':
      mongodbUri = process.env.MONGODB_URI_STAGE
      break;
    case 'production':
      mongodbUri = process.env.MONGODB_URI_PROD
      break;
    default:
      mongodbUri = process.env.MONGODB_URI_TEST
      break;
  }
}
mongodbUri = 'mongodb://localhost:27017/housepro';
logger.info(
  '\n ======================= MONGODB_URI ======================= \n'
)
logger.info(mongodbUri)

// mongoose.Promise = global.Promise;
const mockMongoose = () => {
  // TODO: Only needed if for some reason jest's mock is not sufficient
  // mockgoose.prepareStorage().then(() => {
  //   console.log('Prepared');
  //   mongoose.connect(mongodbUri, { useNewUrlParser: true });
  //   mongoose.connection.on('error', (err) => {
  //     console.error(err);
  //     console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  //     process.exit();
  //   });
  // });
}

if (process.env.NODE_ENV === 'test') {
  mockMongoose()
} else {
  mongoose.connect(
    mongodbUri,
    { useNewUrlParser: true }
  )
  mongoose.connection.on('error', err => {
    logger.error(err)
    logger.error(
      '%s MongoDB connection error. Please make sure MongoDB is running.',
      chalk.red('✗')
    )
    process.exit()
  })
}
/**
 * Express configuration.
 */

const whitelist = () => {
  switch (process.env.HOST_ENV) {
    case 'test':
      return [process.env.HOST_URI_TEST]
    case 'stage':
      return [process.env.HOST_URI_STAGE]
    case 'production':
      return [process.env.HOST_URI_PROD]
    default:
      return ['http://localhost:8080', 'http://localhost:8888']
  }
}

const corsOptions = {
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  origin: (origin, callback) => {
    if (
      whitelist().indexOf(origin) !== -1 ||
      process.env.NODE_ENV === 'test' ||
      !origin
    ) {
      callback(null, true)
    } else {
      logger.info('whitelist:', whitelist())
      logger.info('HOST_ENV:', process.env.HOST_ENV)
      logger.info('NODE_ENV:', process.env.NODE_ENV)
      logger.error('origin:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(redirectToHTTPS([/localhost:(\d{4})/, /127.0.0.1:(\d{4})/]))
app.use(cors(corsOptions))
app.set('env', process.env.NODE_ENV || 'production')
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0')
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080)
app.use(compression())
app.use(bodyParser.json({ limit: '10mb' }))
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '10mb'
  })
)
if (process.env.NODE_ENV !== 'test') {
  const expressStatusMonitor = require('express-status-monitor')
  app.use(expressStatusMonitor())
  app.use(
    session({
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      cookie: {
        maxAge: 1209600000
      }, // two weeks in milliseconds
      store: new MongoStore({
        url: mongodbUri,
        autoReconnect: true
      })
    })
  )
}
app.use(
  expressValidator({
    errorFormatter: (param, msg, value, location) => {
      return {
        param: param,
        msg: msg
      }
    }
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (
    !req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)
  ) {
    if (req.session) {
      req.session.returnTo = req.originalUrl
    }
  } else if (
    req.user &&
    (req.path === '/account' || req.path.match(/^\/api/))
  ) {
    if (req.session) {
      req.session.returnTo = req.originalUrl
    }
  }
  next()
})

app.use(
  express.static(path.join(__dirname, '../public'), {
    maxAge: 31557600000,
    setHeaders: function (res) {
      res.set({
        'Cache-control': 'no-store, no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      })
    }
  })
)

/**
 * Cognito OAuth2 Authentication
 */
// const passportCognitoAuth = passport.authenticate('oauth2-cognito', { session: false });
// app.get('/auth/cognito', passportCognitoAuth);
// app.get('/auth/cognito/callback', passportCognitoAuth, (req, res) => res.send(req.user));

/**
 * Primary app routes.
 */

// cognito access token authentication middleware
let passportJwtAuth = passport.authenticate('bearer', { session: false })

if (process.env.NODE_ENV === 'test') {
  passportJwtAuth = (req, res, next) => next()
}

/**
 * Property APIs
 */
app.get('/api/properties', propertyController.searchProperties)
app.get('/api/suburb/properties', propertyController.getPropertyBySuburb)
app.get('/api/mytest', (req, res) => {
  surveyAnswerController
    .calculateComparativeRankings('5b57a49d1e574500148a5ae7', '2074')
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json({ error }))
})
app.get('/api/properties/:id', propertyController.getPropertyById)
app.post('/api/properties', propertyController.addProperty)
app.put('/api/properties/:id', propertyController.updateProperty)
app.get(
  '/api/properties/:propertyId/:postCode/location_score',
  propertyController.getLocationScore
)

app.post(
  '/api/properties/:propertyId/survey/score',
  surveyAnswerController.assessSurveyAnswers
)
app.get(
  '/api/properties/suburb_scores/:postCode',
  passportJwtAuth,
  surveyAnswerController.getSuburbScores
)
app.post(
  '/api/properties/:propertyId/survey/answer',
  passportJwtAuth,
  surveyAnswerController.upsertSurveyAnswer
)
app.get(
  '/api/properties/:propertyId/survey/answer',
  surveyAnswerController.getSurveyAnswer
)
app.get(
  '/api/properties/:propertyId/survey/answers',
  passportJwtAuth,
  surveyAnswerController.getSurveyAnswers
)
app.get(
  '/api/properties/:propertyId/survey/remains',
  passportJwtAuth,
  surveyAnswerController.getRemainedQuestionsCount
)
app.get(
  '/api/properties/:propertyId/survey/ranking',
  passportJwtAuth,
  surveyAnswerController.getRankingParagraph
)
app.get(
  '/api/properties/:propertyId/provider/refresh',
  passportJwtAuth,
  propertyController.refreshGetExternalData
)
app.get(
  '/api/properties/:propertyId/comparative_rankings',
  passportJwtAuth,
  propertyController.getComparativeRankings
)
app.get(
  '/api/properties/on_market_properties/:postCode',
  passportJwtAuth,
  propertyController.getOnMarketProperties
)

app.post(
  '/api/surveyanswer/:surveyId/publish',
  passportJwtAuth,
  surveyAnswerController.publishAnswer
)

app.get('/api/questions', passportJwtAuth, surveyAnswerController.getQuestions)
app.post(
  '/api/questions',
  passportJwtAuth,
  surveyAnswerController.createQuestion
)
app.get(
  '/api/questions/autocomplete',
  passportJwtAuth,
  surveyAnswerController.searchByText
)
app.get(
  '/api/questions/:questionId',
  passportJwtAuth,
  surveyAnswerController.getQuestionById
)
app.put(
  '/api/questions/:questionId',
  passportJwtAuth,
  surveyAnswerController.updateQuestion
)

/**
 * Property Suburb Services Assessment API
 */
app.get(
  '/api/properties/:propertyId/suburb/assessment',
  suburbController.getProximityAssessment
)
app.post(
  '/api/properties/:propertyId/suburb/reset',
  passportJwtAuth,
  suburbController.resetProximityAssessment
)

/**
 * Suburb Research Management APIs
 */
app.get('/api/suburbs', suburbController.getSuburbs)
app.get(
  '/api/suburbs/:suburbId',
  passportJwtAuth,
  suburbController.getSuburbById
)
app.put(
  '/api/suburbs/:suburbId',
  passportJwtAuth,
  suburbController.updateSuburb
)
app.post('/api/suburbs', passportJwtAuth, suburbController.createSuburb)
app.delete(
  '/api/suburbs/:suburbId',
  passportJwtAuth,
  suburbController.deleteSuburb
)
app.get('/api/suburb_postcodes', suburbController.getSuburbPostCodes)

/**
 * Suburb Proximity Rules APIs
 */
app.get(
  '/api/suburb/rules',
  passportJwtAuth,
  suburbController.getProximityRules
)
app.get(
  '/api/suburb/rules/:proximityRuleId',
  passportJwtAuth,
  suburbController.getProximityRuleById
)
app.put(
  '/api/suburb/rules/:proximityRuleId',
  passportJwtAuth,
  suburbController.updateProximityRule
)
app.post(
  '/api/suburb/rules',
  passportJwtAuth,
  suburbController.createProximityRule
)
app.delete(
  '/api/suburb/rules/:proximityRuleId',
  passportJwtAuth,
  suburbController.deleteProximityRule
)

/**
 * Scoring Rules API
 */
app.get('/api/suburb/scoringrules/:postCode', suburbController.getScoringRules)
app.post('/api/suburb/scoringrules', suburbController.createScoringRule)
app.put(
  '/api/suburbs/scoringrules/:scoringRuleID',
  suburbController.updateScoringRule
)

/**
 * Reference Data Manangement APIs
 */
app.get(
  '/api/referencedata/question',
  passportJwtAuth,
  referenceController.getQuestionClassification
)
app.get(
  '/api/referencedata/services',
  passportJwtAuth,
  referenceController.getServiceClassification
)
app.get(
  '/api/referencedata/analysis_types',
  passportJwtAuth,
  referenceController.getAnalysisTypes
)
app.get(
  '/api/referencedata/scoring_rules',
  passportJwtAuth,
  referenceController.getScoringRuleServiceClassification
)
app.get(
  '/api/referencedata/calculation_methods',
  passportJwtAuth,
  referenceController.getCalculationMethods
)
app.get(
  '/api/referencedata/report_content_types',
  passportJwtAuth,
  referenceController.getReportContentTypes
)
app.get(
  '/api/referencedata/property_types',
  passportJwtAuth,
  referenceController.getPropertyTypes
)

/**
 * Content Fragements API
 */
app.get('/api/contentfragments', contentFragmentController.getContentFragments)
app.post(
  '/api/contentfragments',
  passportJwtAuth,
  contentFragmentController.updateContentFragment
)
app.delete(
  '/api/contentfragments/:id',
  passportJwtAuth,
  contentFragmentController.deleteContentFragment
)

/**
 * User's dashboard APIs
 */
app.get('/api/portfolio', passportJwtAuth, portfolioController.getPortfolio)
app.post(
  '/api/portfolio/property',
  passportJwtAuth,
  portfolioController.addPortfolioProperty
)
app.put(
  '/api/portfolio/:propertyId/archive',
  passportJwtAuth,
  portfolioController.archivePortfolioProperty
)
/**
 * Error Handler.
 */
app.use(errorHandler())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use((req, res) => {
  if (req.path.includes('/dashboard')) {
    res.sendFile(path.join(__dirname, '../public/dashboard/index.html'))
  } else {
    res.sendFile(path.join(__dirname, '../public/index.html'))
  }
})

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.sendStatus(401)
  }
})
module.exports = app
