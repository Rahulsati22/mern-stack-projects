const jwt = require('jsonwebtoken')
const User = require('../Models/userModel')
module.exports.protect = async (request, response, next) => {
    let token;
    if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
        try {
            token = request.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, 'rahul');
            console.log(decoded)
            request.user = await User.findById({ _id: decoded.id }).select("-password");
            next();
        } catch (error) {
            response.status(401)
            throw new Error("not authorized, token failed")
        }
    }
    if (!token) {
        response.status(401);
        throw new Error("user is not authorized, no token")
    }
}
