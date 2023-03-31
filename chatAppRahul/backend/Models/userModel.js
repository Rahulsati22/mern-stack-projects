const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const generateToken = require("../config/generateToken");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    }
}, {
    timestamps: true,
})

userSchema.index({ name: 'text', email: 'text' });
const User = mongoose.model("User", userSchema);
module.exports = User;