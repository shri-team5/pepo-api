const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TweetSchema = new Schema({
    text: { type: String, maxlength: 140, required: true },
    type: { type: String, enum: ['text', 'photo', 'geo', 'link'], required: true },
    author: { type: ObjectId, ref: 'User', required: true },
    image: { type: String },
    parentTweet: { type: ObjectId, ref: 'Tweet' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tweet', TweetSchema);
