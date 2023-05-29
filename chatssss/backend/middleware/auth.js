const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
exports.isAuth = async(request, response, next)=>{
    const {token} = request.cookies;
    if (!token){
        return response.status(401).json({
            message : 'Please login first'
        })
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    request.user = await User.findById(decoded._id);
    next();
}