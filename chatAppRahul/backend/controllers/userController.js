const { response } = require("express");
const User = require('../Models/userModel')
const generateToken = require('../config/generateToken')
const bcrypt = require('bcryptjs')
const protect = require('../middleware/authmiddleware')
module.exports.registerUser = async function (request, response) {
    const { name, email, password, pic } = request.body;
    if (!name || !email || !password) {
        response.send(400);
        throw new Error("Please Enter all the fields");
    }
    const userExists = await User.findOne({ email: email });
    if (userExists) {
        response.status(400)
        throw new Error("User already exists")
    }

    const salt = await bcrypt.genSalt(10);
    const passwordNew = await bcrypt.hash(password, salt);
    const user = await User.create({ email: email, name: name, password: passwordNew, pic: pic })

    if (user) {
        response.status(201).json(
            {
                _id: user._id,
                email: user.email,
                password: user.password,
                name: user.name,
                token: generateToken(user._id)
            }
        )

    } else {
        response.status(400);
        throw new Error("User not created")
    }
}

module.exports.authUser = async function (request, response) {
    const { email, password } = request.body;
    console.log(email, password)
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
        let val = await bcrypt.compare(password, user.password);
        console.log(val)
        if (val) {
            response.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            })
        }
        else {
            response.status(401).json("wrong password")
        }
    }
    else {
        response.status(401).json("wrong credentials");
        throw new Error("User not found")
    }
}
// '/api/user/allUsers'
// we send queries within the url
module.exports.allUsers = async function (request, response) {
    // sending the name of the user in the search bar that the database will search
    const keyWord = request.query.search;
    console.log(keyWord, 'hey i am keyword')
    if (keyWord){
        const users = await User.find({
            $text : {$search: keyWord, $diacriticSensitive: true}
        })
       return  response.send(users);
    }
    else
    return response.send([]);
}