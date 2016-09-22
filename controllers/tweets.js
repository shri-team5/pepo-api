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
 * Get replies
 * @param {Number} tweet_id - tweet id
 * @returns {Aggregate|Promise}
 */
function countReplies(tweet_id) {
    return Tweet.aggregate(
        [
            {$match: {parentTweet: {$in: [tweet_id]}}},
            {$project: {parentTweet: 1, count: {$add: [1]}}},
            {$group: {_id: "$parentTweet", number: {$sum: "$count"}}}
        ]);
}

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
    const {userId, text, parentTweet, location, linkimage, linktitle, linkdesc, linkurl} = req.body;

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

            (linkimage || linktitle || linkdesc) && (tweet.link = {
                image: linkimage,
                title: linktitle,
                description: linkdesc,
                url: linkurl
            });

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
            req.io.sockets.json.send({'event': 'new-tweet', 'data': data}); 
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
    const {user, username, feed, tweet, search, offset, count,} = req.query;

    new Promise((resolve, reject)=> {

        if (feed) {
            User.findById(feed).exec()
                .then(user => {
                    resolve({author: {$in: [...user.subscriptions, feed]}})
                })
                .catch(() => {
                    reject();
                });
        } else {
            tweet && resolve({parentTweet: tweet});
            search && resolve({"text": {$regex: ".*" + search + ".*"}});
            user && resolve({author: {$in: [user]}});
            if(username){
                User.findOne({username: username})
                    .then(userObj => {
                        resolve({author: {$in: [userObj._id]}})
                    })
                    .catch((err) => res.sendStatus(404));
            }else{
                resolve({});
            }
        }
    })
        .then(query => {
            Tweet.find(query, null, {
                skip: +offset,
                limit: +count,
                sort: {createdAt: 'desc'}
            }).populate('author').lean().exec()
                .then(tweets => {
                    const countTweets = tweets.length;
                    let counter = 0;
                    if(countTweets){
                        tweets.forEach(tweet=> {
                            countReplies(tweet._id).then(resp=> {
                                if (resp.length) {
                                    var foundIndex = tweets.findIndex(x => String(x._id) === String(resp[0]._id));
                                    foundIndex >= 0 && (tweets[foundIndex].replies = resp[0].number);
                                }

                                if (++counter >= countTweets) {
                                    res.send(tweets);
                                }
                            }).catch(err=> {
                                console.log(err);
                                res.send(tweets);
                            })
                        });
                    }else{
                        res.send(tweets);
                    }
                })
                .catch(() => {
                    res.sendStatus(404);
                });
        })
        .catch(()=> {
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
