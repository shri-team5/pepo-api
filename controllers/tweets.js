const { flatten } = require('ramda');

const User = require('../models/User');
const Tweet = require('../models/Tweet');

const { createdAtComparator } = require('../utils');

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
            tweets.sort(createdAtComparator);

            res.send(tweets);
        })
        .catch(() => {
            res.sendStatus(404);
        });
}

function post(req, res) {
    const userSave = User.findOne({ username: req.body.username }).then((user) => {
        const tweet = new Tweet();
        tweet.text = req.body.text;
        tweet.user = user;
        tweet.type = req.body.type;
        tweet.created_at = new Date;

        return tweet.save();
    });

    userSave.then(() => {
        return res.sendStatus(200);
    });

    userSave.catch((err) => {
        return res.sendStatus(500);
    });
}

module.exports = {
    getFeed,
    post
};
