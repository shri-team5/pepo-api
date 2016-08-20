const config = require('./config');
const mongoose = require('mongoose');
const User = require('./models/User');
const Tweet = require('./models/Tweet');
mongoose.Promise = Promise;

function connect() {
    return mongoose.connect(config.mongodb.uri).connection;
}

function createUser(fullName, avatarPath, username, description) {
    const user = new User();
    user.fullName = fullName;
    user.avatarPath = avatarPath;
    user.username = username;
    user.description = description;

    return user.save();
}

function createTweet(text, author, type) {
    const tweet = new Tweet();
    tweet.text = text;
    tweet.author = author;
    tweet.type = type;

    return tweet.save();
}

function createFakeData() {
    createUser('Вася Пупкин', 'http://placehold.it/96x96', 'superuser', 'Lorem Ipsum')
        .then(user => Promise.all([
            Promise.resolve(user),
            createTweet(
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                user, 'text'
            ),
            createTweet(
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                user, 'text'
            ),
            createTweet(
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                user, 'text'
            )
        ]))
        .then(() => {
            console.log('success!'); // eslint-disable-line

            process.exit();
        })
        .catch(err => {
            console.error(err.message); // eslint-disable-line

            process.exit(1);
        });
}

connect()
    .on('error', console.error) // eslint-disable-line
    .on('disconnect', connect)
    .once('open', createFakeData);
