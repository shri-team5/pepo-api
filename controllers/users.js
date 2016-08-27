const User = require('../models/User');

function getUser(req, res) {
    const { id } = req.params;

    User.findById(id)
        .then(user => {
            res.send(user)
        })
        .catch(() => {
            res.sendStatus(404);
        });
}

function createUser(req, res) {
    const {
        username,
        vkId,
        fbId,
        fullName,
        description,
        avatarPath
    } = req.body;

    const user = new User;

    user.username = username;
    user.vkId = vkId;
    user.fbId = fbId;
    user.fullName = fullName;
    user.description = description;
    user.avatarPath = avatarPath;

    return user.save()
        .then(user => res.send(user))
        .catch(() => res.sendStatus(400));
}

module.exports = {
    getUser,
    createUser
};
