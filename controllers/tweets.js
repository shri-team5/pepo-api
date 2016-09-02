const User = require('../models/User');
const Tweet = require('../models/Tweet');

function getFeed(req, res) {
    const {userId, offset, count, ownTweetsOnly} = req.query;

    if (!userId) {
        return res.sendStatus(400);
    }

    User.findById(userId).exec()
        .then(user => {
            const userIds = ownTweetsOnly === 'true' ? [userId] : [...user.subscriptions, userId];
            return Tweet.find({author: {$in: userIds}}, null, {
                skip: +offset,
                limit: +count,
                sort: {createdAt: 'desc'}
            }).populate('author').exec();
        })
        .then(tweets => {
            res.send(tweets);
        })
        .catch(() => {
            res.sendStatus(404);
        });
}

function getWorldFeed(req, res) {
    const {offset, count} = req.query;

    Tweet.find({}, null, {
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
}

function createTweet(req, res) {
    const {userId, text, type, parentTweet} = req.body;

    if (!userId) {
        return res.sendStatus(400);
    }

    User.findById(userId)
        .then(user => {
            const tweet = new Tweet();
            tweet.text = text;
            tweet.type = type;
            tweet.author = user;
            (parentTweet) && (tweet.parentTweet = parentTweet);

            return tweet.save();
        })
        .then(() => {
            return res.sendStatus(200);
        })
        .catch(() => {
            return res.sendStatus(500);
        });
}

function getReplies(req, res) {

    const {offset, count} = req.query;
    const {tweetId} = req.params;

    if (!tweetId) {
        return res.sendStatus(400);
    }

    Tweet.find({parentTweet: tweetId}, null, {
        skip: +offset,
        limit: +count,
        sort: {createdAt: 'asc'}
    }).populate('author').exec()
        .then(tweets => {
            res.send(tweets);
        })
        .catch(() => {
            res.sendStatus(404);
        });
}

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
    getFeed,
    getWorldFeed,
    createTweet,
    getReplies,
    getTweet
};
