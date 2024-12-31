const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: String,
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String
    },
    name: {
        type: String // Changed from lowercase 'string' to uppercase 'String'
    }
});

module.exports = mongoose.model("user", userSchema);