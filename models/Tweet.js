const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TweetSchema = new Schema({
    text: { type: String, maxlength: 140, required: true },
    author: { type: ObjectId, ref: 'User', required: true },
    image: { type: String },
    parentTweet: { type: ObjectId, ref: 'Tweet' },
    location: { type: String, maxlength: 140},
    link: {
        image: String,
        title: String,
        description: String,
        url: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tweet', TweetSchema);
