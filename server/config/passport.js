const passport = require('passport');
const CognitoExpress = require('cognito-express');
const OAuth2CognitoStrategy = require('passport-oauth2-cognito');
const BearerStrategy = require('passport-http-bearer');
const jwt = require('jsonwebtoken');

/**
 * Server Side OAuth2 Cognito Configuration
 */
let cognitoOptions = {};

switch (process.env.HOST_ENV) {
  case 'test':
    cognitoOptions = {
      callbackURL: `${process.env.HOST_URI_PROD}/auth/cognito/callback`,
      clientDomain: process.env.TEST_COGNITO_APP_DOMAIN_NAME,
      clientID: process.env.TEST_COGNITO_APP_CLIENT_ID,
      clientSecret: process.env.TEST_COGNITO_APP_CLIENT_SECRET,
      region: process.env.COGNITO_REGION
    };
    break
  case 'stage':
    cognitoOptions = {
      callbackURL: `${process.env.HOST_URI_STAGE}/auth/cognito/callback`,
      clientDomain: process.env.STAGE_COGNITO_APP_DOMAIN_NAME,
      clientID: process.env.STAGE_COGNITO_APP_CLIENT_ID,
      clientSecret: process.env.STAGE_COGNITO_APP_CLIENT_SECRET,
      region: process.env.COGNITO_REGION
    };
    break;
  case 'production':
    cognitoOptions = {
      callbackURL: `${process.env.HOST_URI_PROD}/auth/cognito/callback`,
      clientDomain: process.env.PROD_COGNITO_APP_DOMAIN_NAME,
      clientID: process.env.PROD_COGNITO_APP_CLIENT_ID,
      clientSecret: process.env.PROD_COGNITO_APP_CLIENT_SECRET,
      region: process.env.COGNITO_REGION
    };
    break;
  default:
    cognitoOptions = {
      callbackURL: `http://localhost:8080/auth/cognito/callback`,
      clientDomain: process.env.DEV_COGNITO_APP_DOMAIN_NAME,
      clientID: process.env.DEV_COGNITO_APP_CLIENT_ID,
      clientSecret: process.env.DEV_COGNITO_APP_CLIENT_SECRET,
      region: process.env.COGNITO_REGION
    };
    break;
}

/**
 * middleware for server side OAuth2 cognito authentication
 * This is not used for now. maybe it's used for swagger login in the future or can be deleted if not
 */
passport.use(new OAuth2CognitoStrategy(cognitoOptions, (accessToken, refreshToken, profile, done) => {
  done(null, {
    tokens: {
      accessToken,
      refreshToken
    },
    profile
  });
}));

/**
 * middleware for Client Side OAuth2 Cognito authentication
 */
let cognitoUserPoolId;
switch (process.env.HOST_ENV) {
  case 'test':
    cognitoUserPoolId = process.env.TEST_COGNITO_POOL_ID;
    break;
  case 'stage':
    cognitoUserPoolId = process.env.STAGE_COGNITO_POOL_ID;
    break;
  case 'production':
    cognitoUserPoolId = process.env.PROD_COGNITO_POOL_ID;
    break;
  default:
    cognitoUserPoolId = process.env.DEV_COGNITO_POOL_ID;
    break;
}

const cognitoExpress = new CognitoExpress({
  region: process.env.COGNITO_REGION,
  cognitoUserPoolId,
  tokenUse: 'access',
  tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
});

passport.use(new BearerStrategy(
  (token, done) => {
    if (!token) {
      return done({
        error: {
          name: 'TokenNotFound',
          message: 'access token not found'
        }
      });
    }
    const tokens = token.split(':');
    const accessToken = tokens[0];
    const identity = jwt.decode(tokens[1])
    cognitoExpress.validate(accessToken, function(err, response) {
      if (err) {
        return done({
          name: typeof err === 'object' ? err.name : '',
          message: typeof err === 'object' ? err.message : err,
          expiredAt: typeof err === 'object' ? err.expiredAt : undefined
        });
      }
      done(null, {
        ...response,
        sub: identity.sub,
        email: identity.email
      });
    });
  }
));

passport.serializeUser((user, done) => {
  console.log('passport.serializeUser:', user)
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser:', id)
  User.findById(id, (err, user) => {
    done(err, user.id);
  });
});
