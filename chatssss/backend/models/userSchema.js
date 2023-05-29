const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
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
    avatar: {
        public_id: String,
        url: String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
},
    {
        timestamps: true,
    })

userSchema.methods.generateToken = async (id) => {
    return await jwt.sign({ _id: id }, process.env.TOKEN_SECRET)
}

userSchema.methods.getResetPasswordToken = function () {
    // hexadecimal string means to convert the binary data in human readable form which ranges from 0-9 and A-F
    const resetToken = crypto.randomBytes(20).toString("hex");
    //crypto.createHash --> it will create a hash  update-->create hash for the string provided inside this method digest hex->convert it into human readable form by converting it into a hexadecimal string
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;

}



module.exports = mongoose.model('User', userSchema);