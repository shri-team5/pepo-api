const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    text: { type: String, maxlength: 140, required: true },
    type: { type: String, enum: ['text', 'photo', 'geo', 'link'], required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentTweet: { type: Schema.Types.ObjectId, ref: 'Tweet' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tweet', TweetSchema);
