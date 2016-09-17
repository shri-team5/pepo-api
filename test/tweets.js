var request = require('supertest');
var mongoose = require('mongoose');
var chai = require('chai');
var config = require('../config/environments/testing');

describe('Tweets', function() {

    before(function(done) {
        // In our tests we use the test db
        mongoose.connect(config.mongodb.uri)
        done();
    });

    it('Should Do Nothing', function() {
        chai.expect(1).to.be.ok;

    })

});