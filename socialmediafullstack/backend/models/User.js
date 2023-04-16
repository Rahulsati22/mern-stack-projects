const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be atleast 6 characters"], 
    select: false,
  },
  resetPasswordToken:{
    type : String,
  },
  resetPasswordExpire:{
    type : Date
  },
  avatar: {
    public_id: String,
    url: String,
  },
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// the below function will tell what will happen before saving something in the mongodb
userSchema.pre("save", async function (next) {
  // we will modify the password if and only if password is modified
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async (password, encPassword) => {
  return await bcrypt.compare(password, encPassword);
};

userSchema.methods.generateToken = async (id) => {
  return await jwt.sign({ _id: id }, process.env.TOKEN_SECRET);
};

userSchema.methods.getResetPasswordToken = async(user) => {
  // generate random string of 20 bytes in hexadecimal format
  const resetToken = crypto.randomBytes(20).toString("hex");
  console.log(resetToken);
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // token will be valid for only ten minutes
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);

/**
 * crypto.createHash("sha256")->it will generate a 32 byte hex value.
 * .update(resetToken)->it will add it to the previous hashvalue
 * .digest("hex")->it will generate the final hexadecimal string of 64 characters
 */
