var request = require('supertest');
var mongoose = require('mongoose');
var chai = require('chai');
var config = require('../config/environments/testing');
var clearDB  = require('mocha-mongoose')(config.mongodb.uri, {noClear: true});

describe('Tweets', function() {
    var server;
    var userObject;
    before(function(done) {
        clearDB(done);
    });
    before(function() {
        server = require('../index');
    });
    before(function(done) {
        var user = {
            username: 'userTest',
            fullName: 'User Test',
            description: 'Test description',
            avatarPath: 'Avatar path'
        };
        request(server)
            .post('/users')
            .send(user)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                userObject = res.body;


                done();
            });
    });
    after(function () {
        server.close();
    });


    it('Get 200 from /tweets', function(done) {
        request(server)
            .get('/tweets')
            .expect(200, done);
    });



    it('Checks if author exists', function(done) {
        request(server)
            .get('/users/'+userObject._id)
            .expect(200, done)
    });
    
    it('It should create tweet', function(done) {
        var tweet = {
            userId: userObject._id,
            text: 'test',
            type: 'text'
        };
        request(server)
            .post('/tweets')
            .send(tweet)
            .expect(200, done);
    });
});