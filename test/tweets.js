var request = require('supertest');
var mongoose = require('mongoose');
var chai = require('chai');
var config = require('../config/environments/testing');

describe('Tweets', function() {
    var server;

    before(function() {
        server = require('../index');
    });

    after(function () {
        server.close();
    });

    it('Get 200 from /tweets', function(done) {
        request(server)
            .get('/tweets')
            .expect(200, done);
    });

    it('Get 404 from /', function(done) {
        request(server)
            .get('/')
            .expect(404, done);
    });
});