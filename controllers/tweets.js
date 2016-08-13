const User = require('../models/User');
const Tweet = require('../models/Tweet');

function get(req, res) {
    const tweets = [
        {
            id: 1,
            text: 'Hello 140!',
            created_at: 1471093167,
            user: {
                login: 'superuser1',
                avatar: 'placehold.it/96x96',
                name: 'Вася Пупкин',
                description: '',
            },
            type: 'text'
        },
        {
            id: 1,
            text: 'Hello 141!',
            created_at: 1471093167,
            user: {
                login: 'superuser1',
                avatar: 'placehold.it/96x96',
                name: 'Вася Пупкин',
                description: '',
            },
            type: 'text'
        },
        {
            id: 1,
            text: 'Hello 142!',
            created_at: 1471093167,
            user: {
                login: 'superuser2',
                avatar: 'placehold.it/96x96',
                name: 'Вася Пупкин',
                description: '',
            },
            type: 'text'
        },
        {
            id: 1,
            text: 'Hello 143!',
            created_at: 1471093168,
            user: {
                login: 'superuser2',
                avatar: 'placehold.it/96x96',
                name: 'Вася Пупкин',
                description: '',
            },
            type: 'text'
        },
    ];

    return res.send(tweets);
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
    get,
    post
};
