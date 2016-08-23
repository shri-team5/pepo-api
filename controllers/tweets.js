const { flatten } = require('ramda');

const User = require('../models/User');
const Tweet = require('../models/Tweet');

const { createdAtComparatorDesc } = require('../utils');

function getFeed(req, res) {
    const { userId } = req.query;

    if (!userId) {
        return res.sendStatus(400);
    }

    User.findById(userId).populate('subscriptions').exec()
        .then(user => {
            const usersForFeed = [...user.subscriptions, user];
            const tweetsFinds = usersForFeed.reduce((reducer, user) => {
                reducer.push(Tweet.find({ author: user }).populate('author').exec());

                return reducer;
            }, []);

            return Promise.all(tweetsFinds);
        })
        .then(tweetsByUsers => {
            const tweets = flatten(tweetsByUsers);
            tweets.sort(createdAtComparatorDesc);

            res.send(tweets);
        })
        .catch(() => {
            res.sendStatus(404);
        });
}

function createTweet(req, res) {
    const { userId, text, type } = req.body;

    if(!userId) {
        return res.sendStatus(400);
    }

    User.findById(userId)
        .then(user => {
            const tweet = new Tweet();
            tweet.text = text;
            tweet.type = type;
            tweet.author = user;

            return tweet.save();
        })
        .then(() => {
            return res.sendStatus(200);
        })
        .catch(() => {
            return res.sendStatus(500);
        });
}

module.exports = {
    getFeed,
    createTweet
};
