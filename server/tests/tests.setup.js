global.chai = require('chai')
global.chaiHttp = require('chai-http')
chai.use(chaiHttp)
global.assert = require('assert')
global.expect = require('chai').expect
global.should = require('chai').should()
global.config = require('./../../config/test.env')
global.json2mongo = require('json2mongo');