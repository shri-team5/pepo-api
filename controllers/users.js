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

module.exports = {
    getUser
};
