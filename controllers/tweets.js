const User = require('../models/User');
const Tweet = require('../models/Tweet');

const config = require('../config');
var cloudinary = require('cloudinary');
var xss = require('xss');

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.access_key_id,
    api_secret: config.cloudinary.secret_access_key
});

/**
 * Create tweet controller
 * @param {Object} req - request object
 * @param {Object} req.body - request object body
 * @param {Object} [req.file] - request object file
 * @param {String} req.body.text - tweet text
 * @param {String} req.body.userId - userId
 * @param {String} [req.body.parentTweet] - parent tweet id (fore reply)
 * @param {String} [req.body.location] - coordinates
 * @param res
 */
function createTweet(req, res) {
    const {userId, text, parentTweet, location} = req.body;

    if (!userId) {
        return res.sendStatus(400);
    }

    User.findById(userId)
        .then(user => {
            const tweet = new Tweet();
            tweet.text = xss(text);
            tweet.author = user;
            (parentTweet) && (tweet.parentTweet = parentTweet);
            (location) && (tweet.location = location);
            return new Promise(function (fulfill, reject) {
                if (req.file) {
                    cloudinary.uploader.upload(
                        req.file.path,
                        function (result) {
                            tweet.image = result.secure_url;
                            fulfill(tweet);
                        },
                        {
                            crop: 'limit',
                            width: 640,
                            height: 640
                        });
                } else {
                    fulfill(tweet);
                }
            });
        })
        .then((tweet) => {
            return tweet.save();
        })
        .then((data) => {
            return res.send(data);
        })
        .catch(() => {
            return res.sendStatus(500);
        });
}

/**
 * Return filtered tweets
 * @param {Object} req - request object
 * @param {Object} req.body - request object body
 * @param {String} [req.body.user] - userId (get users tweets)
 * @param {String} [req.body.feed] - userId (get feed for user)
 * @param {String} [req.body.tweet] - tweetId (get feed for user)
 * @param {String} [req.body.search] - text (global search)
 * @param {Number} [req.body.offset] - offset filter
 * @param {Number} [req.body.count] - limit filter
 * @param res
 */
function getTweets(req, res) {
    const {user, feed, tweet, search, offset, count,} = req.query;

    new Promise((resolve, reject)=> {

        if (feed) {
            User.findById(feed).exec()
                .then(user => {
                    resolve({author: {$in: [...user.subscriptions, feed]}})
                })
                .catch(() => {
                    reject();
                });
        } else{
            user && resolve({author: {$in: [user]}});
            tweet && resolve({parentTweet: tweet});
            search && resolve({"text" : {$regex : ".*"+search+".*"}});
            resolve({});
        }
    })
        .then(query => {
            Tweet.find(query, null, {
                skip: +offset,
                limit: +count,
                sort: {createdAt: 'desc'}
            }).populate('author').exec()
                .then(tweets => {
                    res.send(tweets);
                })
                .catch(() => {
                    res.sendStatus(404);
                });
        })
        .catch(()=>{
            res.sendStatus(404);
        });
}

/**
 * Get tweet info
 * @param {Object} req - request object
 * @param {Object} req.body - request object body
 * @param {String} req.body.tweetId - tweetId
 * @param res
 */
function getTweet(req, res) {

    const {tweetId} = req.params;

    Tweet.findById(tweetId).populate('author').exec()
        .then(tweet => {
            res.send(tweet);
        })
        .catch(() => {
            res.sendStatus(404);
        });
}

module.exports = {
    createTweet,
    getTweet,
    getTweets
};
