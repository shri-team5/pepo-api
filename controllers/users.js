const {path} = require('ramda');

const User = require('../models/User');
const Tweet = require('../models/Tweet');
var xss = require('xss');

const vkontakteIdPath = path(['vkontakte', 'id']);
const facebookIdPath = path(['facebook', 'id']);

var cloudinary = require('cloudinary');
var xss = require('xss');

const config = require('../config');
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.access_key_id,
    api_secret: config.cloudinary.secret_access_key
});


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
    const userSubscribers = User.find({subscriptions: {$in: [id]}});

    Promise.all([user, userTweetsNumber, userSubscribers])
        .then(responses => {

            let subscribers = [];

            if(responses[2].length){
                subscribers = responses[2].map(item=>item._id)
            }
            
            res.send(Object.assign({},
                {tweetsNumber: responses[1]},
                {subscribers: subscribers},
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
            description
        } = req.body,
        {id} = req.params,
        update = {};

    if (!id) {
        return Promise.resolve(res.sendStatus(400));
    }

    username && (update.username = xss(username));
    fullName && (update.fullName = xss(fullName));
    description && (update.description = xss(description));

    new Promise((resolve, reject)=> {
        if (req.file) {
            cloudinary.uploader.upload(
                req.file.path,
                function (result) {
                    update.avatarPath = result.secure_url;
                    resolve(update);
                },
                {
                    crop: 'fill',
                    width: 240,
                    height: 240
                });
        }
        else {
            resolve(update);
        }
    })
        .then((update)=> {
            return User.findByIdAndUpdate(id, update)
                .then(() => res.sendStatus(200))
                .catch(() => res.sendStatus(500));
        });

}
/**
 * Create user controller
 * @param {Object} req - request object
 * @param {Object} req.body - request body
 * @param {String} req.body.username - Username
 * @param {String} req.body.fullName - Full Name
 * @param {String} req.body.description - User description field
 * @param {String} req.body.avatarPath - avatar link
 * @param res
 * @returns {Promise.<TResult>|Promise}
 */
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
