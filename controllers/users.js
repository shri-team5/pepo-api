const {path} = require('ramda');

const User = require('../models/User');
const Tweet = require('../models/Tweet');

const vkontakteIdPath = path(['vkontakte', 'id']);
const facebookIdPath = path(['facebook', 'id']);

function getUserByCustomId(req, res, next, provider) {
    const {id} = req.params;

    if (!id) {
        return Promise.resolve(res.sendStatus(400));
    }

    return User.findOne({[`${provider}.id`]: id})
        .then((user) => {
            if (user) {
                return res.send(user);
            }

            return res.sendStatus(404);
        })
        .catch(() => res.sendStatus(400));
}

function getUserByFacebookId(...params) {
    return getUserByCustomId(...params, 'facebook');
}

function getUserByVkontakteId(...params) {
    return getUserByCustomId(...params, 'vkontakte');
}

function getUser(req, res) {
    const {id} = req.params;

    const user = User.findById(id);
    const userTweetsNumber = Tweet.count({"author": id});
    const userSubscribersNumber = User.count({subscriptions: {$in: [id]}});

    Promise.all([user, userTweetsNumber, userSubscribersNumber])
        .then(responses => {
            res.send(Object.assign({},
                {tweetsNumber: responses[1]},
                {subscribersNumber: responses[2]},
                responses[0]._doc));
        })
        .catch(() => res.sendStatus(404))

}

function getUserByUsername(req, res) {
    const {username} = req.params;

    return User.findOne({username: username})
        .then(user => {

            const userTweetsNumber = Tweet.count({"author": user._id});
            const userSubscribersNumber = User.count({subscriptions: {$in: [user._id]}});

            Promise.all([userTweetsNumber, userSubscribersNumber])
                .then(responses => {
                    res.send(Object.assign({},
                        {tweetsNumber: responses[0]},
                        {subscribersNumber: responses[1]},
                        user._doc));
                })
                .catch(() => res.sendStatus(500));
        })
        .catch(() => res.sendStatus(404));
}

function updateUser(req, res) {
    const {
            username,
            fullName,
            description,
            avatarPath
        } = req.body,
        {id} = req.params,
        update = {};

    if (!id) {
        return Promise.resolve(res.sendStatus(400));
    }

    username && (update.username = username);
    fullName && (update.fullName = fullName);
    description && (update.description = description);
    avatarPath && (update.avatarPath = description);

    return User.findByIdAndUpdate(id, update)
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
}

function createUser(req, res) {
    const {
            username,
            fullName,
            description,
            avatarPath
        } = req.body,
        vkontakteId = vkontakteIdPath(req.body),
        facebookId = facebookIdPath(req.body);

    const user = new User;

    user.username = username;
    user.facebook.id = facebookId;
    user.vkontakte.id = vkontakteId;
    user.fullName = fullName;
    user.description = description;
    user.avatarPath = avatarPath;

    return user.save()
        .then(user => res.send(user))
        .catch(() => res.sendStatus(400));
}

function subscribe(req, res) {
    const {subscriber_id} = req.body,
        {user_id} = req.params;

    User.findById(subscriber_id)
        .then(user => {
            user.subscriptions.push(user_id);
            user.save()
                .then(()=>res.sendStatus(200))
                .catch(()=>res.sendStatus(500))
        })
        .catch(() => res.sendStatus(404))
}


function unsubscribe(req, res) {
    const {subscriber_id} = req.body,
        {user_id} = req.params;

    User.findById(subscriber_id)
        .then(user => {
            user.subscriptions.pull(user_id);
            user.save()
                .then(()=>res.sendStatus(200))
                .catch(()=>res.sendStatus(500))
        })
        .catch(() => res.sendStatus(404))
}

module.exports = {
    getUser,
    createUser,
    updateUser,
    getUserByUsername,
    getUserByFacebookId,
    getUserByVkontakteId,
    subscribe,
    unsubscribe
};
