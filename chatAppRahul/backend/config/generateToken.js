const jwt = require('jsonwebtoken')
const generateToken = (id)=>{
    return jwt.sign({id}, 'rahul', {
        expiresIn:"30d"
    })
}

module.exports = generateToken;