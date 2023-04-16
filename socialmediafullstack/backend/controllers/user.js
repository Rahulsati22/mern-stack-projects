const User = require("../models/User");
const Post = require("../models/Post");
const cloudinary = require("cloudinary");
const crypto = require("crypto");
const { sendEmail } = require("../middleware/sendEmail");
module.exports.registerUser = async (request, response) => {
  try {
    const { name, email, password, avatar } = request.body;
    let user = await User.findOne({ email: email });
    if (user) {
      return response
        .status(400)
        .json({ success: false, message: "user already exists" });
    }
    const url = await cloudinary.v2.uploader.upload(avatar, {
      folder: "posts",
    });
    user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: url.public_id, url: url.secure_url },
    });

    const token = await user.generateToken(user._id);
    return response
      .status(201)
      .cookie("token", token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({
        success: true,
        user,
        token,
      });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email })
      .select("+password")
      .populate("followers following post");
    if (!user) {
      return response.status(400).json("User not found");
    }
    const isMatch = await user.matchPassword(password, user.password);
    if (!isMatch) {
      return response.status(400).json({
        success: false,
        message: "incorrect password",
      });
    }
    const token = await user.generateToken(user._id);
    return response
      .status(201)
      .cookie("token", token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({
        success: true,
        user,
        token,
      });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// creating route to follow the user
module.exports.followUser = async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    const loggedInUser = await User.findById(request.user._id);

    if (!user || !loggedInUser) {
      return response.status(404).json({
        success: false,
        message:
          "authenticated user or the person you want to follow not found",
      });
    }

    var contains = loggedInUser.following.includes(request.params.id);
    console.log(contains);

    if (contains) {
      const indxfollowing = loggedInUser.following.indexOf(user._id);
      loggedInUser.following.splice(indxfollowing, 1);

      const indxfollower = user.followers.indexOf(loggedInUser._id);
      user.followers.splice(indxfollower, 1);

      await loggedInUser.save();
      await user.save();

      return response.status(200).json({
        success: false,
        message: "Successfully unfollowed the user",
      });
    } else {
      loggedInUser.following.push(user._id);
      user.followers.push(loggedInUser._id);
      await loggedInUser.save();
      await user.save();

      response.status(200).json({
        success: true,
        message: "Successfully followed the user",
      });
    }
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.logout = async (request, response) => {
  try {
    response.clearCookie("token").status(200).json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.updatePassword = async (request, response) => {
  try {
    const usr = await User.findById(request.user._id).select("+password");
    const { oldPassword, newPassword } = request.body;

    if (!oldPassword || !newPassword) {
      return response.status(500).json({
        success: false,
        message: "oldPassword or newPassword field is empty",
      });
    }
    console.log(usr.password);
    const match = await usr.matchPassword(oldPassword, usr.password);
    if (!match) {
      return response.status(404).json({
        success: false,
        message: "wrong Old password",
      });
    }
    usr.password = newPassword;
    await usr.save();

    response.status(200).json({
      success: true,
      message: "successfully update the password",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.updateProfile = async (request, response) => {
  try {
    const user = await User.findById(request.user._id);
    const { name, email, avatar } = request.body;
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }

    // user avatar todo
    if (avatar) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "posts",
      });

      user.avatar.public_id = myCloud.public_id;
      user.avatar.url = myCloud.secure_url;
    }

    await user.save();

    return response.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.deleteMyProfile = async (request, response) => {
  try {
    const user = await User.findById(request.user._id);

    const posts = user.post;

    console.log(user);

    const followers = user.followers;

    const following = user.following;

    // removing all posts of user
    for (let i = 0; i < posts.length; i++) {
      const helperPost = await Post.findById(posts[i]._id);
      cloudinary.v2.uploader.destroy(helperPost.imageUrl.public_id);
      await Post.findByIdAndDelete(posts[i]._id);
    }

    // removing users from all followers and following
    for (let i = 0; i < followers.length; i++) {
      const findUser = await User.findById(followers[i]);
      const indx = findUser.following.indexOf(user._id);
      findUser.following.splice(indx, 1);
      await findUser.save();
    }

    for (let i = 0; i < following.length; i++) {
      const findUser = await User.findById(following[i]);
      const indx = findUser.followers.indexOf(user._id);
      findUser.followers.splice(indx, 1);
      await findUser.save();
    }

    // removing all the comments of the user from all posts
    const allPosts = await Post.find();
    for (let i = 0; i < allPosts.length; i++) {
      const post = await Post.findById(allPosts[i]._id);

      for (let j = 0; j < post.comments.length; j++) {
        if (post.comments[j].user === request.user._id) {
          post.comments[j].splice(j, 1);
        }
      }
      await post.save();
    }

    // removing all the likes of the user from all the posts
    for (let i = 0; i < allPosts.length; i++) {
      const post = await Post.findById(allPosts[i]._id);
      for (let j = 0; j < post.likes.length; j++) {
        if (post.likes[j].person === request.user._id) {
          post.likes[j].splice(j, 1);
        }
      }
      await post.save();
    }

    // removing data from cloudinary
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    await User.findByIdAndDelete(request.user._id);
    response.clearCookie("token");
    response.status(200).json({
      success: true,
      message: "Successfully deleted the user",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.myProfile = async (request, response) => {
  try {
    const user = await User.findById(request.user._id).populate(
      "post followers following"
    );
    response.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getUserProfile = async (request, response) => {
  try {
    const user = await User.findById(request.params.id).populate(
      "post followers following"
    );

    if (!user) {
      response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    response.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.findAllUser = async (request, response) => {
  try {
    const user = await User.find({
      name: { $regex: request.query.name, $options: "i" },
    });

    response.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.findAllPost = async (request, response) => {
  try {
    const user = await User.findById(request.user._id);
    const posts = [];
    for (let i = 0; i < user.post.length; i++) {
      const post = await Post.findById(user.post[i]).populate(
        "owner likes comments.user"
      );
      posts.push(post);
    }

    response.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getUserPosts = async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    const posts = [];
    for (let i = 0; i < user.post.length; i++) {
      const post = await Post.findById(user.post[i]).populate(
        "owner likes comments.user"
      );
      posts.push(post);
    }

    response.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.forgotPassword = async (request, response) => {
  try {
    const user = await User.findOne({ email: request.body.email });
    if (!user) {
      response.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const resetPasswordToken = await user.getResetPasswordToken(user);
    await user.save();
    const resetUrl = `${request.protocol}://${request.get(
      "host"
    )}/password/reset/${resetPasswordToken}`;
    const message = `Reset your password by clicking on the link below : \n \n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset Password",
        message,
      });

      response.status(200).json({
        success: true,
        message: `Email sent to ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      response.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async (request, response) => {
  try {
    console.log(request.params.token, "I am token");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(request.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return response.status(401).json({
        success: false,
        message: "Token is invalid or has expired",
      });
    }
    user.password = request.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    response.status(200).json({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
