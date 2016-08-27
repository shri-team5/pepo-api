const { path } = require('ramda');

const User = require('../models/User');

const vkontakteIdPath = path(['vkontakte', 'id']);
const facebookIdPath = path(['facebook', 'id']);

function getUserByCustomId(req, res, next, provider) {
    const { id } = req.params;

    if (!id) {
        return Promise.resolve(res.sendStatus(400));
    }

    return User.findOne({ [`${provider}.id`]: id })
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
    const { id } = req.params;

    return User.findById(id)
        .then(user => res.send(user))
        .catch(() => res.sendStatus(404));
}

function updateUser(req, res) {
    const {
            username,
            fullName,
            description,
            avatarPath
        } = req.body,
        { id } = req.params,
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
    user.facebook.id = facebookId,
    user.vkontakte.id = vkontakteId,
    user.fullName = fullName;
    user.description = description;
    user.avatarPath = avatarPath;

    return user.save()
        .then(user => res.send(user))
        .catch(() => res.sendStatus(400));
}

module.exports = {
    getUser,
    createUser,
    updateUser,
    getUserByFacebookId,
    getUserByVkontakteId
};
