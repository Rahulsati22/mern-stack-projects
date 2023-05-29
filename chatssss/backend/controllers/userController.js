const express = require('express');
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../middleware/sendEmail')
module.exports.registerUser = async function (request, response) {
    try {
        const { name, email, password, pic } = request.body;
        console.log(name, email, password)
        if (!name || !email || !password || !pic) {
            return response.status(400).json({
                success: false,
                message: "Please enter all the fields"
            })
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return response.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        console.log (userExists)


        const url = await cloudinary.v2.uploader.upload(pic, {
            folder: "posts"
        });



        console.log(url,"I am url")

        const salt = await bcrypt.genSalt(10);
        const passwordNew = await bcrypt.hash(password, salt);
        const user = await User.create({ email: email, name: name, password: passwordNew, avatar: { public_id: url.public_id, url: url.secure_url } });
        let token = '';
        if (user)
            token = await user.generateToken(user._id);
        if (user) {
            return response.status(201).cookie("token", token, {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }).json({
                success: true,
                user
            })
        }
        else {
            return response.status(400).json({
                success: false,
                message: "User not created"
            })
        }
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }

}


module.exports.loginUser = async function (request, response) {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).json({
                success: false,
                message: 'all fields require'
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        let val = await bcrypt.compare(password, user.password);
        console.log(val);
        
        if (val === false) {
            return response.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }
        const token = await user.generateToken(user._id);
        return response.status(200).cookie("token", token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }).json({
            success: true,
            user
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.response.data.message
        })
    }
}


module.exports.updatePassword = async function (request, response) {
    try {
        const { oldPassword, newPassword } = request.body;
        if (!oldPassword || !newPassword) {
            return response.status(500).json({
                success: false,
                message: "Enter all fields"
            })
        }
        const user = await User.findById(request.user._id);
        const val = await bcrypt.compare(oldPassword, user.password);
        if (val === false) {
            return response.status(404).json({
                success: false,
                message: "Invalid old password"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashPassword;
        await user.save();
        return response.status(200).json({
            success: true,
            message: "Password updated successfully"
        })

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports.allUsers = async function (request, response) {
    try {
        console.log(request.query.name)
        const users = await User.find({
            name: { $regex: request.query.name, $options: "i" }
        });
        return response.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports.forgotPassword = async (request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email });
        if (!user) {
            return response.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        // this password will be sent in email with the help of which user will reset his password
        const resetPasswordToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `${request.protocol}://${request.get("host")}/api/user/resetpassword/${resetPasswordToken}`
        const message = `Reset your password by clicking on the link below : \n\n ${resetUrl}`

        try {
            await sendEmail({
                email: user.email,
                subject: 'Reset Password',
                message
            })
            response.status(200).json({
                success: true,
                message: `Email sent to ${user.email}`
            })
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return response.status(500).json({
                success: false,
                message: error.message
            })
        }
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports.resetPassword = async (request, response) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(request.params.token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if (!user) {
            return response.status(401).json({
                success: false,
                message: "Token is invalid or has expired"
            })
        }

        // now we will hash the password
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(request.body.password, salt);

        user.password = pass;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return response.status(200).json({
            success: true,
            message: "Password updated successfully"
        })

    } catch (error) {
        response.status(500).json({
            success: false,
            message: error.message
        })
    }
}