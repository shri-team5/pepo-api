const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    vkontakte: {
        id: { type: String }
    },
    facebook: {
        id: { type: String }
    },
    fullName: String,
    description: String,
    avatarPath: String,
    subscriptions: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
