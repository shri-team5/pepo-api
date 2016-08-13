const config = require('./config');
const mongoose = require('mongoose');
const User = require('./models/User');
const Tweet = require('./models/Tweet');

function connect() {
    return mongoose.connect(config.mongodb.uri).connection;
}

connect()
    .on('error', console.error)
    .on('disconnect', connect);

const user = new User();
user.name = 'Иван';
user.avatarPath = 'http://placehold.it/96x96';
user.username = 'superuser';
user.description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
user.created_at = new Date;

user.save(function() {
  User.findOne({ username: 'superuser' }, function(err, user) {
    const tweet = new Tweet();
    tweet.text = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
    tweet.user = user;
    tweet.type = 0;
    tweet.created_at = new Date;

    tweet.save(function(err) {
      console.log(err);
    });
  });
});
