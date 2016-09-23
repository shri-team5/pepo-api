var request = require('supertest');
var mongoose = require('mongoose');
var chai = require('chai');
var config = require('../config/environments/testing');
var clearDB  = require('mocha-mongoose')(config.mongodb.uri, {noClear: true});

describe('Tweets', function() {
    var server;
    var userObject;
    var tweetObject;
    var tweetReplyObject;

    before(function(done) {
        clearDB(done);
    });
    before(function(done) {
        server = require('../index');
        setTimeout(done, 1000)
    });
    before(function(done) {
        var user = {
            username: 'userTest',
            fullName: 'User Test',
            description: 'Test description',
            avatarPath: 'Avatar path'
        };

        console.log('Create user test');
        request(server)
            .post('/users')
            .send(user)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    console.log(err);
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
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.length(0);
                done();
            });
    });

    it('Checks if author exists', function(done) {
        request(server)
            .get('/users/'+userObject._id)
            .expect(200, done)
    });
    
    it('Should create tweet', function(done) {
        var tweet = {
            userId: userObject._id,
            text: 'test'
        };
        request(server)
            .post('/tweets')
            .send(tweet)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                tweetObject = res.body;
                done();
            });
    });

    it('Should get created tweet', function(done) {
        request(server)
            .get('/tweets/'+tweetObject._id)
            .expect(200, done)
    });

    it('Should create reply tweet', function(done) {
        var tweet = {
            userId: userObject._id,
            text: 'test reply',
            parentTweet: tweetObject._id
        };
        request(server)
            .post('/tweets')
            .send(tweet)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                tweetReplyObject = res.body;
                done();
            });
    });

    it('Should get tweet replies', function(done) {
        request(server)
            .get('/tweets/')
            .query({tweet:tweetObject._id})
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                chai.expect(res.body).to.have.length(1);

                done();
            });
    });

    it('Should return 2 tweets (all)', function(done) {
        request(server)
            .get('/tweets')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.length(2);
                done();
            });
    });

    it('Should return 1 tweet with text reply', function(done) {
        request(server)
            .get('/tweets')
            .query({search:'reply'})
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                chai.expect(res.body).to.have.length(1);
                chai.expect(res.body[0].text).to.contain('reply');
                done();
            });
    });
});