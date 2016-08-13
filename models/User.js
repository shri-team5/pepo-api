const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    avatarPath: String,
    username: { type: String, required: true, unique: true },
    description: String,
    created_at: { type: Date, default: new Date }
});

module.exports = mongoose.model('User', UserSchema);
