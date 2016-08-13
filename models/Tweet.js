const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    text: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: new Date },
    type: { type: Number, default: 0 }
});

module.exports = mongoose.model('Tweet', TweetSchema);
