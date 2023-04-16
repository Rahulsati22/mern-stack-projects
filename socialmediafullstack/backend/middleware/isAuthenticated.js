const User = require("../models/User");
const jwt = require("jsonwebtoken");
exports.isAuth = async (request, response, next) => {
  const { token } = request.cookies;
  if (!token) {
    return response.status(401).json({
      message: "please login first",
    });
  }
  const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
  request.user = await User.findById(decoded._id);
  next();
};
